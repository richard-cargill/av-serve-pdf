// Packages
const micro = require('micro')
const test = require('ava')
const listen = require('test-listen')
const request = require('request-promise')
const {Base64} = require('js-base64')

// Service
const service = require('../src')

require('dotenv').config()

test('Endpoint authenticates with basic auth', async t => {
  const microInstance = micro(service)
  const url = await listen(microInstance)
  const password = Base64.encode('user:' + process.env.password)

  const response = await request({
    uri: url,
    method: 'POST',
    headers: { 'Authorization': `Basic ${password}` },
    resolveWithFullResponse: true
  })

  t.deepEqual(response.body, 'Success')
})

test('Endpoint returns 401 if password is wrong', async t => {
  const microInstance = micro(service)
  const url = await listen(microInstance)
  const password = Base64.encode('user:incorrectpassword')

  const response = await t.throws(request({
    uri: url,
    method: 'POST',
    headers: { 'Authorization': `Basic ${password}` },
    resolveWithFullResponse: true
  }))

  t.is(response.statusCode, 401)
})

test('Endpoint returns 405 if method is not post', async t => {
  const microInstance = micro(service)
  const url = await listen(microInstance)
  const response = await t.throws(request(url))

  t.is(response.statusCode, 405)
})
