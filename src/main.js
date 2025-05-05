import { renderHome } from './views/home.js';
import { renderAddStory } from './views/add-story.js';
import { renderLogin } from './views/login.js';
import { renderLogout } from './views/logout.js';
import { renderRegister } from './views/register.js';
import './style.css'; 

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
