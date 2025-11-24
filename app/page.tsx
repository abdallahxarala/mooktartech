export default function RootPage() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>✅ Site Fonctionne</h1>
      <p>Cette page de test charge correctement</p>
      <div style={{ marginTop: '20px' }}>
        <a href="/fr/org/foire-dakar-2025">Foire Dakar</a>
        {' | '}
        <a href="/fr/org/mooktartech-com">Mooktar</a>
        {' | '}
        <a href="/fr/org/xarala-solutions">Xarala</a>
      </div>
    </div>
  )
}

