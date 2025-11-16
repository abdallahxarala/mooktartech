'use client'

import { useMemo } from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Font
} from '@react-pdf/renderer'
import { Receipt } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { OrderDetails } from '@/lib/orders/queries'

Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLT2mW9C5Eqg.ttf' },
    {
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLT2mW9C5Epg.ttf',
      fontWeight: 'bold'
    }
  ]
})

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    fontSize: 12,
    padding: 32,
    color: '#1f2937'
  },
  header: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 16
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  section: {
    marginBottom: 16
  },
  table: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 8
  },
  tableHeader: {
    fontWeight: 'bold',
    flex: 1
  },
  tableCell: {
    flex: 1
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6
  }
})

interface InvoicePDFProps {
  order: OrderDetails['order']
  items: OrderDetails['items']
  totals: {
    subtotal: number
    shipping: number
    tax: number
    total: number
  }
}

function formatCurrency(value: number, currency?: string | null) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency ?? 'XOF',
    maximumFractionDigits: 0
  }).format(value)
}

function InvoiceDocument({ order, items, totals }: InvoicePDFProps) {
  const shippingInfo = (order.shipping_address as any) ?? {}

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Facture {order.order_number ?? order.id}</Text>
          <Text>Date : {new Date(order.created_at).toLocaleDateString('fr-FR')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Client</Text>
          <Text>{shippingInfo.firstName ? `${shippingInfo.firstName} ${shippingInfo.lastName}` : order.user?.full_name ?? 'Client Xarala'}</Text>
          <Text>{shippingInfo.address ?? 'Adresse non renseignée'}</Text>
          <Text>{shippingInfo.city ?? 'Dakar'}, Sénégal</Text>
          <Text>Téléphone : {shippingInfo.phone ?? order.user?.phone ?? '—'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Détails des produits</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, { backgroundColor: '#f8fafc' }]}>
              <Text style={styles.tableHeader}>Produit</Text>
              <Text style={[styles.tableHeader, { textAlign: 'right' }]}>Quantité</Text>
              <Text style={[styles.tableHeader, { textAlign: 'right' }]}>Prix</Text>
            </View>
            {items.map((item) => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.product?.name ?? `Produit ${item.product_id}`}</Text>
                <Text style={[styles.tableCell, { textAlign: 'right' }]}>{item.quantity}</Text>
                <Text style={[styles.tableCell, { textAlign: 'right' }]}>
                  {formatCurrency((item.price ?? 0) * (item.quantity ?? 1), order.currency)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Totaux</Text>
          <View>
            <View style={styles.totalsRow}>
              <Text>Sous-total</Text>
              <Text>{formatCurrency(totals.subtotal, order.currency)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text>TVA</Text>
              <Text>{formatCurrency(totals.tax, order.currency)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text>Livraison</Text>
              <Text>{formatCurrency(totals.shipping, order.currency)}</Text>
            </View>
            <View style={[styles.totalsRow, { marginTop: 12, fontWeight: 'bold' }]}>
              <Text>Total TTC</Text>
              <Text>{formatCurrency(totals.total, order.currency)}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export function InvoicePDF(props: InvoicePDFProps) {
  const fileName = useMemo(
    () => `facture-${props.order.order_number ?? props.order.id}.pdf`,
    [props.order.id, props.order.order_number]
  )

  return (
    <PDFDownloadLink document={<InvoiceDocument {...props} />} fileName={fileName}>
      {({ loading }) => (
        <Button
          variant="outline"
          className="flex items-center gap-2 rounded-full border-2 border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100"
        >
          <Receipt className="h-4 w-4" />
          {loading ? 'Génération...' : 'Télécharger la facture'}
        </Button>
      )}
    </PDFDownloadLink>
  )
}

