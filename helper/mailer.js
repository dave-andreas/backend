const nodemailer=require('nodemailer')

const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'daroytak@gmail.com',
        pass:'pjspztmivvlxmrbd'
    },
    tls:{
        rejectUnauthorized:false
    }
})

module.exports=transporter