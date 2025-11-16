import * as React from 'react'
import type { OrderDetails } from '@/lib/orders/queries'

interface OrderConfirmationEmailProps {
  order: OrderDetails['order']
  items: OrderDetails['items']
  totals: {
    subtotal: number
    shipping: number
    tax: number
    total: number
  }
  trackingUrl: string
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    color: '#0f172a',
    backgroundColor: '#f8fafc',
    padding: '24px'
  },
  card: {
    maxWidth: '640px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '32px',
    boxShadow:
      '0 12px 24px -12px rgba(15, 23, 42, 0.25), 0 0 1px rgba(15, 23, 42, 0.1)'
  },
  title: {
    fontSize: '24px',
    fontWeight: 800,
    marginBottom: '12px'
  },
  paragraph: {
    lineHeight: 1.5,
    margin: '8px 0'
  },
  sectionTitle: {
    marginTop: '24px',
    marginBottom: '8px',
    fontWeight: 700,
    fontSize: '16px'
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: '0'
  },
  listItem: {
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '12px',
    backgroundColor: '#f8fafc'
  },
  footer: {
    marginTop: '32px',
    fontSize: '13px',
    color: '#334155',
    lineHeight: 1.6
  },
  button: {
    display: 'inline-block',
    marginTop: '16px',
    padding: '12px 24px',
    backgroundImage: 'linear-gradient(135deg,#f97316,#ec4899)',
    borderRadius: '999px',
    color: '#ffffff',
    fontWeight: 600,
    textDecoration: 'none'
  }
}

export function OrderConfirmationEmail({
  order,
  items,
  totals,
  trackingUrl
}: OrderConfirmationEmailProps) {
  const currency = order.currency ?? 'XOF'
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(value)

  const customerName =
    (order.shipping_address as any)?.firstName && (order.shipping_address as any)?.lastName
      ? `${(order.shipping_address as any).firstName} ${(order.shipping_address as any).lastName}`
      : order.user?.full_name ?? 'Cher client'

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Merci pour votre commande ! 🎉</h1>
        <p style={styles.paragraph}>
          Bonjour {customerName},
          <br />
          Nous confirmons la réception de votre commande{' '}
          <strong>#{order.order_number ?? order.id.slice(0, 8).toUpperCase()}</strong>. Notre équipe
          prépare votre colis avec soin.
        </p>

        <p style={styles.paragraph}>
          Vous pouvez suivre l’évolution de votre commande à tout moment via le lien ci-dessous.
        </p>

        <a href={trackingUrl} style={styles.button}>
          Suivre ma commande
        </a>

        <h2 style={styles.sectionTitle}>Détails de la commande</h2>
        <ul style={styles.list}>
          {items.map((item) => (
            <li key={item.id} style={styles.listItem}>
              <div style={{ fontWeight: 600 }}>{item.product?.name ?? `Produit ${item.product_id}`}</div>
              <div style={{ color: '#475569', marginTop: '4px' }}>
                Qté : {item.quantity} &nbsp;•&nbsp; Prix unitaire :{' '}
                {formatCurrency(item.price)}
              </div>
              <div style={{ marginTop: '4px' }}>
                Total : <strong>{formatCurrency(item.price * item.quantity)}</strong>
              </div>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span>Sous-total</span>
            <strong>{formatCurrency(totals.subtotal)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span>TVA</span>
            <strong>{formatCurrency(totals.tax)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span>Livraison</span>
            <strong>{formatCurrency(totals.shipping)}</strong>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '12px',
              fontSize: '18px'
            }}
          >
            <span>Total TTC</span>
            <strong>{formatCurrency(totals.total)}</strong>
          </div>
        </div>

        {order.shipping_address && (
          <>
            <h2 style={styles.sectionTitle}>Adresse de livraison</h2>
            <p style={styles.paragraph}>
              {(order.shipping_address as any)?.address}
              <br />
              {(order.shipping_address as any)?.city ?? 'Dakar'}, Sénégal
              <br />
              Téléphone : {(order.shipping_address as any)?.phone ?? order.user?.phone ?? '—'}
            </p>
          </>
        )}

        <div style={styles.footer}>
          <p>
            📞 Besoin d’aide ? Notre équipe support est disponible 7/7 au{' '}
            <strong>+221 77 539 81 39</strong> ou par email{' '}
            <a href="mailto:contact@xarala-solutions.com">contact@xarala-solutions.com</a>.
          </p>
          <p>Merci de faire confiance à Xarala Solutions 💼</p>
        </div>
      </div>
    </div>
  )
}

