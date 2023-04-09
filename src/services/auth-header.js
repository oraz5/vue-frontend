export default function authHeader () {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user && user.token) {
    console.log('autheader1:' + user.token)
    // for Node.js Express back-end
    return { 'Content-Type': 'application/json', 'x-access-token': user.token }
  } else {
    return {}
  }
}
