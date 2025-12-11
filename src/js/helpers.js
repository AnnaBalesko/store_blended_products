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

export function toastSuccess(msg) {
  if (window.iziToast)
    iziToast.success({ title: 'OK', message: msg, position: 'topRight' });
  else console.info('SUCCESS:', msg);
}
export function toastError(msg) {
  if (window.iziToast)
    iziToast.error({ title: 'Error', message: msg, position: 'topRight' });
  else console.error('ERROR:', msg);
}
export function toastInfo(msg) {
  if (window.iziToast)
    iziToast.info({ title: 'Info', message: msg, position: 'topRight' });
  else console.info('INFO:', msg);
}

export function formatPrice(num) {
  return Number(num).toFixed(2);
}

export function clearActiveCategory() {
  const activeBtn = document.querySelector('.categories__btn--active');
  if(activeBtn) activeBtn.classList.remove('categories__btn--active');
}
