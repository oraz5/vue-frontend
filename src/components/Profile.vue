<template>
<div>
 <div class="title-container">
    <div class="filters">
      <div class="filter" v-bind:class="{ active: activeItem === 1}" v-on:click="clickHandler(1)">
        UserProfile
      </div>
       <div class="filter" v-bind:class="{ active: activeItem === 2}" v-on:click="clickHandler(2)">
        Orders
      </div>
    </div>
  </div>
<transition class="boxes" name="boxes" v-if="activeItem === 1">
    <div class="box1">
        <div class="column side">
        <h2>Buyer Information</h2>
        <form>
            <label for="username">Username:</label>
            <input type="text" id="username" :placeholder="currentUserName" v-model="currentUserName"><br>
            <label for="phone">Phone Number:</label>
            <input type="text" id="phone" :placeholder="currentUserPhone" v-model="currentUserPhone"><br>
            <label for="phone">Email:</label>
            <input type="text" id="phone" :placeholder="currentUserEmail" v-model="currentUserEmail"><br>
            <label for="address">Address:</label>
            <input type="text" id="address" :placeholder="orderAddress" v-model="orderAddress"><br>
        </form>
        </div>
    </div>
</transition>
<transition class="boxes" name="boxes" v-if="activeItem === 2">
    <div class="box2">
        <div  class="column middle">
        <div class="link-product" >
        </div>
        <h1>Ordered products</h1>
         <div class="cart box" >
            <table v-for="(order, index) in orders" :key="index" style="width:100%; ">
            <tr>
                <th>Id</th>
                <th>Status</th>
                <th>Date</th>
                <th>User</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Comment</th>
            </tr>
            <tr class="orderId-text" v-b-toggle="'collapse-'+(index+1)" variant="primary">
                <td>{{ order.id }}</td>
                <td>{{ order.status }}</td>
                <td>{{ order.created_ts }}</td>
                <td>{{ order.username }}</td>
                <td>{{ order.phone }}</td>
                <td>{{ order.address }}</td>
                <td>{{ order.comment }}</td>
            </tr>
            <b-collapse v-bind:id="'collapse-'+(index+1)" class="mt-2">
                <b-card v-for="(order_item, index) in order.order_items" :key="index">
                <img :src="'http://localhost:8800/'+order_item.product_image"><router-link v-bind:to="'/product/' + order_item.codename"><p class="codename-text">codename: {{ order_item.codename }}</p></router-link>
                <p class="price-text">price: {{ order_item.price }} $</p>
                <p class="quantity-text">quantity: {{ order_item.quantity }}</p>
                <p class="subtotal-text">Sub Total: {{ order_item.sub_total }} $</p>
                </b-card>
            </b-collapse>
            <p class="order-sum">TOTAL: {{order.total_sum}} $</p>
            </table>
        </div>
        </div>
    </div>
</transition>
</div>
</template>

<script>
import UserService from '../services/user.service'

export default {
  name: 'UserProfile',
  data () {
    return {
      currentUserName: this.$store.state.auth.user.username,
      currentUserPhone: this.$store.state.auth.user.phone,
      currentUserEmail: this.$store.state.auth.user.email,
      orderAddress: this.$store.state.auth.user.address,
      orderComment: 'gaty gowy',
      resultPrice: null,
      orderSum: null,
      productsInCart: [],
      categories: [],
      search: '',
      api_url: this.$api_url,
      activeItem: 1
    }
  },
  methods: {
    getData: function () {
      UserService.getOrders().then((response) => {
        this.orders = response.data
        this.totalPrice = response.data.total_sum
        this.orderSum = this.resultPrice.reduce((a, b) => a + b, 0)
      })
        .catch((error) => {
          console.log(error)
          if (error.response.data.message.includes('Token')) {
            this.logOut()
          }
        })
    },
    clickHandler (index) {
      this.activeItem = index
      console.log(this.activeItem)
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
