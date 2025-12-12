import { refs } from './refs';
import { getCart,getWishlist } from './storage';

export async function renderProducts(products) {
  const markup = products
    .map(
      ({
        thumbnail,
        id,
        description,
        title,
        price,
        category,
        brand,
      }) => `<li class="products__item" data-id="${id}">
    <img class="products__image" src="${thumbnail}" alt="${description}"/>
    <p class="products__title">${title}</p>
    <p class="products__brand"><span class="products__brand--bold">Brand:${
      brand || 'no brand'
    }</span></p>
    <p class="products__category">Category: ${category}</p>
    <p class="products__price">Price: ${price}$</p>
 </li>`
    )
    .join('');



  refs.productsList.insertAdjacentHTML('beforeEnd', markup);
}

export function renderCategories(categories) {
  const categoryList = ['All', ...categories];
  const markup = categoryList
    .map(
      item =>
        `<li class="categories__item">
    <button class="categories__btn" type="button">${item}</button>
    </li>`
    )
    .join('');
  refs.categoriesList.innerHTML = markup;
}

export function renderModalProduct(product) {
  const modalRoot = refs.modal.querySelector('.modal-product');

  modalRoot.innerHTML = `<img class="modal-product__img" src="${
    product.thumbnail
  }" alt="${product.description}" />
      <div class="modal-product__content">
        <p class="modal-product__title">${product.title}</p>
        <ul class="modal-product__tags">${product.tags
          ?.map(tag => `<li>#${tag}</li>`)
          .join('')}</ul>
        <p class="modal-product__description">${product.description}</p>
        <p class="modal-product__shipping-information">Shipping: ${
          product.shippingInformation || 'N/A'
        }</p>
        <p class="modal-product__return-policy">Return Policy: ${
          product.returnPolicy || 'N/A'
        }</p>
        <p class="modal-product__price">Price: ${product.price}$</p>
        <button class="modal-product__buy-btn" type="button">Buy</button>
      </div>
`;
}


export function updateNavCount() {
  const cartEl = document.querySelector('[data-cart-count]');
  const wishlistEl = document.querySelector('[data-wishlist-count]');

  if (!cartEl || !wishlistEl) return;

  const cartCount = getCart().length;
  const wishlistCount = getWishlist().length;

  cartEl.textContent = cartCount;
  wishlistEl.textContent = wishlistCount;
}