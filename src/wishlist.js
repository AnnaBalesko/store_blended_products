//Логіка сторінки Wishlist

import { refs } from './js/refs';
import * as storage from './js/storage';
import * as api from './js/products-api';
import {
  renderProducts,
  renderModalProduct,
  updateNavCount,
} from './js/render-function';
import { openModal } from './js/modal';
import { toastInfo, toggleTheme } from './js/helpers';

async function initWishlistPage() {
  updateNavCount();
  const saved = storage.getTheme();
  toggleTheme(saved);
  const ids = storage.getWishlist();
  if (!ids || ids.length === 0) {
    if (refs.notFound) refs.notFound.classList.add('not-found--visible');
    refs.productsList.innerHTML = '';
    return;
  }

  try {
    refs.notFound?.classList.remove('not-found--visible');
    const promises = ids.map(id => api.getProductById(id));
    const products = await Promise.all(promises);
    renderProducts(products);
  } catch (err) {
    console.error(err);
    toastInfo('Failed to load wishlist products');
  }
}

refs.themeToggleBtn?.addEventListener('click', () => {
  const next = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  toggleTheme(next);
  saveTheme(next);
});

refs.productsList?.addEventListener('click', async e => {
  const li = e.target.closest('.products__item');
  if (!li) return;
  const id = li.dataset.id;
  const product = await api.getProductById(id);
  renderModalProduct(product);
  openModal();
  const wishlistBtn = refs.modal.querySelector('.modal-product__wishlist-btn');
  const cartBtn = refs.modal.querySelector('.modal-product__cart-btn');

  if (wishlistBtn) {
    wishlistBtn.onclick = () => {
      if (storage.isInWishlist(id)) {
        storage.removeFromWishlist(id);
        wishlistBtn.textContent = 'Add to Wishlist';
        toastInfo('Removed from wishlist');
      } else {
        storage.addToWishlist(id);
        wishlistBtn.textContent = 'Remove from Wishlist';
      }
      updateNavCount();
    };
  }
  if (cartBtn) {
    cartBtn.onclick = () => {
      if (storage.isInCart(id)) {
        storage.removeFromCart(id);
        cartBtn.textContent = 'Add to Cart';
      } else {
        storage.addToCart(id);
        cartBtn.textContent = 'Remove from Cart';
      }
      updateNavCount();
    };
  }
});

document.addEventListener('DOMContentLoaded', initWishlistPage);
