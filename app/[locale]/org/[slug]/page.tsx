export default function OrgSlugPage({ params }: { params: { locale: string; slug: string } }) {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>✅ Page Fonctionne !</h1>
      <p>Locale: {params.locale}</p>
      <p>Slug: {params.slug}</p>
    </div>
  )
}
