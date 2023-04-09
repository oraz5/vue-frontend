<template>
  <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-brand href="#">Market</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item href="#">Home</b-nav-item>
        <router-link :to="{ name: 'ProductCategories' }" class="nav-link"> Categories</router-link>
        <span v-if="currentUser">
        <router-link :to="{ name: 'AdminOrders' }" class="nav-link" v-if="currentUser.userRole == 'superadmin' || currentUser.userRole == 'admin'"> Orders</router-link>
        </span>
        <span v-if="currentUser">
        <router-link :to="{ name: 'AllProductsAdmin' }" class="nav-link" v-if="currentUser.userRole == 'superadmin' || currentUser.userRole == 'admin'"> Products</router-link>
        </span>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-form v-on:submit.prevent="searchFunc()">
          <b-form-input size="sm" class="mr-sm-2" v-model="searchInput" placeholder="Search" ></b-form-input>
          <b-button size="sm" class="my-2 my-sm-0" @click="searchFunc()">Search</b-button>
        </b-nav-form>
        <b-nav-item-dropdown text="Lang" right>
          <b-dropdown-item href="#">TM</b-dropdown-item>
          <b-dropdown-item href="#">RU</b-dropdown-item>
          <b-dropdown-item href="#">EN</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown v-if="!currentUser"  right>
           <template #button-content>
            <em> Login </em>
          </template>
         <router-link to="/register"><b-dropdown-item>Signup</b-dropdown-item></router-link>
          <b-dropdown-item><router-link to="/login">Login</router-link></b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown v-if="currentUser" right>
          <template #button-content>
            <em> {{ currentUser.username }}</em>
          </template>
          <b-dropdown-item><router-link :to="{ name: 'UserProfile' }">Profile</router-link></b-dropdown-item>
          <b-dropdown-item href @click.prevent="logOut">Logout</b-dropdown-item>
        </b-nav-item-dropdown>
        <router-link :to="{ name: 'userCart' }"><b-icon icon="cart" font-scale="2">></b-icon></router-link>
        <p class="cart-count">{{quantity}}</p>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { EventBus } from '../event-bus'
import singleProduct from '@/components/singleProduct'
import userCart from '@/components/userCart'
import UserService from '../services/user.service'
import { mapActions } from 'vuex'

export default {
  name: 'navBar',
  components: {
    singleProduct,
    userCart
  },
  data () {
    return {
      quantity: '',
      isLoggedIn: false,
      isAdminStatus: false,
      searchInput: ''
    }
  },
  mounted () {
    EventBus.$on('clicked', this.getCartData)
    // console.log('cart quant: '+cartQuantity)
    if (this.loggedIn) {
      console.log('logged in mounted')
      this.getCartData()
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.auth.user
    },
    loggedIn () {
      return this.$store.state.auth.status.loggedIn
    }
  },
  methods: {
    getCartData: function () {
      UserService.getUserCart().then((response) => {
        this.quantity = response.data.length
        console.log('NavQuantity: ' + this.quantity)
      // var productsID = response.data.find(x => x.product_id == this.$route.query.category)
      })
        .catch((error) => {
          if (error.response.data.message.includes('Token')) {
            this.logOut()
          }
        })
    },
    logOut () {
      this.quantity = ''
      this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    },
    searchFunc () {
      console.log(this.searchInput)
      const payload = this.searchInput
      EventBus.$emit('searchClicked', payload)
    },
    ...mapActions(['fetchCategories'])
  },
  created () {
    this.fetchCategories()
    console.log('isAdmin: ' + this.$store.state.auth.isAdmin)
  }
}
</script>
