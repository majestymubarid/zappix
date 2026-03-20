import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { auth } from '@/lib/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const session = await auth()
  if (!session) return new NextResponse('Unauthorized', { status: 401 })

  const { path: fileParts } = await params
  const filePath = path.join(process.env.MEDIA_PATH!, ...fileParts)

  if (!fs.existsSync(filePath)) {
    return new NextResponse('Not found', { status: 404 })
  }

  const buffer = fs.readFileSync(filePath)
  const ext = path.extname(filePath).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.mp4': 'video/mp4',
    '.pdf': 'application/pdf',
  }

  return new NextResponse(buffer, {
    headers: { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' },
  })
}
