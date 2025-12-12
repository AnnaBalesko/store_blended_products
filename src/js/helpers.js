import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { refs } from './refs';

export function toggleTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  document.body.dataset.theme = theme;

  refs.themeToggleBtn.innerHTML = theme === 'light' ? '🌙' : '☀️';
}

export function showLoader() {
  if (!refs.loader) return;
  refs.loader.classList.remove('hidden');
}
export function hideLoader() {
  if (!refs.loader) return;
  refs.loader.classList.add('hidden');
}

export function toastSuccess(msg) {
  iziToast.success({ title: 'OK', message: msg, position: 'topRight' });
}
export function toastError(msg) {
  iziToast.error({ title: 'Error', message: msg, position: 'topRight' });
}
export function toastInfo(msg) {
  iziToast.info({ title: 'Info', message: msg, position: 'topRight' });
}

export function formatPrice(num) {
  return Number(num).toFixed(2);
}

export function clearActiveCategory() {
  const activeBtn = document.querySelector('.categories__btn--active');
  if (activeBtn) activeBtn.classList.remove('categories__btn--active');
}
