export default function FoireDakarPage() {
  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
        🎪 Foire Dakar 2025
      </h1>
      <p style={{ fontSize: '20px', color: '#666' }}>
        Site temporaire - En cours de finalisation
      </p>
      <div style={{ marginTop: '40px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <a href="/fr/foire-dakar-2025/tickets" style={{ padding: '15px 30px', background: '#f97316', color: 'white', borderRadius: '8px', textDecoration: 'none' }}>
          Billetterie
        </a>
        <a href="/fr/foire-dakar-2025/catalogue" style={{ padding: '15px 30px', background: '#3b82f6', color: 'white', borderRadius: '8px', textDecoration: 'none' }}>
          Exposants
        </a>
      </div>
    </div>
  )
}

