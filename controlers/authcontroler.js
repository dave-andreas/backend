const crypto=require('../helper/crypto')
const {mysqldb}=require('../connection')
const fs=require('fs')
const {uploader}=require('../helper/uploader')
const transporter=require('../helper/mailer')
const {createJWTToken,createJWTTokenemail}=require('../helper/jwt')

module.exports={
    login:(req,res)=>{
        const {username,password}=req.query
        const encryptpass=crypto(password)
        var sql=`select u.*, r.role from users u join role r on u.roleid=r.id where u.username='${username}' and password='${encryptpass}'`
        mysqldb.query(sql,(err,datauser)=>{
            if (err) return res.status(500).send(err)
            if (datauser.length===0){
                return res.status(200).send({status:'error',error:'username or password incorect'})
            }
            // console.log(datauser[0].email)
            return res.send({datauser})
        })
    },
    datausers:(req,res)=>{
        mysqldb.query('select * from users',(err,result)=>{
            return res.send((result))
        })
    },
    getuser:(req,res)=>{
        const {id}=req.params
        var sql=`select u.*, r.role from users u join role r on u.roleid=r.id where u.id='${id}'`
        mysqldb.query(sql,(err,datauser)=>{
            if(err) res.status(500).send(err)
            // console.log('masok')
            return res.send({datauser})
        })
    },
    register:(req,res)=>{
        var {username,password,email}=req.body
        // console.log(username)
        password=crypto(password)
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
                    // console.log(result1)
                    if(err1) return res.status(500).send({status:'error',err:err1})
                    sql=`select * from users where id='${result1.insertId}'`
                    mysqldb.query(sql,(err2,result2)=>{
                        if(err2) return res.status(500).send({status:'error',err:err2})
                        // console.log(result2[0].id,result2[0].username)
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
                            return res.status(200).send(result2[0])
                        })
                    })
                })
            }
        })
    },
    verified:(req,res)=>{
        var {username,password} = req.body
        // const encryptpass=crypto(password)
        // console.log(username,password)
        var sql = `update users set status='verified' where username='${username}' and password='${password}'`
        mysqldb.query(sql,(err,result)=>{
            if(err) return res.status(500).send({status:'error',err:err})
            sql = `select u.*, r.role from users u join role r on u.roleid=r.id where u.username='${username}' and password='${password}'`
            mysqldb.query(sql,(err2,result2)=>{
                if(err2) return res.status(500).send({status:'error',err:err2})
                // console.log(result2[0])
                return res.status(200).send(result2[0])
            })
        })
    },
    encrypt:(req,res)=>{
        var {pass}=req.params
        var encryptpass=crypto(pass)
        return res.send({encryptpass,pass})
    },
    editinfo:(req,res)=>{
        var {userid,fullname,usia,gender,phone,address}=req.body
        var sql = `select * from userinfo where userid=${userid}`
        mysqldb.query(sql,(err,result)=>{
            if(err) res.status(500).send({err})
            if(result.length){
                sql=`update userinfo set fullname='${fullname}', usia='${usia}', gender='${gender}', phone='${phone}', address='${address}' where userid=${userid}`
                mysqldb.query(sql,(err1,result1)=>{
                    if(err1) return res.status(500).send(err1)
                    sql=`select * from userinfo where userid=${userid}`
                    mysqldb.query(sql,(err2,result2)=>{
                        if(err2) return res.status(500).send(err2)
                        return res.status(200).send(result2[0])
                    })
                })
            }else{
                var userinfo={userid,fullname,usia,gender,phone,address}
                sql='insert into userinfo set ?'
                mysqldb.query(sql,userinfo,(err1,result1)=>{
                    if(err1) return res.status(500).send(err1)
                    sql=`select * from userinfo where id=${result1.insertId}`
                    mysqldb.query(sql,(err2,result2)=>{
                        if(err2) return res.status(500).send(err2)
                        return res.status(200).send(result2[0])
                    })
                })
            }
        })
    },
    getinfo:(req,res)=>{
        const {id}=req.params
        var sql=`select * from userinfo where userid=${id}`
        mysqldb.query(sql,(err,result)=>{
            if(err) res.status(500).send(err)
            return res.send(result[0])
        })
    },

    // ======================= coba ===================================

    postUsers:(req,res)=>{
        try {
            console.log(req.user)
            const path = '/users/images'; //file save path
            const upload = uploader(path, 'USERS').fields([{ name: 'image'}]); //uploader(path, 'default prefix')
    
            upload(req, res, (err) => {
                if(err){
                    return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                }
                //foto baru telah terupload
                console.log('masuk')
                const { image } = req.files;
                console.log(image)
                const imagePath = image ? path + '/' + image[0].filename : null;
                console.log(imagePath)
    
                console.log(req.body.data)
                const data = JSON.parse(req.body.data);
                console.log(data)
                data.image = imagePath;
                data.password= cryptogenerate(data.password)

                // data.userId=req.user.userid
    
                var sql = 'INSERT INTO users SET ?';
                mysqldb.query(sql, data, (err, results) => {
                    if(err) {
                        console.log(err.message)
                        fs.unlinkSync('./public' + imagePath);
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }
                   
                    console.log(results);
                    mysqldb.query(`select u.*,r.nama as rolename from users u left join roles r on u.roleid=r.id order by u.id`,(err,result4)=>{
                        if (err) res.status(500).send(err)
                        mysqldb.query('select * from roles',(err,result5)=>{
                            if (err) res.status(500).send(err)
                            res.status(200).send({datauser:result4,datarole:result5})
                        })
                    })   
                })    
            })
        } catch(err) {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        }
    }
}

