'use strict'

const fetch = require('node-fetch')
const moment = require('moment')
const cache = require('memory-cache')

const URL = 'https://api.meetup.com/Hamburg-AngularJS-Meetup/events?photo-host=public&page=1&sig_id=195379857&status=upcoming&sig=a9872ee1923a5237a19da19d196f588e0ebcc5ac'

const CACHE_TTL = 1000 * 60 * 60

const ensure200 = res => {
  if (res.status !== 200) {
    throw new Error(`Unable to get next meetup from Meetup API: ${res.status} - ${res.statusText}`)
  }
  return res
}

const formatDate = json => {
  return {
    date: moment(parseInt(json[0].time))
      .format('MMMM DD, YYYY')
  }
}

module.exports = () => {
  let nextMeetup = cache.get('next-meetup')
  if (nextMeetup) {
    return Promise.resolve(nextMeetup)
  }
  return fetch(URL)
    .then(res => ensure200(res))
    .then(res => res.json())
    .then(json => {
      nextMeetup = formatDate(json)
      cache.put('next-meetup', nextMeetup, CACHE_TTL)
      return Promise.resolve(nextMeetup)
    })
}
