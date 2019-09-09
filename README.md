# 基于nodejs-express-mongodb 博客demo
* 多博客用户系统的原理
* 后端 Nodejs & Express
* pug 模板引擎
* passport 认证系统
* mongodb
* bower 管理前端
* cookies 操作
* express-messages && express-session && express-validator && connect-flash

## 1. 搭建项目源码

```
$ npm init
$ npm init -y
$ npm install express --save
$ npm install nodemon --save-dev
```
app.js
```javascript
const express = require('express');

const app = express();

app.get('/', function(req, res) {
  res.send('hello world');
})

app.listen(5001, function() {
  console.log("Server started on port 5001...");
})
```

运行命令
nodemon app 

也可以把命令写在 package.json中
npm start 
```
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon app"
  },
```

## 2. pug 模板引擎
app.js

plug中如下等价
```
h1 hello world
<h1>hello world</h1>
```
```javascript
const express = require('express');
const path = require('path');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', function(req, res) {
  let articles = [
    {
      id: 1,
      title: 'Title One',
      author: 'hfpp2012'
    },
    {
      id: 2,
      title: 'Title Two',
      author: 'hfpp2012'
    },
    {
      id: 3,
      title: 'Title Three',
      author: 'hfpp2012'
    }
  ]
  res.render('index', {
    articles: articles
  });
})

app.get('/articles/new', function(req, res) {
  res.render('new', {
    title: 'Add Article'
  });
})

app.listen(5001, function() {
  console.log("Server started on port 5001...");
```

views/layout.pug
```html
doctype html
html(lang="en")
  head
  body
    block content
    br
    hr
    footer
      p Copyright &copy; 2018
```

views/index.pug
```
extends layout

block content
  ul
    each article, i in articles
      li= article.title
```

views/new.pug  -- 模版中取出变量
```
extends layout

block content
  h1 #{title}
```

设置模版引擎和目录
```

//设置模板位置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

```

## 3. MongoDB 的安装与使用

### 使用 brew 安装
此外你还可以使用 OSX 的 brew 来安装 mongodb：<br/>
brew install mongodb<br/>
如果要安装支持 TLS/SSL 命令如下：<br/>
brew install mongodb --with-openssl<br/>
安装最新开发版本：<br/>
brew install mongodb --devel

### 运行 MongoDB
1. 首先我们创建一个数据库存储目录 /data/db：
sudo mkdir -p /data/db

2. 启动 mongodb，默认数据库目录即为 /data/db：
sudo mongod


* 如果没有创建全局路径 PATH，需要进入以下目录
cd /usr/local/mongodb/bin
sudo ./mongod

### 再打开一个终端进入执行以下命令：
```
$ cd /usr/local/mongodb/bin 
$ ./mongo
MongoDB shell version v4.0.9
connecting to: mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("3c12bf4f-695c-48b2-b160-8420110ccdcf") }
MongoDB server version: 4.0.9
……
> 1 + 1
2
> 

```

```
$ mongo
$ show dbs;
$ use nodejs-blog
$ db.createCollection('articles')
$ show collections;
$ db.articles.insert({ title: "Article One", author: "rails365", body: "This is article one" });
$ db.articles.find();
$ db.articles.insert({ title: "Article Two", author: "rails365", body: "This is article two" });
$ db.articles.find().pretty();

```

### 启动
brew services start mongodb

### 进入mongodb 服务器
```
mongo
```
### 查看有什么数据库
show dbs

### 创建自己的数据库
```
use nodejs-blog  -切换到数据库 nodejs-blog
```
### 创建表存放博客
```
 db.createCollection('articles')
```
### 相关操作
1. 查看数据库中有什么表
```
show collections;
```

2. 给表添加记录
```
db.articles.insert({ title: "Article One", author: "Mark", body: "This is article one" });
```

3. 查询表的内容
```
db.articles.find();
```

4. 格式更好看
```
db.articles.find().pretty();
```