import { put } from '@vercel/blob'

export const config = {
  api: { bodyParser: false },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const chunks = []
    for await (const chunk of req) chunks.push(chunk)
    const buffer = Buffer.concat(chunks)

    const contentType = req.headers['content-type'] || 'image/jpeg'
    const ext = contentType.split('/')[1]?.split(';')[0] || 'jpg'
    const filename = `photos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const blob = await put(filename, buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType,
    })

    return res.json({ url: blob.url })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
}
