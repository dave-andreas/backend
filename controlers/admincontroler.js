const crypto=require('../helper/crypto')
const {mysqldb}=require('../connection')
const transporter=require('../helper/mailer')

module.exports={
    getmod:(req,res)=>{
        var sql='select m.*, gm.path from models m join gmbmodel gm on m.id=gm.modelid group by gm.modelid;'
        mysqldb.query(sql,(err,result)=>{
            if(err) return res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
    getgmb:(req,res)=>{
        const {id} = req.params
        var sql = `select path from gmbmodel where modelid=${id}`
        mysqldb.query(sql,(err,result)=>{
            if(err) return res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
    addmod:(req,res)=>{
        var {name,desc,harga,kategoriid} = req.body
        var sql=`select * from models where name='${name}'`
        mysqldb.query(sql,(err,result)=>{
            if(err) return res.status(500).send(err)
            if(result.length>0){
                return res.status(200).send({message:'sudah ada model dengan nama yang sama'})
            }else{
                var datamodel={name,desc,harga,kategoriid}
                sql='insert into models set ?'
                mysqldb.query(sql,datamodel,(err1,result1)=>{
                    if(err1) return res.status(500).send(err1)
                    sql='select * from models'
                    mysqldb.query(sql,(err2,result2)=>{
                        if(err2) return res.status(500).send(err2)
                        return res.status(200).send(result2)
                    })
                })
            }
        })
    }
}