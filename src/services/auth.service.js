import axios from 'axios'

const API_URL = 'http://127.0.0.1:8800/api/v1/'

class AuthService {
  login (user) {
    // const loginFormData = new FormData()
    // loginFormData.append('email', this.email)
    // loginFormData.append('password', this.password)
    console.log('login auth service:' + user.email)
    return axios
      .post(API_URL + 'login', {
        email: user.email,
        password: user.password
      })
      .then(response => {
        console.log(response.data)
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data))
        }
        return response.data
      })
  }

  logout () {
    localStorage.removeItem('user')
    localStorage.removeItem('category')
  }

  register (user) {
    return axios.post(API_URL + 'signup', {
      username: user.username,
      email: user.email,
      phone: user.phone,
      password: user.password
    })
  }
}

export default new AuthService()
