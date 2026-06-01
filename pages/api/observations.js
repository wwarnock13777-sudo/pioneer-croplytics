import { getSQL, initDB } from '../../lib/db'

export default async function handler(req, res) {
  try {
    await initDB()
    const sql = getSQL()

    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM observations ORDER BY date DESC, created_at DESC`
      return res.json(rows)
    }

    if (req.method === 'POST') {
      const { product_id, date, growth_stage, location, rating, notes, photos, gps, entered_by, entered_by_role } = req.body
      const rows = await sql`
        INSERT INTO observations (product_id, date, growth_stage, location, rating, notes, photos, gps, entered_by, entered_by_role)
        VALUES (${product_id||null}, ${date}, ${growth_stage||''}, ${location||''}, ${rating||0}, ${notes||''}, ${photos||[]}, ${JSON.stringify(gps||null)}, ${entered_by||''}, ${entered_by_role||''})
        RETURNING *
      `
      return res.status(201).json(rows[0])
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      await sql`DELETE FROM observations WHERE id = ${id}`
      return res.json({ ok: true })
    }

    res.status(405).end()
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
}
