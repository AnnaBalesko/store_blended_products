//Логіка сторінки Cart

import { refs } from './js/refs';
import * as storage from './js/storage';
import * as api from './js/products-api';
import { hideNotFound,openProductModal,showNotFound,setCartChangeHandler} from './js/handlers';
import {
  renderProducts,
  renderModalProduct,
  updateNavCount,
} from './js/render-function';
import { openModal } from './js/modal';
import { toastSuccess, toggleTheme, toastInfo, toastError } from './js/helpers';


let pageProducts = [];

export async function initCartPage() {
  updateNavCount();
  const saved = storage.getTheme();
  toggleTheme(saved);
  const ids = storage.getCart();
  if (!ids || ids.length === 0) {
    if (refs.notFound) refs.notFound.classList.add('not-found--visible');
    refs.productsList.innerHTML = '';
    pageProducts = [];
    updateSummary(0, 0);
    return;
  }

  try {
    refs.notFound?.classList.remove('not-found--visible');
    const promises = ids.map(id => api.getProductById(id));
    const products = await Promise.all(promises);
    pageProducts = products;
    refs.productsList.innerHTML = '';
    renderProducts(products);
    const total = products.reduce((s, p) => s + (p.price || 0), 0);
    updateSummary(products.length, total);
  } catch (err) {
    console.error(err);
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

  if (!query || "") {
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

setCartChangeHandler(() => {
  initCartPage();
});

refs.searchForm?.addEventListener('submit', searchSubmitHandlerLocal);
refs.searchClearBtn?.addEventListener('click', searchClearHandlerLocal);

function updateSummary(items, total) {
  if (refs.cartItemsCount) refs.cartItemsCount.textContent = items;
  if (refs.cartTotal)
    refs.cartTotal.textContent = `$${Number(total).toFixed(2)};`;
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
      initCartPage();
    };
  }
});

refs.buyProductsBtn?.addEventListener('click', () => {
  const cart = storage.getCart();

  if (!cart || cart.length === 0) {
    toastInfo('Cart empty, please add product');
    return;
  }

  storage.saveToLS('cart', []);
  toastSuccess('Thank you! Your order has been placed.');
  refs.notFound.classList.add('not-found--visible');
  refs.productsList.innerHTML = '';
  updateNavCount();
  updateSummary(0, 0);
});

document.addEventListener('DOMContentLoaded', initCartPage);
