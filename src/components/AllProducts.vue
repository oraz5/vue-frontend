<template>
<div>
<div class="column side">
    </div>
<div  class="column middle">
  <div class="link-product" >
  <h2 class="parent">{{parentCatNameTM}}</h2>
  </div>
  <h1>{{categoryNameTM}}</h1>
  <h1 v-if="currentCat==null">All Products</h1>
  <div class="box" v-for="(product, index) in products" :key="index">
    <router-link v-bind:to="'/product/' + product.sku_code"><h2>{{ product.product_name }} {{product.sku_code}}</h2></router-link>
    <p>{{ product.description_tm }}</p>
    <img v-if="product.sku_image" :src="apiURL  + product.sku_image" />
    <p class="price"> <b> Bahasy:</b> {{ product.sku_price }} $</p>
  </div>
  <nav aria-label="Page navigation example">
  <ul class="pagination" >
    <li class="page-item"><a class="page-link">Previous</a></li>
    <li class="page-item"   >
      <a class="page-link"  v-for="(page, index) in pagesCount" :key="page" v-bind:class="{ active: activePage === page || activePage == index+1 }" v-on:click.prevent="toPage(page)">{{page}}</a>
    </li>
    <li class="page-item"><a class="page-link">Next</a></li>
  </ul>
</nav>
</div>
</div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import { EventBus } from '../event-bus'
import Navigation from '@/components/Navigation'

export default {
  name: 'AllPosts',
  components: {
    Navigation
  },
  data () {
    return {
      apiURL: this.$api_url,
      offset: '0',
      limit: '5',
      page: 1,
      activePage: null,
      prevRoute: null,
      pagesCount: '0',
      products: [],
      categories: [],
      currentCat: null,
      categoryNameTM: null,
      categoryNameRU: null,
      parentCatNameTM: null,
      parentCatNameRU: null,
      search: ''
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.prevRoute = to
      localStorage.setItem('prevRoute', vm.prevRoute.query.category)
      console.log(from)
    })
  },
  beforeRouteEach (to, from, next) {
    next(vm => {
      console.log(from)
    })
  },
  mounted () {
    EventBus.$on('searchClicked', (payload) => {
      this.page = 1
      this.activePage = 1
      this.offset = 0
      localStorage.removeItem('activePage')
      localStorage.removeItem('storePage')
      this.getData(payload)
    })
    this.getCategory()
    document.title = this.parentCatNameTM + ' - ' + this.categoryNameTM
  },
  methods: {
    getData: function (payload) {
      this.search = payload
      console.log('search: ' + payload)
      console.log('thisPage: ' + this.page)
      console.log('thisActive: ' + this.activePage)
      axios.get(this.$api_url + '/api/v1/products', { params: { offset: this.offset, limit: this.limit, category_id: this.$route.query.category, search: this.search } }).then((response) => {
        if (response.data.products) {
          console.log(response.data)
          this.products = response.data.products
          this.pagesCount = Math.ceil(response.data.total_count / this.limit)
          console.log('count: ' + response.data.total_count)
        }
      })
        .catch((error) => {
          console.log(error)
        })
    },
    getCategory: function () {
      console.log('this cat: ' + this.$route.query.category)
      const catID = this.categoriesList.find(x => x.id == this.$route.query.category)
      const parCatID = this.categoriesList.find(x => x.id == catID.parent_category)
      this.currentCat = this.$route.query.category
      this.categoryNameTM = catID.category_name_tm
      this.categoryNameRU = catID.category_name_ru
      this.parentCatNameTM = parCatID.category_name_tm
      this.parentCatNameRU = parCatID.category_name_ru
    },
    toPage: function (page) {
      this.activePage = page
      this.prevRoute = localStorage.getItem('prevRoute')
      if (this.$route.query.category === this.prevRoute) {
        localStorage.setItem('activePage', page)
        localStorage.setItem('storePage', page)
      }
      // console.log('savedPageFunc: ' + localStorage.getItem('storePage'))
      // console.log('savedActivePageFunc: ' + localStorage.getItem('activePage'))
      if (page === 1) {
        this.offset = 0
      } else {
        this.offset = (page - 1) * this.limit
      }
      if (this.search == '' && this.page == 1) {
        this.getData()
      } else { this.getData(this.search) }
    },
    logOut () {
      this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    }
  },
  computed: {
    ...mapGetters(['categoriesList'])
  },
  created () {
    this.prevRoute = localStorage.getItem('prevRoute')
    if (this.$route.query.category === this.prevRoute) {
      if (localStorage.getItem('storePage')) {
        this.activePage = localStorage.getItem('activePage')
        this.page = localStorage.getItem('storePage')
      }
    } else {
      this.activePage = 1
      this.page = 1
      localStorage.setItem('activePage', this.activePage)
      localStorage.setItem('storePage', this.page)
    }
    // console.log('onCreateThisRouteCateg: ' + this.$route.query.category)
    // console.log('onCratePrevRoute: ' + this.prevRoute)
    // console.log('onCreatePage: ' + this.page)
    // console.log('onCreateActivePage: ' + this.activePage)
    this.toPage(this.page)
    this.getData()
  }
}
</script>
