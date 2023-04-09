export default function multipartAuthHeader () {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user && user.token) {
    console.log('autheader1:' + user.token)
    // for Node.js Express back-end
    return { 'Content-Type': 'multipart/form-data', 'x-access-token': user.token }
  } else {
    return {}
  }
}
