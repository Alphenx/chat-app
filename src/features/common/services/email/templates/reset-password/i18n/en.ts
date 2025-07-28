const en = {
  resetPasswordEmail: {
    head: {
      subject: 'Reset your password and recover your account',
      from: 'ChatApp Support <support@chatapp.com>',
    },
    body: {
      title: 'Recover your account',
      content: 'Hello, ${username}. Click the button below to reset your password.',
      button: 'Reset password',
      footer: "If you didn't request a password reset, please ignore this email.",
    },
  },
} as const;

export default en;
