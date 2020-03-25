const {mysqldb} = require('../connection')
const db = mysqldb
const multer=require('multer')
const path=require('path')

const queryAsync = query => new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if(err) return reject(err)
      resolve(result)
    })
})

const upload = multer ({
    storage: multer.diskStorage({
        destination: './public/buktibayar',
        filename: function(req,file,cb){
            cb(null,file.fieldname+Date.now()+path.extname(file.originalname))
        }
    }),
    fileFilter: function (req,file,cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        // Check ext
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
        // Check mime
        const mimetype = filetypes.test(file.mimetype)
    
        if(mimetype && extname){
            return cb(null,true)
        } else {
            cb('Error: Images Only!') // bisa jadi caption error
        }
    }
}).single('image')

const ubah = (dest) => {
    var arr = dest.split('\\')
    var newdest = ''
    for (let i = 0; i < arr.length; i++) {
        if ( i === arr.length-1 ) {
            newdest += ( arr[i] )
        } else {
            newdest += ( arr[i] + '/' )
        }
    }
    return newdest
}

module.exports = {
    // ------------------------------------------------ \/\/\/ ordering \/\/\/ ------------------------------------------------
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
    orderingcheck:(req,res)=>{
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
                    return res.status(200).send({model,bahan,bodysize})
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
            // console.log(result)
            if (err) return res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
    // ------------------------------------------------ \/\/\/ crud body size \/\/\/ ------------------------------------------------
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
        var sql = `insert into bodysize set ?`
        db.query(sql,data,(err,result)=>{
            if (err) return res.status(500).send(err)
            sql = `select * from bodysize where userid=${data.userid}`
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
        const data = req.body
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
    // ------------------------------------------------ \/\/\/ cart \/\/\/ ------------------------------------------------
    getcart:(req,res)=>{
        const {id} = req.params
        // var sql = `select * from order_detil where userid=${id}`
        var sql = `select od.id, od.orderid, od.userid, m.name as model, m.harga as mharga, gm.path, b.name as bahan, b.harga as bharga, od.warna, bs.name as size, od.jumlah, od.harga, b.id as bahanid, m.id as modelid 
            from order_detil od 
            join models m on od.modelid=m.id 
            join gmbmodel gm on m.id=gm.modelid
            join bahan b on od.bahanid=b.id
            left join bodysize bs on od.bodysizeid=bs.id
            where od.userid=${id} and od.orderid=0 group by od.id;`
        db.query(sql,(err,cart)=>{
            if (err) return res.status(500).send(err)
            sql = `select address from userinfo where userid=${id};`
            db.query(sql,(err,address)=>{
                if (err) return res.status(500).send(err)
                return res.status(200).send({cart,address})
            })
        })
    },
    delcart:(req,res)=>{
        const {id,userid} = req.query
        var sql = id == 0 ? `delete from order_detil where userid=${userid}` : `delete from order_detil where id=${id}`
        db.query(sql,(err,result)=>{
            if (err) return res.status(500).send(err)
            sql = `select od.id, od.orderid, od.userid, m.name as model, m.harga as mharga, gm.path, b.name as bahan, b.harga as bharga, od.warna, bs.name as size, od.jumlah, od.harga 
                from order_detil od 
                join models m on od.modelid=m.id 
                join gmbmodel gm on m.id=gm.modelid
                join bahan b on od.bahanid=b.id
                left join bodysize bs on od.bodysizeid=bs.id
                where od.userid=${userid} and od.orderid=0 group by od.id;`
            db.query(sql,(err,result)=>{
                if (err) return res.status(500).send(err)
                return res.status(200).send(result)
            })
        })
    },
    checkout:(req,res)=>{
        // var od = req.body
        var {id,userid,harga,alamat,jumlah,bahanid,modelid} = req.query
        var d = new Date()
        var data = {
            userid: userid,
            statusorder: 0,
            buktibayar: '',
            tanggalorder: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`,
            jamorder:`${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`,
            totharga: harga,
            alamat:alamat
        }
        var sql = 'insert into orders set ?'
        db.query(sql,data,(err,result)=>{
            if (err) return res.status(500).send(err)
            sql = id == 0 ? `update order_detil set orderid=${result.insertId} where userid=${userid} and orderid=0` : `update order_detil set orderid=${result.insertId} where id=${id}`
            db.query(sql,(err,result)=>{
                if (err) return res.status(500).send(err)
                sql = `update bahan set stok=stok-${jumlah}, terjual=terjual+${jumlah} where id=${bahanid}`
                db.query(sql,(err,result)=>{
                    if (err) return res.status(500).send(err)
                    sql = `update models set terjual=terjual+${jumlah} where id=${modelid}`
                    db.query(sql,(err,result)=>{
                        if (err) return res.status(500).send(err)
                        sql = `select od.id, od.orderid, od.userid, m.name as model, m.harga as mharga, gm.path, b.name as bahan, b.harga as bharga, od.warna, bs.name as size, od.jumlah, od.harga, b.id as bahanid, m.id as modelid
                            from order_detil od 
                            join models m on od.modelid=m.id 
                            join gmbmodel gm on m.id=gm.modelid
                            join bahan b on od.bahanid=b.id
                            left join bodysize bs on od.bodysizeid=bs.id
                            where od.userid=${userid} and od.orderid=0 group by od.id;`
                        db.query(sql,(err,result)=>{
                            if (err) return res.status(500).send(err)
                            return res.status(200).send(result)
                        })
                    })
                })
            })
        })
    },
    // ------------------------------------------------ \/\/\/ transaksi \/\/\/ ------------------------------------------------
    getbill:(req,res)=>{
        const {id} = req.params
        var sql = `select * from orders where userid=${id}`
        db.query(sql,(err,result)=>{
            if (err) return res.status(500).send(err)
            var arr = []
            result.forEach(val =>{
                arr.push(queryAsync(`select od.id, od.orderid, od.userid, m.name as model, b.name as bahan, od.warna, bs.name as size, od.jumlah
                    from order_detil od
                    join models m on od.modelid=m.id 
                    join bahan b on od.bahanid=b.id 
                    left join bodysize bs on od.bodysizeid=bs.id 
                    where orderid=${val.id} ;`
                ))
            })
            Promise.all(arr)
            .then(arr=>{
                arr.forEach((arr,index)=>{
                    result[index].detil=arr
                })
                return res.status(200).send(result)
            }).catch(err=>{
                console.log(err)
            })
        })
    },
    uplbill:(req,res)=>{
        upload (req,res,(err) => {
            if (err) {
                console.log('nga')
                return res.status(500).send(err)
            } else {
                // console.log('file', req.file)
                // console.log('body', req.body)
                // disini sudah ke upload
                const buktibayar = ubah(req.file.path)
                const {userid,orderid} = req.body
                var d = new Date()
                var tanggalbayar = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
                var jambayar = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
                var sql = `update orders set statusorder=1, tanggalbayar='${tanggalbayar}', jambayar='${jambayar}', buktibayar='${buktibayar}' where id=${orderid}`
                db.query(sql,(err,result)=>{
                    if (err) return res.status(500).send(err)
                    var sql = `select * from orders where userid=${userid}`
                    db.query(sql,(err,result)=>{
                        if (err) return res.status(500).send(err)
                        var arr = []
                        result.forEach(val =>{
                            arr.push(queryAsync(`select od.id, od.orderid, od.userid, m.name as model, b.name as bahan, od.warna, bs.name as size, od.jumlah
                                from order_detil od
                                join models m on od.modelid=m.id 
                                join bahan b on od.bahanid=b.id 
                                left join bodysize bs on od.bodysizeid=bs.id 
                                where orderid=${val.id} ;`
                            ))
                        })
                        Promise.all(arr)
                        .then(arr=>{
                            arr.forEach((arr,index)=>{
                                result[index].detil=arr
                            })
                            return res.status(200).send(result)
                        }).catch(err=>{
                            console.log(err)
                        })
                    })
                })
            }
        })
    },
    finishorder:(req,res)=>{
        const {id,userid} = req.query
        var sql = `select u.username, o.buktibayar, o.tanggalorder, o.tanggalbayar, o.statusorder, o.alamat from orders o join users u on o.userid=u.id where o.id=${id};`
        db.query(sql,(err,order)=>{
            if (err) return res.status(500).send(err)
            sql = `select od.id, m.name as model, m.id as modelid, b.name as bahan, od.warna, od.jumlah, bs.name as size, gm.path 
                from order_detil od
                join models m on od.modelid=m.id
                join gmbmodel gm on gm.modelid=m.id
                join bahan b on od.bahanid=b.id
                left join bodysize bs on od.bodysizeid=bs.id
                where od.orderid=${id} group by od.id;`
            db.query(sql,(err,detil)=>{
                if (err) return res.status(500).send(err)
                sql = `select * from komentar where orderid=${id} and userid=${userid}`
                db.query(sql,(err,komen)=>{
                    if (err) return res.status(500).send(err)
                    return res.status(200).send({order,detil,komen})
                })
            })
        })
    },
    confirm:(req,res)=>{
        const {orderid,statusorder} = req.query
        var sql = `update orders set statusorder=${statusorder} where id=${orderid}`
        mysqldb.query(sql,(err,result)=>{
            if (err) return res.status(500).send(err)
            sql = `select u.username, o.buktibayar, o.tanggalorder, o.tanggalbayar, o.statusorder, o.alamat from orders o join users u on o.userid=u.id where o.id=${orderid};`
            mysqldb.query(sql,(err,order)=>{
                if (err) return res.status(500).send(err)
                sql = `select od.id, m.name as model, m.id as modelid, b.name as bahan, od.warna, od.jumlah, bs.name as size, gm.path 
                    from order_detil od
                    join models m on od.modelid=m.id
                    join gmbmodel gm on gm.modelid=m.id
                    join bahan b on od.bahanid=b.id
                    left join bodysize bs on od.bodysizeid=bs.id
                    where od.orderid=${orderid} group by od.id;`
                mysqldb.query(sql,(err,detil)=>{
                    if (err) return res.status(500).send(err)
                    return res.status(200).send({order,detil})
                })
            })
        })
    },
    addkomen:(req,res)=>{
        const {modelid,userid,orderid,komen} = req.body
        const data = {modelid,userid,orderid,komen}
        var sql = `insert into komentar set ?`
        db.query(sql,data,(err,result)=>{
            if (err) return res.status(500).send(err)
            sql = `select * from komentar where modelid=${modelid} and userid=${userid}`
            db.query(sql,(err,result)=>{
                if (err) return res.status(500).send(err)
                return res.status(200).send(result)
            })
        })
    },
    getmovies:(req,res)=>{
        var sql=`select * from movies`
        db.query(sql,(err,result)=>{
            if (err) res.status(500).send({status:'error',err})
            var arr=[]
            result.forEach(element => {
                arr.push(queryAsync(`select md.id as idmoviesdetail,s.nama as studio,j.jadwal from moviesdetails md join studios s on md.studioid=s.idstudios join jadwal j on  md.jadwalid=j.idjadwal where md.movieid=${element.idmovies}`))
            });
            Promise.all(arr)
            .then(result1=>{
                result1.forEach((element,index)=>{
                    result[index].studiojadwal=element
                    result[index].genre=JSON.parse(result[index].genre)
                })
                sql=`select * from jadwal`
                db.query(sql,(err,result2)=>{
                    if (err) res.status(500).send({status:'error',err})
                    sql=`select * from studios`
                    db.query(sql,(err,studios)=>{
                        if (err) res.status(500).send({status:'error',err})
                        return res.status(200).send({movie:result,jadwal:result2,studios})
                    })
                })
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
    },
    kurang:(req,res)=>{
        const {id,stok} = req.query
        var sql = `update bahan set stok=stok-${stok} where id=${id}`
        db.query(sql,(err,result)=>{
            if (err) return res.status(500).send(err)
            sql = `select * from bahan where id=${id}`
            db.query(sql,(err,result)=>{
                if (err) return res.status(500).send(err)
                return res.status(200).send(result)
            })
        })
    }
}