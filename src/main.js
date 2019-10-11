const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const bodyParser = require('body-parser')

const reward = require('./reward')

const app = express()

dotenv.config()

const rewardToken = process.env.REWARD_TOKEN
const rewardURI = process.env.REWARD_URI
const zippieApiKey = process.env.ZIPPIE_API_KEY
const prefix = process.env.SECURE_PREFIX

const authenicationKey = process.env.AUTH_KEY

reward.init(prefix, '', zippieApiKey, rewardURI, rewardToken)

app.use(cors())
app.use(bodyParser.json())

/**
 * @api {post} /get_user_reference Get User Reference
 * @apiVersion 0.0.1
 * @apiGroup Reward
 * 
 * @apiParam {String} authKey internal authenication key
 */
app.post('/get_user_reference', async function(req,res) {
    const user = req.body.user
    const authKey = req.body.authKey

    if(!user || !authKey) {
        res.code = 400
        res.send('Missing Parameters')
        return
    }
    
    if(authenicationKey === authKey) {
        const userRef = reward.getUserReference(user)

        res.send(userRef)
    } else {
        res.statusCode = 401
        res.send("Not Authorised")
    }
})

/**
 * @api {post} /reward_user Reward User
 * @apiVersion 0.0.1
 * @apiGroup Reward
 * @apiDescription Allocate Rewards to a User
 * 
 * @apiParam {String} user
 * @apiParam {Number} amount
 * @apiParam {String} authKey internal authenication key
 * 
 * @apiSuccess (200) {String} ok
 */
app.post('/reward_user', async function(req,res) {
    const user = req.body.user
    const amount = req.body.amount
    const authKey = req.body.authKey

    if(!user || !amount || !authKey) {
        res.code = 400
        res.send('Missing Parameters')
        return
    }

    if(authenicationKey === authKey) {
        await reward.rewardUser(user, amount)

        res.send({status: 'ok'})
    } else {
        res.statusCode = 401
        res.send("Not Authorised")
    }
})

/**
 * @api {post} /reward_user_reference Reward User Reference
 * @apiVersion 0.0.1
 * @apiGroup Reward
 * @apiDescription Allocate Rewards to a User Reference
 * 
 * @apiParam {String} userRef
 * @apiParam {Number} amount
 * @apiParam {String} authKey internal authenication key
 * 
 * @apiSuccess (200) {String} ok
 */
app.post('/reward_user_reference', async function(req,res) {
    const userRef = req.body.userRef
    const amount = req.body.amount
    const authKey = req.body.authKey

    if(!userRef || !amount || !authKey) {
        res.code = 400
        res.send('Missing Parameters')
        return
    }

    if(authenicationKey === authKey) {
        await reward.rewardUserReference(userRef, amount)

        res.send({status: 'ok'})
    } else {
        res.statusCode = 401
        res.send("Not Authorised")
    }
})

/**
 * @api {post} /get_user_balance Get User Balance
 * @apiVersion 0.0.1
 * @apiGroup Reward
 * @apiDescription Gets current unclaimed reward balance for a user
 * 
 * @apiParam {String} user
 * @apiParam {String} authKey internal authenication key
 * 
 * @apiSuccess (200) {Number} user balance
 */
app.post('/get_user_balance', async function(req,res) {
    const user = req.body.user
    const authKey = req.body.authKey

    if(!user || !authKey) {
        res.code = 400
        res.send('Missing Parameters')
        return
    }

    if(authenicationKey === authKey) {
    const response = await reward.getUserBalance(user)

    res.send(response)
    } else {
        res.statusCode = 401
        res.send("Not Authorised")
    }
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
 * @apiParam {String} authKey internal authenication key
 * 
 * @apiSuccess (200) {String} ok
 */
app.post('/set_user_key_value', async function(req,res) {
    const user = req.body.user
    const key = req.body.key
    const value = req.body.value
    const authKey = req.body.authKey

    if(!user || !key || !value || !authKey) {
        res.code = 400
        res.send('Missing Parameters')
        return
    }

    if(authenicationKey === authKey) {
        const response = await reward.setUserKeyValue(user, key, value)

        res.send(response)
    } else {
        res.statusCode = 401
        res.send("Not Authorised")
    }
})

/**
 * @api {post} /get_user_key_value Get User Key Value
 * @apiVersion 0.0.1
 * @apiGroup Reward
 * @apiDescription 
 * 
 * @apiParam {String} user
 * @apiParam {String} key
 * @apiParam {String} authKey internal authenication key
 */
app.post('/get_user_key_value', async function(req, res) {
    const user = req.body.user
    const key = req.body.key
    const authKey = req.body.authKey

    if(!user || !key || !authKey) {
        res.code = 400
        res.send('Missing Parameters')
        return
    }

    if(authenicationKey === authKey) {
        const value = reward.getUserKeyValue(user, key)
        res.send(value)

    } else {
        res.statusCode = 401
        res.send("Not Authorised")
    }
})

/**
 * @api {post} /get_user_reference_from_referral_code Get User Reference from Referral Code
 * @apiVersion 0.0.1
 * @apiGroup Reward
 * 
 * @apiParam {String} referralCode
 * @apiParam {String} authKey internal authenication key
 */
app.post('/get_user_reference_from_referral_code', async function(req, res) {
    const referral = req.body.referralCode
    const authKey = req.body.authKey

    if(!referral || !authKey) {
        res.code = 400
        res.send('Missing Parameters')
        return
    }

    if(authenicationKey === authKey) {
        const userRef = await reward.getUserRefFromReferralCode(referral)
        res.send(userRef)

    } else {
        res.statusCode = 401
        res.send("Not Authorised")
    }
})

/**
 * @api {post} /queue_pending_reward Queue Pending Reward
 * @apiVersion 1.1.0
 * @apiGroup Conditional Rewards
 * 
 * @apiParam {String} user
 * @apiParam {Number} amount
 * @apiParam {Date} expiry
 * @apiParam {String} message
 * @apiParam {String} authKey internal authenication key
 */
app.post('/queue_pending_reward', async function(req,res) {
    const authKey = req.body.authKey

    const user = req.body.user
    const amount = req.body.amount
    const expiry = req.body.expiry
    const message = req.body.message

    if(!user || !amount || !expiry || !message || !authKey) {
        res.code = 400
        res.send('Missing Parameters')
        return
    }

    if(authenicationKey === authKey) {
        const response = await reward.queuePendingReward(user, amount, expiry, message)
        res.send(response)

    } else {
        res.statusCode = 401
        res.send("Not Authorised")
    }
})

/**
 * @api {post} /list_pending_rewards List Pending Rewards
 * @apiVersion 1.1.0
 * @apiGroup Conditional Rewards
 * 
 * @apiParam {String} user
 * @apiParam {String} authKey internal authenication key
 */
app.post('/list_pending_rewards', async function(req,res) {
    const authKey = req.body.authKey
    const user = req.body.user

    if(!user || !authKey) {
        res.code = 400
        res.send('Missing Parameters')
        return
    }

    if(authenicationKey === authKey) {
        const response = await reward.getPendingRewards(user)
        res.send(response)
    } else {
        res.statusCode = 401
        res.send("Not Authorised")
    }
})

/**
 * @api {post} /release_pending_reward Release Pending Reward
 * @apiVersion 1.1.0
 * @apiGroup Conditional Rewards
 * 
 * @apiParam {String} user
 * @apiParam {String} reward_id
 * @apiParam {String} authKey internal authenication key
 */
app.post('/release_pending_reward', async function(req,res) {
    const authKey = req.body.authKey
    const user = req.body.user
    const rewardId = req.body.reward_id

    if(!user || !rewardId || !authKey) {
        res.code = 400
        res.send('Missing Parameters')
        return
    }

    if(authenicationKey === authKey) {
        const response = await reward.releasePendingReward(user, rewardId)
        res.send(response)
    } else {
        res.statusCode = 401
        res.send("Not Authorised")
    }
})

/**
 * @api {post} /cancel_pending_reward Cancel Pending Reward
 * @apiVersion 1.1.0
 * @apiGroup Conditional Rewards
 * 
 * @apiParam {String} user
 * @apiParam {String} reward_id
 * @apiParam {String} authKey internal authenication key
 */
app.post('/cancel_pending_reward', async function(req, res) {
    const authKey = req.body.authKey
    const user = req.body.user
    const rewardId = req.body.reward_id

    if(!user || !rewardId || authKey) {
        res.code = 400
        res.send('Missing Parameters')
        return
    }

    if(authenicationKey === authKey) {
        const response = await reward.cancelPendingReward(user, rewardId)
        res.send(response)
    } else {
        res.statusCode = 401
        res.send("Not Authorised")
    }
})

/**
 * @api {post} /send_event Send Event
 * @apiVersion 1.1.0
 * @apiGroup Events
 * 
 * @apiParam {JSON} data
 * @apiParam {String} authKey internal authenication key
 */
app.post('/send_event', async function(req,res) {
    const authKey = req.body.authKey
    const data = req.body.data

    if(!data || !authKey) {
        res.code = 400
        res.send('Missing Parameters')
        return
    }

    if(authenicationKey === authKey) {
        const response = await reward.sendEvent(data)
        res.send(response)
    } else {
        res.statusCode = 401
        res.send("Not Authorised")
    }
})

app.get('/', function(req,res) {
    res.send({status: 'ok', version: '1.1.0'})
})

app.get('/health', function(req, res) {
  res.send(JSON.stringify({ notdead: true }))
})

// Start express server
const port = process.env.PORT || 8080
const server = app.listen(port, '0.0.0.0', function() {
    console.log('app listening at http://%s:%s', server.address().address, server.address().port)
    console.log({rewardToken, rewardURI, authenicationKey})
})
