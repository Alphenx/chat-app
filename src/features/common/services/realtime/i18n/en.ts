const en = {
  realtime: {
    errors: {
      defaultError: 'Something went wrong. Please try again.',
      connectionFailed: 'Connection to realtime server failed.',
      channelNotFound: 'Channel not found.',
      unauthorized: 'Unauthorized for realtime action.',
    },
    sessionStatus: {
      online: 'Online',
      offline: 'Offline',
      loading: 'Loading...',
      typing: 'Typing...',
    },
  },
} as const;

export default en;
