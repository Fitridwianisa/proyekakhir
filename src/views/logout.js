export function renderLogout() {
    localStorage.removeItem('token');
    alert('Kamu sudah logout');
    window.location.hash = '#/login';
  }
  