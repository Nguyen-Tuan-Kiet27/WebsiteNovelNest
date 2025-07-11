// import { createInertiaApp } from '@inertiajs/react';
// import { createRoot } from 'react-dom/client';

// createInertiaApp({
//   resolve: name => require(`./Pages/${name}`).default,
//   setup({ el, App, props }) {
//     createRoot(el).render(<App {...props} />);
//   },
// });

// ===============================================

// import { createInertiaApp } from '@inertiajs/react';
// import { createRoot } from 'react-dom/client';

// createInertiaApp({
//   resolve: name => import(`./Pages/${name}.jsx`).then(module => module.default),
//   setup({ el, App, props }) {
//     createRoot(el).render(<App {...props} />);
//   },
// });

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// import Echo from 'laravel-echo';
// import Pusher from 'pusher-js';

// window.Pusher = Pusher;

// window.Echo = new Echo({
//   broadcaster: 'pusher',
//   key: 'local', // khớp với .env
//   cluster: 'mt1',
//   wsHost: window.location.hostname, // tự động là 127.0.0.1 hoặc localhost
//   wsPort: 6001,                     // Cổng mà Reverb đang chạy
//   forceTLS: false,
//   enabledTransports: ['ws'],
//   disableStats: true,
//   authEndpoint: '/broadcasting/auth', // Laravel mặc định
//   auth: {
//     headers: {
//       'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content,
//     },
//   },
// });

  import Echo from 'laravel-echo';
  import Pusher from 'pusher-js';

  window.Pusher = Pusher;

  window.Echo = new Echo({
      broadcaster: 'pusher',
      key: 'novelkey',
      cluster: 'mt1',
      wsHost: window.location.hostname,
      wsPort: 6001,
      forceTLS: false,
      disableStats: true,
      enabledTransports: ['ws', 'wss'],
  });

createInertiaApp({
  resolve: name =>
    resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
});