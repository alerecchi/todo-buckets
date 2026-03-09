type ResetPasswordTemplateInput = {
  appName: string
  userName?: string | null
  resetUrl: string
}

export function renderResetPasswordTemplate({ appName, userName, resetUrl }: ResetPasswordTemplateInput) {
  const greeting = userName ? `Hi ${userName},` : 'Hi,'
  const subject = `Reset your password for ${appName}`

  const text = [
    `${greeting}`,
    '',
    `We received a request to reset your password for ${appName}.`,
    'Open the link below to choose a new password:',
    '',
    resetUrl,
    '',
    'If you did not request this, you can ignore this email.',
  ].join('\n')

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111; max-width: 560px; margin: 0 auto; padding: 24px;">
      <h1 style="font-size: 24px; margin-bottom: 16px;">
        Reset your password
      </h1>

      <p>${greeting}</p>

      <p>
        We received a request to reset your password for
        <strong>${appName}</strong>.
      </p>

      <p>
        Click the button below to choose a new password:
      </p>

      <p style="margin: 24px 0;">
        <a
          href="${resetUrl}"
          style="display: inline-block; background: #111; color: #fff; text-decoration: none; padding: 12px 18px; border-radius: 8px;"
        >
          Reset password
        </a>
      </p>

      <p>
        Or copy and paste this URL into your browser:
      </p>

      <p>
        <a href="${resetUrl}">${resetUrl}</a>
      </p>

      <hr style="margin: 32px 0; border: none; border-top: 1px solid #ddd;" />

      <p style="font-size: 14px; color: #555;">
        If you did not request a password reset, you can safely ignore this
        email.
      </p>
    </div>
  `.trim()

  return { subject, text, html }
}
