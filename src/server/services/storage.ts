import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

const MEDIA_PATH = process.env.MEDIA_PATH || '/mnt/zappix-media/media'

export async function saveMediaFile(
  buffer: Buffer,
  originalName: string,
  userId: string
): Promise<string> {
  const ext = path.extname(originalName).toLowerCase()
  const filename = `${userId}/${randomUUID()}${ext}`
  const fullPath = path.join(MEDIA_PATH, filename)

  // Create user directory if it doesn't exist
  fs.mkdirSync(path.dirname(fullPath), { recursive: true })
  fs.writeFileSync(fullPath, buffer)

  // Return relative URL path
  return `/media/${filename}`
}

export function getMediaPath(relativePath: string): string {
  return path.join(MEDIA_PATH, relativePath.replace('/media/', ''))
}

export function deleteMediaFile(relativePath: string): void {
  const fullPath = getMediaPath(relativePath)
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath)
  }
}
