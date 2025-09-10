const es = {
  realtime: {
    errors: {
      defaultError: 'Algo salió mal. Por favor, inténtalo de nuevo.',
      connectionFailed: 'La conexión con el servidor en tiempo real falló.',
      channelNotFound: 'Canal no encontrado.',
      unauthorized: 'No autorizado para la acción en tiempo real.',
    },
    sessionStatus: {
      online: 'En línea',
      offline: 'Desconectado',
      loading: 'Cargando...',
      typing: 'Escribiendo...',
    },
  },
} as const;

export default es;
