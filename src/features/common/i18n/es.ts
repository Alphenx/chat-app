const es = {
  common: {
    defaultError: 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo más tarde.',
    globalError: {
      title: 'Algo salió mal',
      message: 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.',
      retry: 'Reintentar',
      button: 'Volver al inicio',
    },
    notFound: {
      title: '404 - Página no encontrada',
      message: 'Lo sentimos, la página que buscas no existe o fue movida.',
      button: 'Volver al inicio',
    },
  },
} as const;

export default es;
