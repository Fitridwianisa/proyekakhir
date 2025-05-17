import { renderHome } from './views/home.js';
import { renderAddStory } from './views/add-story.js';
import { renderLogin } from './views/login.js';
import { renderLogout } from './views/logout.js';
import { renderRegister } from './views/register.js';

const routes = {
  '/': renderHome,
  '/tambah': renderAddStory,
  '/login': renderLogin,
  '/logout': renderLogout,
  '/register': renderRegister,
};

function router() {
  const hash = location.hash.slice(1) || '/';
  const token = localStorage.getItem('token');

  const publicPages = ['/login', '/register'];

  if (!token && !publicPages.includes(hash)) {
    window.location.hash = '#/login';
    return;
  }

  const render = routes[hash] || (() => {
    document.getElementById('app').innerHTML = '<p>Halaman tidak ditemukan</p>';
  });

  if (document.startViewTransition) {
    document.startViewTransition(() => render());
  } else {
    render();
  }

  const logoutLink = document.querySelector('a[href="#/logout"]');
  if (logoutLink) {
    logoutLink.style.display = token ? 'inline' : 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.getElementById('app');
      if (target) target.focus();
    });
  }

  router();
});

window.addEventListener('hashchange', router);

if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
            return Notification.requestPermission();
        })
        .then((permission) => {
            if (permission === 'granted') {
                console.log('Notification permission granted.');
                subscribeUserToPush(registration);
            } else {
                console.log('Notification permission denied.');
            }
        })
        .catch((error) => {
            console.error('Service Worker registration failed:', error);
        });
}

function subscribeUserToPush(registration) {
    const applicationServerKey = urlB64ToUint8Array('BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk');

    registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
    })
    .then((subscription) => {
        console.log('User  is subscribed:', subscription);
    })
    .catch((error) => {
        console.error('Failed to subscribe the user: ', error);
    });
}

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
}
