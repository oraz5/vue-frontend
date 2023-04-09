<template>
  <div class="container">
    <div class="row">
      <!-- Varinats of Product -->
      <div class="col">
        <h4>Variants</h4>
        <select v-model="selectedVariant" @change="selectVariant()">
          <option v-for="item in variants" :value="item" :key="item.id">
            {{ item.sku_codename }}
          </option>
        </select>
      </div>
       <!-- End of variants-->
      <div class="col-6">
        <div style="display:flex">
        <p>{{parentCatNameTM}}</p>-><p>{{categoryNameTM}}</p>
        </div>
        <h1>{{ product.product_name }} {{ product.sku_code }}</h1>
        <article>{{ product.description_tm }}</article>
        <p>Price: {{product.sku_price}} $</p>
        <div class="details">
          <h4>Details</h4>
          <div v-for="(value, key) in options" :key="key">
            {{ key }}: {{ value }}
          </div>
        </div>
        <!-- <div v-for="path in paths" v-bind:key="path">
        <img v-bind:src="apiURL +path" /> -->
         <div>
          <b-carousel
            id="carousel-1"
            v-model="slide"
            :interval="0"
            controls
            indicators
            background="#ffffff"
            img-width="auto"
            img-height="580px"
            style="text-shadow: 1px 1px 2px #333;"
            @sliding-start="onSlideStart"
            @sliding-end="onSlideEnd"
          >
            <!-- Slides with image only -->
            <b-carousel-slide v-for="path in paths" v-bind:key="path">
               <template #img>
                <img  style="display: block; margin-left: auto; margin-right: auto"
                width= "auto"
                height="380px"
                v-bind:src="apiURL +path" />
              </template>
            </b-carousel-slide>
          </b-carousel>
         </div>
  <!-- </div> -->
      </div>
      <div class="col-3">
        <form  class="form-class" style="position: relative !important;
        top: 50px !important;" >
          <label for="quantity">Quantity:</label><br>
          <input type="text" id="quantity" value="1" v-model="quantity">
          <input type="submit" value="Add to Cart" v-on:click.prevent="submitForm">
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { EventBus } from '../event-bus'
import axios from 'axios'
import UserService from '../services/user.service'
import { mapGetters } from 'vuex'

export default {
  name: 'singleProduct',
  data () {
    return {
      quantity: '',
      apiURL: this.$api_url,
      id: this.$route.params.id,
      product: {},
      options: {},
      productCategory: null,
      paths: [],
      photoArr: [],
      variants: [],
      prevRouteQuery: null,
      categoryNameTM: '',
      categoryNameRU: '',
      parentCatNameTM: '',
      parentCatNameRU: '',
      slide: 0,
      sliding: null
    }
  },
  computed: {
    currentUser () {
      console.log(this.$store.state.auth.user)
      return this.$store.state.auth.user
    },
    ...mapGetters(['categoriesList'])
  },
  mounted () {
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      console.log(from.query.category)
      vm.prevRouteQuery = from.query.category
      localStorage.setItem('prevRoute', vm.prevRouteQuery)
    })
  },
  methods: {
    getData: function () {
      axios.get(this.$api_url + 'api/v1/product/' + this.id).then((response) => {
        this.product = response.data
        this.options = response.data.options
        this.variants = response.data.variants
        console.log(this.variants)
        const image = this.product.sku_images
        const photo = image.replace(/[{}]/g, '')
        this.paths = photo.split(',')
        this.productCategory = this.product.category_id
        console.log(this.paths)
        this.getCategory()
        document.title = this.product.product_name
      })
        .catch((error) => {
          console.log(error)
        })
    },
    getCategory: function () {
      console.log('this cat: ' + this.productCategory)
      const catID = this.categoriesList.find(x => x.id == this.productCategory)
      const parCatID = this.categoriesList.find(x => x.id == catID.parent_category)
      this.currentCat = this.productCategory
      this.categoryNameTM = catID.category_name_tm
      this.categoryNameRU = catID.category_name_ru
      this.parentCatNameTM = parCatID.category_name_tm
      this.parentCatNameRU = parCatID.category_name_ru
    },
    submitForm: function () {
      console.log(this.currentUser)
      console.log(this.product.sku_code)
      if (this.currentUser) {
        console.log(this.quantity)
        const formData = new FormData()
        formData.append('quantity', this.quantity)
        UserService.addToUserCart(this.product.sku_code, formData).then(
          response => {
            console.log(response.headers)
            EventBus.$emit('clicked')
          },
          error => {
            console.log(error)
            if (error.response.data.message.includes('Token')) {
              this.logOut()
            }
          }
        )
      } else {
        this.$router.push('/login')
      }
      // const formData = new FormData()
      // formData.append('quantity', this.quantity)
      // axios.post(this.$api_url + 'api/v1/product/cart/' + this.$route.params.id, formData)
      //   .then((res) => {
      //     EventBus.$emit('clicked')
      //   })
      //   .catch((error) => {
      //     console.log(error)
      //   })
    },
    logOut () {
      this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    },
    onSlideStart (slide) {
      this.sliding = true
    },
    onSlideEnd (slide) {
      this.sliding = false
    },
    selectVariant () {
      console.log(this.selectedVariant.sku_id)
      this.$router.push('/product/' + this.selectedVariant.sku_codename)
      this.id = this.selectedVariant.sku_codename
      this.getData()
    }
  },
  created () {
    this.prevRouteQuery = localStorage.getItem('prevRoute')
    this.getData()
  }
}
</script>
