var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')

const weatherApp = require('../src/weatherApp')
var { Todo } = require('./models/todo')
var { User } = require('./models/user')

const port = process.env.PORT || 8000

var app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/weather', (req, res) => {
  const address = weatherApp.address
  const weather = weatherApp.weather
  res.send(`Your current address is: ${address} and ${weather}`)
})

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  })

  todo.save().then(
    doc => {
      res.send(doc)
    },
    e => {
      res.status(400).send(e)
    }
  )
})

app.post('/user', (req, res) => {
  var user = new User({
    email: req.body.email
  })

  user.save().then(
    doc => {
      res.send(doc)
    },
    e => {
      res.status(400).send(e)
    }
  )
})

app.listen(port, () => {
  console.log(`Started on port ${port}`)
})

module.exports = { app }
