// Packages
const micro = require('micro')
const test = require('ava')
const listen = require('test-listen')
const fetch = require('node-fetch')
const {Base64} = require('js-base64')

// Service
const service = require('../src')

require('dotenv').config()

test('Endpoint authenticates with basic auth', async t => {
  const microInstance = micro(service)
  const url = await listen(microInstance)
  const password = Base64.encode('user:' + process.env.password)
  const body = await fetch(url, { method: 'POST', headers: { 'Authorization': `Basic ${password}` }}).then( res => res.text())

  t.deepEqual(body, 'Success')
})
