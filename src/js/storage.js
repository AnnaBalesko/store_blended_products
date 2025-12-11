export function saveToLS(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to LocalStorage:', error);
  }
}

export function loadFromLS(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading from LocalStorage:', error);
    return null;
  }
}


export function getTheme() {
  return loadFromLS('theme') || 'light';
}
export function saveTheme(theme) {
  saveToLS('theme', theme);
}

export function getCart() {
  return loadFromLS('cart') || [];
}
export function addToCart(id) {
  const arr = new Set(getCart().map(Number));
  arr.add(Number(id));
  saveToLS('cart', [...arr]);
}
export function removeFromCart(id) {
  const arr = getCart().filter(i => Number(i) !== Number(id));
  saveToLS('cart', arr);
}
export function isInCart(id) {
  return getCart().map(Number).includes(Number(id));
}

export function getWishlist() {
  return loadFromLS('wishlist') || [];
}
export function addToWishlist(id) {
  const arr = new Set(getWishlist().map(Number));
  arr.add(Number(id));
  saveToLS('wishlist', [...arr]);
}
export function removeFromWishlist(id) {
  const arr = getWishlist().filter(i => Number(i) !== Number(id));
  saveToLS('wishlist', arr);
}
export function isInWishlist(id) {
  return getWishlist().map(Number).includes(Number(id));
}