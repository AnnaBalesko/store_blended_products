//Логіка сторінки Cart
// import { refs } from './js/refs';
// import * as storage from './js/storage';
// import * as api from './js/products-api';
// import { renderProducts, renderProductModal, updateNavCount } from './js/render-function';
// import { openModal } from './js/modal';
// import { toastSuccess } from './js/helpers';

// async function initCartPage() {
//   updateNavCount();
//   const ids = storage.getCart();
//   if (!ids || ids.length === 0) {
//     if (refs.notFound) refs.notFound.classList.add('not-found--visible');
//     refs.productsList.innerHTML = '';
//     updateSummary(0, 0);
//     return;
//   }

//   try {
//     refs.notFound?.classList.remove('not-found--visible');
//     const promises = ids.map(id => api.getProductById(id));
//     const products = await Promise.all(promises);
//     renderProducts(products);
//     const total = products.reduce((s, p) => s + (p.price || 0), 0);
//     updateSummary(products.length, total);
//   } catch (err) {
//     console.error(err);
//   }
// }

// /* update summary (items count, total) */
// function updateSummary(items, total) {
//   if (refs.cartItemsCount) refs.cartItemsCount.textContent = items;
//   if (refs.cartTotal) refs.cartTotal.textContent = `${Number(total).toFixed(2)}`;
// }

// /* open modal on cart list */
// refs.productsList?.addEventListener('click', async (e) => {
//   const li = e.target.closest('.products__item');
//   if (!li) return;
//   const id = li.dataset.id;
//   const product = await api.getProductById(id);
//   renderProductModal(product);
//   openModal();
//   // attach cart/wishlist handlers similarly to wishlist.js
// });

// refs.buyProductsBtn?.addEventListener('click', () => {
//   // For demo: show success & clear cart
//   toastSuccess('Thank you! Your order has been placed.');
//   // Optionally: clear cart:
//   // saveToLS('cart', []);
//   // updateNavCount();
// });

// document.addEventListener('DOMContentLoaded', initCartPage);