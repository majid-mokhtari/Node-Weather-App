const express = require('express');
const router = new express.Router();
const { User } = require('../models/user');
var { authenticate } = require('../middleware/authenticate');
const _ = require('lodash');

router.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

router.post('/users/signup', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  User.findOne({ email: body.email })
    .then(u => {
      if (u) {
        return Promise.reject('Email already exists!');
      } else {
        user
          .save()
          .then(() => {
            return user.generateAuthToken(body.email);
          })
          .then(token => {
            res.header('token', token).send(user);
          })
          .catch(err => {
            res.status(400).send({ err });
          });
      }
    })
    .catch(err => {
      res.status(400).send({ err });
    });
});

router.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password)
    .then(user => {
      return user.generateAuthToken().then(token => {
        res.header('token', token).send(user);
      });
    })
    .catch(err => {
      res.status(400).send({ err });
    });
});

router.delete('/users/logout', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(
    () => {
      res.status(200).send();
    },
    () => {
      res.status(400).send();
    }
  );
});

module.exports = router;
