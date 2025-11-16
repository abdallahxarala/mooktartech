/**
 * Script de test pour Wave Payment
 * Usage: node scripts/test-wave.js
 */

require('dotenv').config({ path: '.env.local' })

async function testWave() {
  try {
    const { initiateWavePayment, verifyWavePayment } = require('../lib/integrations/wave')

    console.log('🧪 Test Wave Payment...\n')

    console.log('1. Test initiation paiement...')
    const payment = await initiateWavePayment({
      amount: 1000,
      currency: 'XOF',
      successUrl: 'http://localhost:3000/success',
      errorUrl: 'http://localhost:3000/error',
      description: 'Test payment',
      customer: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+221771234567',
      },
    })
    console.log('✅ Paiement initié:', payment.checkoutUrl, '\n')

    if (payment.sessionId) {
      console.log('2. Test vérification paiement...')
      const verification = await verifyWavePayment(payment.sessionId)
      console.log('✅ Statut paiement:', verification.status, '\n')
    }

    console.log('✅ Tous les tests Wave sont passés!')
  } catch (error) {
    console.error('❌ Erreur:', error.message)
    if (error.message.includes('WAVE_API_KEY')) {
      console.error('\n💡 Vérifiez que les credentials Wave sont configurés dans .env.local')
      console.error('   - WAVE_API_KEY')
      console.error('   - WAVE_BUSINESS_ID')
    }
    process.exit(1)
  }
}

testWave()

