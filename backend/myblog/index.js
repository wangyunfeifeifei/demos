const path = require('path')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const config = require('config-lite')(__dirname)
const routes = require('./routes')
const pkg = require('./package')

const app = express()

app.set('views', path.join(__dirname, 'views'))

app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
  name: config.session.key, // 设置cookie中保存session id 的字段名称
  secret: config.session.secret, // 通过设置secret来计算hash值并放在cookie中，使产生signedCookie防篡改
  resave: true, // 强制刷新 session
  saveUninitialized: false, // 设置为 false, 强制创建一个session, 即使用户未登录
  cookie: {
    maxAge: config.session.maxAge
  },
  store: new MongoStore({ // 将session 存储到mongodb
    url: config.mongodb // mongo地址
  })
}))

app.use(flash())

routes(app)

app.listen(config.port, function () {
  console.log(`${pkg.name} listening on port ${config.port}`)
})
