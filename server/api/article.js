const express = require("express")
const router = express.Router()
const db = require("../db/db.js")
const confirmToken = require("../middlewares/confirmToken")
/**
 *req.query.payload 此方法主要用于接收表单数据
*/
//发表文章
router.post("/api/article", confirmToken, (req, res)=> {
  const article = {
    comment_n: 0,
    title: req.body.title,
    content: req.body.content,
    date: Date(),
    tags: req.body.tags,
    isPublish: true
  }
  new db.Article(article).save();
  res.status(200).send("success in saving new passage.")
})
//获取文章
router.get("/api/article/:aid", (req, res)=> {
  db.Ariticle.findOne({aid: req.params.aid}, (err, doc)=> {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(doc)
    }
  })
})
// 删除文章并删除文章下面的评论
router.delete("/api/acticle/:aid", confirmToken, (req, res)=> {
  db.Article.remove({aid: req.params.aid}, (err, data)=> {
    if (err) {
      console.log(err);
    } else {
      db.Comment.remove({articleId: req.params.aid}, (err, data)=> {
        if (err) {
          console.log(err);
        } else {
          res.status(200).send("success in deleting ===" + data)
        }
      })
    }
  })
})

//更新文章
router.patch("/api/article/:aid", confirmToken, (req, res)=> {
  const aid = req.params.aid;
  const article = {
    title: req.body.title,
    tags: req.body.tags,
    date: Date(),
    content: req.body.content,
    isPublish: true
  }
  db.Article.update({aid: aid}, article, (err, data)=> {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send("success in updating =====" + data)
    }
  })
})
// 获取全部文章
router.get("/api/articles", (req, res)=> {
  const page = req.query.payload.page
  const value = req.query.payload.value
  const limit = req.query.payload.limit - 0 || 4
  const skip = limit * (page - 1)
  if (value && value !== "全部") {
    db.Article.find({tags: value, isPublish: true}).sort({date: -1}).limit(limit).skip(skip).exec().then((articles)=> {
      res.send(articles)
    })
  } else {
    db.Article.find({isPublish: true}).sort({date: -1}).limit(limit).skip(skip).exec().then((articles)=> {
      res.send(articles)
    })
  }
})

// 搜索一些文章
router.get("/api/someArticles", (req, res)=> {
  const key = req.query.payload.key
  const value = req.query.payload.value
  const page = req.query.payload.page || 1
  const skip = 4 * (page - 1)
  const re = new RegExp(value, "i")
  if (key === "tags") {
    const arr = value.split(" ")
    db.Article.find({tags: {$all: arr}}).sort({data: -1}).limit(4).skip(skip).exec().then((articles)=> {
      res.send(articles)
    })
  } else if (key === "date") {
    const nextDay = value + 'T24:00:00'
    db.Article.find({date: {$gte: new Date(value), $lt: new Date(nextDay)}})
      .sort({date: -1}).limit(4).skip(skip).exec()
      .then((articles) => {
        res.send(articles)
      })
  }
})
module.exports = router
