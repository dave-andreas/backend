const mysql = require('mysql')

// const db=mysql.createConnection({
//     host:'localhost',
//     user:'david',
//     password:'!2#)9*RoY',
//     database:'jahitin',
//     port:'3306'
// })

const db = mysql.createConnection ({
    host:'db4free.net',
    user:'davroy',
    password:'pew4955JHStU@Nz',
    database:'deploy1st',
    port:'3306'
})
//693wxV#qEnu9nwTc

// const db = mysql.createConnection ({
//     host:'remotemysql.com',
//     user:'CpHSLtzqVx',
//     password:'erGLrDIToX',
//     database:'CpHSLtzqVx',
//     port:'3306'
// })

module.exports=db