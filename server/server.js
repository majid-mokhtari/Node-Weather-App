require('./config/config')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { ObjectID } = require('mongodb')
const _ = require('lodash')

const { mongoose } = require('./db/mongoose')
const weatherApp = require('../src/weatherApp')
const { Todo } = require('./models/todo')
const { User } = require('./models/user')
var { authenticate } = require('./middleware/authenticate')

const port = process.env.PORT

const app = express()
const corsOptions = {
  exposedHeaders: 'token'
}

app.use(cors(corsOptions))
app.use(bodyParser.json())

app.get('/weather', (req, res) => {
  const address = weatherApp.address
  const weather = weatherApp.weather
  res.send(`Your current address is: ${address} and ${weather}`)
})

// Users routes
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user)
})

app.post('/users/signup', (req, res) => {
  var body = _.pick(req.body, ['email', 'password'])
  var user = new User(body)

  User.findOne({ email: body.email })
    .then(u => {
      if (u) {
        return Promise.reject('Email already exists!')
      } else {
        user
          .save()
          .then(() => {
            return user.generateAuthToken(body.email)
          })
          .then(token => {
            res.header('token', token).send(user)
          })
          .catch(err => {
            res.status(400).send({ err })
          })
      }
    })
    .catch(err => {
      res.status(400).send({ err })
    })
})

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password'])

  User.findByCredentials(body.email, body.password)
    .then(user => {
      return user.generateAuthToken().then(token => {
        res.header('token', token).send(user)
      })
    })
    .catch(err => {
      res.status(400).send({ err })
    })
})

app.delete('/users/logout', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(
    () => {
      res.status(200).send()
    },
    () => {
      res.status(400).send()
    }
  )
})

// Todos routes
app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then(
    todos => {
      res.send({ todos })
    },
    e => {
      res.status(400).send(e)
    }
  )
})

app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  })
    .then(todo => {
      if (!todo) {
        return res.status(404).send()
      }

      res.send({ todo })
    })
    .catch(e => {
      res.status(400).send()
    })
})

app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
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

app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id
  var body = _.pick(req.body, ['text', 'completed'])

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime()
  } else {
    body.completed = false
    body.completedAt = null
  }

  Todo.findOneAndUpdate(
    { _id: id, _creator: req.user._id },
    { $set: body },
    { new: true }
  )
    .then(todo => {
      if (!todo) {
        return res.status(404).send()
      }

      res.send({ todo })
    })
    .catch(e => {
      res.status(400).send()
    })
})

app.delete('/todos', authenticate, (req, res) => {
  Todo.deleteMany({ _creator: req.user._id }).then(
    doc => {
      res.send(doc)
    },
    e => {
      res.status(400).send(e)
    }
  )
})

app.delete('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  })
    .then(todo => {
      if (!todo) {
        return res.status(404).send()
      }

      res.send({ todo })
    })
    .catch(e => {
      res.status(400).send()
    })
})

app.listen(port, () => {
  console.log(`Started on port ${port}`)
})

module.exports = { app }
