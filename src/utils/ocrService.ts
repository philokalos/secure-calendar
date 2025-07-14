import { createWorker, Worker } from 'tesseract.js'

export interface OCRResult {
  text: string
  confidence: number
  words: Array<{
    text: string
    confidence: number
    bbox: {
      x0: number
      y0: number
      x1: number
      y1: number
    }
  }>
}

export class OCRService {
  private worker: Worker | null = null
  private isInitialized = false

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      this.worker = await createWorker('kor+eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            console.log(`OCR 진행률: ${Math.round(m.progress * 100)}%`)
          }
        },
      })

      // OCR 설정 최적화 (타입 이슈로 주석 처리)
      // await this.worker.setParameters({
      //   tessedit_pageseg_mode: '1', // 자동 페이지 분할
      //   tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ가-힣ㄱ-ㅎㅏ-ㅣ :/-.,()[]', // 허용 문자
      //   preserve_interword_spaces: '1',
      // })

      this.isInitialized = true
      console.log('OCR 서비스 초기화 완료')
    } catch (error) {
      console.error('OCR 초기화 실패:', error)
      throw new Error('OCR 서비스를 초기화할 수 없습니다.')
    }
  }

  async recognizeText(
    imageFile: File | string,
    _progressCallback?: (progress: number) => void
  ): Promise<OCRResult> {
    if (!this.worker) {
      await this.initialize()
    }

    if (!this.worker) {
      throw new Error('OCR 워커를 초기화할 수 없습니다.')
    }

    try {
      const { data } = await this.worker.recognize(imageFile)

      // 결과 정제
      const cleanedText = this.cleanupText(data.text)

      return {
        text: cleanedText,
        confidence: data.confidence,
        words: [],
      }
    } catch (error) {
      console.error('OCR 인식 실패:', error)
      throw new Error('이미지에서 텍스트를 인식할 수 없습니다.')
    }
  }

  async recognizeFromDataURL(
    dataURL: string,
    _progressCallback?: (progress: number) => void
  ): Promise<OCRResult> {
    return this.recognizeText(dataURL)
  }

  async recognizeFromCanvas(
    canvas: HTMLCanvasElement,
    progressCallback?: (progress: number) => void
  ): Promise<OCRResult> {
    const dataURL = canvas.toDataURL('image/png')
    return this.recognizeFromDataURL(dataURL, progressCallback)
  }

  private cleanupText(text: string): string {
    return text
      .replace(/\s+/g, ' ') // 연속된 공백을 하나로
      .replace(/\n\s*\n/g, '\n') // 연속된 빈 줄을 하나로
      .replace(/[^\w\s가-힣ㄱ-ㅎㅏ-ㅣ:/\-.,()[\]]/g, '') // 특수문자 제거 (허용된 것 제외)
      .trim()
  }

  async preprocessImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        try {
          // 이미지 크기 조정 (최대 1920x1080)
          const maxWidth = 1920
          const maxHeight = 1080
          let { width, height } = img

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height)
            width *= ratio
            height *= ratio
          }

          canvas.width = width
          canvas.height = height

          if (!ctx) {
            reject(new Error('Canvas context를 생성할 수 없습니다.'))
            return
          }

          // 이미지 그리기
          ctx.drawImage(img, 0, 0, width, height)

          // 이미지 전처리 (대비 향상)
          const imageData = ctx.getImageData(0, 0, width, height)
          this.enhanceContrast(imageData, 1.2)
          ctx.putImageData(imageData, 0, 0)

          resolve(canvas.toDataURL('image/png'))
        } catch (error) {
          reject(error)
        }
      }

      img.onerror = () => {
        reject(new Error('이미지를 로드할 수 없습니다.'))
      }

      img.src = URL.createObjectURL(file)
    })
  }

  private enhanceContrast(imageData: ImageData, contrast: number): void {
    const data = imageData.data
    const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255))

    for (let i = 0; i < data.length; i += 4) {
      data[i] = this.clamp(factor * (data[i] - 128) + 128) // Red
      data[i + 1] = this.clamp(factor * (data[i + 1] - 128) + 128) // Green
      data[i + 2] = this.clamp(factor * (data[i + 2] - 128) + 128) // Blue
      // Alpha 채널은 그대로 유지
    }
  }

  private clamp(value: number): number {
    return Math.max(0, Math.min(255, value))
  }

  async terminate(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate()
      this.worker = null
      this.isInitialized = false
      console.log('OCR 서비스 종료')
    }
  }

  static isImageFile(file: File): boolean {
    return file.type.startsWith('image/')
  }

  static async validateImageFile(file: File): Promise<void> {
    if (!this.isImageFile(file)) {
      throw new Error('이미지 파일만 업로드할 수 있습니다.')
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      throw new Error('이미지 파일 크기는 10MB 이하여야 합니다.')
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('JPEG, PNG, GIF, WebP 형식의 이미지만 지원됩니다.')
    }
  }
}

// 싱글톤 인스턴스
let ocrServiceInstance: OCRService | null = null

export const getOCRService = (): OCRService => {
  if (!ocrServiceInstance) {
    ocrServiceInstance = new OCRService()
  }
  return ocrServiceInstance
}

export const cleanupOCRService = async (): Promise<void> => {
  if (ocrServiceInstance) {
    await ocrServiceInstance.terminate()
    ocrServiceInstance = null
  }
}
