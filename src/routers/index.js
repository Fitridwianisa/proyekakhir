import { renderHome } from '../views/home.js';
import { renderAddStory } from '../views/add-story.js';
import { renderLogin } from '../views/login.js';
import { renderLogout } from '../views/logout.js';
import { renderRegister } from '../views/register.js';

export const routes = {
  '#/': renderHome,
  '#/tambah': renderAddStory,
  '#/login': renderLogin,
  '#/logout': renderLogout,
  '#/register': renderRegister,
};
