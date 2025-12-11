//Логіка сторінки Cart

import { refs } from './js/refs';
import * as storage from './js/storage';
import * as api from './js/products-api';
import {
  renderProducts,
  renderModalProduct,
  updateNavCount,
} from './js/render-function';
import { openModal } from './js/modal';
import { toastSuccess, toggleTheme } from './js/helpers';

async function initCartPage() {
  updateNavCount();
  const saved = storage.getTheme();
  toggleTheme(saved);
  const ids = storage.getCart();
  if (!ids || ids.length === 0) {
    if (refs.notFound) refs.notFound.classList.add('not-found--visible');
    refs.productsList.innerHTML = '';
    updateSummary(0, 0);
    return;
  }

  try {
    refs.notFound?.classList.remove('not-found--visible');
    const promises = ids.map(id => api.getProductById(id));
    const products = await Promise.all(promises);
    renderProducts(products);
    const total = products.reduce((s, p) => s + (p.price || 0), 0);
    updateSummary(products.length, total);
  } catch (err) {
    console.error(err);
  }
}

refs.themeToggleBtn?.addEventListener('click', () => {
    const next = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    toggleTheme(next);
    saveTheme(next);
  });

function updateSummary(items, total) {
  if (refs.cartItemsCount) refs.cartItemsCount.textContent = items;
  if (refs.cartTotal)
    refs.cartTotal.textContent = `$${Number(total).toFixed(2)};`;
}

refs.productsList?.addEventListener('click', async e => {
  const li = e.target.closest('.products__item');
  if (!li) return;
  const id = li.dataset.id;
  const product = await api.getProductById(id);
  renderModalProduct(product);
  openModal();
});

refs.buyProductsBtn?.addEventListener('click', () => {
  toastSuccess('Thank you! Your order has been placed.');
});

document.addEventListener('DOMContentLoaded', initCartPage);
