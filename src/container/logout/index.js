const { saveSession } = require('../../script/session')

document.addEventListener('DOMContentLoaded', () => {
  saveSession(null)
  location.assign('/')
})
