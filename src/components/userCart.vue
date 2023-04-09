<template>
<div>
<div class="column side">
    <h2>Buyer Information</h2>
    <form>
        <label for="username">Username:</label>
        <input type="text" id="username" :placeholder="currentUser" v-model="currentUser" disabled><br>
        <label for="phone">Phone Number:</label>
        <input type="text" id="phone" :placeholder="currentPhone" v-model="currentPhone" disabled><br>
        <label for="address">Address:</label>
        <input type="text" id="address" :placeholder="orderAddress" v-model="orderAddress"><br>
        <label for="comment">Comment:</label>
        <input type="text" id="comment" :placeholder="orderComment" v-model="orderComment">  <br>
    </form>
    </div>
<div  class="column middle">
  <div class="link-product" >
  </div>
  <h1>Products in cart</h1>
  <div class="cart box" v-for="(product, index) in productsInCart" :key="index">
    <router-link v-bind:to="'/product/' + product.id"><h2>{{ product.product_name }}</h2></router-link>
    <p>{{ product.description_tm }}</p>
    <img v-if="product.small_name" :src="api_url  + product.small_name" />
    <p class="price"> <b> Price:</b> {{ product.price }} $</p>
    <p class="quantity"> <b> Quantity:</b> {{ product.quantity }} </p>
    <p class="product-sum"> <b> Sum:</b> {{ resultPrice[index] }} $</p>
    <button type="button" class="btn btn-success" @click="addCount(product.sku_code)">Add Count</button>
    <button type="button" class="btn btn-danger" @click="subCount(product.sku_code)">Subtract Count</button>
  </div>
  <p class="order-sum">TOTAL: {{orderSum}} $</p>
 <button type="button" class="btn btn-success btn-lg" @click="setOrder">Order</button>
</div>
</div>
</template>

<script>
import { EventBus } from '../event-bus'
import UserService from '../services/user.service'

export default {
  name: 'userCart',
  data () {
    return {
      currentUser: this.$store.state.auth.user.username,
      currentPhone: this.$store.state.auth.user.phone,
      orderAddress: this.$store.state.auth.user.address,
      orderComment: 'write here your comment',
      resultPrice: null,
      orderSum: null,
      productsInCart: [],
      categories: [],
      search: '',
      api_url: this.$api_url
    }
  },
  methods: {
    getData: function () {
      UserService.getUserCart().then((response) => {
        this.productsInCart = response.data
        this.resultPrice = response.data.map(a => a.price * a.quantity)
        this.orderSum = this.resultPrice.reduce((a, b) => a + b, 0)
      })
        .catch((error) => {
          console.log(error)
          if (error.response.data.message.includes('Token')) {
            this.logOut()
          }
        })
    },
    setOrder: function () {
      const formData = new FormData()
      formData.append('phone_number', this.currentPhone)
      formData.append('order_address', this.orderAddress)
      formData.append('order_comment', this.orderComment)
      UserService.addNewOrder(formData).then((response) => {
        console.log('orderStatus: ' + response.data)
        this.getData()
        EventBus.$emit('clicked')
      })
        .catch((error) => {
          console.log(error)
          if (error.response.data.message.includes('Token')) {
            this.logOut()
          }
        })
    },
    addCount: function (skuCode) {
      if (this.currentUser) {
        const formData = new FormData()
        formData.append('quantity', 1)
        UserService.addToUserCart(skuCode, formData).then(
          response => {
            console.log(response.headers)
            this.getData()
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
    },
    subCount: function (skuCode) {
      if (this.currentUser) {
        const formData = new FormData()
        formData.append('quantity', 1)
        UserService.subFromUserCart(skuCode, formData).then(
          response => {
            console.log(response.headers)
            this.getData()
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
    },
    logOut () {
      this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    }
  },
  created () {
    this.getData()
  }
}
</script>
