import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, ITEMS_PER_PAGE } from './constants';
axios.defaults.baseURL = API_BASE_URL;

export async function getProducts(page = 1) {
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const { data } = await axios.get(
    `${API_ENDPOINTS.PRODUCTS}?limit=${ITEMS_PER_PAGE}&skip=${skip}`
  );
  return data;
}

export async function getCategories() {
  const { data } = await axios.get(API_ENDPOINTS.CATEGORIES);
  return data;
}

export async function getProductById(id) {
  const { data } = await axios.get(`${API_ENDPOINTS.PRODUCTS_BY_ID}${id}`);
  return data;
}

export async function searchProducts(q, page = 1) {
  const skip = (page - 1) * ITEMS_PER_PAGE;
  const { data } = await axios.get(
    `${API_ENDPOINTS.SEARCH}?q=${encodeURIComponent(
      q
    )}&limit=${ITEMS_PER_PAGE}&skip=${skip}`
  );
  return data;
}

export async function searchAllProducts(q, page = 1) {
  const skip = (page - 1) * ITEMS_PER_PAGE;
  const { data } = await axios.get(
    `${API_ENDPOINTS.PRODUCTS
    }?q=${encodeURIComponent(q)}&limit=0&skip=${skip}`
  );
  return data;
}

export async function getProductsByCategory(category, page = 1) {
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const cat = encodeURIComponent(category);
  const { data } = await axios.get(
    `${API_ENDPOINTS.PRODUCTS}/category/${cat}?limit=${ITEMS_PER_PAGE}&skip=${skip}`
  );
  return data;
}
