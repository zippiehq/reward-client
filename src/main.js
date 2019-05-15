const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const bodyParser = require('body-parser')

const reward = require('./reward')

const app = express()

dotenv.config()

const rewardToken = process.env.REWARD_TOKEN
const rewardURI = proces.env.REWARD_URI
const zippieApiKey = process.env.ZIPPIE_API_KEY
const prefix = process.env.SECURE_PREFIX

reward.init(prefix, '', zippieApiKey, rewardURI, rewardToken)

app.use(cors())
app.use(bodyParser.json())

/**
 * @api {post} /reward_user Reward User
 * @apiVersion 0.0.1
 * @apiGroup Reward
 * @apiDescription Allocate Rewards to a User
 * 
 * @apiParam {String} user
 * @apiParam {Number} amount
 * 
 * @apiSuccess (200) {String} ok
 */
app.post('/reward_user', async function(req,res) {
    const user = req.body.user
    const amount = req.body.amount

    await reward.rewardUser(user, amount)

    res.send({status: 'ok'})
})

/**
 * @api {post} /get_user_balance Get User Balance
 * @apiVersion 0.0.1
 * @apiGroup Reward
 * @apiDescription Gets current unclaimed reward balance for a user
 * 
 * @apiParam {String} user
 * 
 * @apiSuccess (200) {Number} user balance
 */
app.post('/get_user_balance', async function(req,res) {
    const user = req.body.user

    const response = await reward.getUserBalance(user)

    res.send(response)
})

/**
 * @api {post} /get_claim_link Get Claim Link
 * @apiVersion 0.0.1
 * @apiGroup Reward
 * @apiDescription Gets a claim link for a user
 * 
 * @apiParam {String} user
 * 
 * @apiSuccess (200) {String} Link for user to claim rewards
 */
app.post('/get_claim_link', async function(req,res) {
    const user = req.body.user

    const link = await reward.getClaimLink(user)

    res.send(link)
})

/**
 * @api {post} /create_referral_code Create Referral Code
 * @apiVersion 0.0.1
 * @apiGroup Reward
 * @apiDescription Create a referral code for a user
 * 
 * @apiParam {String} user
 * 
 * @apiSuccess (200) {String} unique referral code
 */
app.post('/create_referral_code', async function(req,res) {
    const user = req.body.user

    const code = await reward.createReferralCode(user)

    res.send(code)
})

/**
 * @api {post} /set_user_key_value Set User Key Value
 * @apiVersion 0.0.1
 * @apiGroup Reward
 * @apiDescription sets a key value pair for a user
 * 
 * @apiParam {String} user
 * @apiParam {String} key
 * @apiParam {String} value
 * 
 * @apiSuccess (200) {String} ok
 */
app.post('/set_user_key_value', async function(req,res) {
    const user = req.body.user
    const key = req.body.key
    const value = req.body.value

    const response = await reward.setUserKeyValue(user, key, value)

    res.send(response)
})


// Start express server
const port = process.env.PORT || 8080
const server = app.listen(port, '0.0.0.0', function() {
    console.log('app listening at http://%s:%s', server.address().address, server.address().port)
})