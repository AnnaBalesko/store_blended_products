//Логіка сторінки Home

import {
  initHomePage,
  categoriesClickHandler,
  productsClickHandler,
  loadMoreHandler,
  searchSubmitHandler,
  onSearchClear,
  initScrollUp,
} from './js/handlers';
import { refs } from './js/refs';
import { toggleTheme } from './js/helpers';
import { getTheme, saveTheme } from './js/storage';

document.addEventListener('DOMContentLoaded', () => {
  const saved = getTheme();
  toggleTheme(saved);
  initHomePage();

  refs.categoriesList?.addEventListener('click', categoriesClickHandler);
  refs.productsList?.addEventListener('click', productsClickHandler);
  refs.loadMoreBtn?.addEventListener('click', loadMoreHandler);
  refs.searchForm?.addEventListener('submit', searchSubmitHandler);
  refs.searchClearBtn?.addEventListener('click', onSearchClear);

  refs.themeToggleBtn?.addEventListener('click', () => {
    const next = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    toggleTheme(next);
    saveTheme(next);
  });

  initScrollUp();
});










// import { initHomePage, categoriesClickHandler,searchClearBtn,searchSubmitHandler} from './js/handlers';
// import { refs } from './js/refs';
// import { toggleTheme } from './js/helpers';
// import { getTheme, saveTheme } from './js/storage';
// import { renderCategories, renderProducts } from './js/render-function';
// import { getCategories,getProductById,getProducts,searchProducts } from './js/products-api';


// document.addEventListener('DOMContentLoaded', initHomePage);

// document.addEventListener('DOMContentLoaded', () => {
//   const saved = getTheme();
//   toggleTheme(saved);

//   refs.themeToggleBtn?.addEventListener('click', () => {
//     const next = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
//     toggleTheme(next);
//     saveTheme(next);
//   });
// });

// refs.categoriesList.addEventListener('click', categoriesClickHandler);
// refs.productsList.addEventListener('click', productClickHandler);
// refs.searchForm.addEventListener('submit', searchSubmitHandler);
// refs.searchClearBtn.addEventListener('click', searchClearBtn);

// refs.searchInput.addEventListener('input', () => {
//   if (refs.searchInput.value.trim()) {
//     refs.searchClearBtn.classList.add('visible');
//   } else {
//     refs.searchClearBtn.classList.remove('visible');
//   }
// });