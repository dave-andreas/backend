// const crypto=require('../helper/encrypt')
const {mysqldb}=require('../connection')
const fs=require('fs')
const transporter=require('../helper/mailer')
const {createJWTToken,createJWTTokenemail}=require('../helper/jwt')

module.exports={
    login:(req,res)=>{
        const{username,password}=req.query
        var sql=`select u.*, r.role from users u join role r on u.roleid=r.id where u.username='${username}' and password='${password}'`
        mysqldb.query(sql,(err,datauser)=>{
            if (err) res.status(500).send(err)
            if (datauser.length===0){
                return res.status(200).send({status:'error',error:'username or password incorect'})
            }
            console.log(datauser[0].email)
            return res.send({datauser})
        })
    },
    datausers:(req,res)=>{
        mysqldb.query('select * from users',(err,result)=>{
            return res.send((result))
        })
    },
    getuser:(req,res)=>{
        const{id}=req.params
        var sql=`select u.*, r.role from users u join role r on u.roleid=r.id where u.id='${id}'`
        mysqldb.query(sql,(err,datauser)=>{
            if(err) res.status(500).send(err)
            console.log('masok')
            return res.send({datauser})
        })
    },
    register:(req,res)=>{
        var {username,password,email}=req.body
        // console.log(username)
        var sql=`select * from users where username='${username}'`
        mysqldb.query(sql,(err,result)=>{
            if (err) return res.status(500).send(err)
            // console.log(res)
            if (result.length>0) {
                return res.status(202).send({status:'error',message:'username has been taken'})
            }else{
                var datauser={
                    username,
                    email,
                    password,
                    roleid:2
                }
                sql='insert into users set ?'
                mysqldb.query(sql,datauser,(err1,result1)=>{
                    console.log(result1.insertId)
                    if(err1) return res.status(500).send({status:'error',err:err1})
                    sql=`select * from users where id='${result1.insertId}'`
                    mysqldb.query(sql,(err2,result2)=>{
                        if(err2) return res.status(500).send({status:'error',err:err2})
                        console.log(result2[0].id,result2[0].username)
                        // var tokenemail = createJWTTokenemail(result2[0].id,result2[0].username)
                        var linkverf = `localhost:3000/verified?username=${result2[0].username}&password=${result2[0].password}`
                        var mailoptions = {
                            from : 'Manusia Paling Kece <daroytak@gmail.com>',
                            to : email,
                            subject : 'Verification jAHiTiN app',
                            html : `Please click link below to complete your registration :
                                    <a href=${linkverf}> ${linkverf} </a>`
                        }
                        transporter.sendMail(mailoptions,(err3,result3)=>{
                            if(err3) return res.status(500).send({status:'error',err:err2})
                            // token = createJWTToken(result2[0].id,result2[0].username)
                            console.log(result2[0])
                            return res.status(200).send(result2[0])
                        })
                    })
                })
            }
        })
    },
    verified:(req,res)=>{
        var {username,password} = req.body
        // console.log(username,password)
        var sql = `update users set status='verified' where username='${username}' and password='${password}'`
        mysqldb.query(sql,(err,result)=>{
            if(err) return res.status(500).send({status:'error',err:err})
            sql = `select * from users where username='${username}' and password='${password}'`
            mysqldb.query(sql,(err2,result2)=>{
                if(err2) return res.status(500).send({status:'error',err:err2})
                // console.log(result2[0])
                return res.status(200).send(result2[0])
            })
        })
    }
    // register:(req,res)=>{
    //     const {username,password,email}=req.body
    //     var encryptpass=hashpassword(password)
    //     var sql=`select * from users where username='${username}' and password='${encryptpass}'`
    //     db.query(sql,(err,results)=>{
    //         if (err) res.status(500).send({status:'error',err})
    //         if(results.length===0){
    //             sql=`insert into users set ?`
    //             var data={
    //                 username,
    //                 password:hashpassword(password),
    //                 roleid:2,
    //                 email,
    //                 verified:0
    //             }
    //             db.query(sql,data,(err,results1)=>{
    //                 if (err) res.status(500).send({status:'error insert',err})
    //                 console.log(results1.insertId)
    //                 sql=`select * from users where id=${results1.insertId}`
    //                 db.query(sql,(err,results2)=>{
    //                     if (err) res.status(500).send({status:'error select',err})
    //                     // email disini
    //                     const tokenemail=createJWTTokenemail({userid:results2[0].id,username:results2[0].username})
    //                     console.log('das')
    //                     var LinkVerifikasi=`http://localhost:3000/verified?token=${tokenemail}`
    //                     var mailoptions={
    //                         from:'hokage <aldinorahman36@gmail.com>',
    //                         to:email,
    //                         subject:`verifikasi Email app bioskop`,
    //                         html:`tolong klik link ini untuk verifikasi :
    //                         <a href=${LinkVerifikasi}>Join apps ini</a>`
    //                     }
    //                     transporter.sendMail(mailoptions,(err2,res2)=>{
    //                         if(err2){
    //                             console.log('das1')
    //                             console.log(err2)
    //                             return res.status(500).send({status:'error',err:err2})
    //                         }
    //                         console.log('das12')
    //                         console.log('berhasil')
    //                         const token=createJWTToken({userid:results2[0].id,username:results2[0].username})
    //                         return res.status(200).send({result:results2[0],token})
    //                     })
    //                 })
    //             })  
    //         }else{
    //             return res.status(500).send({message:'user sudah ada '})
    //         }
    //     })
    // },
    // verifiedemail:(req,res)=>{
    //     const {
    //         userid,
    //         // username
    //     }=req.user
    //     console.log(req.query)
    //     var sql=`select * from users where id=${userid}`
    //     db.query(sql,(err,result)=>{
    //         if (err) res.status(500).send({status:'error select user',err})
    //         if(result.length===1){
    //             sql=`update users set verified=1 where id=${userid}`
    //             db.query(sql,(err,result1)=>{
    //                 if (err) res.status(500).send({status:'error update user',err})
    //                 return res.status(200).send({message:'berhasil update',result:result1})
    //             })
    //         }else{
    //             return res.status(500).send({status:'error user lebih dari satu atau nol',err})
    //         }
    //     })
    // }
}