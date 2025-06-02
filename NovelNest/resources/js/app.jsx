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


createInertiaApp({
  resolve: name =>
    resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
});