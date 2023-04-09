import axios from 'axios'
import authHeader from './auth-header'
import multipartAuthHeader from './multipartAuthHeader'
const API_URL = 'http://127.0.0.1:8800/api/v1/'

class UserService {
  getAllProducts () {
    return axios({ method: 'get', url: API_URL + 'products', params: {} })
  }

  getUserCart () {
    return axios({ method: 'get', url: API_URL + 'cart', headers: authHeader() })
  }

  addToUserCart (productId, form) {
    return axios({ method: 'post', url: API_URL + 'product/cart/' + productId, data: form, headers: authHeader() })
  }

  subFromUserCart (productId, form) {
    return axios({ method: 'delete', url: API_URL + 'product/cart/' + productId, data: form, headers: authHeader() })
  }

  addNewOrder (form) {
    return axios({ method: 'post', url: API_URL + 'order', data: form, headers: authHeader() })
  }

  addProductVariant (skuId, form) {
    return axios({ method: 'post', url: API_URL + 'product/variant/' + skuId, data: form, headers: multipartAuthHeader() })
  }

  addProduct (form) {
    return axios({ method: 'post', url: API_URL + 'product', data: form, headers: multipartAuthHeader() })
  }

  getRegions () {
    return axios({ method: 'get', url: API_URL + 'regions' })
  }

  getBrands () {
    return axios({ method: 'get', url: API_URL + 'brands' })
  }

  getOrders () {
    return axios({ method: 'get', url: API_URL + 'orders', headers: authHeader() })
  }

  addCategory (form) {
    return axios({ method: 'post', url: API_URL + 'category', data: form, headers: multipartAuthHeader() })
  }

  getCategory () {
    return axios({ method: 'get', url: API_URL + 'categories' })
  }

  editCategory (form, category) {
    return axios({ method: 'put', url: API_URL + 'category/' + category, data: form, headers: multipartAuthHeader() })
  }

  addCategoryOption (form, category) {
    return axios({ method: 'post', url: API_URL + 'category/option/' + category, data: form, headers: authHeader() })
  }

  delCategoryOption (form, category) {
    return axios({ method: 'delete', url: API_URL + 'category/option/' + category, data: form, headers: authHeader() })
  }

  getProcessors () {
    return axios({ method: 'get', url: API_URL + 'processors' })
  }

  editOrder (uuid, form) {
    return axios({ method: 'put', url: API_URL + 'order/' + uuid, data: form, headers: multipartAuthHeader() })
  }
}

export default new UserService()
