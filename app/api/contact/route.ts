import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message, to } = body || {}

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 })
    }

    // Attempt to send via SMTP if environment is configured
    const smtpHost = process.env.SMTP_HOST
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587
    const toEmail = to || process.env.CONTACT_TO || process.env.SMTP_TO || process.env.SMTP_USER

    if (smtpHost && smtpUser && smtpPass && toEmail) {
      try {
        const nodemailer = await import('nodemailer')
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: { user: smtpUser, pass: smtpPass },
        })

        await transporter.sendMail({
          from: `Xarala Solutions <${smtpUser}>`,
          to: toEmail,
          subject: subject || 'Nouveau message du site',
          replyTo: email,
          text: `Nom: ${name}\nEmail: ${email}\nTéléphone: ${phone || ''}\n\n${message}`,
          html: `
            <div style="font-family: Arial, sans-serif;">
              <h2>Nouveau message du site</h2>
              <p><strong>Nom:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              ${phone ? `<p><strong>Téléphone:</strong> ${phone}</p>` : ''}
              <p><strong>Objet:</strong> ${subject || ''}</p>
              <hr />
              <p>${(message || '').replace(/\n/g, '<br/>')}</p>
            </div>
          `,
        })
      } catch (e) {
        console.warn('Email fallback (nodemailer not available):', e)
        // Continue to return success for now
      }
    } else {
      console.log('[CONTACT] New message:', { name, email, phone, subject, message })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}


