-- Enable RLS (Row Level Security) and Realtime
alter table auth.users enable row level security;

-- Create events table
create table public.events (
    id uuid default gen_random_uuid() primary key,
    title text not null check (length(trim(title)) > 0),
    description text,
    start_date timestamptz not null,
    end_date timestamptz not null check (end_date > start_date),
    user_id uuid references auth.users(id) on delete cascade not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
    category text check (category in ('work', 'personal', 'health', 'education', 'social')),
    location text,
    reminder_minutes integer check (reminder_minutes >= 0)
);

-- Enable RLS on events table
alter table public.events enable row level security;

-- Enable realtime for events table
alter publication supabase_realtime add table public.events;

-- Create enhanced RLS policies for events table
create policy "Users can view their own events" on public.events
    for select using (auth.uid() = user_id);

create policy "Users can insert their own events" on public.events
    for insert with check (
        auth.uid() = user_id AND
        auth.uid() is not null AND
        length(trim(title)) > 0 AND
        end_date > start_date
    );

create policy "Users can update their own events" on public.events
    for update using (auth.uid() = user_id) 
    with check (
        auth.uid() = user_id AND
        auth.uid() is not null AND
        length(trim(title)) > 0 AND
        end_date > start_date
    );

create policy "Users can delete their own events" on public.events
    for delete using (
        auth.uid() = user_id AND
        auth.uid() is not null
    );

-- Create indexes for better performance
create index events_user_id_idx on public.events(user_id);
create index events_start_date_idx on public.events(start_date);
create index events_end_date_idx on public.events(end_date);
create index events_category_idx on public.events(category);
create index events_title_search_idx on public.events using gin(to_tsvector('english', title));
create index events_description_search_idx on public.events using gin(to_tsvector('english', coalesce(description, '')));

-- Create function to automatically update updated_at column
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql security definer;

-- Create trigger to automatically update updated_at
create trigger handle_events_updated_at
    before update on public.events
    for each row
    execute function public.handle_updated_at();

-- Create function for event validation
create or replace function public.validate_event_dates()
returns trigger as $$
begin
    -- Ensure end_date is after start_date
    if new.end_date <= new.start_date then
        raise exception 'End date must be after start date';
    end if;
    
    -- Ensure title is not empty
    if length(trim(new.title)) = 0 then
        raise exception 'Title cannot be empty';
    end if;
    
    -- Validate reminder_minutes
    if new.reminder_minutes is not null and new.reminder_minutes < 0 then
        raise exception 'Reminder minutes cannot be negative';
    end if;
    
    return new;
end;
$$ language plpgsql security definer;

-- Create trigger for event validation
create trigger validate_events_before_insert_update
    before insert or update on public.events
    for each row
    execute function public.validate_event_dates();

-- Create function to get user events count
create or replace function public.get_user_events_count(user_uuid uuid)
returns integer as $$
begin
    return (
        select count(*)::integer
        from public.events
        where user_id = user_uuid
    );
end;
$$ language plpgsql security definer;

-- Create function to get events by date range
create or replace function public.get_events_by_date_range(
    user_uuid uuid,
    start_date_param timestamptz,
    end_date_param timestamptz
)
returns setof public.events as $$
begin
    return query
    select *
    from public.events
    where user_id = user_uuid
    and (
        (start_date >= start_date_param and start_date <= end_date_param) or
        (end_date >= start_date_param and end_date <= end_date_param) or
        (start_date <= start_date_param and end_date >= end_date_param)
    )
    order by start_date;
end;
$$ language plpgsql security definer;

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.events to authenticated;
grant execute on function public.get_user_events_count(uuid) to authenticated;
grant execute on function public.get_events_by_date_range(uuid, timestamptz, timestamptz) to authenticated;