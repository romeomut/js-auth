const express = require('express')
const router = express.Router()

const { User } = require('../class/user')
const { Confirm } = require('../class/confirm')

User.create({
  email: 'test@mail.com',
  password: 123,
  rol: 1,
})

//

router.get('/signup', function (req, res) {
  return res.render('signup', {
    name: 'signup',
    component: [
      'back-button',
      'field',
      'field-password',
      'field-checkbox',
      'field-select',
    ],
    title: 'Signup page',
    data: {
      role: [
        { value: User.USER_ROLE.USER, text: 'Користувач' },
        {
          value: User.USER_ROLE.ADMIN,
          text: 'Адміністратор',
        },
        {
          value: User.USER_ROLE.DEVELOPER,
          text: 'Розробник',
        },
      ],
    },
  })
})

//

router.post('/signup', function (req, res) {
  const { email, password, role } = req.body

  console.log(req.body)

  if (!email || !password || !role) {
    return res.status(400).json({
      message: 'Помилка. Обов`язкові поля відсутні!',
    })
  }

  try {
    const user = User.getByEmail(email)

    if (user) {
      return res.status(400).json({
        message: 'Помилка. Такий користувач вже існує.',
      })
    }

    User.create({
      email,
      password,
      role,
    })

    return res.status(200).json({
      message: 'Користувач успішно зареєсрований',
    })
  } catch (error) {
    return res.status(400).json({
      message: 'Помилка створення користувача',
    })
  }
})

//

router.get('/recovery', function (req, res) {
  return res.render('recovery', {
    name: 'recovery',
    component: ['back-button', 'field'],
    title: 'Recovery page',
    data: {},
  })
})

//

router.post('/recovery', function (req, res) {
  const { email } = req.body

  console.log(email)

  if (!email) {
    return res.status(400).json({
      message: 'Помилка. Обов`язкові поля відсутні!',
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: 'Користувач з таким email не існує',
      })
    }

    Confirm.create(email)

    return res.status(200).json({
      message: 'Код для відновлення відправлено!',
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

//

router.get('/recovery-confirm', function (req, res) {
  return res.render('recovery-confirm', {
    name: 'recovery-confirm',
    component: ['back-button', 'field', 'field-password'],
    title: 'Recovery confirm page',
    data: {},
  })
})

//

router.post('/recovery-confirm', function (req, res) {
  const { code, password } = req.body
  console.log(code, password)

  if (!code || !password) {
    return res.status(400).json({
      message: 'Помилка. Обов`язкові поля відсутні!',
    })
  }

  try {
    const email = Confirm.getData(Number(code))

    if (!email) {
      return res.status(400).json({
        message: 'Код не існує!',
      })
    }

    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: 'Користувач з таким email не існує',
      })
    }

    user.password = password

    console.log(user)

    return res.status(200).json({
      message: 'Пароль змінено!',
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

module.exports = router
