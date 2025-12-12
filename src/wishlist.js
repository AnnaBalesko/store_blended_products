//Логіка сторінки Wishlist

import { refs } from './js/refs';
import * as storage from './js/storage';
import * as api from './js/products-api';
import {
  hideNotFound,
  showNotFound,
  openProductModal,
  setWishlistChangeHandler,
} from './js/handlers';
import {
  renderProducts,
  renderModalProduct,
  updateNavCount,
} from './js/render-function';
import { openModal } from './js/modal';
import { toastInfo, toggleTheme, toastError } from './js/helpers';

let pageProducts = [];

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
    pageProducts = products;
    renderProducts(products);
  } catch (err) {
    console.error(err);
    toastInfo('Failed to load wishlist products');
  }
}

function searchInPageProducts(query) {
  const q = query.toLowerCase();

  return pageProducts.filter(product => {
    const titleMatch = product.title?.toLowerCase().includes(q);
    const categoryMatch = product.category?.toLowerCase().includes(q);
    const tagsMatch = product.tags?.some(tag => tag.toLowerCase().includes(q));

    return titleMatch || categoryMatch || tagsMatch;
  });
}

export function searchSubmitHandlerLocal(e) {
  e.preventDefault();

  const query = refs.searchInput.value.trim();

  if (!query) {
    toastError('Please, enter text');
    return;
  }

  refs.searchClearBtn.classList.remove('hidden');

  const filtered = searchInPageProducts(query);

  refs.productsList.innerHTML = '';

  if (filtered.length === 0) {
    showNotFound();
    return;
  }

  hideNotFound();
  renderProducts(filtered);
}
export function searchClearHandlerLocal() {
  refs.searchInput.value = '';
  refs.searchClearBtn.classList.add('hidden');

  hideNotFound();
  refs.productsList.innerHTML = '';
  renderProducts(pageProducts);
}

setWishlistChangeHandler(() => {
  initWishlistPage();
});

refs.searchForm?.addEventListener('submit', searchSubmitHandlerLocal);
refs.searchClearBtn?.addEventListener('click', searchClearHandlerLocal);

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
  openProductModal(Number(li.dataset.id));
  renderModalProduct(product);
  openModal();
  const wishlistBtn = refs.modal.querySelector('.modal-product__btn--wishlist');
  const cartBtn = refs.modal.querySelector('.modal-product__btn--cart');

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
      initWishlistPage();
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
