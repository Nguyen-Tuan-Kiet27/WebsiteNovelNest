import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

import Echo from 'laravel-echo'

window.Echo = new Echo({
  broadcaster: 'reverb',
  host: 'http://127.0.0.1:6001',
})