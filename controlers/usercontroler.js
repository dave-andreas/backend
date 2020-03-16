const {mysqldb} = require('../connection')
const db = mysqldb

module.exports = {
    ordering:(req,res)=>{
        const {userid,modelid} = req.query
        var sql = `select m.*, k.name as kategori from models m join kategori k on m.kategoriid=k.id where m.id=${modelid};`
        db.query(sql,(err,model)=>{
            if (err) return res.status(500).send(err)
            sql = `select * from gmbmodel where modelid=${modelid};`
            db.query(sql,(err,gmbmodel)=>{
                if (err) return res.status(500).send(err)
                sql = `select * from bahan_model bm join bahan b on bm.idbahan=b.id where idmodel=${modelid};`
                db.query(sql,(err,bahan)=>{
                    if (err) return res.status(500).send(err)
                    sql = `select * from bodysize where userid=${userid};`
                    db.query(sql,(err,size)=>{
                        if (err) return res.status(500).send(err)
                        return res.status(200).send({model,gmbmodel,bahan,size})
                    })
                })
            })
        })
    },
    confirm:(req,res)=>{
        const {modelid,bahanid,bodysizeid,userid} = req.query
        var sql = `select m.name, m.harga, k.name as kategori, g.path from models m join kategori k on m.kategoriid=k.id join gmbmodel g on m.id=g.modelid where m.id=${modelid} group by m.id;`
        db.query(sql,(err,model)=>{
            if (err) return res.status(500).send(err)
            sql = `select name, harga from bahan where id=${bahanid};`
            db.query(sql,(err,bahan)=>{
                if (err) return res.status(500).send(err)
                sql = `select * from bodysize where id=${bodysizeid};`
                db.query(sql,(err,bodysize)=>{
                    if (err) return res.status(500).send(err)
                    sql = `select address from userinfo where userid=${userid};`
                    db.query(sql,(err,address)=>{
                        if (err) return res.status(500).send(err)
                        return res.status(200).send({model,bahan,bodysize,address})
                    })
                })
            })
        })
    },
}