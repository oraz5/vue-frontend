<template>
<div class="center-align">
  <div class="login-container">
  <section class="login" id="login">
    <header>
      <h2>Market</h2>
      <h4>Login</h4>
    </header>
    <form class="login-form">
      <input type="text" class="login-input" placeholder="Email" v-model="user.email" required autofocus/>
      <input type="password" class="login-input" placeholder="Password" v-model="user.password" required/>
      <div class="submit-container">
        <button type="submit" class="login-button"  v-on:click.prevent="handleLogin">LOGIN</button>
      </div>
    </form>
    <div class="form-group">
        <div v-if="message" class="alert alert-danger" role="alert">{{message}}</div>
    </div>
  </section>
  </div>
</div>
</template>

<script>
import { EventBus } from '../event-bus'
import User from '../models/user'
export default {
  name: 'UserLogin',
  data () {
    return {
      user: new User('', ''),
      password: '',
      email: '',
      loading: false,
      message: '',
      prevRouteQuery: '',
      path: []
    }
  },
  computed: {
    loggedIn () {
      return this.$store.state.auth.status.loggedIn
    }
  },
  created () {
    if (this.loggedIn) {
      this.$router.push('/profile')
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      console.log(from.path)
      vm.prevRouteQuery = from.path
    })
  },
  methods: {
    handleLogin () {
      this.loading = true
      this.$validator.validateAll().then(isValid => {
        if (!isValid) {
          this.loading = false
          return
        }
        if (this.user.email && this.user.password) {
          this.$store.dispatch('auth/login', this.user).then(
            () => {
              const user = JSON.parse(localStorage.getItem('user'))
              EventBus.$emit('clicked')
              if (user.userRole == 'user' && this.prevRouteQuery) {
                this.$router.push(this.prevRouteQuery)
              } else if (user.userRole == 'user' && this.prevRouteQuery === '/') {
                this.$router.push('/')
              } else if (user.userRole == 'superadmin' || user.userRole == 'admin') {
                this.$router.push('admin/products')
              }
            },
            error => {
              console.log(error)
              this.loading = false
              this.message =
                (error.response && error.response.data) ||
                error.message ||
                error.toString()
            }
          )
        }
      })
    }
  }
}
</script>
