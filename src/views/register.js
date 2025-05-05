import { registerUser } from '../models/story-model.js';

export function renderRegister() {
  document.getElementById('app').innerHTML = `
    <section>
      <h2>Daftar Akun Baru</h2>
      <form id="register-form">
        <label for="name">Nama:</label>
        <input type="text" id="name" required>
        <label for="email">Email:</label>
        <input type="email" id="email" required>
        <label for="password">Password:</label>
        <input type="password" id="password" required>
        <button type="submit">Daftar</button>
      </form>
      <p>Sudah punya akun? <a href="#/login">Login</a></p>
    </section>
  `;

  const form = document.getElementById('register-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const success = await registerUser({ name, email, password });
    if (success) window.location.hash = '#/login';
  });
}
