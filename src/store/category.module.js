import UserService from '../services/user.service'

const category = JSON.parse(localStorage.getItem('category'))
const state = {
  categories: []
}

const getters = {
  categoriesList: state => state.categories
}

const actions = {
  async fetchCategories ({ commit }) {
    if (category !== null) {
      console.log(category)
      commit('setCategories', category)
    } else {
      UserService.getCategory().then(response => {
        localStorage.setItem('category', JSON.stringify(response.data))
        commit('setCategories', response.data)
      })
    }
  },
  async updateCategories ({ commit }) {
    UserService.getCategory().then(response => {
      localStorage.setItem('category', JSON.stringify(response.data))
      commit('setCategories', response.data)
    })
  }
}

const mutations = {
  setCategories: (state, categories) => (
    state.categories = categories
  )
}

export default {
  state,
  getters,
  actions,
  mutations
}
