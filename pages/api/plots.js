import { getSQL, initDB } from '../../lib/db'

export default async function handler(req, res) {
  try {
    await initDB()
    const sql = getSQL()

    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM plot_entries ORDER BY date DESC, created_at DESC`
      return res.json(rows)
    }

    if (req.method === 'POST') {
      const { type, field_name, date, crop, growth_stage, location, field_notes, photos, products_data, gps, entered_by, entered_by_role } = req.body
      const rows = await sql`
        INSERT INTO plot_entries (type, field_name, date, crop, growth_stage, location, field_notes, photos, products_data, gps, entered_by, entered_by_role)
        VALUES (${type||'pkp'}, ${field_name}, ${date}, ${crop||'Corn'}, ${growth_stage||''}, ${location||''}, ${field_notes||''}, ${photos||[]}, ${JSON.stringify(products_data||[])}, ${JSON.stringify(gps||null)}, ${entered_by||''}, ${entered_by_role||''})
        RETURNING *
      `
      return res.status(201).json(rows[0])
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      await sql`DELETE FROM plot_entries WHERE id = ${id}`
      return res.json({ ok: true })
    }

    res.status(405).end()
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
}
