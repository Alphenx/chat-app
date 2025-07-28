const es = {
  verificationEmail: {
    head: {
      subject: 'Verifica tu correo electrónico',
      from: 'ChatApp Support <support@chatapp.com>',
    },
    body: {
      title: 'Verifica tu dirección de correo electrónico',
      content:
        'Hola, ${username}. Por favor verifica tu dirección de correo electrónico para continuar.',
      button: 'Verificar cuenta',
      footer: 'Si no creaste una cuenta, puedes ignorar este correo electrónico.',
    },
  },
};

export default es;
