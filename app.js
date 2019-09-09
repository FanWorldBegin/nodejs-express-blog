const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database')
mongoose.connect(config.database, {
  useNewUrlParser: true
});
let db = mongoose.connection;

db.once('open', function () {
  console.log('Connected to Mongodb');
})

db.on('error', function (err) {
  console.log(err);
});

const app = express();


// flash 提示信息
app.use(session({
  secret: config.secret, //随意的字符串
  resave: false,
  saveUninitialized: true
}));

//flash 提示信息 req.flash
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(bodyParser.urlencoded({
  extended: false
}));

// 设置静态资路径
app.use(express.static(path.join(__dirname, 'public')));

//使用登陆验证策略
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// res.locals - express 提供可以定义变量 -- 要放在最上面 --但要放在passport 后面
app.get('*', function (req, res, next) {
  console.log(req.user)
  // 用户判断用户是否登陆
  res.locals.user = req.user || null;
  next();
})

// 获取数据库Model
let Article = require('./models/article');

//设置模板位置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// 使用路由
let articles = require('./routes/articles');
let users = require('./routes/users');

app.use('/articles', articles);
app.use('/users', users);

app.get('/', function (req, res) {
  //传入全部的文章
  Article.find({}, function (err, articles) {
    res.render('articles/index', {
      articles: articles
    });
  });
})

app.listen(5001, function () {
  console.log("Server started on port 5001...");
})