import mammoth from 'mammoth'

export async function extractTextFromFile(
  file: File
): Promise<{ text: string; error?: string }> {
  try {
    const fileType = file.name.split('.').pop()?.toLowerCase()
    const buffer = Buffer.from(await file.arrayBuffer())

    switch (fileType) {
      case 'pdf':
        return await extractFromPdf(buffer)
      case 'docx':
        return await extractFromDocx(buffer)
      case 'txt':
      case 'md':
        return await extractFromText(buffer)
      default:
        return { text: '', error: 'Unsupported file type' }
    }
  } catch (error) {
    console.error('Error extracting text:', error)
    return { text: '', error: 'Failed to extract text from file' }
  }
}

async function extractFromPdf(buffer: Buffer): Promise<{ text: string }> {
  // Dynamic import for pdf-parse to avoid ESM issues
  // @ts-expect-error - pdf-parse has complex module exports
  const pdfParse = (await import('pdf-parse')).default || (await import('pdf-parse'))
  const data = await pdfParse(buffer)
  return { text: data.text }
}

async function extractFromDocx(buffer: Buffer): Promise<{ text: string }> {
  const result = await mammoth.extractRawText({ buffer })
  return { text: result.value }
}

async function extractFromText(buffer: Buffer): Promise<{ text: string }> {
  return { text: buffer.toString('utf-8') }
}
