const es = {
  friends: {
    errors: {
      defaultError: 'Algo salió mal. Por favor, inténtalo de nuevo.',
      userAlreadyExists: 'Esta cuenta ya existe.',
      userNotFound: 'Usuario no encontrado.',
      alreadyFriend: 'Este usuario ya es tu amigo.',
      requestAlreadySent: 'Solicitud de amistad ya enviada.',
      cantAddYourself: 'No puedes agregarte a ti mismo como amigo.',
    },
    title: 'Contactos',
    friendsList: {
      title: 'Tus amigos',
      search: {
        label: 'Buscar',
        placeholder: 'Escribe un nombre o correo...',
      },
      empty: 'Aún no tienes amigos. ¡Empieza a conectar con otros!',
      actions: {
        removeFriend: {
          button: 'Eliminar',
          label: 'Eliminar amigo',
          title: 'Eliminar amigo',
          confirm: {
            message: '¿Seguro que quieres eliminar a <bold>${name}</bold> de tus amigos?',
            yes: 'Sí, eliminar',
            no: 'No, mantener',
          },
          feedback: {
            success: '¡Amigo eliminado con éxito!',
          },
        },
        viewProfile: {
          button: 'Ver perfil',
        },
        startChat: {
          button: 'Iniciar chat',
        },
        realtime: {
          friendRequestReceived: '${name} sent you a friend request',
          friendRequestAccepted: '${name} accepted your friend request',
          friendRequestCancelled: '${name} declined your friend request',
        },
      },
    },
    friendsRequestList: {
      title: 'Solicitudes de amistad',
      noRequests: 'Aún no tienes solicitudes de amistad. Las solicitudes entrantes aparecerán aquí.',
      error: 'No se pueden cargar las solicitudes de amistad.',
      actions: {
        sendFriendRequest: {
          button: 'Agregar nuevo amigo',
          title: 'Agregar amigo',
          backBtn: 'Cerrar',
          form: {
            label: 'Email',
            placeholder: 'Ingresa la dirección de correo electrónico',
            btnLabel: 'Enviar solicitud',
            errors: {
              email: {
                required: 'El correo electrónico es obligatorio.',
                invalid: 'Formato de correo electrónico inválido.',
              },
            },
          },
          feedback: {
            success: '¡Solicitud de amistad enviada con éxito!',
          },
        },
        acceptFriendRequest: {
          button: 'Aceptar',
          title: 'Aceptar solicitud de amistad',
          confirm: {
            message: '¿Seguro que quieres aceptar a <bold>${name}</bold> como amigo?',
            yes: 'Sí, aceptar',
            no: 'No, rechazar',
          },
          feedback: {
            success: '¡Solicitud de amistad aceptada con éxito!',
          },
        },
        cancelFriendRequest: {
          button: 'Rechazar',
          title: 'Rechazar solicitud de amistad',
          confirm: {
            message: '¿Seguro que quieres rechazar la solicitud de amistad de <bold>${name}</bold>?',
            yes: 'Sí, rechazar',
            no: 'No, mantener',
          },
          feedback: {
            success: '¡Solicitud de amistad rechazada con éxito!',
          },
        },
      },
    },
  },
} as const;

export default es;
