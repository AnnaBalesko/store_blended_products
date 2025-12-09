import { refs } from './refs';

export function openModal() {
  refs.modal.classList.add('modal--is-open');
  document.body.style.overflow = 'hidden';

  window.addEventListener('keydown', onEscPress);
  refs.modal.addEventListener('click', onBackDropClick);
  refs.closeModalBtn.addEventListener('click', closeModal);
}

export function closeModal() {
  refs.modal.classList.remove('modal--is-open');
  document.body.style.overflow = '';

  window.removeEventListener('keydown', onEscPress);
  refs.modal.removeEventListener('click', onBackDropClick);
  refs.closeModalBtn.removeEventListener('click', closeModal);
}

function onEscPress(e) {
  if (e.code === 'Escape') {
    closeModal();
  }
}

function onBackDropClick(e) {
  if (e.target === refs.modal) {
    closeModal();
  }
}
