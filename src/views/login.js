import { loginUser } from '../models/story-model.js';

export function renderLogin() {
  document.getElementById('app').innerHTML = `
    <section>
      <h2>Login</h2>
      <form id="login-form">
        <label for="email">Email:</label>
        <input type="email" id="email" required>
        <label for="password">Password:</label>
        <input type="password" id="password" required>
        <button type="submit">Masuk</button>
      </form>
      <p>Belum punya akun? <a href="#/register">Daftar</a></p>
    </section>
  `;

  const form = document.getElementById('login-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const success = await loginUser({ email, password });
    if (success) window.location.hash = '#/';
  });
}
