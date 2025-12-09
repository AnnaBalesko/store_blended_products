//Логіка сторінки Wishlist
// import { refs } from './refs';
// import * as storage from './storage';
// import * as api from './products-api';
// import {
//   renderProducts,
//   renderProductModal,
//   updateNavCount,
// } from './render-function';
// import { openModal } from './modals';
// import { toastInfo } from './helpers';

// async function initWishlistPage() {
//   updateNavCount();
//   const ids = storage.getWishlist();
//   if (!ids || ids.length === 0) {
//     if (refs.notFound) refs.notFound.classList.add('not-found--visible');
//     refs.productsList.innerHTML = '';
//     return;
//   }

//   try {
//     refs.notFound?.classList.remove('not-found--visible');
//     // fetch all products by ids
//     const promises = ids.map(id => api.getProductById(id));
//     const products = await Promise.all(promises);
//     renderProducts(products);
//   } catch (err) {
//     console.error(err);
//     toastInfo('Failed to load wishlist products');
//   }
// }

// /* open modal on wishlist list */
// refs.productsList?.addEventListener('click', async e => {
//   const li = e.target.closest('.products__item');
//   if (!li) return;
//   const id = li.dataset.id;
//   const product = await api.getProductById(id);
//   renderProductModal(product);
//   openModal();
//   // attach modal buttons logic is already implemented in handlers.attachModalButtons when using home modal flow,
//   // but here we can re-attach minimal buttons to keep functionality:
//   const wishlistBtn = refs.modal.querySelector('.modal-product__wishlist-btn');
//   const cartBtn = refs.modal.querySelector('.modal-product__cart-btn');

//   if (wishlistBtn) {
//     wishlistBtn.onclick = () => {
//       if (storage.isInWishlist(id)) {
//         storage.removeFromWishlist(id);
//         wishlistBtn.textContent = 'Add to Wishlist';
//         toastInfo('Removed from wishlist');
//       } else {
//         storage.addToWishlist(id);
//         wishlistBtn.textContent = 'Remove from Wishlist';
//       }
//       updateNavCount();
//     };
//   }
//   if (cartBtn) {
//     cartBtn.onclick = () => {
//       if (storage.isInCart(id)) {
//         storage.removeFromCart(id);
//         cartBtn.textContent = 'Add to Cart';
//       } else {
//         storage.addToCart(id);
//         cartBtn.textContent = 'Remove from Cart';
//       }
//       updateNavCount();
//     };
//   }
// });

// document.addEventListener('DOMContentLoaded', initWishlistPage);