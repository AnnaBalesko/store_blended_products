import * as api from './products-api';
import { refs } from './refs';
import {
  renderCategories,
  renderProducts,
  renderModalProduct,
  updateNavCount,
} from './render-function';
import {
  showLoader,
  hideLoader,
  toastError,
  toastSuccess,
  toastInfo,
  clearActiveCategory,
} from './helpers';
import * as storage from './storage';
import { openModal, closeModal } from './modal';
import { ITEMS_PER_PAGE } from './constants';

let currentPage = 1;
let currentCategory = 'All';
let currentQuery = '';
let totalProducts = 0;

export async function initHomePage() {
  try {
    showLoader();
    const categories = await api.getCategories();
    renderCategories(categories);
    currentPage = 1;
    await loadProducts({ reset: true });
    updateNavCount();
    if (refs.searchClearBtn) refs.searchClearBtn.classList.add('hidden');
  } catch (err) {
    console.error(err);
    toastError('Failed to initialize home page');
  } finally {
    hideLoader();
  }
}

export async function loadProducts({ reset = false } = {}) {
  try {
    if (reset) currentPage = 1;
    showLoader();
    let resp;
    if (currentQuery) {
      resp = await api.searchProducts(currentQuery, currentPage);
    } else if (currentCategory && currentCategory !== 'All') {
      resp = await api.getProductsByCategory(currentCategory, currentPage);
    } else {
      resp = await api.getProducts(currentPage);
    }
    const products = resp.products || [];
    totalProducts = resp.total ?? products.length;
    if (!products.length) {
      refs.productsList.innerHTML = '';
      if (refs.notFound) refs.notFound.classList.add('not-found--visible');
      if (refs.loadMoreBtn) refs.loadMoreBtn.classList.add('is-hidden');
      return;
    } else {
      if (refs.notFound) refs.notFound.classList.remove('not-found--visible');
    }
    const append = !reset && currentPage > 1;
    renderProducts(products, { append });
    const loaded = (currentPage - 1) * ITEMS_PER_PAGE + products.length;
    if (loaded >= totalProducts) {
      if (refs.loadMoreBtn) refs.loadMoreBtn.classList.add('is-hidden');
      toastInfo('No more products to load');
    } else {
      if (refs.loadMoreBtn) refs.loadMoreBtn.classList.remove('is-hidden');
    }
  } catch (err) {
    console.error(err);
    toastError('Failed to load products');
  } finally {
    hideLoader();
  }
}

export function categoriesClickHandler(e) {
  const btn = e.target.closest('.categories__btn');
  if (!btn) return;

  refs.searchInput.value = '';
  const category = btn.textContent.trim();

  currentCategory = category;
  currentQuery = '';
  currentPage = 1;

  const allBtns = refs.categoriesList.querySelectorAll('.categories__btn');
  allBtns.forEach(b =>
    b.classList.toggle('categories__btn--active', b === btn)
  );
  loadProducts({ reset: true });

  if (category === 'All') {
    loadProductsAll();
  } else {
    loadProductsByCategory(category);
  }
}

async function loadProductsAll() {
  try {
    const { products } = await api.getProducts(currentPage);
    checkFound(products);
    refs.productsList.innerHTML = '';
    renderProducts(products);
  } catch (err) {
    console.error(err);
  }
}

async function loadProductsByCategory(category) {
  try {
    const { products } = await api.getProductsByCategory(category, currentPage);
    checkFound(products);

    refs.productsList.innerHTML = '';
    renderProducts(products);
  } catch (err) {
    console.error(err);
  }
}

function checkFound(products) {
  if (!products || products.length === 0) {
    refs.notFound.classList.add('not-found--visible');
  } else {
    refs.notFound.classList.remove('not-found--visible');
  }
}

export async function productsClickHandler(e) {
  const li = e.target.closest('.products__item');
  if (!li) return;

  const id = li.dataset.id;
  if (!id) return;

  try {
    showLoader();
    const product = await api.getProductById(id);
    renderModalProduct(product);
    openModal();
    attachModalButtons(product.id);
  } catch (err) {
    console.error(err);
    toastError('Failed to load product details');
  } finally {
    hideLoader();
  }
}

function attachModalButtons(productId) {
  const wishlistBtn = refs.modal.querySelector('.modal-product__btn--wishlist');
  const cartBtn = refs.modal.querySelector('.modal-product__btn--cart');
  const buyBtn = refs.modal.querySelector('.modal-product__buy-btn');

  if (wishlistBtn) {
    wishlistBtn.onclick = () => {
      if (storage.isInWishlist(productId)) {
        storage.removeFromWishlist(productId);
        wishlistBtn.textContent = 'Add to Wishlist';
        toastInfo('Removed from wishlist');
      } else {
        storage.addToWishlist(productId);
        wishlistBtn.textContent = 'Remove from Wishlist';
        toastSuccess('Added to wishlist');
      }
      updateNavCount();
    };
  }

  if (cartBtn) {
    cartBtn.onclick = () => {
      if (storage.isInCart(productId)) {
        storage.removeFromCart(productId);
        cartBtn.textContent = 'Add to Cart';
        toastInfo('Removed from cart');
      } else {
        storage.addToCart(productId);
        cartBtn.textContent = 'Remove from Cart';
        toastSuccess('Added to cart');
      }
      updateNavCount();
    };
  }

  if (buyBtn) {
    buyBtn.onclick = () => {
      if (window.iziToast)
        iziToast.success({ title: 'Success', message: 'Purchase complete' });
    };
  }
}

export function loadMoreHandler() {
  currentPage += 1;
  loadProducts({ reset: false });
}

export async function searchSubmitHandler(e) {
  e.preventDefault();

  const query = refs.searchInput.value.trim();

  if (!query || "") {
    toastError('Please, enter text');
    return;
  }

  refs.searchClearBtn.classList.remove('hidden');
  clearActiveCategory();

  currentQuery = query;
  currentPage = 1;

  try {
    showLoader();
    const { products } = await api.searchAllProducts(query, currentPage);

    refs.productsList.innerHTML = '';

    const q = query.toLowerCase();

    const filtered = products.filter(product => {
      const titleMatch = product.title.toLowerCase().includes(q);
      const categoryMatch = product.category.toLowerCase().includes(q);
      const tagsMatch = product.tags?.some(tag =>
        tag.toLowerCase().includes(q)
      );
      return titleMatch || categoryMatch || tagsMatch;
    });

    if (filtered.length === 0) {
      showNotFound();
      return;
    }

    hideNotFound();
    renderProducts(filtered);
    hideLoader();
  } catch (err) {
    console.log(err);
  }
}

function showNotFound() {
  refs.notFound.classList.add('not-found--visible');
}

function hideNotFound() {
  refs.notFound.classList.remove('not-found--visible');
}

export async function onSearchClear() {
  refs.searchInput.addEventListener('input', () => {
    if (refs.searchInput.value.trim()) {
      refs.searchClearBtn.classList.remove('hidden');
    } else {
      refs.searchClearBtn.classList.add('hidden');
    }
  });

  refs.searchClearBtn.addEventListener('click', () => {
    refs.searchInput.value = '';
    refs.searchClearBtn.classList.add('hidden');

    currentCategory = 'All';
    currentQuery = '';
    currentPage = 1;

    loadProducts({ reset: true });
  });
}

export function initScrollUp() {
  if (!refs.scrollUpBtn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      refs.scrollUpBtn.classList.add('scroll-top-btn--visible');
    } else {
      refs.scrollUpBtn.classList.remove('scroll-top-btn--visible');
    }
  });
  refs.scrollUpBtn.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );
}
