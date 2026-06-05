import { put } from '@vercel/blob'

export const config = {
  api: { 
    bodyParser: false,
    sizeLimit: '10mb'
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const chunks = []
    for await (const chunk of req) chunks.push(chunk)
    const buffer = Buffer.concat(chunks)

    const filename = `photos/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`

    const blob = await put(filename, buffer, {
      access: 'public',
      contentType: 'image/jpeg',
    })

    return res.json({ url: blob.url })
  } catch (e) {
    console.error('Upload error:', e)
    res.status(500).json({ error: e.message })
  }
}
