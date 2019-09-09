const express = require('express');
const passport = require('passport');
const {
  check,
  validationResult
} = require('express-validator/check');
const bcrypt = require('bcrypt');

let User = require('../models/user');

let router = express.Router();

router.get('/register', function (req, res) {
  res.render('users/register');
});

router.post('/register', [
  check('name').isLength({
    min: 1
  }).withMessage('Name is required'),
  check('username').isLength({
    min: 1
  }).withMessage('Username is required'),
  check('email').isLength({
    min: 1
  }).withMessage('Email is required'),
  check('email').isEmail().withMessage('invalid email'),
  check("password", "invalid password")
  .isLength({
    min: 1
  })
  .custom((value, {
    req,
    loc,
    path
  }) => {
    if (value !== req.body.password_confirmation) {
      // trow error if passwords do not match
      throw new Error("Passwords don't match");
    } else {
      return value;
    }
  })
], function (req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.render('users/register', {
      errors: errors.array()
    })
  } else {
    let user = new User(req.body);
    //密码加密
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          console.log(err);
          return;
        }

        user.password = hash;
        //数据保存到数据库
        user.save(function (err) {
          if (err) {
            console.log(err);
            return;
          } else {
            req.flash("success", "You are now registered and can log in");
            res.redirect('/');
          }
        })

      });
    });
  }
})


//登陆页面
router.get('/login', function (req, res) {
  //渲染模板
  res.render('users/login');
});

//登陆请求 -- next 中间件使用
router.post('/login', function (req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true,
    successFlash: 'Welcome!'
  })(req, res, next);

});


router.get('/logout', function (req, res) {
  req.logout();
  req.flash('success', 'you are logged out')
  res.redirect('/users/login');
});
module.exports = router;