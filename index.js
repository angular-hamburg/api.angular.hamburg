'use strict'

const express = require('express')
const cors = require('cors')
const nextMeetup = require('./next-meetup')

express()
  .use(cors({ origin: '*' }))
  .get('/next-meetup', (req, res) => {
    nextMeetup()
      .then(next => res.json(next))
      .catch(err => res.status(500).send(err.message))
  })
  .listen(80)
