const expect = require('chai').expect
const axios = require('axios')

const serviceUrl = 'http://localhost:8080'
const authKey = 'mykey'

async function postJson(url, json) {
    const response = await axios.post(
        url,
        json,
        { headers: { 'Content-Type': 'application/json;charset=UTF-8' }}
    )
    return response.data
}

describe('Reward Client Tests', function () {

    this.timeout(5000)

    it('get_user_reference', async function() {
        const response = await postJson(serviceUrl + '/get_user_reference',
        {user: 'exampleuser@gmail.com', authKey})

        console.log(response)
    })

    it('reward_user', async function() {
        const response = await postJson(serviceUrl + '/reward_user',
        {user: 'exampleuser@gmail.com', amount: '50', authKey})

        console.log(response)
    })

    it('get_user_balance', async function() {
        const response = await postJson(serviceUrl + '/get_user_balance',
        {user: 'exampleuser@gmail.com', authKey})

        console.log(response)
    })

    it('queue_pending_reward', async function() {
        const expiry = new Date()
        const response = await postJson(serviceUrl + '/queue_pending_reward',
        {user: 'example@gmail.com', authKey, amount:'50', message:'test pending', expiry: expiry.toUTCString()})
        console.log(response)
    })

    it('list_pending_rewards', async function() {
        const response = await postJson(serviceUrl + '/list_pending_rewards',
        {user: 'example@gmail.com', authKey})
        console.log(response)
    })

    it('release_pending_reward', async function() {
        const response = await postJson(serviceUrl + '/release_pending_reward',
        {user: 'example@gmail.com', reward_id: ''})
    })

})