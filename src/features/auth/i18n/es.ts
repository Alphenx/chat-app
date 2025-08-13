const es = {
  auth: {
    login: {
      form: {
        title: 'Iniciar sesión',
        fields: {
          email: {
            label: 'Correo electrónico',
            placeholder: 'Introduce tu correo electrónico',
          },
          password: {
            label: 'Contraseña',
            placeholder: 'Introduce tu contraseña',
          },
        },
        submit: 'Entrar',
      },
      linkToRegister: '¿No tienes cuenta? Regístrate ahora',
      linkToForgotPassword: '¿Has olvidado tu contraseña?',
      rememberMeLabel: 'Recuérdame',
    },
    register: {
      form: {
        title: 'Crea tu cuenta',
        fields: {
          name: {
            label: 'Nombre completo',
            placeholder: 'Introduce tu nombre completo',
          },
          email: {
            label: 'Correo electrónico',
            placeholder: 'Introduce tu correo electrónico',
          },
          password: {
            label: 'Contraseña',
            placeholder: 'Crea una contraseña segura',
          },
          confirmPassword: {
            label: 'Confirmar contraseña',
            placeholder: 'Vuelve a introducir tu contraseña',
          },
        },
        errors: {
          name: {
            required: 'Por favor, indica tu nombre completo',
          },
          email: {
            required: 'El correo electrónico es obligatorio',
            invalid: 'Introduce un correo electrónico válido',
          },
          password: {
            required: 'La contraseña es obligatoria',
            requirements: 'La contraseña debe cumplir los requisitos de seguridad',
            mismatch: 'Las contraseñas no coinciden',
          },
        },
        submit: 'Registrarse',
      },
      linkToLogin: '¿Ya tienes cuenta? Inicia sesión aquí',
      feedback: {
        emailVerification:
          'Te hemos enviado un correo de verificación. Por favor, revisa tu bandeja de entrada para verificar tu cuenta.',
      },
    },
    alternativeMethods: {
      google: 'Acceder con Google',
    },
    forgotPassword: {
      forgot: {
        form: {
          title: 'Recupera tu cuenta',
          fields: {
            email: {
              label: 'Correo electrónico',
              placeholder: 'Introduce tu correo electrónico',
            },
          },
          submit: 'Enviar enlace de recuperación',
        },
        feedback: {
          emailVerification: 'Te hemos enviado un enlace de recuperación. Revisa tu correo.',
        },
        linkToLogin: 'Volver a iniciar sesión',
      },
      reset: {
        form: {
          title: 'Establece una nueva contraseña',
          fields: {
            password: {
              label: 'Nueva contraseña',
              placeholder: 'Introduce una nueva contraseña',
            },
            confirmPassword: {
              label: 'Confirmar nueva contraseña',
              placeholder: 'Vuelve a introducir la nueva contraseña',
            },
          },
          submit: 'Restablecer contraseña',
          errors: {
            password: {
              required: 'La nueva contraseña es obligatoria',
              requirements: 'La contraseña debe cumplir los requisitos de seguridad',
              mismatch: 'Las contraseñas no coinciden',
            },
          },
        },
        feedback: {
          passwordReset: 'Tu contraseña se ha restablecido correctamente.',
        },
        linkToLogin: 'Volver a iniciar sesión',
      },
    },
    errors: {
      defaultError: 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo más tarde.',
      invalidCredentials: 'Correo electrónico o contraseña incorrectos.',
      userAlreadyExists: 'Ya existe una cuenta registrada con estos datos.',
      userNotFound: 'No se ha podido encontrar al usuario.',
      unauthorized: 'No estás autorizado para realizar esta acción.',
      emailNotValidated: 'Por favor, verifica tu correo electrónico para continuar.',
      invalidToken: 'El enlace no es válido o ha caducado.',
    },
    passwordRequirements: {
      length: 'Debe tener al menos 8 caracteres',
      case: 'Incluye letras mayúsculas y minúsculas',
      number: 'Incluye al menos un número',
      special: 'Incluye al menos un carácter especial',
    },
  },
} as const;

export default es;
