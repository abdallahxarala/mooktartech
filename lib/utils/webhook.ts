import crypto from 'crypto';

export async function sendWebhookEvent(
  webhook: {
    url: string;
    secret_key: string;
    events: string[];
  },
  event: string,
  payload: any
) {
  try {
    // Vérifier si l'événement est autorisé
    if (!webhook.events.includes(event)) {
      return;
    }

    // Préparer les données
    const timestamp = Date.now();
    const body = JSON.stringify({
      event,
      timestamp,
      payload,
    });

    // Générer la signature
    const signature = crypto
      .createHmac('sha256', webhook.secret_key)
      .update(body)
      .digest('hex');

    // Envoyer la requête
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Xarala-Signature': signature,
        'X-Xarala-Timestamp': timestamp.toString(),
      },
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('Error sending webhook:', error);
    throw error;
  }
}

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  timestamp: string,
  secretKey: string
): boolean {
  // Vérifier que le timestamp n'est pas trop ancien (5 minutes max)
  const eventTimestamp = parseInt(timestamp);
  if (Date.now() - eventTimestamp > 5 * 60 * 1000) {
    return false;
  }

  // Recalculer la signature
  const expectedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(payload)
    .digest('hex');

  // Comparer les signatures
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}