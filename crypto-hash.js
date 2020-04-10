const crypto = require('crypto')

const cryptoHash = (...inputs) => {
    const hash = crypto.createHash('sha256')

    hash.update(inputs.sort().join(' ')) // used to update the hash with new input and creates new sha256 hash

    return hash.digest('hex')
}

module.exports = cryptoHash