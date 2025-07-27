const es = {
  resetPasswordEmail: {
    head: {
      subject: 'Restablece tu contraseña y recupera tu cuenta',
      from: 'ChatApp Support <support@chatapp.com>',
    },
    body: {
      title: 'Recupera tu cuenta',
      content: 'Hola, ${username}. Haz clic en el botón de abajo para restablecer tu contraseña.',
      button: 'Restablecer contraseña',
      footer:
        'Si no solicitaste un restablecimiento de contraseña, ignora este correo electrónico.',
    },
  },
} as const;

export default es;
