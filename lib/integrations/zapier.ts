export async function forwardLeadToZapier(payload: Record<string, unknown>) {
  const webhookUrl = process.env.ZAPIER_WEBHOOK_URL
  if (!webhookUrl) {
    console.warn('[Zapier] ZAPIER_WEBHOOK_URL not set, skipping webhook dispatch')
    return
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const text = await response.text()
      console.error('[Zapier] webhook failed', response.status, text)
    }
  } catch (error) {
    console.error('[Zapier] webhook error', error)
  }
}

