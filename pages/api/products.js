import { getSQL, initDB } from '../../lib/db'

export default async function handler(req, res) {
  try {
    await initDB()
    const sql = getSQL()

    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM products ORDER BY created_at DESC`
      return res.json(rows)
    }

    if (req.method === 'POST') {
      const { crop, name, brand, maturity, is_new, technologies, selling_points, notes, scores, placement, entered_by, entered_by_role } = req.body
      const rows = await sql`
        INSERT INTO products (crop, name, brand, maturity, is_new, technologies, selling_points, notes, scores, placement, entered_by, entered_by_role)
        VALUES (${crop}, ${name}, ${brand || 'Pioneer'}, ${maturity || ''}, ${!!is_new}, ${technologies || []}, ${selling_points || ''}, ${notes || ''}, ${JSON.stringify(scores || {})}, ${JSON.stringify(placement || {})}, ${entered_by || ''}, ${entered_by_role || ''})
        RETURNING *
      `
      return res.status(201).json(rows[0])
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      await sql`DELETE FROM products WHERE id = ${id}`
      return res.json({ ok: true })
    }

    res.status(405).end()
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
}
