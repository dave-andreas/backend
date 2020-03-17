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
    savecart:(req,res)=>{
        console.log(req.body)
        const {userid,modelid,bahanid,warna,bodysizeid,jumlah,harga} = req.body
        const data = {
            userid,modelid,bahanid,warna,bodysizeid,jumlah,harga,
            orderid:0,
            jadi:0
        }
        var sql = `insert into order_detil set ?`
        db.query(sql,data,(err,result)=>{
            if (err) return res.status(500).send(err)
            return res.status(200).send('Successfully adding to cart')
        })
    },
    // -----------------------------------------------------------
    getboze:(req,res)=>{
        const {id} = req.params
        var sql = `select * from bodysize where userid=${id}`
        db.query(sql,(err,result)=>{
            if (err) return res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
    addboze:(req,res)=>{
        const data = req.body
        var sql = `select into bodysize set ?`
        db.query(sql,(err,result)=>{
            if (err) return res.status(500).send(err)
            sql =  `select * from bodysize where userid=${data.userid}`
            db.query(sql,(err,result)=>{
                if (err) return res.status(500).send(err)
                return res.status(200).send(result)
            })
        })
    },
    delboze:(req,res)=>{
        const {id,userid} = req.query
        var sql = `delete from bodysize where id=${id}`
        db.query(sql,(err,result)=>{
            if (err) return res.status(500).send(err)
            sql = `select * from bodysize where userid=${userid}`
            db.query(sql,(err,result)=>{
                if (err) return res.status(500).send(err)
                return res.status(200).send(result)
            })
        })
    },
    editboze:(req,res)=>{
        const {data} = req.body
        var sql = `update bodysize set name='${data.name}', lingping=${data.lingping}, lingba=${data.lingba}, leda=${data.leda}, tule=${data.tule}, panmu=${data.panmu}, linggul=${data.linggul}, panpung=${data.panpung}, lepun=${data.lepun}, leba=${data.leba}, kele=${data.kele}, panle=${data.panle}, lule=${data.lule} where id=${data.id};`
        db.query(sql,(err,result)=>{
            if (err) return res.status(500).send(err)
            sql = `select * from bodysize where userid=${data.userid}`
            db.query(sql,(err,result)=>{
                if (err) return res.status(500).send(err)
                return res.status(200).send(result)
            })
        })
    },
    // ----------------------- coba ------------------------------
    coba:(req,res)=>{

        var sql = `update bahan_model set idbahan=6 where idmodel=1`
        db.query(sql,(err,result)=>{
            if (err) return res.status(500).send(err)
            return res.status(200).send('Your order have been reported, please wait our admin for the confirmation. Thank you!')
        })
    }
}