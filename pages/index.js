import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'

const IconHome = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>)
const IconSeedling = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V12"/><path d="M12 12C12 8 9 4 5 4c0 4 2 8 7 8z"/><path d="M12 12c0-4 3-8 7-8 0 4-2 8-7 8z"/></svg>)
const IconDoc = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>)
const IconCompare = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="9" height="18" rx="1"/><rect x="13" y="3" width="9" height="18" rx="1"/></svg>)
const IconPlus = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>)
const IconX = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>)

const CROPS = ['Corn', 'Soybean', 'Wheat']
const CORN_SCORES = ['Yield', 'Drought Tolerance', 'Disease Resistance', 'Standability', 'Emergence', 'Root Strength']
const SOY_SCORES  = ['Yield', 'SCN Resistance', 'White Mold', 'Standability', 'Iron Deficiency']
const WHEAT_SCORES= ['Yield', 'Test Weight', 'Disease Package', 'Winter Hardiness', 'Straw Strength']
const SOIL_TYPES  = ['Sandy', 'Sandy Loam', 'Loam', 'Silt Loam', 'Silty Clay Loam', 'Clay', 'Muck']
const DRAINAGE    = ['Excessive', 'Well Drained', 'Moderately Well', 'Somewhat Poor', 'Poor', 'Very Poor']
const YIELD_ZONES = ['High (200+ bu)', 'Medium-High (185-200)', 'Medium (170-185)', 'Low-Medium (150-170)', 'Low (<150)']
const CORN_TECH   = ['Qrome', 'PowerCore ENLIST', 'Leptra', 'ENLIST E3', 'Roundup Ready 2', 'Conventional']
const SOY_TECH    = ['ENLIST E3', 'Roundup Ready 2 Xtend', 'LibertyLink', 'Conventional']
const STAGES_CORN = ['VE','V1','V2','V3','V4','V5','V6','V7','V8','V9','V10','VT','R1','R2','R3','R4','R5','R6']
const STAGES_SOY  = ['VE','VC','V1','V2','V3','V4','V5','V6','R1','R2','R3','R4','R5','R6','R7','R8']

function fmtDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
function initials(name) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}
function Stars({ n = 0, size = 14 }) {
  return (
    <div className="star-row">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`star ${i <= n ? '' : 'empty'}`} style={{ fontSize: size }}>★</span>
      ))}
    </div>
  )
}
function CropTag({ crop }) {
  const cls = crop === 'Corn' ? 'corn' : crop === 'Soybean' ? 'soybean' : 'wheat'
  return <span className={`crop-tag ${cls}`}>{crop}</span>
}
function ScoreBar({ val, color = 'var(--gd-light)' }) {
  return (
    <div className="compare-bar-wrap" style={{ height: 8 }}>
      <div className="compare-bar-fill" style={{ width: `${(val / 9) * 100}%`, background: color }} />
    </div>
  )
}

async function apiFetch(path) {
  const r = await fetch(path)
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}
async function apiPost(path, body) {
  const r = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}
async function uploadPhoto(file) {
  const r = await fetch('/api/upload', { method: 'POST', headers: { 'Content-Type': file.type }, body: file })
  if (!r.ok) throw new Error(await r.text())
  const { url } = await r.json()
  return url
}

export default function CropLytics() {
  const [user, setUser] = useState(null)
  const [tab, setTab] = useState('dashboard')
  const [toast, setToast] = useState(null)
  const [products, setProducts] = useState([])
  const [observations, setObservations] = useState([])
  const [plotEntries, setPlotEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [showOnboard, setShowOnboard] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)
  const [showObsModal, setShowObsModal] = useState(false)
  const [showPlotModal, setShowPlotModal] = useState(false)
  const [showDetail, setShowDetail] = useState(null)
  const [productFilter, setProductFilter] = useState('All')
  const [obsFilter, setObsFilter] = useState('All')
  const [lightboxUrl, setLightboxUrl] = useState(null)
  const toastRef = useRef(null)

  function showToast(msg) {
    setToast(msg)
    clearTimeout(toastRef.current)
    toastRef.current = setTimeout(() => setToast(null), 2500)
  }

  useEffect(() => {
    const saved = localStorage.getItem('cl_user')
    if (saved) setUser(JSON.parse(saved))
    else setShowOnboard(true)
  }, [])

  useEffect(() => { if (user) loadAll() }, [user])

  async function loadAll() {
    setLoading(true)
    try {
      const [p, o, pl] = await Promise.all([
        apiFetch('/api/products'),
        apiFetch('/api/observations'),
        apiFetch('/api/plots'),
      ])
      setProducts(p)
      setObservations(o)
      setPlotEntries(pl)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  function switchTab(t) { setTab(t); window.scrollTo({ top: 0, behavior: 'instant' }) }

  function Onboard() {
    const [name, setName] = useState('')
    const [role, setRole] = useState('Field Agronomy')
    function save() {
      if (!name.trim()) return
      const u = { name: name.trim(), role, id: Date.now().toString() }
      localStorage.setItem('cl_user', JSON.stringify(u))
      setUser(u)
      setShowOnboard(false)
    }
    return (
      <div className="onboard-overlay">
        <div className="onboard-logo">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M24 8C18 8 12 14 12 22c0 5 2 9 5 12h14c3-3 5-7 5-12 0-8-6-14-12-14z" fill="white" opacity="0.9"/>
            <path d="M24 36v6" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="24" cy="22" r="5" fill="#CC0000"/>
          </svg>
        </div>
        <div>
          <div className="onboard-title">Pioneer <span>CropLytics</span></div>
          <div style={{ fontFamily:'Barlow Condensed', fontWeight:600, fontSize:14, color:'var(--text-dim)', textAlign:'center', letterSpacing:3, textTransform:'uppercase', marginTop:4 }}>Indiana · 2026 Season</div>
        </div>
        <div className="onboard-sub">Enter your name so your teammates can see who added each entry.</div>
        <div style={{ width:'100%', maxWidth:320, display:'flex', flexDirection:'column', gap:12 }}>
          <div className="form-group" style={{ marginBottom:0 }}>
            <label className="form-label">Your Name</label>
            <input className="form-input" placeholder="e.g. Jake Miller" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key==='Enter' && save()} autoFocus />
          </div>
          <div className="form-group" style={{ marginBottom:0 }}>
            <label className="form-label">Team</label>
            <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
              <option>Field Agronomy</option>
              <option>Sales Rep</option>
              <option>DSM</option>
              <option>Other</option>
            </select>
          </div>
          <button className="btn btn-primary btn-full" style={{ marginTop:4 }} onClick={save}>Get Started →</button>
        </div>
      </div>
    )
  }

  function Dashboard() {
    const counts = {
      corn: products.filter(p => p.crop==='Corn').length,
      soy: products.filter(p => p.crop==='Soybean').length,
      wheat: products.filter(p => p.crop==='Wheat').length
    }
    return (
      <div>
        <div className="stat-grid">
          <div className="stat-card corn"><div className="stat-value">{counts.corn}</div><div className="stat-label">Corn Hybrids</div></div>
          <div className="stat-card soy"><div className="stat-value">{counts.soy}</div><div className="stat-label">Soy Varieties</div></div>
          <div className="stat-card wheat"><div className="stat-value">{counts.wheat}</div><div className="stat-label">Wheat Varieties</div></div>
          <div className="stat-card obs"><div className="stat-value">{observations.length}</div><div className="stat-label">Field Obs</div></div>
        </div>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Observations</span>
            <button className="btn btn-ghost btn-sm" onClick={() => switchTab('observations')}>View All</button>
          </div>
          {observations.slice(0,5).length === 0
            ? <div style={{ color:'var(--text-dim)', fontSize:13, padding:'10px 0' }}>No observations yet</div>
            : observations.slice(0,5).map(o => {
                const prod = products.find(p => p.id===o.product_id)
                return (
                  <div key={o.id} className="obs-item" onClick={() => setShowDetail({ type:'obs', data:o })}>
                    <div className="obs-header"><span className="obs-date">{fmtDate(o.date)}</span><Stars n={o.rating}/></div>
                    <div className="obs-product">{prod?.name||'Unknown'}</div>
                    {prod && <CropTag crop={prod.crop}/>}
                    <div className="obs-notes">{o.notes}</div>
                    {o.photos?.length > 0 && (
                      <div className="photo-strip">
                        {o.photos.slice(0,4).map((url,i) => <img key={i} className="photo-thumb" src={url} alt="" onClick={e => { e.stopPropagation(); setLightboxUrl(url) }}/>)}
                      </div>
                    )}
                    <div className="entry-meta">
                      {o.entered_by && <span className="by">{o.entered_by}</span>}
                      {o.entered_by_role && <span>{o.entered_by_role}</span>}
                    </div>
                  </div>
                )
              })
          }
        </div>
        {plotEntries.length > 0 && (
          <div className="card">
            <div className="card-header">
              <span className="card-title">Recent PKP / PXP</span>
              <button className="btn btn-ghost btn-sm" onClick={() => switchTab('observations')}>View All</button>
            </div>
            {plotEntries.slice(0,3).map(e => (
              <div key={e.id} className="obs-item" onClick={() => setShowDetail({ type:'plot', data:e })}>
                <div className="obs-header">
                  <span className={`crop-tag ${e.type==='pkp'?'corn':'soybean'}`}>{e.type?.toUpperCase()}</span>
                  <span className="obs-date">{fmtDate(e.date)}</span>
                </div>
                <div className="obs-product">{e.field_name}</div>
                <div className="obs-stage">{e.growth_stage} · {e.location}</div>
                <div className="entry-meta">{e.entered_by && <span className="by">{e.entered_by}</span>}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  function Products() {
    const filtered = productFilter==='All' ? products : products.filter(p => p.crop===productFilter)
    return (
      <div>
        <div className="section-header">
          <span className="section-title">Products</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowProductModal(true)}><IconPlus/> Add</button>
        </div>
        <div className="filter-tabs">
          {['All','Corn','Soybean','Wheat'].map(f => <button key={f} className={`filter-tab ${productFilter===f?'active':''}`} onClick={() => setProductFilter(f)}>{f}</button>)}
        </div>
        {filtered.length === 0
          ? <div className="empty-state"><p>No products yet. Tap Add to get started.</p></div>
          : filtered.map(p => {
              const keys = p.crop==='Corn' ? CORN_SCORES : p.crop==='Soybean' ? SOY_SCORES : WHEAT_SCORES
              const scores = p.scores||{}
              const avg = keys.length ? Math.round(keys.reduce((s,k) => s+(scores[k]||0),0)/keys.length) : 0
              const obsCount = observations.filter(o => o.product_id===p.id).length
              return (
                <div key={p.id} className="product-item" onClick={() => setShowDetail({ type:'product', data:p })}>
                  <div className="product-item-top">
                    <div>
                      <div className="product-name">{p.name}</div>
                      <div className="product-maturity">{p.brand} · {p.maturity}</div>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
                      {p.is_new && <span className="new-badge">NEW</span>}
                      <CropTag crop={p.crop}/>
                    </div>
                  </div>
                  <div className="score-bar">
                    <span className="score-pill">Avg {avg}/9</span>
                    <div className="score-dots">
                      {Array.from({length:9}).map((_,i) => <div key={i} className={`score-dot ${i<avg?'filled'+(avg>=7?' high':''):''}`}/>)}
                    </div>
                    <span style={{ marginLeft:'auto', fontSize:11, color:'var(--text-dim)' }}>{obsCount} obs</span>
                  </div>
                  <div className="entry-meta">
                    {p.entered_by && <span className="by">{p.entered_by}</span>}
                    <span>{fmtDate(p.created_at)}</span>
                  </div>
                </div>
              )
            })
        }
      </div>
    )
  }

  function FieldLog() {
    const [logTab, setLogTab] = useState('obs')
    const filteredObs = obsFilter==='All' ? observations : observations.filter(o => {
      const prod = products.find(p => p.id===o.product_id)
      return prod?.crop===obsFilter
    })
    return (
      <div>
        <div className="section-header">
          <span className="section-title">Field Log</span>
          <div style={{ display:'flex', gap:6 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowPlotModal(true)}>PKP/PXP</button>
            <button className="btn btn-primary btn-sm" onClick={() => setShowObsModal(true)}><IconPlus/> Obs</button>
          </div>
        </div>
        <div className="filter-tabs">
          <button className={`filter-tab ${logTab==='obs'?'active':''}`} onClick={() => setLogTab('obs')}>Observations</button>
          <button className={`filter-tab ${logTab==='pkp'?'active':''}`} onClick={() => setLogTab('pkp')}>PKP / PXP</button>
        </div>
        {logTab==='obs' && <>
          <div className="filter-tabs">
            {['All','Corn','Soybean','Wheat'].map(f => <button key={f} className={`filter-tab ${obsFilter===f?'active':''}`} onClick={() => setObsFilter(f)}>{f}</button>)}
          </div>
          {filteredObs.length===0
            ? <div className="empty-state"><p>No observations yet.</p></div>
            : filteredObs.map(o => {
                const prod = products.find(p => p.id===o.product_id)
                return (
                  <div key={o.id} className="obs-item" onClick={() => setShowDetail({ type:'obs', data:o })}>
                    <div className="obs-header"><span className="obs-date">{fmtDate(o.date)}</span><Stars n={o.rating}/></div>
                    <div className="obs-product">{prod?.name||'Unknown Product'}</div>
                    <div className="obs-stage">{o.growth_stage}{o.location?` · ${o.location}`:''}</div>
                    {prod && <div style={{marginTop:4}}><CropTag crop={prod.crop}/></div>}
                    <div className="obs-notes">{o.notes}</div>
                    {o.photos?.length > 0 && (
                      <div className="photo-strip">
                        {o.photos.slice(0,4).map((url,i) => <img key={i} className="photo-thumb" src={url} alt="" onClick={e => { e.stopPropagation(); setLightboxUrl(url) }}/>)}
                      </div>
                    )}
                    <div className="entry-meta">
                      {o.entered_by && <span className="by">{o.entered_by}</span>}
                      {o.entered_by_role && <span>{o.entered_by_role}</span>}
                    </div>
                  </div>
                )
              })
          }
        </>}
        {logTab==='pkp' && <>
          {plotEntries.length===0
            ? <div className="empty-state"><p>No PKP/PXP entries yet.</p></div>
            : plotEntries.map(e => (
                <div key={e.id} className="obs-item" onClick={() => setShowDetail({ type:'plot', data:e })}>
                  <div className="obs-header">
                    <span className={`crop-tag ${e.type==='pkp'?'corn':'soybean'}`}>{e.type?.toUpperCase()}</span>
                    <span className="obs-date">{fmtDate(e.date)}</span>
                  </div>
                  <div className="obs-product">{e.field_name}</div>
                  <div className="obs-stage">{e.growth_stage} · {e.location}</div>
                  <div className="obs-notes">{e.field_notes}</div>
                  {e.photos?.length > 0 && (
                    <div className="photo-strip">
                      {e.photos.slice(0,3).map((url,i) => <img key={i} className="photo-thumb" src={url} alt="" onClick={ev => { ev.stopPropagation(); setLightboxUrl(url) }}/>)}
                    </div>
                  )}
                  <div className="entry-meta">
                    {e.entered_by && <span className="by">{e.entered_by}</span>}
                    <span>{e.products_data?.length||0} products</span>
                  </div>
                </div>
              ))
          }
        </>}
      </div>
    )
  }

  function Compare() {
    const [crop, setCrop] = useState('Corn')
    const [selected, setSelected] = useState([])
    const cropProds = products.filter(p => p.crop===crop)
    const scoreKeys = crop==='Corn' ? CORN_SCORES : crop==='Soybean' ? SOY_SCORES : WHEAT_SCORES
    const colors = ['var(--gold)','var(--pioneer-red)','var(--gd-light)','#8B9EFF']
    function toggle(p) {
      setSelected(prev => {
        if (prev.find(x => x.id===p.id)) return prev.filter(x => x.id!==p.id)
        if (prev.length>=4) return prev
        return [...prev,p]
      })
    }
    return (
      <div>
        <div className="section-header">
          <span className="section-title">Compare</span>
          {selected.length>0 && <button className="btn btn-ghost btn-sm" onClick={() => setSelected([])}>Clear</button>}
        </div>
        <div className="filter-tabs">
          {CROPS.map(c => <button key={c} className={`filter-tab ${crop===c?'active':''}`} onClick={() => { setCrop(c); setSelected([]) }}>{c}</button>)}
        </div>
        <div className="card" style={{ marginBottom:14 }}>
          <div className="card-title" style={{ marginBottom:10 }}>Select up to 4 products</div>
          {cropProds.length===0
            ? <div style={{ color:'var(--text-dim)', fontSize:13 }}>No {crop} products added yet.</div>
            : cropProds.map(p => {
                const sel = !!selected.find(x => x.id===p.id)
                return (
                  <div key={p.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontFamily:'Barlow Condensed', fontWeight:700, fontSize:16, color:'#fff' }}>{p.name}</div>
                      <div style={{ fontSize:12, color:'var(--text-muted)' }}>{p.maturity}</div>
                    </div>
                    <button className={`btn btn-sm ${sel?'btn-primary':'btn-secondary'}`} onClick={() => toggle(p)} disabled={!sel&&selected.length>=4}>
                      {sel?'✓ Selected':'Select'}
                    </button>
                  </div>
                )
              })
          }
        </div>
        {selected.length>=2 && <>
          <div className="card-title" style={{ marginBottom:10 }}>Agronomic Scores</div>
          {scoreKeys.map(key => (
            <div key={key} className="card" style={{ padding:'12px 14px', marginBottom:8 }}>
              <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:8, textTransform:'uppercase', letterSpacing:1 }}>{key}</div>
              {selected.map((p,i) => {
                const val = (p.scores||{})[key]||0
                return (
                  <div key={p.id} style={{ marginBottom:6 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                      <span style={{ fontSize:13 }}>{p.name}</span>
                      <span style={{ fontFamily:'Barlow Condensed', fontWeight:700, fontSize:14, color:colors[i] }}>{val}/9</span>
                    </div>
                    <ScoreBar val={val} color={colors[i]}/>
                  </div>
                )
              })}
            </div>
          ))}
          <div className="card">
            <div className="card-title" style={{ marginBottom:10 }}>Placement Info</div>
            <div style={{ display:'grid', gridTemplateColumns:`repeat(${selected.length},1fr)`, gap:8 }}>
              {selected.map((p,i) => (
                <div key={p.id} style={{ padding:10, background:'rgba(255,255,255,0.03)', borderRadius:8, borderTop:`3px solid ${colors[i]}` }}>
                  <div style={{ fontFamily:'Barlow Condensed', fontWeight:700, fontSize:15, color:'#fff', marginBottom:6 }}>{p.name}</div>
                  <div style={{ fontSize:11, color:'var(--text-dim)' }}>Maturity</div>
                  <div style={{ fontSize:13, color:'var(--text-muted)', marginBottom:6 }}>{p.maturity||'—'}</div>
                  <div style={{ fontSize:11, color:'var(--text-dim)' }}>Soil Types</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:6 }}>{p.placement?.soilTypes?.join(', ')||'—'}</div>
                  <div style={{ fontSize:11, color:'var(--text-dim)' }}>Yield Zone</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)' }}>{p.placement?.yieldZone||'—'}</div>
                </div>
              ))}
            </div>
          </div>
        </>}
        {selected.length===1 && <div style={{ textAlign:'center', color:'var(--text-dim)', fontSize:13, padding:20 }}>Select at least 2 products to compare</div>}
      </div>
    )
  }

  function AddProductModal() {
    const [form, setForm] = useState({ crop:'Corn', name:'', brand:'Pioneer', maturity:'', is_new:false, technologies:[], selling_points:'', notes:'', scores:{}, placement:{ soilTypes:[], drainage:[], popMin:'', popMax:'', yieldZone:'', placementNotes:'' } })
    const [saving, setSaving] = useState(false)
    const scoreKeys = form.crop==='Corn' ? CORN_SCORES : form.crop==='Soybean' ? SOY_SCORES : WHEAT_SCORES
    const techOptions = form.crop==='Corn' ? CORN_TECH : SOY_TECH
    function set(k,v) { setForm(f => ({...f,[k]:v})) }
    function setScore(k,v) { setForm(f => ({...f,scores:{...f.scores,[k]:Number(v)}})) }
    function setP(k,v) { setForm(f => ({...f,placement:{...f.placement,[k]:v}})) }
    function toggleArr(arr,val) { return arr.includes(val) ? arr.filter(x=>x!==val) : [...arr,val] }
    async function save() {
      if (!form.name.trim()) return alert('Please enter a product name')
      setSaving(true)
      try {
        await apiPost('/api/products', { ...form, entered_by:user.name, entered_by_role:user.role })
        await loadAll()
        setShowProductModal(false)
        showToast('Product saved!')
      } catch(e) { alert('Error: '+e.message) }
      setSaving(false)
    }
    return (
      <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-handle"/>
          <div className="modal-title">Add Product</div>
          <div className="form-group">
            <label className="form-label">Crop</label>
            <div className="chip-group">{CROPS.map(c => <button key={c} className={`chip ${form.crop===c?'selected':''}`} onClick={() => set('crop',c)}>{c}</button>)}</div>
          </div>
          <div className="form-group">
            <label className="form-label">Product Name / Hybrid #</label>
            <input className="form-input" placeholder="e.g. P1197AM" value={form.name} onChange={e => set('name',e.target.value)} autoFocus/>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <div className="form-group">
              <label className="form-label">Brand</label>
              <select className="form-select" value={form.brand} onChange={e => set('brand',e.target.value)}>
                <option>Pioneer</option><option>Brevant</option><option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Maturity</label>
              <input className="form-input" placeholder={form.crop==='Corn'?'110 RM':'3.8'} value={form.maturity} onChange={e => set('maturity',e.target.value)}/>
            </div>
          </div>
          <div className="form-group" style={{ display:'flex', alignItems:'center', gap:10 }}>
            <input type="checkbox" id="isnew" checked={form.is_new} onChange={e => set('is_new',e.target.checked)} style={{ width:18, height:18 }}/>
            <label htmlFor="isnew" style={{ fontSize:14, color:'var(--text-muted)' }}>New for 2026 Season</label>
          </div>
          <div className="form-group">
            <label className="form-label">Technology</label>
            <div className="chip-group">{techOptions.map(t => <button key={t} className={`chip ${form.technologies.includes(t)?'selected':''}`} onClick={() => set('technologies',toggleArr(form.technologies,t))}>{t}</button>)}</div>
          </div>
          <div className="divider"/>
          <div className="card-title" style={{ marginBottom:12 }}>Agronomic Ratings (1–9)</div>
          {scoreKeys.map(k => (
            <div key={k} className="score-group">
              <div className="score-label-row"><span className="score-name">{k}</span><span className="score-val">{form.scores[k]||0}</span></div>
              <input type="range" min="0" max="9" value={form.scores[k]||0} onChange={e => setScore(k,e.target.value)}/>
            </div>
          ))}
          <div className="divider"/>
          <div className="card-title" style={{ marginBottom:12 }}>Placement</div>
          <div className="form-group">
            <label className="form-label">Soil Types</label>
            <div className="chip-group">{SOIL_TYPES.map(s => <button key={s} className={`chip ${form.placement.soilTypes.includes(s)?'selected':''}`} onClick={() => setP('soilTypes',toggleArr(form.placement.soilTypes,s))}>{s}</button>)}</div>
          </div>
          <div className="form-group">
            <label className="form-label">Drainage</label>
            <div className="chip-group">{DRAINAGE.map(d => <button key={d} className={`chip ${form.placement.drainage.includes(d)?'selected':''}`} onClick={() => setP('drainage',toggleArr(form.placement.drainage,d))}>{d}</button>)}</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <div className="form-group"><label className="form-label">Pop Min</label><input className="form-input" placeholder="28,000" value={form.placement.popMin} onChange={e => setP('popMin',e.target.value)}/></div>
            <div className="form-group"><label className="form-label">Pop Max</label><input className="form-input" placeholder="36,000" value={form.placement.popMax} onChange={e => setP('popMax',e.target.value)}/></div>
          </div>
          <div className="form-group">
            <label className="form-label">Yield Zone</label>
            <select className="form-select" value={form.placement.yieldZone} onChange={e => setP('yieldZone',e.target.value)}>
              <option value="">Select…</option>
              {YIELD_ZONES.map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
          <div className="form-group"><label className="form-label">Placement Notes</label><textarea className="form-textarea" placeholder="Additional placement guidance…" value={form.placement.placementNotes} onChange={e => setP('placementNotes',e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Selling Points</label><textarea className="form-textarea" placeholder="Key selling points…" value={form.selling_points} onChange={e => set('selling_points',e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Notes</label><textarea className="form-textarea" placeholder="General notes…" value={form.notes} onChange={e => set('notes',e.target.value)}/></div>
          <button className="btn btn-primary btn-full" onClick={save} disabled={saving}>{saving?'Saving…':'Save Product'}</button>
        </div>
      </div>
    )
  }

  function AddObsModal() {
    const [form, setForm] = useState({ product_id:'', date:new Date().toISOString().split('T')[0], growth_stage:'', location:'', rating:0, notes:'' })
    const [photos, setPhotos] = useState([])
    const [saving, setSaving] = useState(false)
    const fileRef = useRef()
    const selectedProd = products.find(p => p.id===form.product_id)
    const stages = selectedProd?.crop==='Corn' ? STAGES_CORN : STAGES_SOY
    function set(k,v) { setForm(f => ({...f,[k]:v})) }
    function handleFiles(e) {
      Array.from(e.target.files).forEach(file => {
        const reader = new FileReader()
        reader.onload = ev => setPhotos(prev => [...prev,{ file, preview:ev.target.result }])
        reader.readAsDataURL(file)
      })
    }
    async function save() {
      if (!form.product_id||!form.date) return alert('Please select a product and date')
      setSaving(true)
      try {
        const photoUrls = await Promise.all(photos.map(p => uploadPhoto(p.file)))
        await apiPost('/api/observations', { ...form, photos:photoUrls, entered_by:user.name, entered_by_role:user.role })
        await loadAll()
        setShowObsModal(false)
        showToast('Observation saved!')
      } catch(e) { alert('Error: '+e.message) }
      setSaving(false)
    }
    return (
      <div className="modal-overlay" onClick={() => setShowObsModal(false)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-handle"/>
          <div className="modal-title">Field Observation</div>
          <div className="form-group">
            <label className="form-label">Product</label>
            <select className="form-select" value={form.product_id} onChange={e => set('product_id',e.target.value)}>
              <option value="">Select product…</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.crop})</option>)}
            </select>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <div className="form-group"><label className="form-label">Date</label><input type="date" className="form-input" value={form.date} onChange={e => set('date',e.target.value)}/></div>
            <div className="form-group">
              <label className="form-label">Growth Stage</label>
              <select className="form-select" value={form.growth_stage} onChange={e => set('growth_stage',e.target.value)}>
                <option value="">Select…</option>
                {stages.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group"><label className="form-label">Location / Field Name</label><input className="form-input" placeholder="e.g. Smith Farm North" value={form.location} onChange={e => set('location',e.target.value)}/></div>
          <div className="form-group">
            <label className="form-label">Rating</label>
            <div className="rating-input">
              {[1,2,3,4,5].map(n => <span key={n} className={`rating-star ${n<=form.rating?'filled':''}`} onClick={() => set('rating',n)}>★</span>)}
            </div>
          </div>
          <div className="form-group"><label className="form-label">Observation Notes</label><textarea className="form-textarea" style={{ minHeight:100 }} placeholder="What did you observe today?" value={form.notes} onChange={e => set('notes',e.target.value)}/></div>
          <div className="form-group">
            <label className="form-label">Photos</label>
            <div className="photo-upload-area" onClick={() => fileRef.current?.click()}>
              <div style={{ fontSize:24, marginBottom:4 }}>📷</div>
              Tap to add field photos
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple capture="environment" style={{ display:'none' }} onChange={handleFiles}/>
            {photos.length>0 && (
              <div className="photo-preview-grid">
                {photos.map((p,i) => (
                  <div key={i} className="photo-preview-item">
                    <img src={p.preview} alt=""/>
                    <button className="photo-remove" onClick={() => setPhotos(prev => prev.filter((_,j) => j!==i))}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="btn btn-primary btn-full" onClick={save} disabled={saving}>{saving?'Uploading & Saving…':'Save Observation'}</button>
        </div>
      </div>
    )
  }

  function AddPlotModal() {
    const [form, setForm] = useState({ type:'pkp', field_name:'', date:new Date().toISOString().split('T')[0], crop:'Corn', growth_stage:'', location:'', field_notes:'', products_data:[] })
    const [fieldPhotos, setFieldPhotos] = useState([])
    const [saving, setSaving] = useState(false)
    const fileRef = useRef()
    function set(k,v) { setForm(f => ({...f,[k]:v})) }
    const stages = form.crop==='Corn' ? STAGES_CORN : STAGES_SOY
    const cropProds = products.filter(p => p.crop===form.crop)
    function addProduct() { if (!cropProds.length) return; setForm(f => ({...f,products_data:[...f.products_data,{ pid:cropProds[0].id, rating:0, notes:'' }]})) }
    function updateProd(i,k,v) { setForm(f => { const arr=[...f.products_data]; arr[i]={...arr[i],[k]:v}; return {...f,products_data:arr} }) }
    function removeProd(i) { setForm(f => ({...f,products_data:f.products_data.filter((_,j)=>j!==i)})) }
    function handleFiles(e) {
      Array.from(e.target.files).forEach(file => {
        const reader = new FileReader()
        reader.onload = ev => setFieldPhotos(prev => [...prev,{ file, preview:ev.target.result }])
        reader.readAsDataURL(file)
      })
    }
    async function save() {
      if (!form.field_name.trim()) return alert('Please enter a field name')
      setSaving(true)
      try {
        const photoUrls = await Promise.all(fieldPhotos.map(p => uploadPhoto(p.file)))
        await apiPost('/api/plots', { ...form, photos:photoUrls, entered_by:user.name, entered_by_role:user.role })
        await loadAll()
        setShowPlotModal(false)
        showToast('Entry saved!')
      } catch(e) { alert('Error: '+e.message) }
      setSaving(false)
    }
    return (
      <div className="modal-overlay" onClick={() => setShowPlotModal(false)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-handle"/>
          <div className="modal-title">PKP / PXP Entry</div>
          <div className="form-group">
            <label className="form-label">Entry Type</label>
            <div className="chip-group">
              <button className={`chip ${form.type==='pkp'?'selected':''}`} onClick={() => set('type','pkp')}>PKP</button>
              <button className={`chip ${form.type==='pxp'?'selected':''}`} onClick={() => set('type','pxp')}>PXP</button>
            </div>
          </div>
          <div className="form-group"><label className="form-label">Field Name</label><input className="form-input" placeholder="e.g. Johnson Farm" value={form.field_name} onChange={e => set('field_name',e.target.value)}/></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <div className="form-group"><label className="form-label">Date</label><input type="date" className="form-input" value={form.date} onChange={e => set('date',e.target.value)}/></div>
            <div className="form-group"><label className="form-label">Crop</label><select className="form-select" value={form.crop} onChange={e => set('crop',e.target.value)}>{CROPS.map(c => <option key={c}>{c}</option>)}</select></div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <div className="form-group">
              <label className="form-label">Growth Stage</label>
              <select className="form-select" value={form.growth_stage} onChange={e => set('growth_stage',e.target.value)}>
                <option value="">Select…</option>
                {stages.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Location</label><input className="form-input" placeholder="Township / County" value={form.location} onChange={e => set('location',e.target.value)}/></div>
          </div>
          <div className="form-group"><label className="form-label">Field Notes</label><textarea className="form-textarea" placeholder="Overall field observations…" value={form.field_notes} onChange={e => set('field_notes',e.target.value)}/></div>
          <div className="form-group">
            <label className="form-label">Field Photos</label>
            <div className="photo-upload-area" onClick={() => fileRef.current?.click()}>
              <div style={{ fontSize:24, marginBottom:4 }}>📷</div>
              Tap to add field photos
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple capture="environment" style={{ display:'none' }} onChange={handleFiles}/>
            {fieldPhotos.length>0 && (
              <div className="photo-preview-grid">
                {fieldPhotos.map((p,i) => (
                  <div key={i} className="photo-preview-item">
                    <img src={p.preview} alt=""/>
                    <button className="photo-remove" onClick={() => setFieldPhotos(prev => prev.filter((_,j)=>j!==i))}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="divider"/>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <div className="card-title">Products in Plot</div>
            <button className="btn btn-secondary btn-sm" onClick={addProduct} disabled={!cropProds.length}>+ Add</button>
          </div>
          {form.products_data.map((pd,i) => (
            <div key={i} className="card" style={{ marginBottom:10 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                <select className="form-select" style={{ flex:1, marginRight:8 }} value={pd.pid} onChange={e => updateProd(i,'pid',e.target.value)}>
                  {cropProds.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <button onClick={() => removeProd(i)} style={{ background:'none', border:'none', color:'var(--text-dim)', cursor:'pointer', padding:4 }}><IconX/></button>
              </div>
              <div className="form-group" style={{ marginBottom:8 }}>
                <label className="form-label">Rating</label>
                <div className="rating-input">
                  {[1,2,3,4,5].map(n => <span key={n} className={`rating-star ${n<=pd.rating?'filled':''}`} style={{ fontSize:24 }} onClick={() => updateProd(i,'rating',n)}>★</span>)}
                </div>
              </div>
              <textarea className="form-textarea" style={{ minHeight:60 }} placeholder="Product-specific notes…" value={pd.notes} onChange={e => updateProd(i,'notes',e.target.value)}/>
            </div>
          ))}
          <button className="btn btn-primary btn-full" onClick={save} disabled={saving}>{saving?'Saving…':'Save Entry'}</button>
        </div>
      </div>
    )
  }

  function DetailModal({ type, data }) {
    if (type==='product') {
      const scoreKeys = data.crop==='Corn' ? CORN_SCORES : data.crop==='Soybean' ? SOY_SCORES : WHEAT_SCORES
      const relObs = observations.filter(o => o.product_id===data.id)
      return (
        <div className="modal-overlay" onClick={() => setShowDetail(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-handle"/>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
              <div><div className="modal-title" style={{ marginBottom:4 }}>{data.name}</div><CropTag crop={data.crop}/></div>
              {data.is_new && <span className="new-badge">NEW 2026</span>}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:16 }}>
              {[['Brand',data.brand],['Maturity',data.maturity],['Tech',(data.technologies||[]).join(', ')||'—']].map(([l,v]) => (
                <div key={l} style={{ background:'rgba(255,255,255,0.04)', borderRadius:8, padding:'8px 10px' }}>
                  <div style={{ fontSize:10, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:1 }}>{l}</div>
                  <div style={{ fontSize:13, marginTop:2 }}>{v||'—'}</div>
                </div>
              ))}
            </div>
            {scoreKeys.map(k => (
              <div key={k} style={{ marginBottom:10 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ fontSize:13, color:'var(--text-muted)' }}>{k}</span>
                  <span style={{ fontFamily:'Barlow Condensed', fontWeight:700, color:'var(--gd-light)' }}>{(data.scores||{})[k]||0}/9</span>
                </div>
                <ScoreBar val={(data.scores||{})[k]||0}/>
              </div>
            ))}
            {data.placement && <>
              <div className="divider"/>
              <div className="card-title" style={{ marginBottom:10 }}>Placement</div>
              {data.placement.soilTypes?.length>0 && <div style={{ marginBottom:6, fontSize:13, color:'var(--text-muted)' }}><strong style={{ color:'var(--text-dim)', fontSize:11, textTransform:'uppercase', letterSpacing:1 }}>Soil: </strong>{data.placement.soilTypes.join(', ')}</div>}
              {data.placement.drainage?.length>0 && <div style={{ marginBottom:6, fontSize:13, color:'var(--text-muted)' }}><strong style={{ color:'var(--text-dim)', fontSize:11, textTransform:'uppercase', letterSpacing:1 }}>Drainage: </strong>{data.placement.drainage.join(', ')}</div>}
              {(data.placement.popMin||data.placement.popMax) && <div style={{ marginBottom:6, fontSize:13, color:'var(--text-muted)' }}><strong style={{ color:'var(--text-dim)', fontSize:11, textTransform:'uppercase', letterSpacing:1 }}>Population: </strong>{data.placement.popMin}–{data.placement.popMax}</div>}
              {data.placement.yieldZone && <div style={{ marginBottom:6, fontSize:13, color:'var(--text-muted)' }}><strong style={{ color:'var(--text-dim)', fontSize:11, textTransform:'uppercase', letterSpacing:1 }}>Yield Zone: </strong>{data.placement.yieldZone}</div>}
              {data.placement.placementNotes && <div style={{ fontSize:13, color:'var(--text-muted)', marginTop:4 }}>{data.placement.placementNotes}</div>}
            </>}
            {data.selling_points && <><div className="divider"/><div className="card-title" style={{ marginBottom:6 }}>Selling Points</div><div style={{ fontSize:14, color:'var(--text-muted)', marginBottom:14 }}>{data.selling_points}</div></>}
            {data.notes && <><div className="card-title" style={{ marginBottom:6 }}>Notes</div><div style={{ fontSize:14, color:'var(--text-muted)', marginBottom:14 }}>{data.notes}</div></>}
            {relObs.length>0 && <>
              <div className="divider"/>
              <div className="card-title" style={{ marginBottom:10 }}>Field Observations ({relObs.length})</div>
              {relObs.map(o => (
                <div key={o.id} style={{ padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                    <span style={{ fontSize:12, color:'var(--text-dim)' }}>{fmtDate(o.date)} · {o.growth_stage}</span>
                    <Stars n={o.rating} size={12}/>
                  </div>
                  <div style={{ fontSize:13, color:'var(--text-muted)' }}>{o.notes}</div>
                  {o.photos?.length>0 && (
                    <div className="photo-strip">
                      {o.photos.map((url,i) => <img key={i} className="photo-thumb" src={url} alt="" onClick={() => setLightboxUrl(url)}/>)}
                    </div>
                  )}
                  <div className="entry-meta">{o.entered_by && <span className="by">{o.entered_by}</span>}</div>
                </div>
              ))}
            </>}
            <div className="entry-meta" style={{ marginTop:16 }}>
              Added by {data.entered_by && <span className="by">{data.entered_by}</span>} {data.entered_by_role && `(${data.entered_by_role})`} · {fmtDate(data.created_at)}
            </div>
          </div>
        </div>
      )
    }
    if (type==='obs') {
      const prod = products.find(p => p.id===data.product_id)
      return (
        <div className="modal-overlay" onClick={() => setShowDetail(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-handle"/>
            <div className="modal-title">{prod?.name||'Observation'}</div>
            {prod && <div style={{ marginBottom:12 }}><CropTag crop={prod.crop}/></div>}
            <div style={{ display:'flex', gap:16, marginBottom:14, flexWrap:'wrap' }}>
              <div><div style={{ fontSize:11, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:1 }}>Date</div><div style={{ fontSize:14 }}>{fmtDate(data.date)}</div></div>
              <div><div style={{ fontSize:11, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:1 }}>Stage</div><div style={{ fontSize:14 }}>{data.growth_stage||'—'}</div></div>
              <div><div style={{ fontSize:11, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:1 }}>Rating</div><Stars n={data.rating} size={16}/></div>
            </div>
            {data.location && <div style={{ marginBottom:12, fontSize:13, color:'var(--text-muted)' }}>📍 {data.location}</div>}
            {data.notes && <div style={{ fontSize:14, color:'var(--text)', lineHeight:1.6, marginBottom:14 }}>{data.notes}</div>}
            {data.photos?.length>0 && (
              <div className="photo-preview-grid">
                {data.photos.map((url,i) => <div key={i} className="photo-preview-item" style={{ cursor:'pointer' }} onClick={() => setLightboxUrl(url)}><img src={url} alt=""/></div>)}
              </div>
            )}
            <div className="entry-meta" style={{ marginTop:14 }}>
              By {data.entered_by && <span className="by">{data.entered_by}</span>} {data.entered_by_role && `· ${data.entered_by_role}`}
            </div>
          </div>
        </div>
      )
    }
    if (type==='plot') {
      return (
        <div className="modal-overlay" onClick={() => setShowDetail(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-handle"/>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
              <span className={`crop-tag ${data.type==='pkp'?'corn':'soybean'}`}>{data.type?.toUpperCase()}</span>
              <span style={{ fontSize:11, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:1 }}>{data.crop}</span>
            </div>
            <div className="modal-title">{data.field_name}</div>
            <div style={{ display:'flex', gap:16, marginBottom:14, flexWrap:'wrap' }}>
              <div><div style={{ fontSize:11, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:1 }}>Date</div><div style={{ fontSize:14 }}>{fmtDate(data.date)}</div></div>
              <div><div style={{ fontSize:11, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:1 }}>Stage</div><div style={{ fontSize:14 }}>{data.growth_stage||'—'}</div></div>
              <div><div style={{ fontSize:11, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:1 }}>Location</div><div style={{ fontSize:14 }}>{data.location||'—'}</div></div>
            </div>
            {data.field_notes && <div style={{ fontSize:14, color:'var(--text-muted)', marginBottom:14 }}>{data.field_notes}</div>}
            {data.photos?.length>0 && (
              <div className="photo-preview-grid" style={{ marginBottom:14 }}>
                {data.photos.map((url,i) => <div key={i} className="photo-preview-item" onClick={() => setLightboxUrl(url)}><img src={url} alt=""/></div>)}
              </div>
            )}
            {data.products_data?.length>0 && <>
              <div className="divider"/>
              <div className="card-title" style={{ marginBottom:10 }}>Products</div>
              {data.products_data.map((pd,i) => {
                const prod = products.find(p => p.id===pd.pid)
                return (
                  <div key={i} style={{ padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                      <span style={{ fontFamily:'Barlow Condensed', fontWeight:700, fontSize:16 }}>{prod?.name||pd.pid}</span>
                      <Stars n={pd.rating} size={14}/>
                    </div>
                    {pd.notes && <div style={{ fontSize:13, color:'var(--text-muted)' }}>{pd.notes}</div>}
                  </div>
                )
              })}
            </>}
            <div className="entry-meta" style={{ marginTop:14 }}>
              By {data.entered_by && <span className="by">{data.entered_by}</span>} {data.entered_by_role && `· ${data.entered_by_role}`}
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  if (showOnboard) return <Onboard/>

  return (
    <>
      <Head>
        <title>Pioneer CropLytics · Indiana</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
        <meta name="mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
        <meta name="theme-color" content="#0D1710"/>
      </Head>
      <div className="app-shell">
        <div className="app-header">
          <div className="header-top">
            <div className="header-brand">
              <div className="header-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3C8 3 5 7 5 11c0 3 1.5 5.5 4 7h6c2.5-1.5 4-4 4-7 0-4-3-8-7-8z" fill="white" opacity="0.9"/>
                  <path d="M12 18v3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="11" r="3" fill="#CC0000"/>
                </svg>
              </div>
              <div className="header-wordmark">
                <div className="app-name">Pioneer <span>CropLytics</span></div>
                <div className="app-sub">Indiana · Field Team</div>
              </div>
            </div>
            <div className="season-badge">2026</div>
          </div>
          {user && (
            <div className="user-pill" onClick={() => { if (confirm('Switch user?')) { localStorage.removeItem('cl_user'); setUser(null); setShowOnboard(true) } }}>
              <div className="user-avatar">{initials(user.name)}</div>
              {user.name} · {user.role}
            </div>
          )}
        </div>
        <div className="app-content">
          {loading
            ? <div className="loading-full"><div className="spinner"/></div>
            : <>
                <div className={`section ${tab==='dashboard'?'active':''}`}><Dashboard/></div>
                <div className={`section ${tab==='products'?'active':''}`}><Products/></div>
                <div className={`section ${tab==='observations'?'active':''}`}><FieldLog/></div>
                <div className={`section ${tab==='compare'?'active':''}`}><Compare/></div>
              </>
          }
        </div>
        <div className="tab-bar">
          {[
            { id:'dashboard', label:'Dashboard', icon:<IconHome/> },
            { id:'products',  label:'Products',  icon:<IconSeedling/> },
            { id:'observations', label:'Field Log', icon:<IconDoc/> },
            { id:'compare',   label:'Compare',   icon:<IconCompare/> },
          ].map(t => (
            <button key={t.id} className={`tab-btn ${tab===t.id?'active':''}`} onClick={() => switchTab(t.id)}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>
      </div>
      {showProductModal && <AddProductModal/>}
      {showObsModal    && <AddObsModal/>}
      {showPlotModal   && <AddPlotModal/>}
      {showDetail      && <DetailModal type={showDetail.type} data={showDetail.data}/>}
      {lightboxUrl && (
        <div className="lightbox" onClick={() => setLightboxUrl(null)}>
          <button className="lightbox-close" onClick={() => setLightboxUrl(null)}><IconX/></button>
          <img src={lightboxUrl} alt="" onClick={e => e.stopPropagation()}/>
        </div>
      )}
      {toast && <div className="toast">✓ {toast}</div>}
    </>
  )
}
