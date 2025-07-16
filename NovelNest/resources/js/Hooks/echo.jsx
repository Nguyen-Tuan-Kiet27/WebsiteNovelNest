  import Echo from 'laravel-echo';
  import Pusher from 'pusher-js';

  window.Pusher = Pusher;

  export const echo = new Echo({
      broadcaster: 'pusher',
      key: 'novelkey',
      cluster: 'mt1',
      wsHost: window.location.hostname,
      wsPort: 6001,
      forceTLS: false,
      disableStats: true,
      enabledTransports: ['ws', 'wss'],
  });