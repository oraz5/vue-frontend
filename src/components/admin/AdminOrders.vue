<template>
<div>
<div  class="column middle-large">
  <div class="link-product" >
  </div>
  <h1>Orders</h1>
  <div class="cart box" >
  <table v-for="(order, index) in orders" :key="index" style="width:100%; ">
  <tr>
    <th style="width: 15%">Id</th>
    <th style="width: 8%">Status</th>
    <th style="width: 10%">Date</th>
    <th style="width: 5%">User</th>
    <th style="width: 7%">Phone</th>
    <th style="width: 10%">Address</th>
    <th style="width: 10%">Comment</th>
    <th style="width: 10%">Admin Notes</th>
  </tr>
  <tr class="orderId-text" >
    <td v-b-toggle="'collapse-'+(index+1)" variant="primary">{{ order.id }}</td>
    <td>
      <select :value="order.status" @change="orderStatusChange(order.id, $event)" >
          <option class="bg-primary" value="Order Recieved" >Order Recieved</option>
          <option class="bg-light" value="Open" >Open</option>
          <option class="bg-warning" value="Partially Shipped" >Partially Shipped</option>
          <option class="bg-info" value="Shipped" >Shipped</option>
          <option class="bg-secondary" value="Electronically Delivered" >Electronically Delivered</option>
          <option class="bg-success" value="Completed" >Completed</option>
          <option class="bg-danger" value="Cancelled" >Cancelled</option>
          <option class="bg-white" value="Action Required" >Action Required</option>
        </select>
    </td>
    <td>{{ order.created_ts }}</td>
    <td>{{ order.username }}</td>
    <td>{{ order.phone }}</td>
    <td>{{ order.address }}</td>
    <td>{{ order.comment }}</td>
    <td>{{ order.notes }}</td>
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
</template>

<script>
import UserService from '../../services/user.service'
export default {
  name: 'AdminOrders',
  data () {
    return {
      totalPrice: null,
      orderSum: null,
      orders: [],
      orderStatus: '',
      categories: [],
      search: '',
      api_url: this.$api_url
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
    orderStatusChange (orderId, event) {
      console.log('orderId: ' + orderId + ' --- status: ' + event.target.value)
      this.orderStatus = event.target.value
      console.log(event.target.value)
      const formData = new FormData()
      formData.append('order_status', event.target.value)
      UserService.editOrder(orderId, formData).then((response) => {
        console.log(response.headers)
      })
        .catch((error) => {
          console.log(error)
          if (error.response.data.message.includes('Token')) {
            this.logOut()
          }
        })
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
