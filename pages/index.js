import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'

const IconHome = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>)
const IconSeedling = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V12"/><path d="M12 12C12 8 9 4 5 4c0 4 2 8 7 8z"/><path d="M12 12c0-4 3-8 7-8 0 4-2 8-7 8z"/></svg>)
const IconDoc = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>)
const IconCompare = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="9" height="18" rx="1"/><rect x="13" y="3" width="9" height="18" rx="1"/></svg>)
const IconPlus = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>)
const IconX = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>)
const IconEdit = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>)
const IconBack = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>)
const IconPrint = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>)
const IconMap = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>)

const CROPS = ['Corn', 'Soybean', 'Wheat']
const BRANDS = ['Pioneer', 'DeKalb', 'Channel', 'Dyna-Gro', 'Croplan', 'AgriGold', 'Brevant', 'Other']
const CORN_SCORES = ['Stalk Strength','Mid-Season Brittle Stalk','Root Strength','Stress Emergence','Drought Tolerance','Staygreen','Test Weight','Plant Height','Ear Height','Tar Spot','Gray Leaf Spot','Northern Corn Leaf Blight','Southern Rust','Anthracnose Stalk Rot','Fusarium Ear Rot','Gibberella Ear Rot','Diplodia Ear Rot']
const SOY_SCORES  = ['Yield','SCN Resistance','White Mold','Standability','Iron Deficiency','Phytophthora','SDS','Sudden Death Syndrome']
const WHEAT_SCORES= ['Yield','Test Weight','Disease Package','Winter Hardiness','Straw Strength','Heading Date','Flour Quality']
const SOIL_TYPES  = ['Sandy','Sandy Loam','Loam','Silt Loam','Silty Clay Loam','Clay','Muck']
const DRAINAGE    = ['Excessive','Well Drained','Moderately Well','Somewhat Poor','Poor','Very Poor']
const YIELD_ZONES = ['High Yield (240+)','Moderate (200-240)','Low (170-200)','Stress / Dryland (<170)']
const CORN_TECH   = ['PowerCore Enlist','Vorceed Enlist','AcreMax','Qrome','VT2P','VT4P','Trecepta','SmartStax','SmartStax Pro','Conventional']
const SOY_TECH    = ['ENLIST E3','Roundup Ready 2 Xtend','LibertyLink','Conventional']
const STAGES_CORN = ['VE','V1','V2','V3','V4','V5','V6','V7','V8','V9','V10','VT','R1','R2','R3','R4','R5','R6']
const STAGES_SOY  = ['VE','VC','V1','V2','V3','V4','V5','V6','R1','R2','R3','R4','R5','R6','R7','R8']
const ADMIN_CODE  = 'KYLEQUICK'

function fmtDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })
}
function initials(name) {
  if (!name) return '?'
  return name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)
}
function Stars({ n=0, size=14 }) {
  return <div className="star-row">{[1,2,3,4,5].map(i=><span key={i} className={`star ${i<=n?'':'empty'}`} style={{fontSize:size}}>★</span>)}</div>
}
function CropTag({ crop }) {
  const cls = crop==='Corn'?'corn':crop==='Soybean'?'soybean':'wheat'
  return <span className={`crop-tag ${cls}`}>{crop}</span>
}
function ScoreBar({ val, color='var(--gd-light)' }) {
  return <div className="compare-bar-wrap" style={{height:8}}><div className="compare-bar-fill" style={{width:`${(val/9)*100}%`,background:color}}/></div>
}
function ModalHeader({ title, onBack }) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:18}}>
      <button onClick={onBack} style={{background:'#CC0000',border:'none',borderRadius:8,height:36,padding:'0 14px',display:'flex',alignItems:'center',gap:5,cursor:'pointer',color:'white',flexShrink:0,fontFamily:'Barlow Condensed',fontWeight:700,fontSize:13,letterSpacing:0.5,boxShadow:'0 2px 8px rgba(204,0,0,0.4)'}}>
        <IconBack/> BACK
      </button>
      <div style={{fontFamily:'Barlow Condensed',fontWeight:800,fontSize:22,color:'#fff'}}>{title}</div>
    </div>
  )
}
function GoogleMapsButton({ gps }) {
  if (!gps?.lat || !gps?.lng) return null
  const url = `https://www.google.com/maps/dir/?api=1&destination=${gps.lat},${gps.lng}`
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',alignItems:'center',gap:6,padding:'8px 14px',background:'rgba(74,140,84,0.15)',border:'1px solid var(--border-green)',borderRadius:8,color:'var(--gd-light)',fontSize:13,fontFamily:'Barlow Condensed',fontWeight:700,textDecoration:'none',marginBottom:12}}>
      <IconMap/> Get Directions in Google Maps
    </a>
  )
}

async function apiFetch(path) {
  const r = await fetch(path)
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}
async function apiPost(path, body) {
  const r = await fetch(path, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)})
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}
async function apiPatch(path, body) {
  const r = await fetch(path, {method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)})
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}
async function uploadPhoto(file) {
  const r = await fetch('/api/upload', {method:'POST', headers:{'Content-Type':file.type}, body:file})
  if (!r.ok) throw new Error(await r.text())
  const { url } = await r.json()
  return url
}

function MapPinPicker({ onSelect, initial }) {
  const [showMap, setShowMap] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [coords, setCoords] = useState(initial || null)
  const [loading, setLoading] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const mapRef = useRef(null)
  const leafletMap = useRef(null)
  const markerRef = useRef(null)

  useEffect(() => {
    if (!showMap) return
    // Load Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }
    // Load Leaflet JS
    function initMap() {
      if (!mapRef.current || leafletMap.current) return
      const L = window.L
      const center = coords ? [parseFloat(coords.lat), parseFloat(coords.lng)] : [40.2672, -86.1349] // Indiana center
      const map = L.map(mapRef.current, { zoomControl: true }).setView(center, coords ? 14 : 7)
      // Google Maps Hybrid - satellite + street labels
      L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        attribution: '© Google', maxZoom: 21, maxNativeZoom: 21
      }).addTo(map)
      // Custom green marker
      const greenIcon = L.divIcon({
        html: `<div style="width:28px;height:28px;background:#2E7D32;border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.4)"></div>`,
        iconSize: [28, 28], iconAnchor: [14, 28], className: ''
      })
      if (coords) {
        markerRef.current = L.marker([parseFloat(coords.lat), parseFloat(coords.lng)], {icon: greenIcon, draggable: true}).addTo(map)
        markerRef.current.on('dragend', async e => {
          const pos = e.target.getLatLng()
          await reverseGeocode(pos.lat.toFixed(6), pos.lng.toFixed(6))
        })
      }
      map.on('click', async e => {
        const lat = e.latlng.lat.toFixed(6)
        const lng = e.latlng.lng.toFixed(6)
        if (markerRef.current) markerRef.current.remove()
        markerRef.current = L.marker([parseFloat(lat), parseFloat(lng)], {icon: greenIcon, draggable: true}).addTo(map)
        markerRef.current.on('dragend', async ev => {
          const pos = ev.target.getLatLng()
          await reverseGeocode(pos.lat.toFixed(6), pos.lng.toFixed(6))
        })
        await reverseGeocode(lat, lng)
      })
      leafletMap.current = map
      setTimeout(() => map.invalidateSize(), 100)
    }
    if (window.L) { initMap() }
    else {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = initMap
      document.head.appendChild(script)
    }
    return () => { if (leafletMap.current) { leafletMap.current.remove(); leafletMap.current = null; markerRef.current = null } }
  }, [showMap])

  async function reverseGeocode(lat, lng) {
    try {
      const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      const data = await resp.json()
      const addr = data.display_name || `${lat}, ${lng}`
      const result = { lat, lng, address: addr }
      setCoords(result); onSelect(result)
    } catch(e) {
      const result = { lat, lng, address: `${lat}, ${lng}` }
      setCoords(result); onSelect(result)
    }
  }

  async function useMyLocation() {
    setLoading(true)
    try {
      const pos = await new Promise((res,rej) => navigator.geolocation.getCurrentPosition(res,rej,{timeout:10000}))
      const lat = pos.coords.latitude.toFixed(6)
      const lng = pos.coords.longitude.toFixed(6)
      await reverseGeocode(lat, lng)
      if (leafletMap.current && window.L) {
        leafletMap.current.setView([parseFloat(lat), parseFloat(lng)], 15)
        const greenIcon = window.L.divIcon({
          html: `<div style="width:28px;height:28px;background:#2E7D32;border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.4)"></div>`,
          iconSize: [28,28], iconAnchor: [14,28], className:''
        })
        if (markerRef.current) markerRef.current.remove()
        markerRef.current = window.L.marker([parseFloat(lat), parseFloat(lng)], {icon: greenIcon, draggable: true}).addTo(leafletMap.current)
      }
      setShowMap(true)
    } catch(e) { alert('Could not get location. Please allow location access.') }
    setLoading(false)
  }

  async function searchAddress() {
    if (!searchVal.trim()) return
    setLoading(true)
    try {
      const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchVal)}&limit=1`)
      const data = await resp.json()
      if (data[0]) {
        const lat = parseFloat(data[0].lat).toFixed(6)
        const lng = parseFloat(data[0].lon).toFixed(6)
        await reverseGeocode(lat, lng)
        if (leafletMap.current && window.L) {
          leafletMap.current.setView([parseFloat(lat), parseFloat(lng)], 14)
          const greenIcon = window.L.divIcon({
            html: `<div style="width:28px;height:28px;background:#2E7D32;border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.4)"></div>`,
            iconSize:[28,28], iconAnchor:[14,28], className:''
          })
          if (markerRef.current) markerRef.current.remove()
          markerRef.current = window.L.marker([parseFloat(lat), parseFloat(lng)], {icon: greenIcon, draggable: true}).addTo(leafletMap.current)
        }
      } else { alert('Location not found. Try a more specific address.') }
    } catch(e) {}
    setLoading(false)
  }

  return (
    <div style={{marginBottom:14}}>
      <label className="form-label">📍 Drop a Pin</label>
      {coords && (
        <div style={{background:'rgba(74,140,84,0.1)',border:'1px solid var(--border-green)',borderRadius:8,padding:'8px 12px',marginBottom:8}}>
          <div style={{fontFamily:'Barlow Condensed',fontWeight:700,color:'var(--gd-light)',fontSize:13}}>📍 {coords.lat}, {coords.lng}</div>
          <div style={{fontSize:11,color:'var(--text-dim)',marginTop:2,lineHeight:1.4}}>{coords.address}</div>
          <button onClick={()=>{setCoords(null);onSelect(null)}} style={{marginTop:4,background:'none',border:'none',color:'var(--text-dim)',cursor:'pointer',fontSize:11,padding:0}}>× Remove pin</button>
        </div>
      )}
      <div style={{display:'flex',gap:6,marginBottom:6}}>
        <button className="btn btn-secondary btn-sm" onClick={()=>setShowMap(!showMap)} style={{flex:1}}>
          {showMap ? '🗺 Hide Map' : '🗺 Open Map'}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={useMyLocation} disabled={loading} style={{flex:1}}>
          {loading ? '...' : '📍 My Location'}
        </button>
      </div>
      {showMap && (
        <div style={{
          border:'1px solid var(--border-green)',
          borderRadius: fullscreen ? 0 : 10,
          overflow:'hidden',
          marginBottom: fullscreen ? 0 : 6,
          position: fullscreen ? 'fixed' : 'relative',
          top: fullscreen ? 0 : 'auto',
          left: fullscreen ? 0 : 'auto',
          right: fullscreen ? 0 : 'auto',
          bottom: fullscreen ? 0 : 'auto',
          zIndex: fullscreen ? 9999 : 'auto',
          display:'flex',
          flexDirection:'column',
          background:'var(--bg)'
        }}>
          <div style={{background:'rgba(0,0,0,0.6)',padding:'8px 12px',paddingTop: fullscreen ? 'max(8px, env(safe-area-inset-top, 8px))' : '8px',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
            <span style={{fontSize:11,color:'var(--text-muted)'}}>📍 Tap to drop pin · Drag to move</span>
            <button
              onClick={()=>{ setFullscreen(f=>!f); setTimeout(()=>leafletMap.current?.invalidateSize(),150) }}
              style={{background:'#2E7D32',border:'none',borderRadius:6,padding:'5px 12px',color:'white',fontSize:12,fontFamily:'Barlow Condensed',fontWeight:700,cursor:'pointer',letterSpacing:0.5}}>
              {fullscreen ? '✕ EXIT FULLSCREEN' : '⛶ FULLSCREEN'}
            </button>
          </div>
          <div ref={mapRef} style={{flex: fullscreen ? 1 : 'none', height: fullscreen ? undefined : 280, width:'100%'}}/>
          <div style={{padding:'8px 10px',display:'flex',gap:6,background:'var(--bg-card)',flexShrink:0}}>
            <input className="form-input" style={{flex:1,padding:'7px 10px',fontSize:13}} placeholder="Search address or farm name…" value={searchVal} onChange={e=>setSearchVal(e.target.value)} onKeyDown={e=>e.key==='Enter'&&searchAddress()}/>
            <button className="btn btn-primary btn-sm" onClick={searchAddress}>Go</button>
          </div>
        </div>
      )}
    </div>
  )
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
  const [editProduct, setEditProduct] = useState(null)
  const [showObsModal, setShowObsModal] = useState(false)
  const [showPlotModal, setShowPlotModal] = useState(false)
  const [plotType, setPlotType] = useState('pkp')
  const [showDetail, setShowDetail] = useState(null)
  const [productFilter, setProductFilter] = useState('Corn')
  const [obsFilter, setObsFilter] = useState('All')
  const [lightboxUrl, setLightboxUrl] = useState(null)
  const toastRef = useRef(null)

  function showToast(msg) {
    setToast(msg)
    clearTimeout(toastRef.current)
    toastRef.current = setTimeout(()=>setToast(null), 2500)
  }

  const isAdmin = user?.isAdmin === true

  useEffect(()=>{
    const saved = localStorage.getItem('cl_user')
    if (saved) setUser(JSON.parse(saved))
    else setShowOnboard(true)
  },[])

  useEffect(()=>{ if(user) loadAll() },[user])

  async function loadAll() {
    setLoading(true)
    try {
      const [p,o,pl] = await Promise.all([apiFetch('/api/products'), apiFetch('/api/observations'), apiFetch('/api/plots')])
      setProducts(p); setObservations(o); setPlotEntries(pl)
    } catch(e){ console.error(e) }
    setLoading(false)
  }

  function switchTab(t){ setTab(t); window.scrollTo({top:0,behavior:'instant'}) }

  // ── ONBOARDING ──
  function Onboard() {
    const [name, setName] = useState('')
    const [role, setRole] = useState('Field Agronomy')
    const [code, setCode] = useState('')
    const [showCode, setShowCode] = useState(false)

    function save() {
      if (!name.trim()) return
      const isAdmin = code.trim().toUpperCase() === ADMIN_CODE
      const u = {name:name.trim(), role, id:Date.now().toString(), isAdmin}
      localStorage.setItem('cl_user', JSON.stringify(u))
      setUser(u); setShowOnboard(false)
    }

    return (
      <div className="onboard-overlay">
        <div className="onboard-logo">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M24 8C18 8 12 14 12 22c0 5 2 9 5 12h14c3-3 5-7 5-12 0-8-6-14-12-14z" fill="white" opacity="0.9"/>
            <path d="M24 36v6" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="24" cy="22" r="5" fill="white" opacity="0.8"/>
          </svg>
        </div>
        <div>
          <div className="onboard-title">Pioneer <span>CropLytics</span></div>
          <div style={{fontFamily:'Barlow Condensed',fontWeight:600,fontSize:14,color:'var(--text-dim)',textAlign:'center',letterSpacing:3,textTransform:'uppercase',marginTop:4}}>Indiana · 2026 Season</div>
        </div>
        <div className="onboard-sub">Enter your name so your teammates can see who added each entry.</div>
        <div style={{width:'100%',maxWidth:320,display:'flex',flexDirection:'column',gap:12}}>
          <div className="form-group" style={{marginBottom:0}}>
            <label className="form-label">Your Name</label>
            <input className="form-input" placeholder="e.g. Jake Miller" value={name} onChange={e=>setName(e.target.value)} autoFocus/>
          </div>
          <div className="form-group" style={{marginBottom:0}}>
            <label className="form-label">Team</label>
            <select className="form-select" value={role} onChange={e=>setRole(e.target.value)}>
              <option>Field Agronomy</option><option>Sales Rep</option><option>DSM</option><option>Other</option>
            </select>
          </div>
          <div className="form-group" style={{marginBottom:0}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
              <label className="form-label" style={{marginBottom:0}}>Admin Code <span style={{color:'var(--text-dim)',fontWeight:400}}>(optional)</span></label>
            </div>
            <input className="form-input" type="password" placeholder="Enter admin code if you have one" value={code} onChange={e=>setCode(e.target.value)} onKeyDown={e=>e.key==='Enter'&&save()}/>
            <div style={{fontSize:11,color:'var(--text-dim)',marginTop:4}}>Admin code required to add or edit products</div>
          </div>
          <button className="btn btn-primary btn-full" style={{marginTop:4}} onClick={save}>Get Started →</button>
        </div>
      </div>
    )
  }

  // ── DASHBOARD ──
  function Dashboard() {
    const counts = {corn:products.filter(p=>p.crop==='Corn').length, soy:products.filter(p=>p.crop==='Soybean').length, wheat:products.filter(p=>p.crop==='Wheat').length}
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
            <button className="btn btn-ghost btn-sm" onClick={()=>switchTab('observations')}>View All</button>
          </div>
          {observations.slice(0,5).length===0
            ? <div style={{color:'var(--text-dim)',fontSize:13,padding:'10px 0'}}>No observations yet</div>
            : observations.slice(0,5).map(o=>{
                const prod=products.find(p=>p.id===o.product_id)
                return (
                  <div key={o.id} className="obs-item" onClick={()=>setShowDetail({type:'obs',data:o})}>
                    <div className="obs-header"><span className="obs-date">{fmtDate(o.date)}</span><Stars n={o.rating}/></div>
                    <div className="obs-product">{prod?.name||'Unknown'}</div>
                    {prod&&<CropTag crop={prod.crop}/>}
                    <div className="obs-notes">{o.notes}</div>
                    {o.photos?.length>0&&<div className="photo-strip">{o.photos.slice(0,4).map((url,i)=><img key={i} className="photo-thumb" src={url} alt="" onClick={e=>{e.stopPropagation();setLightboxUrl(url)}}/>)}</div>}
                    <div className="entry-meta">{o.entered_by&&<span className="by">{o.entered_by}</span>}{o.entered_by_role&&<span>{o.entered_by_role}</span>}</div>
                  </div>
                )
              })
          }
        </div>
        {plotEntries.length>0&&(
          <div className="card">
            <div className="card-header"><span className="card-title">Recent PKP / PXP</span><button className="btn btn-ghost btn-sm" onClick={()=>switchTab('observations')}>View All</button></div>
            {plotEntries.slice(0,3).map(e=>(
              <div key={e.id} className="obs-item" onClick={()=>setShowDetail({type:'plot',data:e})}>
                <div className="obs-header"><span className={`crop-tag ${e.type==='pkp'?'corn':'soybean'}`}>{e.type?.toUpperCase()}</span><span className="obs-date">{fmtDate(e.date)}</span></div>
                <div className="obs-product">{e.field_name}</div>
                <div className="obs-stage">{e.growth_stage} · {e.location}</div>
                <div className="entry-meta">{e.entered_by&&<span className="by">{e.entered_by}</span>}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ── PRODUCTS ──
  function Products() {
    const filtered = products.filter(p=>p.crop===productFilter).slice().sort((a,b)=>{ const am=parseFloat(a.maturity)||999; const bm=parseFloat(b.maturity)||999; return am-bm })
    return (
      <div>
        <div className="section-header">
          <span className="section-title">Products</span>
          {isAdmin && <button className="btn btn-primary btn-sm" onClick={()=>{setEditProduct(null);setShowProductModal(true)}}><IconPlus/> Add</button>}
        </div>
        {isAdmin && (
          <div style={{background:'rgba(74,140,84,0.08)',border:'1px solid var(--border-green)',borderRadius:8,padding:'6px 12px',marginBottom:12,fontSize:12,color:'var(--gd-light)'}}>
            🔑 Admin mode — you can add and edit products
          </div>
        )}
        <div className="filter-tabs">
          {['Corn','Soybean','Wheat'].map(f=><button key={f} className={`filter-tab ${productFilter===f?'active':''}`} onClick={()=>setProductFilter(f)}>{f}</button>)}
        </div>
        {filtered.length===0
          ? <div className="empty-state"><p>No products yet.{isAdmin?' Tap Add to get started.':''}</p></div>
          : filtered.map(p=>{
              const keys = p.crop==='Corn'?CORN_SCORES:p.crop==='Soybean'?SOY_SCORES:WHEAT_SCORES
              const scores=p.scores||{}
              const avg=keys.length?Math.round(keys.reduce((s,k)=>s+(scores[k]||0),0)/keys.length):0
              const obsCount=observations.filter(o=>o.product_id===p.id).length
              return (
                <div key={p.id} className="product-item">
                  <div className="product-item-top" onClick={()=>setShowDetail({type:'product',data:p})}>
                    <div>
                      <div className="product-name">{p.name}</div>
                      <div className="product-maturity">{p.brand} · {p.maturity}</div>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4}}>
                      {p.is_new&&<span className="new-badge">NEW</span>}
                      <CropTag crop={p.crop}/>
                    </div>
                  </div>
                  <div className="score-bar">
                    <span className="score-pill">Avg {avg}/9</span>
                    <div className="score-dots">{Array.from({length:9}).map((_,i)=><div key={i} className={`score-dot ${i<avg?'filled'+(avg>=7?' high':''):''}`}/>)}</div>
                    <span style={{marginLeft:'auto',fontSize:11,color:'var(--text-dim)'}}>{obsCount} obs</span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:8}}>
                    <div className="entry-meta" style={{marginTop:0}}>
                      {p.entered_by&&<span className="by">{p.entered_by}</span>}
                      <span>{fmtDate(p.created_at)}</span>
                    </div>
                    {isAdmin && (
                      <button className="btn btn-ghost btn-sm" style={{padding:'4px 10px',fontSize:11}} onClick={()=>{setEditProduct(p);setShowProductModal(true)}}>
                        <IconEdit/> Edit
                      </button>
                    )}
                  </div>
                </div>
              )
            })
        }
      </div>
    )
  }

  // ── FIELD LOG ──
  function FieldLog() {
    const [logTab, setLogTab] = useState('obs')
    const filteredObs = obsFilter==='All' ? observations : observations.filter(o=>{
      const prod=products.find(p=>p.id===o.product_id)
      return prod?.crop===obsFilter
    })
    return (
      <div>
        <div className="section-header">
          <span className="section-title">Field Log</span>
          <div style={{display:'flex',gap:6}}>
            <button className="btn btn-secondary btn-sm" onClick={()=>{setPlotType('pkp');setShowPlotModal(true)}}>PKP</button>
            <button className="btn btn-secondary btn-sm" onClick={()=>{setPlotType('pxp');setShowPlotModal(true)}}>PXP</button>
            <button className="btn btn-primary btn-sm" onClick={()=>setShowObsModal(true)}><IconPlus/> Obs</button>
          </div>
        </div>
        <div className="filter-tabs">
          <button className={`filter-tab ${logTab==='obs'?'active':''}`} onClick={()=>setLogTab('obs')}>Observations</button>
          <button className={`filter-tab ${logTab==='pkp'?'active':''}`} onClick={()=>setLogTab('pkp')}>PKP / PXP</button>
        </div>
        {logTab==='obs'&&<>
          <div className="filter-tabs">
            {['All','Corn','Soybean','Wheat'].map(f=><button key={f} className={`filter-tab ${obsFilter===f?'active':''}`} onClick={()=>setObsFilter(f)}>{f}</button>)}
          </div>
          {filteredObs.length===0
            ? <div className="empty-state"><p>No observations yet.</p></div>
            : filteredObs.map(o=>{
                const prod=products.find(p=>p.id===o.product_id)
                return (
                  <div key={o.id} className="obs-item" onClick={()=>setShowDetail({type:'obs',data:o})}>
                    <div className="obs-header"><span className="obs-date">{fmtDate(o.date)}</span><Stars n={o.rating}/></div>
                    <div className="obs-product">{prod?.name||'Unknown Product'}</div>
                    <div className="obs-stage">{o.growth_stage}{o.location?` · ${o.location}`:''}</div>
                    {prod&&<div style={{marginTop:4}}><CropTag crop={prod.crop}/></div>}
                    <div className="obs-notes">{o.notes}</div>
                    {o.photos?.length>0&&<div className="photo-strip">{o.photos.slice(0,4).map((url,i)=><img key={i} className="photo-thumb" src={url} alt="" onClick={e=>{e.stopPropagation();setLightboxUrl(url)}}/>)}</div>}
                    <div className="entry-meta">{o.entered_by&&<span className="by">{o.entered_by}</span>}{o.entered_by_role&&<span>{o.entered_by_role}</span>}</div>
                  </div>
                )
              })
          }
        </>}
        {logTab==='pkp'&&<>
          {plotEntries.length===0
            ? <div className="empty-state"><p>No PKP/PXP entries yet.</p></div>
            : plotEntries.map(e=>(
                <div key={e.id} className="obs-item" onClick={()=>setShowDetail({type:'plot',data:e})}>
                  <div className="obs-header"><span className={`crop-tag ${e.type==='pkp'?'corn':'soybean'}`}>{e.type?.toUpperCase()}</span><span className="obs-date">{fmtDate(e.date)}</span></div>
                  <div className="obs-product">{e.field_name}</div>
                  <div className="obs-stage">{e.growth_stage} · {e.location}</div>
                  {e.gps&&<div style={{fontSize:11,color:'var(--gd-light)',marginTop:2}}>📍 {e.gps.lat}, {e.gps.lng}</div>}
                  <div className="obs-notes">{e.field_notes}</div>
                  {e.photos?.length>0&&<div className="photo-strip">{e.photos.slice(0,3).map((url,i)=><img key={i} className="photo-thumb" src={url} alt="" onClick={ev=>{ev.stopPropagation();setLightboxUrl(url)}}/>)}</div>}
                  <div className="entry-meta">{e.entered_by&&<span className="by">{e.entered_by}</span>}<span>{e.products_data?.length||0} products</span></div>
                </div>
              ))
          }
        </>}
      </div>
    )
  }

  // ── COMPARE ──
  function Compare() {
    const [crop, setCrop] = useState('Corn')
    const [selected, setSelected] = useState([])
    const cropProds = products.filter(p=>p.crop===crop)
    const scoreKeys = crop==='Corn'?CORN_SCORES:crop==='Soybean'?SOY_SCORES:WHEAT_SCORES
    const colors = ['var(--gold)','var(--gd-light)','#8B9EFF','#FF9E6D']

    function toggle(p) {
      setSelected(prev=>{
        if (prev.find(x=>x.id===p.id)) return prev.filter(x=>x.id!==p.id)
        if (prev.length>=4) return prev
        return [...prev,p]
      })
    }

    function avgObs(p) {
      const obs = observations.filter(o=>o.product_id===p.id)
      if (!obs.length) return '—'
      return (obs.reduce((s,o)=>s+(o.rating||0),0)/obs.length).toFixed(1)
    }

    function printComparison() {
      const rows = [
        {label:'Crop', get:p=>p.crop},
        {label:'Maturity', get:p=>p.maturity||'—'},
        {label:'Brand', get:p=>p.brand||'—'},
        {label:'Technology', get:p=>(p.technologies||[]).join(', ')||'—'},
        {label:'Yield Zones', get:p=>(p.placement?.yieldZones||[]).join(', ')||'—'},
        {label:'Field Obs Rating', get:p=>avgObs(p)},
        ...scoreKeys.map(k=>({label:k, get:p=>(p.scores||{})[k]||0}))
      ]

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Pioneer CropLytics — ${crop} Comparison</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
            h1 { font-size: 22px; margin-bottom: 4px; }
            h2 { font-size: 14px; color: #666; font-weight: normal; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; font-size: 13px; }
            th { background: #1B3A1F; color: white; padding: 8px 12px; text-align: left; }
            th:not(:first-child) { text-align: center; }
            td { padding: 7px 12px; border-bottom: 1px solid #ddd; }
            td:not(:first-child) { text-align: center; font-weight: bold; }
            tr:nth-child(even) { background: #f9f9f9; }
            .attr { color: #555; font-weight: normal; }
            .footer { margin-top: 20px; font-size: 11px; color: #999; }
          </style>
        </head>
        <body>
          <h1>Pioneer CropLytics — ${crop} Comparison</h1>
          <h2>Indiana · 2026 Season · Printed ${new Date().toLocaleDateString()}</h2>
          <table>
            <thead>
              <tr>
                <th>Attribute</th>
                ${selected.map(p=>`<th>${p.name}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${rows.map(row=>`
                <tr>
                  <td class="attr">${row.label}</td>
                  ${selected.map(p=>`<td>${row.get(p)}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">Generated by Pioneer CropLytics · pioneer-croplytics-2026.vercel.app</div>
        </body>
        </html>
      `
      const win = window.open('', '_blank')
      win.document.write(html)
      win.document.close()
      win.print()
    }

    return (
      <div>
        <div className="section-header">
          <span className="section-title">Compare</span>
          <div style={{display:'flex',gap:6}}>
            {selected.length>0&&<button className="btn btn-ghost btn-sm" onClick={()=>setSelected([])}>Clear</button>}
            {selected.length>=2&&<button className="btn btn-secondary btn-sm" onClick={printComparison}><IconPrint/> Print</button>}
          </div>
        </div>
        <div className="filter-tabs">
          {CROPS.map(c=><button key={c} className={`filter-tab ${crop===c?'active':''}`} onClick={()=>{setCrop(c);setSelected([])}}>{c}</button>)}
        </div>
        <div className="card" style={{marginBottom:14}}>
          <div className="card-title" style={{marginBottom:10}}>Select up to 4 products</div>
          {cropProds.length===0
            ? <div style={{color:'var(--text-dim)',fontSize:13}}>No {crop} products added yet.</div>
            : cropProds.map(p=>{
                const sel=!!selected.find(x=>x.id===p.id)
                return (
                  <div key={p.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid var(--border)'}}>
                    <div>
                      <div style={{fontFamily:'Barlow Condensed',fontWeight:700,fontSize:16,color:'#fff'}}>{p.name}</div>
                      <div style={{fontSize:12,color:'var(--text-muted)'}}>{p.maturity} · {p.brand}</div>
                    </div>
                    <button className={`btn btn-sm ${sel?'btn-primary':'btn-secondary'}`} onClick={()=>toggle(p)} disabled={!sel&&selected.length>=4}>
                      {sel?'✓ Selected':'Select'}
                    </button>
                  </div>
                )
              })
          }
        </div>

        {selected.length>=2&&(
          <div style={{overflowX:'auto'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
              <div className="card-title">Head-to-Head</div>
              <button className="btn btn-secondary btn-sm" onClick={printComparison}><IconPrint/> Print</button>
            </div>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
              <thead>
                <tr>
                  <th style={{textAlign:'left',padding:'8px 10px',color:'var(--text-dim)',fontSize:11,textTransform:'uppercase',letterSpacing:1,borderBottom:'1px solid var(--border)',minWidth:160,background:'rgba(255,255,255,0.02)'}}>Attribute</th>
                  {selected.map((p,i)=>(
                    <th key={p.id} style={{textAlign:'center',padding:'8px 10px',borderBottom:'1px solid var(--border)',minWidth:90,background:'rgba(255,255,255,0.02)'}}>
                      <div style={{fontFamily:'Barlow Condensed',fontWeight:700,fontSize:15,color:colors[i]}}>{p.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {label:'Crop', get:p=>p.crop},
                  {label:'Maturity', get:p=>p.maturity||'—'},
                  {label:'Brand', get:p=>p.brand||'—'},
                  {label:'Technology', get:p=>(p.technologies||[]).join(', ')||'—'},
                  {label:'Yield Zones', get:p=>(p.placement?.yieldZones||[]).join(', ')||'—'},
                  {label:'Field Obs Rating', get:p=>avgObs(p)},
                  ...scoreKeys.map(k=>({label:k, get:p=>(p.scores||{})[k]||0, isScore:true}))
                ].map((row,ri)=>(
                  <tr key={ri} style={{background:ri%2===0?'rgba(255,255,255,0.02)':'transparent'}}>
                    <td style={{padding:'7px 10px',color:'var(--text-muted)',fontSize:12,borderBottom:'1px solid rgba(255,255,255,0.04)'}}>{row.label}</td>
                    {selected.map((p,i)=>{
                      const val = row.get(p)
                      const isNum = row.isScore
                      const max = isNum ? Math.max(...selected.map(s=>Number(row.get(s))||0)) : null
                      const isTop = isNum && Number(val)===max && Number(val)>0
                      return (
                        <td key={p.id} style={{textAlign:'center',padding:'7px 10px',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                          {isNum
                            ? <span style={{fontFamily:'Barlow Condensed',fontWeight:700,fontSize:16,color:isTop?colors[i]:'var(--text)'}}>{val||'—'}</span>
                            : <span style={{fontSize:12,color:'var(--text-muted)'}}>{val}</span>
                          }
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {selected.length===1&&<div style={{textAlign:'center',color:'var(--text-dim)',fontSize:13,padding:20}}>Select at least 2 products to compare</div>}
      </div>
    )
  }

  // ── PRODUCT FORM ──
  function ProductForm() {
    const isEdit = !!editProduct
    const [form, setForm] = useState(isEdit ? {
      crop:editProduct.crop||'Corn', name:editProduct.name||'', brand:editProduct.brand||'Pioneer',
      maturity:editProduct.maturity||'', is_new:editProduct.is_new||false,
      technologies:editProduct.technologies||[], selling_points:editProduct.selling_points||'',
      notes:editProduct.notes||'', crm_fields:editProduct.crm_fields||{}, soy_traits:editProduct.soy_traits||{},
      scores:editProduct.scores||{},
      placement:editProduct.placement||{soilTypes:[],drainage:[],popMin:'',popMax:'',yieldZones:[],placementNotes:''}
    } : {
      crop:'Corn', name:'', brand:'Pioneer', maturity:'', is_new:false,
      technologies:[], selling_points:'', notes:'', crm_fields:{}, soy_traits:{},
      scores:{}, placement:{soilTypes:[],drainage:[],popMin:'',popMax:'',yieldZones:[],placementNotes:''}
    })
    const [saving, setSaving] = useState(false)
    const scoreKeys = form.crop==='Corn'?CORN_SCORES:form.crop==='Soybean'?SOY_SCORES:WHEAT_SCORES
    const techOptions = form.crop==='Corn'?CORN_TECH:SOY_TECH
    function set(k,v){ setForm(f=>({...f,[k]:v})) }
    function setScore(k,v){ setForm(f=>({...f,scores:{...f.scores,[k]:Number(v)}})) }
    function setP(k,v){ setForm(f=>({...f,placement:{...f.placement,[k]:v}})) }
    function toggleArr(arr,val){ return arr.includes(val)?arr.filter(x=>x!==val):[...arr,val] }
    function close(){ setShowProductModal(false); setEditProduct(null) }

    async function save() {
      if (!form.name.trim()) return alert('Please enter a product name')
      setSaving(true)
      try {
        if (isEdit) {
          await apiPatch(`/api/products?id=${editProduct.id}`, {...form, entered_by:user.name, entered_by_role:user.role})
        } else {
          await apiPost('/api/products', {...form, entered_by:user.name, entered_by_role:user.role})
        }
        await loadAll(); close(); showToast(isEdit?'Product updated!':'Product saved!')
      } catch(e){ alert('Error: '+e.message) }
      setSaving(false)
    }

    return (
      <div className="modal-overlay">
        <div className="modal">
          <ModalHeader title={isEdit?'Edit Product':'Add Product'} onBack={close}/>
          <div className="form-group">
            <label className="form-label">Crop</label>
            <div className="chip-group">{CROPS.map(c=><button key={c} className={`chip ${form.crop===c?'selected':''}`} onClick={()=>set('crop',c)}>{c}</button>)}</div>
          </div>
          <div className="form-group">
            <label className="form-label">Product Name / Hybrid #</label>
            <input className="form-input" placeholder="e.g. P1197AM" value={form.name} onChange={e=>set('name',e.target.value)} autoFocus/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <div className="form-group">
              <label className="form-label">Brand</label>
              <select className="form-select" value={form.brand} onChange={e=>set('brand',e.target.value)}>
                {BRANDS.map(b=><option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Maturity</label>
              <input className="form-input" placeholder={form.crop==='Corn'?'110 RM':'3.8'} value={form.maturity} onChange={e=>set('maturity',e.target.value)}/>
            </div>
          </div>
          <div className="form-group" style={{display:'flex',alignItems:'center',gap:10}}>
            <input type="checkbox" id="isnew" checked={form.is_new} onChange={e=>set('is_new',e.target.checked)} style={{width:18,height:18}}/>
            <label htmlFor="isnew" style={{fontSize:14,color:'var(--text-muted)'}}>New for 2026 Season</label>
          </div>
          <div className="form-group">
            <label className="form-label">Technology</label>
            <select className="form-select" value={form.technologies[0]||''} onChange={e=>set('technologies',e.target.value?[e.target.value]:[])}>
              <option value="">Select…</option>
              {techOptions.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="divider"/>
          <div className="card-title" style={{marginBottom:12}}>Agronomic Ratings (1–9)</div>
          {scoreKeys.map(k=>(
            <div key={k} className="score-group">
              <div className="score-label-row"><span className="score-name">{k}</span><span className="score-val">{form.scores[k]||0}</span></div>
              <input type="range" min="0" max="9" value={form.scores[k]||0} onChange={e=>setScore(k,e.target.value)}/>
            </div>
          ))}
          <div className="divider"/>
          <div className="card-title" style={{marginBottom:12}}>Placement</div>
          <div className="form-group">
            <label className="form-label">Soil Types</label>
            <div className="chip-group">{SOIL_TYPES.map(s=><button key={s} className={`chip ${(form.placement.soilTypes||[]).includes(s)?'selected':''}`} onClick={()=>setP('soilTypes',toggleArr(form.placement.soilTypes||[],s))}>{s}</button>)}</div>
          </div>
          <div className="form-group">
            <label className="form-label">Drainage</label>
            <div className="chip-group">{DRAINAGE.map(d=><button key={d} className={`chip ${(form.placement.drainage||[]).includes(d)?'selected':''}`} onClick={()=>setP('drainage',toggleArr(form.placement.drainage||[],d))}>{d}</button>)}</div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <div className="form-group"><label className="form-label">Pop Min</label><input className="form-input" placeholder="28,000" value={form.placement.popMin||''} onChange={e=>setP('popMin',e.target.value)}/></div>
            <div className="form-group"><label className="form-label">Pop Max</label><input className="form-input" placeholder="36,000" value={form.placement.popMax||''} onChange={e=>setP('popMax',e.target.value)}/></div>
          </div>
          <div className="form-group">
            <label className="form-label">Target Yield Zone</label>
            <div className="chip-group">{YIELD_ZONES.map(y=><button key={y} className={`chip ${(form.placement.yieldZones||[]).includes(y)?'selected':''}`} onClick={()=>setP('yieldZones',toggleArr(form.placement.yieldZones||[],y))}>{y}</button>)}</div>
          </div>
          <div className="form-group"><label className="form-label">Placement Notes</label><textarea className="form-textarea" placeholder="Additional placement guidance…" value={form.placement.placementNotes||''} onChange={e=>setP('placementNotes',e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Selling Points</label><textarea className="form-textarea" placeholder="Key selling points…" value={form.selling_points} onChange={e=>set('selling_points',e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Notes</label><textarea className="form-textarea" placeholder="General notes…" value={form.notes} onChange={e=>set('notes',e.target.value)}/></div>
          <button className="btn btn-primary btn-full" onClick={save} disabled={saving}>{saving?'Saving…':isEdit?'Save Changes':'Save Product'}</button>
        </div>
      </div>
    )
  }

  // ── ADD OBSERVATION ──
  function AddObsModal() {
    const [form, setForm] = useState({product_id:'', date:new Date().toISOString().split('T')[0], growth_stage:'', location:'', rating:0, notes:'', gps:null})
    const [photos, setPhotos] = useState([])
    const [saving, setSaving] = useState(false)
    const fileRef = useRef()
    const selectedProd = products.find(p=>p.id===form.product_id)
    const stages = selectedProd?.crop==='Corn'?STAGES_CORN:STAGES_SOY
    function set(k,v){ setForm(f=>({...f,[k]:v})) }
    function handleFiles(e) {
      Array.from(e.target.files).forEach(file=>{
        const reader=new FileReader()
        reader.onload=ev=>setPhotos(prev=>[...prev,{file,preview:ev.target.result}])
        reader.readAsDataURL(file)
      })
    }
    async function save() {
      if (!form.product_id||!form.date) return alert('Please select a product and date')
      setSaving(true)
      try {
        const photoUrls = await Promise.all(photos.map(p=>uploadPhoto(p.file)))
        await apiPost('/api/observations', {...form, photos:photoUrls, entered_by:user.name, entered_by_role:user.role})
        await loadAll(); setShowObsModal(false); showToast('Observation saved!')
      } catch(e){ alert('Error: '+e.message) }
      setSaving(false)
    }
    return (
      <div className="modal-overlay">
        <div className="modal">
          <ModalHeader title="Field Observation" onBack={()=>setShowObsModal(false)}/>
          <div className="form-group">
            <label className="form-label">Product</label>
            <select className="form-select" value={form.product_id} onChange={e=>set('product_id',e.target.value)}>
              <option value="">Select product…</option>
              {products.map(p=><option key={p.id} value={p.id}>{p.name} ({p.crop})</option>)}
            </select>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <div className="form-group"><label className="form-label">Date</label><input type="date" className="form-input" value={form.date} onChange={e=>set('date',e.target.value)}/></div>
            <div className="form-group">
              <label className="form-label">Growth Stage</label>
              <select className="form-select" value={form.growth_stage} onChange={e=>set('growth_stage',e.target.value)}>
                <option value="">Select…</option>
                {stages.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group"><label className="form-label">Location / Field Name</label><input className="form-input" placeholder="e.g. Smith Farm North" value={form.location} onChange={e=>set('location',e.target.value)}/></div>
          <MapPinPicker onSelect={gps=>set('gps',gps)} initial={form.gps}/>
          <div className="form-group">
            <label className="form-label">Rating</label>
            <div className="rating-input">{[1,2,3,4,5].map(n=><span key={n} className={`rating-star ${n<=form.rating?'filled':''}`} onClick={()=>set('rating',n)}>★</span>)}</div>
          </div>
          <div className="form-group"><label className="form-label">Observation Notes</label><textarea className="form-textarea" style={{minHeight:100}} placeholder="What did you observe today?" value={form.notes} onChange={e=>set('notes',e.target.value)}/></div>
          <div className="form-group">
            <label className="form-label">Photos</label>
            <div className="photo-upload-area" onClick={()=>fileRef.current?.click()}><div style={{fontSize:24,marginBottom:4}}>📷</div><div style={{fontWeight:600,marginBottom:2}}>Add Photos</div><div style={{fontSize:11,color:"var(--text-dim)"}}>Take a photo or choose from camera roll</div></div>
            <input ref={fileRef} type="file" accept="image/*" multiple style={{display:'none'}} onChange={handleFiles}/>
            {photos.length>0&&<div className="photo-preview-grid">{photos.map((p,i)=><div key={i} className="photo-preview-item"><img src={p.preview} alt=""/><button className="photo-remove" onClick={()=>setPhotos(prev=>prev.filter((_,j)=>j!==i))}>×</button></div>)}</div>}
          </div>
          <button className="btn btn-primary btn-full" onClick={save} disabled={saving}>{saving?'Uploading & Saving…':'Save Observation'}</button>
        </div>
      </div>
    )
  }

  // ── PKP / PXP MODAL ──
  function AddPlotModal() {
    const isPKP = plotType==='pkp'
    const minProducts = 2
    const maxProducts = isPKP ? 20 : 4
    const [form, setForm] = useState({
      type:plotType, field_name:'', date:new Date().toISOString().split('T')[0],
      crop:'Corn', growth_stage:'', location:'', field_notes:'', gps:null, products_data:[]
    })
    const [fieldPhotos, setFieldPhotos] = useState([])
    const [saving, setSaving] = useState(false)
    const fileRef = useRef()
    function set(k,v){ setForm(f=>({...f,[k]:v})) }
    const stages = form.crop==='Corn'?STAGES_CORN:STAGES_SOY
    const cropProds = products.filter(p=>p.crop===form.crop)
    function addProduct() {
      if (!cropProds.length) return
      if (form.products_data.length>=maxProducts) return alert(`Maximum ${maxProducts} products`)
      setForm(f=>({...f,products_data:[...f.products_data,{pid:cropProds[0].id,rating:0,notes:'',photoFiles:[]}]}))
    }
    function updateProd(i,k,v){ setForm(f=>{ const arr=[...f.products_data]; arr[i]={...arr[i],[k]:v}; return {...f,products_data:arr} }) }
    function removeProd(i){ setForm(f=>({...f,products_data:f.products_data.filter((_,j)=>j!==i)})) }
    function handleFieldFiles(e) {
      Array.from(e.target.files).forEach(file=>{
        const reader=new FileReader()
        reader.onload=ev=>setFieldPhotos(prev=>[...prev,{file,preview:ev.target.result}])
        reader.readAsDataURL(file)
      })
    }
    function handleProdFiles(e,i) {
      Array.from(e.target.files).forEach(file=>{
        const reader=new FileReader()
        reader.onload=ev=>{ setForm(f=>{ const arr=[...f.products_data]; arr[i]={...arr[i],photoFiles:[...(arr[i].photoFiles||[]),{file,preview:ev.target.result}]}; return {...f,products_data:arr} }) }
        reader.readAsDataURL(file)
      })
    }
    async function save() {
      if (!form.field_name.trim()) return alert('Please enter a field name')
      if (form.products_data.length<minProducts) return alert(`Please add at least ${minProducts} products`)
      setSaving(true)
      try {
        const photoUrls = await Promise.all(fieldPhotos.map(p=>uploadPhoto(p.file)))
        const prodData = await Promise.all(form.products_data.map(async pd=>{
          const pUrls = await Promise.all((pd.photoFiles||[]).map(p=>uploadPhoto(p.file)))
          return {pid:pd.pid, rating:pd.rating, notes:pd.notes, photos:pUrls}
        }))
        await apiPost('/api/plots', {...form, photos:photoUrls, products_data:prodData, entered_by:user.name, entered_by_role:user.role})
        await loadAll(); setShowPlotModal(false); showToast('Entry saved!')
      } catch(e){ alert('Error: '+e.message) }
      setSaving(false)
    }
    return (
      <div className="modal-overlay">
        <div className="modal">
          <ModalHeader title={isPKP?'PKP Entry':'PXP Entry'} onBack={()=>setShowPlotModal(false)}/>
          <div style={{fontSize:12,color:'var(--text-muted)',marginBottom:14}}>{isPKP?'Pioneer Key Plot — 2 to 20 products':'Pioneer Xcel Plot — 2 to 4 products'}</div>
          <div className="form-group"><label className="form-label">Field Name</label><input className="form-input" placeholder="e.g. Johnson Farm" value={form.field_name} onChange={e=>set('field_name',e.target.value)}/></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <div className="form-group"><label className="form-label">Date</label><input type="date" className="form-input" value={form.date} onChange={e=>set('date',e.target.value)}/></div>
            <div className="form-group"><label className="form-label">Crop</label><select className="form-select" value={form.crop} onChange={e=>set('crop',e.target.value)}>{CROPS.map(c=><option key={c}>{c}</option>)}</select></div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <div className="form-group">
              <label className="form-label">Growth Stage</label>
              <select className="form-select" value={form.growth_stage} onChange={e=>set('growth_stage',e.target.value)}>
                <option value="">Select…</option>
                {stages.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">County / Township</label><input className="form-input" placeholder="e.g. Tippecanoe Co." value={form.location} onChange={e=>set('location',e.target.value)}/></div>
          </div>
          <MapPinPicker onSelect={gps=>set('gps',gps)} initial={form.gps}/>
          <div className="form-group"><label className="form-label">Field Notes</label><textarea className="form-textarea" placeholder="Overall field observations…" value={form.field_notes} onChange={e=>set('field_notes',e.target.value)}/></div>
          <div className="form-group">
            <label className="form-label">Field Photos</label>
            <div className="photo-upload-area" onClick={()=>fileRef.current?.click()}><div style={{fontSize:24,marginBottom:4}}>📷</div><div style={{fontWeight:600,marginBottom:2}}>Add Photos</div><div style={{fontSize:11,color:"var(--text-dim)"}}>Take a photo or choose from camera roll</div></div>
            <input ref={fileRef} type="file" accept="image/*" multiple style={{display:'none'}} onChange={handleFieldFiles}/>
            {fieldPhotos.length>0&&<div className="photo-preview-grid">{fieldPhotos.map((p,i)=><div key={i} className="photo-preview-item"><img src={p.preview} alt=""/><button className="photo-remove" onClick={()=>setFieldPhotos(prev=>prev.filter((_,j)=>j!==i))}>×</button></div>)}</div>}
          </div>
          <div className="divider"/>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
            <div>
              <div className="card-title">Products in Plot</div>
              <div style={{fontSize:11,color:'var(--text-dim)',marginTop:2}}>{form.products_data.length}/{maxProducts} added · min {minProducts}</div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={addProduct} disabled={!cropProds.length||form.products_data.length>=maxProducts}>+ Add Product</button>
          </div>
          {form.products_data.map((pd,i)=>(
            <div key={i} className="card" style={{marginBottom:10}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                <div style={{fontFamily:'Barlow Condensed',fontWeight:700,fontSize:14,color:'var(--gd-light)'}}>Product {i+1}</div>
                <button onClick={()=>removeProd(i)} style={{background:'none',border:'none',color:'var(--text-dim)',cursor:'pointer',padding:4}}><IconX/></button>
              </div>
              <div className="form-group" style={{marginBottom:10}}>
                <select className="form-select" value={pd.pid} onChange={e=>updateProd(i,'pid',e.target.value)}>
                  {cropProds.map(p=><option key={p.id} value={p.id}>{p.name} · {p.brand}</option>)}
                </select>
              </div>
              <div className="form-group" style={{marginBottom:8}}>
                <label className="form-label">Rating</label>
                <div className="rating-input">{[1,2,3,4,5].map(n=><span key={n} className={`rating-star ${n<=pd.rating?'filled':''}`} style={{fontSize:24}} onClick={()=>updateProd(i,'rating',n)}>★</span>)}</div>
              </div>
              <textarea className="form-textarea" style={{minHeight:60,marginBottom:8}} placeholder="Notes on this product…" value={pd.notes} onChange={e=>updateProd(i,'notes',e.target.value)}/>
              <div>
                <label className="form-label">Photos for this product</label>
                <div className="photo-upload-area" style={{padding:'10px',fontSize:12}} onClick={()=>{ const inp=document.createElement('input'); inp.type='file'; inp.accept='image/*'; inp.multiple=true; inp.onchange=e=>handleProdFiles(e,i); inp.click() }}>📷 Take photo or choose from roll</div>
                {(pd.photoFiles||[]).length>0&&<div className="photo-preview-grid" style={{marginTop:6}}>{(pd.photoFiles||[]).map((p,j)=><div key={j} className="photo-preview-item"><img src={p.preview} alt=""/><button className="photo-remove" onClick={()=>{setForm(f=>{const arr=[...f.products_data];arr[i]={...arr[i],photoFiles:(arr[i].photoFiles||[]).filter((_,k)=>k!==j)};return {...f,products_data:arr}})}}>×</button></div>)}</div>}
              </div>
            </div>
          ))}
          <button className="btn btn-primary btn-full" onClick={save} disabled={saving||form.products_data.length<minProducts}>
            {saving?'Saving…':`Save ${isPKP?'PKP':'PXP'} Entry`}
          </button>
        </div>
      </div>
    )
  }

  // ── DETAIL MODALS ──
  function DetailModal({ type, data }) {
    if (type==='product') {
      const scoreKeys = data.crop==='Corn'?CORN_SCORES:data.crop==='Soybean'?SOY_SCORES:WHEAT_SCORES
      const relObs = observations.filter(o=>o.product_id===data.id)
      return (
        <div className="modal-overlay">
          <div className="modal">
            <ModalHeader title={data.name} onBack={()=>setShowDetail(null)}/>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
              <CropTag crop={data.crop}/>
              {data.is_new&&<span className="new-badge">NEW 2026</span>}
              {isAdmin&&<button className="btn btn-ghost btn-sm" style={{marginLeft:'auto'}} onClick={()=>{setShowDetail(null);setEditProduct(data);setShowProductModal(true)}}><IconEdit/> Edit</button>}
              {isAdmin&&<button onClick={async()=>{if(!confirm('Delete this product?'))return;try{await fetch(`/api/products?id=${data.id}`,{method:'DELETE'});await loadAll();setShowDetail(null);showToast('Product deleted')}catch(e){alert('Error: '+e.message)}}} style={{background:'rgba(200,0,0,0.15)',border:'1px solid rgba(200,0,0,0.3)',borderRadius:8,padding:'6px 12px',color:'#ff6b6b',fontSize:12,fontFamily:'Barlow Condensed',fontWeight:700,cursor:'pointer',flexShrink:0}}>Delete</button>}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:16}}>
              {[['Brand',data.brand],['Maturity',data.maturity],['Tech',(data.technologies||[]).join(', ')||'—']].map(([l,v])=>(
                <div key={l} style={{background:'rgba(255,255,255,0.04)',borderRadius:8,padding:'8px 10px'}}>
                  <div style={{fontSize:10,color:'var(--text-dim)',textTransform:'uppercase',letterSpacing:1}}>{l}</div>
                  <div style={{fontSize:13,marginTop:2}}>{v||'—'}</div>
                </div>
              ))}
            </div>
            {scoreKeys.map(k=>(
              <div key={k} style={{marginBottom:10}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                  <span style={{fontSize:13,color:'var(--text-muted)'}}>{k}</span>
                  <span style={{fontFamily:'Barlow Condensed',fontWeight:700,color:'var(--gd-light)'}}>{(data.scores||{})[k]||0}/9</span>
                </div>
                <ScoreBar val={(data.scores||{})[k]||0}/>
              </div>
            ))}
            {data.crm_fields&&(data.crm_fields.silk_crm||data.crm_fields.physio_crm||data.crm_fields.gdu_silk||data.crm_fields.gdu_physio)&&<>
              <div className="divider"/>
              <div className="card-title" style={{marginBottom:10}}>CRM Details</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
                {data.crm_fields.silk_crm&&<div style={{background:'rgba(255,255,255,0.04)',borderRadius:8,padding:'8px 10px'}}><div style={{fontSize:10,color:'var(--text-dim)',textTransform:'uppercase',letterSpacing:1}}>Silk CRM</div><div style={{fontSize:14,marginTop:2}}>{data.crm_fields.silk_crm}</div></div>}
                {data.crm_fields.physio_crm&&<div style={{background:'rgba(255,255,255,0.04)',borderRadius:8,padding:'8px 10px'}}><div style={{fontSize:10,color:'var(--text-dim)',textTransform:'uppercase',letterSpacing:1}}>Physio CRM</div><div style={{fontSize:14,marginTop:2}}>{data.crm_fields.physio_crm}</div></div>}
                {data.crm_fields.gdu_silk&&<div style={{background:'rgba(255,255,255,0.04)',borderRadius:8,padding:'8px 10px'}}><div style={{fontSize:10,color:'var(--text-dim)',textTransform:'uppercase',letterSpacing:1}}>GDU to Silk</div><div style={{fontSize:14,marginTop:2}}>{data.crm_fields.gdu_silk}</div></div>}
                {data.crm_fields.gdu_physio&&<div style={{background:'rgba(255,255,255,0.04)',borderRadius:8,padding:'8px 10px'}}><div style={{fontSize:10,color:'var(--text-dim)',textTransform:'uppercase',letterSpacing:1}}>GDU to Physio</div><div style={{fontSize:14,marginTop:2}}>{data.crm_fields.gdu_physio}</div></div>}
              </div>
            </>}
            {data.soy_traits&&Object.keys(data.soy_traits).length>0&&<>
              <div className="divider"/>
              <div className="card-title" style={{marginBottom:10}}>Soybean Traits</div>
              <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:8}}>
                {data.soy_traits.phyto_gene?.length>0&&<div style={{fontSize:13,color:'var(--text-muted)'}}><strong style={{color:'var(--text-dim)',fontSize:11,textTransform:'uppercase',letterSpacing:1}}>Phyto Gene: </strong>{data.soy_traits.phyto_gene.join(', ')}</div>}
                {data.soy_traits.bsr&&<div style={{fontSize:13,color:'var(--text-muted)'}}><strong style={{color:'var(--text-dim)',fontSize:11,textTransform:'uppercase',letterSpacing:1}}>BSR: </strong>{data.soy_traits.bsr}</div>}
                {data.soy_traits.scn_source&&<div style={{fontSize:13,color:'var(--text-muted)'}}><strong style={{color:'var(--text-dim)',fontSize:11,textTransform:'uppercase',letterSpacing:1}}>SCN Source: </strong>{data.soy_traits.scn_source}</div>}
                {data.soy_traits.flower_color&&<div style={{fontSize:13,color:'var(--text-muted)'}}><strong style={{color:'var(--text-dim)',fontSize:11,textTransform:'uppercase',letterSpacing:1}}>Flower: </strong>{data.soy_traits.flower_color}</div>}
                {data.soy_traits.hila_color&&<div style={{fontSize:13,color:'var(--text-muted)'}}><strong style={{color:'var(--text-dim)',fontSize:11,textTransform:'uppercase',letterSpacing:1}}>Hila: </strong>{data.soy_traits.hila_color}</div>}
                {data.soy_traits.pod_color&&<div style={{fontSize:13,color:'var(--text-muted)'}}><strong style={{color:'var(--text-dim)',fontSize:11,textTransform:'uppercase',letterSpacing:1}}>Pod: </strong>{data.soy_traits.pod_color}</div>}
              </div>
            </>}
            {data.placement&&<>
              <div className="divider"/>
              <div className="card-title" style={{marginBottom:10}}>Placement</div>
              {data.placement.soilTypes?.length>0&&<div style={{marginBottom:6,fontSize:13,color:'var(--text-muted)'}}><strong style={{color:'var(--text-dim)',fontSize:11,textTransform:'uppercase',letterSpacing:1}}>Soil: </strong>{data.placement.soilTypes.join(', ')}</div>}
              {data.placement.drainage?.length>0&&<div style={{marginBottom:6,fontSize:13,color:'var(--text-muted)'}}><strong style={{color:'var(--text-dim)',fontSize:11,textTransform:'uppercase',letterSpacing:1}}>Drainage: </strong>{data.placement.drainage.join(', ')}</div>}
              {(data.placement.popMin||data.placement.popMax)&&<div style={{marginBottom:6,fontSize:13,color:'var(--text-muted)'}}><strong style={{color:'var(--text-dim)',fontSize:11,textTransform:'uppercase',letterSpacing:1}}>Pop: </strong>{data.placement.popMin}–{data.placement.popMax}</div>}
              {data.placement.yieldZones?.length>0&&<div style={{marginBottom:6,fontSize:13,color:'var(--text-muted)'}}><strong style={{color:'var(--text-dim)',fontSize:11,textTransform:'uppercase',letterSpacing:1}}>Yield Zones: </strong>{data.placement.yieldZones.join(', ')}</div>}
              {data.placement.placementNotes&&<div style={{fontSize:13,color:'var(--text-muted)',marginTop:4}}>{data.placement.placementNotes}</div>}
            </>}
            {data.selling_points&&<><div className="divider"/><div className="card-title" style={{marginBottom:6}}>Selling Points</div><div style={{fontSize:14,color:'var(--text-muted)',marginBottom:14}}>{data.selling_points}</div></>}
            {data.notes&&<><div className="card-title" style={{marginBottom:6}}>Notes</div><div style={{fontSize:14,color:'var(--text-muted)',marginBottom:14}}>{data.notes}</div></>}
            {relObs.length>0&&<>
              <div className="divider"/>
              <div className="card-title" style={{marginBottom:10}}>Field Observations ({relObs.length})</div>
              {relObs.map(o=>(
                <div key={o.id} style={{padding:'10px 0',borderBottom:'1px solid var(--border)'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                    <span style={{fontSize:12,color:'var(--text-dim)'}}>{fmtDate(o.date)} · {o.growth_stage}</span>
                    <Stars n={o.rating} size={12}/>
                  </div>
                  <div style={{fontSize:13,color:'var(--text-muted)'}}>{o.notes}</div>
                  {o.photos?.length>0&&<div className="photo-strip">{o.photos.map((url,i)=><img key={i} className="photo-thumb" src={url} alt="" onClick={()=>setLightboxUrl(url)}/>)}</div>}
                  <div className="entry-meta">{o.entered_by&&<span className="by">{o.entered_by}</span>}</div>
                </div>
              ))}
            </>}
            <div className="entry-meta" style={{marginTop:16}}>Added by {data.entered_by&&<span className="by">{data.entered_by}</span>} {data.entered_by_role&&`(${data.entered_by_role})`} · {fmtDate(data.created_at)}</div>
          </div>
        </div>
      )
    }

    if (type==='obs') {
      const prod=products.find(p=>p.id===data.product_id)
      const canDelete = isAdmin || data.entered_by === user?.name
      async function deleteObs() {
        if (!confirm('Delete this observation?')) return
        try {
          await fetch(`/api/observations?id=${data.id}`, {method:'DELETE'})
          await loadAll(); setShowDetail(null); showToast('Deleted')
        } catch(e){ alert('Error: '+e.message) }
      }
      return (
        <div className="modal-overlay">
          <div className="modal">
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:18}}>
              <button onClick={()=>setShowDetail(null)} style={{background:'#CC0000',border:'none',borderRadius:8,height:36,padding:'0 14px',display:'flex',alignItems:'center',gap:5,cursor:'pointer',color:'white',flexShrink:0,fontFamily:'Barlow Condensed',fontWeight:700,fontSize:13,letterSpacing:0.5,boxShadow:'0 2px 8px rgba(204,0,0,0.4)'}}><IconBack/> BACK</button>
              <div style={{fontFamily:'Barlow Condensed',fontWeight:800,fontSize:22,color:'#fff',flex:1}}>{prod?.name||'Observation'}</div>
              {canDelete && <button onClick={deleteObs} style={{background:'rgba(200,0,0,0.15)',border:'1px solid rgba(200,0,0,0.3)',borderRadius:8,padding:'6px 12px',color:'#ff6b6b',fontSize:12,fontFamily:'Barlow Condensed',fontWeight:700,cursor:'pointer',flexShrink:0}}>Delete</button>}
            </div>
            {prod&&<div style={{marginBottom:12}}><CropTag crop={prod.crop}/></div>}
            <div style={{display:'flex',gap:16,marginBottom:14,flexWrap:'wrap'}}>
              <div><div style={{fontSize:11,color:'var(--text-dim)',textTransform:'uppercase',letterSpacing:1}}>Date</div><div style={{fontSize:14}}>{fmtDate(data.date)}</div></div>
              <div><div style={{fontSize:11,color:'var(--text-dim)',textTransform:'uppercase',letterSpacing:1}}>Stage</div><div style={{fontSize:14}}>{data.growth_stage||'—'}</div></div>
              <div><div style={{fontSize:11,color:'var(--text-dim)',textTransform:'uppercase',letterSpacing:1}}>Rating</div><Stars n={data.rating} size={16}/></div>
            </div>
            {data.location&&<div style={{marginBottom:8,fontSize:13,color:'var(--text-muted)'}}>📍 {data.location}</div>}
            {data.gps&&(
              <div style={{marginBottom:12}}>
                <div style={{fontSize:12,color:'var(--gd-light)',marginBottom:6}}>📍 {data.gps.lat}, {data.gps.lng}
                  {data.gps.address&&<div style={{fontSize:11,color:'var(--text-dim)',marginTop:2}}>{data.gps.address}</div>}
                </div>
                <GoogleMapsButton gps={data.gps}/>
              </div>
            )}
            {data.notes&&<div style={{fontSize:14,color:'var(--text)',lineHeight:1.6,marginBottom:14}}>{data.notes}</div>}
            {data.photos?.length>0&&<div className="photo-preview-grid">{data.photos.map((url,i)=><div key={i} className="photo-preview-item" style={{cursor:'pointer'}} onClick={()=>setLightboxUrl(url)}><img src={url} alt=""/></div>)}</div>}
            <div className="entry-meta" style={{marginTop:14}}>By {data.entered_by&&<span className="by">{data.entered_by}</span>} {data.entered_by_role&&`· ${data.entered_by_role}`}</div>
          </div>
        </div>
      )
    }

    if (type==='plot') {
      const canDelete = isAdmin || data.entered_by === user?.name
      async function deletePlot() {
        if (!confirm('Delete this entry?')) return
        try {
          await fetch(`/api/plots?id=${data.id}`, {method:'DELETE'})
          await loadAll(); setShowDetail(null); showToast('Deleted')
        } catch(e){ alert('Error: '+e.message) }
      }
      return (
        <div className="modal-overlay">
          <div className="modal">
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:18}}>
              <button onClick={()=>setShowDetail(null)} style={{background:'#CC0000',border:'none',borderRadius:8,height:36,padding:'0 14px',display:'flex',alignItems:'center',gap:5,cursor:'pointer',color:'white',flexShrink:0,fontFamily:'Barlow Condensed',fontWeight:700,fontSize:13,letterSpacing:0.5,boxShadow:'0 2px 8px rgba(204,0,0,0.4)'}}><IconBack/> BACK</button>
              <div style={{fontFamily:'Barlow Condensed',fontWeight:800,fontSize:22,color:'#fff',flex:1}}>{data.field_name}</div>
              {canDelete && <button onClick={deletePlot} style={{background:'rgba(200,0,0,0.15)',border:'1px solid rgba(200,0,0,0.3)',borderRadius:8,padding:'6px 12px',color:'#ff6b6b',fontSize:12,fontFamily:'Barlow Condensed',fontWeight:700,cursor:'pointer',flexShrink:0}}>Delete</button>}
            </div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
              <span className={`crop-tag ${data.type==='pkp'?'corn':'soybean'}`}>{data.type?.toUpperCase()}</span>
              <span style={{fontSize:11,color:'var(--text-dim)',textTransform:'uppercase',letterSpacing:1}}>{data.crop}</span>
            </div>
            <div style={{display:'flex',gap:16,marginBottom:14,flexWrap:'wrap'}}>
              <div><div style={{fontSize:11,color:'var(--text-dim)',textTransform:'uppercase',letterSpacing:1}}>Date</div><div style={{fontSize:14}}>{fmtDate(data.date)}</div></div>
              <div><div style={{fontSize:11,color:'var(--text-dim)',textTransform:'uppercase',letterSpacing:1}}>Stage</div><div style={{fontSize:14}}>{data.growth_stage||'—'}</div></div>
              <div><div style={{fontSize:11,color:'var(--text-dim)',textTransform:'uppercase',letterSpacing:1}}>Location</div><div style={{fontSize:14}}>{data.location||'—'}</div></div>
            </div>
            {data.gps&&(
              <div style={{marginBottom:14}}>
                <div style={{fontSize:12,color:'var(--gd-light)',marginBottom:8}}>
                  📍 {data.gps.lat}, {data.gps.lng}
                  {data.gps.address&&<div style={{fontSize:11,color:'var(--text-dim)',marginTop:2}}>{data.gps.address}</div>}
                </div>
                <GoogleMapsButton gps={data.gps}/>
              </div>
            )}
            {data.field_notes&&<div style={{fontSize:14,color:'var(--text-muted)',marginBottom:14}}>{data.field_notes}</div>}
            {data.photos?.length>0&&<div className="photo-preview-grid" style={{marginBottom:14}}>{data.photos.map((url,i)=><div key={i} className="photo-preview-item" onClick={()=>setLightboxUrl(url)}><img src={url} alt=""/></div>)}</div>}
            {data.products_data?.length>0&&<>
              <div className="divider"/>
              <div className="card-title" style={{marginBottom:10}}>Products ({data.products_data.length})</div>
              {data.products_data.map((pd,i)=>{
                const prod=products.find(p=>p.id===pd.pid)
                return (
                  <div key={i} style={{padding:'12px 0',borderBottom:'1px solid var(--border)'}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                      <span style={{fontFamily:'Barlow Condensed',fontWeight:700,fontSize:16}}>{prod?.name||pd.pid}</span>
                      <Stars n={pd.rating} size={14}/>
                    </div>
                    {pd.notes&&<div style={{fontSize:13,color:'var(--text-muted)',marginBottom:6}}>{pd.notes}</div>}
                    {pd.photos?.length>0&&<div className="photo-strip">{pd.photos.map((url,j)=><img key={j} className="photo-thumb" src={url} alt="" onClick={()=>setLightboxUrl(url)}/>)}</div>}
                  </div>
                )
              })}
            </>}
            <div className="entry-meta" style={{marginTop:14}}>By {data.entered_by&&<span className="by">{data.entered_by}</span>} {data.entered_by_role&&`· ${data.entered_by_role}`}</div>
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
                  <circle cx="12" cy="11" r="3" fill="white" opacity="0.7"/>
                </svg>
              </div>
              <div className="header-wordmark">
                <div className="app-name">Pioneer <span>CropLytics</span></div>
                <div className="app-sub">Indiana · Field Team {isAdmin&&'· Admin'}</div>
              </div>
            </div>
            <div className="season-badge">2026</div>
          </div>
          {user&&(
            <div className="user-pill" onClick={()=>{if(confirm('Switch user?')){localStorage.removeItem('cl_user');setUser(null);setShowOnboard(true)}}}>
              <div className="user-avatar">{initials(user.name)}</div>
              {user.name} · {user.role}{isAdmin?' 🔑':''}
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
            {id:'dashboard',label:'Dashboard',icon:<IconHome/>},
            {id:'products',label:'Products',icon:<IconSeedling/>},
            {id:'observations',label:'Field Log',icon:<IconDoc/>},
            {id:'compare',label:'Compare',icon:<IconCompare/>},
          ].map(t=>(
            <button key={t.id} className={`tab-btn ${tab===t.id?'active':''}`} onClick={()=>switchTab(t.id)}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>
      </div>
      {showProductModal&&<ProductForm/>}
      {showObsModal&&<AddObsModal/>}
      {showPlotModal&&<AddPlotModal/>}
      {showDetail&&<DetailModal type={showDetail.type} data={showDetail.data}/>}
      {lightboxUrl&&(
        <div className="lightbox" onClick={()=>setLightboxUrl(null)}>
          <button className="lightbox-close" onClick={()=>setLightboxUrl(null)}><IconX/></button>
          <img src={lightboxUrl} alt="" onClick={e=>e.stopPropagation()}/>
        </div>
      )}
      {toast&&<div className="toast">✓ {toast}</div>}
    </>
  )
}
