const crypto=require('crypto')

module.exports=(password)=>{
    return crypto.createHmac('sha256','kampungambon').update(password).digest('hex')
}