type EmailVerificationTemplateInput = {
  appName: string
  userName?: string | null
  verificationUrl: string
}

export function renderEmailVerificationTemplate({
  appName,
  userName,
  verificationUrl,
}: EmailVerificationTemplateInput) {
  const greeting = userName ? `Hi ${userName},` : 'Hi,'
  const subject = `Verify your email for ${appName}`

  const text = [
    `${greeting}`,
    '',
    `Thanks for signing up for ${appName}.`,
    'Please verify your email address by opening the link below:',
    '',
    verificationUrl,
    '',
    'If you did not create an account, you can ignore this email.',
  ].join('\n')

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111; max-width: 560px; margin: 0 auto; padding: 24px;">
      <h1 style="font-size: 24px; margin-bottom: 16px;">
        Verify your email
      </h1>

      <p>${greeting}</p>

      <p>
        Thanks for signing up for <strong>${appName}</strong>.
      </p>

      <p>
        Please confirm your email address by clicking the button below:
      </p>

      <p style="margin: 24px 0;">
        <a
          href="${verificationUrl}"
          style="display: inline-block; background: #111; color: #fff; text-decoration: none; padding: 12px 18px; border-radius: 8px;"
        >
          Verify email
        </a>
      </p>

      <p>
        Or copy and paste this URL into your browser:
      </p>

      <p>
        <a href="${verificationUrl}">${verificationUrl}</a>
      </p>

      <hr style="margin: 32px 0; border: none; border-top: 1px solid #ddd;" />

      <p style="font-size: 14px; color: #555;">
        If you did not create an account, you can safely ignore this email.
      </p>
    </div>
  `.trim()

  return { subject, text, html }
}
