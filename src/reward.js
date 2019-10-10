const reward = require('@zippie/zippie-utils/src/reward')

let rewardTokenAddress = ''
const claimBaseUrl = 'https://customer.zippierewards.org/#/'

function init(prefix, privatekey, apikey, uri, rewardtoken) {
    rewardTokenAddress = rewardtoken
    reward.init(prefix, privatekey, apikey, uri)
}

function getUserReference(user) {
    const userRef = reward.getUserReference(user)

    return userRef
}

async function rewardUser(user, amount, message) {
    const userRef = reward.getUserReference(user)

    const response = await reward.rewardTo(userRef,rewardTokenAddress, amount, message)

    return response
}

async function rewardUserReference(userRef, amount) {
    const response = await reward.rewardTo(userRef,rewardTokenAddress, amount)

    return response
}

async function getUserBalance(user) {
    const userRef = reward.getUserReference(user)

    const response = await reward.getUserBalance(userRef, rewardTokenAddress)

    return response
}

async function getClaimLink(user) {
    const userRef = reward.getUserReference(user)

    return claimBaseUrl + userRef + '/' + rewardTokenAddress
}

async function createReferralCode(user) {
    const userRef = reward.getUserReference(user)

    const response = await reward.createReferralCode(userRef)

    return response
}

async function getUserRefFromReferralCode(code) {
    const userRef = await reward.getUserIdFromReferralCode(code)

    return userRef
}

async function setUserKeyValue(user, key, value) {
    const userRef = reward.getUserReference(user)

    const response = await reward.setUserKeyValue(userRef, key, value)

    return response
}


async function getUserKeyValue(user, key) {
    const userRef = reward.getUserReference(user)

    const response = await reward.getUserKey(userRef, key)

    return response
}

async function queuePendingReward(user, amount, expiry, message) {
    const userRef = reward.getUserReference(user)

    const response = await reward.queuePendingReward(userRef, amount, rewardTokenAddress, message, expiry)
    return response
}

async function getPendingRewards(user) {
    const userRef = reward.getUserReference(user)
    const response = await reward.getPendingRewards(userRef, rewardTokenAddress)

    return response
}

async function releasePendingReward(user, rewardId) {
    const userRef = reward.getUserReference(user)

    const response = await reward.releasePendingReward(userRef, rewardId)
    return response
}

async function cancelPendingReward(user, rewardId) {
    const userRef = reward.getUserReference(user)

    const response = await reward.cancelPendingReward(userRef, rewardId)
    return response
} 

async function sendEvent(jsonData) {
    const response = await reward.sendEvent(jsonData)
    return response
}

module.exports = {
    init,
    getUserReference,
    rewardUser,
    rewardUserReference,
    getUserBalance,
    getClaimLink,
    createReferralCode,
    getUserRefFromReferralCode,
    setUserKeyValue,
    getUserKeyValue,
    queuePendingReward,
    releasePendingReward,
    getPendingRewards,
    cancelPendingReward,
    sendEvent
}