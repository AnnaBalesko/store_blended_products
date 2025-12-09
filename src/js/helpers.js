import { refs } from './refs';

export function toggleTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  document.body.dataset.theme = theme;

  refs.themeToggleBtn.innerHTML = theme === 'light' ? '🌙' : '☀️';
}

export function showLoader() {
  if (!refs.loader) return;
  refs.loader.classList.add('loader--visible');
}
export function hideLoader() {
  if (!refs.loader) return;
  refs.loader.classList.remove('loader--visible');
}


