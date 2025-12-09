import {
  getCategories,
  getProductById,
  getProducts,
  getProductsByCategory,
  searchProducts,
} from './products-api';
import {
  renderCategories,
  renderProducts,
  renderModalProduct,
} from './render-function';
import { ITEMS_PER_PAGE } from './constants';
import { refs } from './refs';
import { openModal } from './modal';

export async function initHomePage() {
  try {
    const categories = await getCategories();
    renderCategories(categories);
    const { products } = await getProducts();
    renderProducts(products);
  } catch (error) {
    console.error(error);
    toastError('Failed to initialize home page');
  } finally {
  }
}

let currentCategory = 'All';
let currentPage = 1;

export async function categoriesClickHandler(e) {
  const btn = e.target.closest('.categories__btn');
  if (!btn) return;

  const category = btn.textContent.trim();
  currentCategory = category;
  currentPage = 1;

  const allBtns = refs.categoriesList.querySelectorAll('.categories__btn');
  allBtns.forEach(b =>
    b.classList.toggle('categories__btn--active', b === btn)
  );

  if (category === 'All') {
    loadProductsAll();
  } else {
    loadProductsByCategory(category);
  }
}

async function loadProductsAll() {
  try {
    const { products } = await getProducts(currentPage);
    checkFound(products);
    refs.productsList.innerHTML = '';
    renderProducts(products);
  } catch (err) {
    console.error(err);
  }
}

async function loadProductsByCategory(category) {
  try {
    const { products } = await getProductsByCategory(category, currentPage);

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

export function productClickHandler(e) {
  const li = e.target.closest('.products__item');
  if (!li) return;

  const id = li.dataset.id;
  if (!id) return;

  openProductModal(id);
}

async function openProductModal(id) {
  try {
    const product = await getProductById(id);
    console.log(product);

    renderModalProduct(product);
    openModal();
  } catch (err) {
    console.error('Modal product error:', err);
  }
}

let currentQuery = '';

export async function onSearchSubmit(e) {
  e.preventDefault();

 

  const query = refs.searchInput.value.trim();

  if (!query) return;

  currentQuery = query;
  currentPage = 1;

  refs.categoriesList.classList.add('hidden');
  
  try {
    const { products } = await searchProducts(query, currentPage);

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
  } catch (err) {
    console.log(err);
  }
}

export async function onSearchClear() {
  refs.searchInput.value = '';
  currentQuery = '';
  currentPage = 1;

  hideNotFound();

  refs.categoriesList.classList.remove('hidden');

  const { products } = await getProducts();
  refs.productsList.innerHTML = '';
  renderProducts(products);
}

function showNotFound() {
  refs.notFound.classList.add('not-found--visible');
}

function hideNotFound() {
  refs.notFound.classList.remove('not-found--visible');
}
