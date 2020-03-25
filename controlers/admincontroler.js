const {mysqldb}=require('../connection')
const multer=require('multer')
const path=require('path')

const upload = multer ({
    storage: multer.diskStorage({
        destination: './public/models',
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

module.exports={
    getmodhom:(req,res)=>{
        var sql = `select m.*, gm.path from models m left join gmbmodel gm on m.id=gm.modelid group by m.id order by m.terjual desc limit 7;`
        mysqldb.query(sql,(err,result)=>{
            if(err) return res.status(500).send(err)
            sql = `select m.*, gm.path from models m left join gmbmodel gm on m.id=gm.modelid group by m.id order by m.id desc limit 4;`
            mysqldb.query(sql,(err,result1)=>{
                if(err) return res.status(500).send(err)
                return res.status(200).send({result,result1})
            })
        })
    },
    getmod:(req,res)=>{
        const {cat} = req.params
        var sql = cat == 0 ? 
            'select m.*, gm.path from models m left join gmbmodel gm on m.id=gm.modelid group by m.id order by m.name;'
            : `select m.*, gm.path from models m left join gmbmodel gm on m.id=gm.modelid where kategoriid=${cat} group by m.id order by m.name;` 
        mysqldb.query(sql,(err,result)=>{
            if(err) return res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
    carimod:(req,res)=>{
        const {cari} = req.query
        var sql = `select m.*, gm.path from models m left join gmbmodel gm on m.id=gm.modelid where name like '%${cari}%' group by m.id;`
        mysqldb.query(sql,(err,result)=>{
            if(err) return res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
    getgmb:(req,res)=>{
        const {id} = req.params
        var sql = `update models set dilihat=dilihat+1 where id=${id}`
        mysqldb.query(sql,(err,result)=>{
            if (err) return res.status(500).send(err)
            sql = `select * from gmbmodel where modelid=${id}`
            mysqldb.query(sql,(err,gambar)=>{
                if(err) return res.status(500).send(err)
                sql = `select * from bahan_model bm join bahan b on bm.idbahan=b.id where idmodel=${id};`
                mysqldb.query(sql,(err,bahan)=>{
                    if(err) return res.status(500).send(err)
                    sql = `select k.modelid, k.komen, u.username from komentar k join users u on k.userid=u.id where modelid=${id};`
                    mysqldb.query(sql,(err,komen)=>{
                        if(err) return res.status(500).send(err)
                        return res.status(200).send({gambar,bahan,komen})
                    })
                })
            })    
        })
    },
    addmod:(req,res)=>{
        var {name,desk,harga,kategoriid} = req.body
        var datamodel={name,desk,harga,kategoriid}
        var sql=`select * from models where name='${name}' and kategoriid=${kategoriid}`
        mysqldb.query(sql,(err,result)=>{
            if(err) return res.status(500).send(err)
            if(result.length>0){
                return res.status(200).send({message:`There's already model with same name and category`})
            }else{
                sql='insert into models set ?'
                mysqldb.query(sql,datamodel,(err1,result1)=>{
                    if(err1) return res.status(500).send(err1)
                    sql='select m.*, gm.path from models m left join gmbmodel gm on m.id=gm.modelid group by m.id order by m.name;'
                    mysqldb.query(sql,(err2,result2)=>{
                        if(err2) return res.status(500).send(err2)
                        return res.status(200).send(result2)
                    })
                })
            }
        })
    },
    getkat:(req,res)=>{
        var sql = 'select * from kategori'
        mysqldb.query(sql,(err,result)=>{
            if(err) return res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
    delmod:(req,res)=>{
        const {id} = req.params
        var sql = `delete from models where id=${id}`
        mysqldb.query(sql,(err,result)=>{
            if(err) return res.status(500).send(err)
            sql = `select m.*, gm.path from models m left join gmbmodel gm on m.id=gm.modelid group by m.id order by m.name;`
            mysqldb.query(sql,(err1,result1)=>{
                if(err1) return res.status(500).send(err1)
                return res.status(200).send(result1)
            })
        })
    },
    addgmb:(req,res)=>{
        var {modelid} = req.body
        var data = req.body
        var sql = 'insert into gmbmodel set ?'
        mysqldb.query(sql,data,(err,result)=>{
            if(err) return res.status(500).send(err)
            sql = `select * from gmbmodel where modelid=${modelid}`
            mysqldb.query(sql,(err,result)=>{
                if(err) return res.status(500).send(err)
                return res.status(200).send(result)
            })
        })
    },
    delgmb:(req,res)=>{
        const {id} = req.params
        var sql = `delete from gmbmodel where id=${id}`
        mysqldb.query(sql,(err,result)=>{
            if(err) return res.status(500).send(err)
            // sql = ``
            // mysqldb.query(sql,(err1,result1)=>{
            //     if(err1) return res.status(500).send(err1)
            //     return res.status(200).send(result1)
            // })
        })
    },
    // ==============================================================================================================================
    getfab:(req,res)=>{
        var sql = 'select * from bahan'
        mysqldb.query(sql,(err,result)=>{
            if(err) return res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
    carifab:(req,res)=>{
        const {cari} = req.query
        var sql = `select * from bahan where name like '%${cari}%'`
        mysqldb.query(sql,(err,result)=>{
            if(err) return res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
    addfab:(req,res)=>{
        var {name,harga,stok} = req.body
        var datafab={name,harga,stok}
        var sql = `select * from bahan where name='${name}';`
        mysqldb.query(sql,(err,result)=>{
            if (err) return res.status(500).send(err)
            if (result.length>0){
                return res.status(200).send({message:'This fabric already on the list'})
            }else{
                var sql='insert into bahan set ?'
                mysqldb.query(sql,datafab,(err1,result1)=>{
                    if(err1) return res.status(500).send(err1)
                    sql='select * from bahan'
                    mysqldb.query(sql,(err2,result2)=>{
                        if(err2) return res.status(500).send(err2)
                        return res.status(200).send(result2)
                    })
                })
            }
        })
    },
    editfab:(req,res)=>{
        var {id,name,harga,stok} = req.body
        var sql = `update bahan set name='${name}', harga=${harga}, stok=${stok} where id=${id};`
        mysqldb.query(sql,(err,result)=>{
            if(err) return res.status(500).send(err)
            sql = `select * from bahan;`
            mysqldb.query(sql,(err1,result1)=>{
                if(err1) return res.status(500).send(err1)
                return res.status(200).send(result1)
            })
        })
    },
    delfab:(req,res)=>{
        const {id} = req.params
        var sql = `delete from bahan where id=${id}`
        mysqldb.query(sql,(err,result)=>{
            if(err) return res.status(500).send(err)
            sql = `select * from bahan;`
            mysqldb.query(sql,(err1,result1)=>{
                if(err1) return res.status(500).send(err1)
                return res.status(200).send(result1)
            })
        })
    },
    // ==============================================================================================================================
    getmodetil:(req,res)=>{
        const {id} = req.params
        var sql = `select * from models where id=${id}`
        mysqldb.query(sql,(err,model)=>{
            if (err) return res.status(500).send(err)
            sql = `select * from gmbmodel where modelid=${id}`
            mysqldb.query(sql,(err,image)=>{
                if (err) return res.status(500).send(err)
                sql = 'select * from kategori'
                mysqldb.query(sql,(err,kat)=>{
                    if(err) return res.status(500).send(err)
                    return res.status(200).send({model,image,kat})
                })
            })
        })
    },
    getselectfab:(req,res)=>{
        const {id} = req.params
        var sql = `select bm.idbahan, b.name from bahan_model bm join bahan b on bm.idbahan=b.id where idmodel=${id};`
        mysqldb.query(sql,(err,fab)=>{
            if (err) return res.status(500).send(err)
            // return res.status(200).send(result)
            sql = 'select id as idbahan, name from bahan'
            mysqldb.query(sql,(err,allfab)=>{
                if(err) return res.status(500).send(err)
                return res.status(200).send({fab,allfab})
            })
        })
    },
    delmod2:(req,res)=>{
        const {id} = req.params
        var sql = `delete from models where id=${id}`
        mysqldb.query(sql,(err,result)=>{
            if(err) return res.status(500).send(err)
            sql = `delete from bahan_model where idmodel=${id}`
            mysqldb.query(sql,(err,result)=>{
                if(err) return res.status(500).send(err)
                sql = `delete from gmbmodel where modelid=${id}`
                mysqldb.query(sql,(err,result)=>{
                    if(err) return res.status(500).send(err)
                    return res.status(200).send(result)
                })
            })
        })
    },
    editmod:(req,res)=>{
        var {id,name,desk,harga,kategoriid} = req.body
        var sql = `update models set name='${name}', desk='${desk}', harga=${harga}, kategoriid=${kategoriid} where id=${id};`
        mysqldb.query(sql,(err,result)=>{
            if(err) return res.status(500).send(err)
            var sql = `select * from models where id=${id}`
            mysqldb.query(sql,(err,model)=>{
                if (err) return res.status(500).send(err)
                sql = `select * from gmbmodel where modelid=${id}`
                mysqldb.query(sql,(err,image)=>{
                    if (err) return res.status(500).send(err)
                    sql = 'select * from kategori'
                    mysqldb.query(sql,(err,kat)=>{
                        if(err) return res.status(500).send(err)
                        return res.status(200).send({model,image,kat})
                    })
                })
            })
        })
    },
    editfabmod:(req,res)=>{
        const {id,data} = req.body
        var sql = `delete from bahan_model where idmodel=${id}`
        mysqldb.query(sql,(err,result)=>{
            data.forEach(data=>{
                var fab = {idmodel:id,idbahan:data.idbahan}
                var sql = 'insert into bahan_model set ?'
                mysqldb.query(sql,fab,(err,result)=>{})
            })
            var sql = `select bm.idbahan, b.name from bahan_model bm join bahan b on bm.idbahan=b.id where idmodel=${id}`
            mysqldb.query(sql,(err,result)=>{
                if (err) return res.status(500).send(err)
                return res.status(200).send(result)
            })
        })
    },
    uplmod:(req,res)=>{
        upload (req,res,(err) => {
            if (err) {
                console.log('ga')
                return res.send(err)
            } else {
                // console.log(req.file)
                // console.log(req.body.modelid)
                // disini sudah ter-upload, bisa dilihat properti yg perlu digunakan
                const path = ubah(req.file.path)
                const {modelid} = req.body
                const data = {modelid,path}
                // console.log(data)
                var sql = 'insert into gmbmodel set ?'
                mysqldb.query(sql,data,(err,result)=>{
                    if(err) return res.status(500).send(err)
                    sql = `select * from gmbmodel where modelid=${modelid}`
                    mysqldb.query(sql,(err,image)=>{
                        if (err) return res.status(500).send(err)
                        return res.status(200).send(image)
                    })
                })
            }
        })
    },
    delimgmod:(req,res)=>{
        const {id,modelid} = req.body
        var sql = `delete from gmbmodel where id=${id}`
        mysqldb.query(sql,(err,result)=>{
            if (err) return res.status(500).send(err)
            sql = `select * from gmbmodel where modelid=${modelid}`
            mysqldb.query(sql,(err,result)=>{
                if (err) return res.status(500).send(err)
                return res.status(200).send(result)
            })
        })
    },
    // ==============================================================================================================================
    getorder:(req,res)=>{
        var {status} = req.query
        var sql = status == 100 ? 
            `select o.id, o.userid, u.username, o.tanggalorder, o.tanggalbayar, o.totharga, o.statusorder from orders o join users u on o.userid=u.id;`
            : `select o.id, o.userid, u.username, o.tanggalorder, o.tanggalbayar, o.totharga, o.statusorder from orders o join users u on o.userid=u.id where o.statusorder=${status};`
        mysqldb.query(sql,(err,result)=>{
            if (err) return res.status(500).send(err)
            sql = `select tanggalorder from orders group by tanggalorder;`
            mysqldb.query(sql,(err,result1)=>{
                if (err) return res.status(500).send(err)
                return res.status(200).send({result,result1})
            })
        })
    },
    cariorder:(req,res)=>{
        var {tanggal} = req.query
        var sql = `select o.id, o.userid, u.username, o.tanggalorder, o.tanggalbayar, o.totharga, o.statusorder from orders o join users u on o.userid=u.id where o.tanggalorder like '%${tanggal}%';`
        mysqldb.query(sql,(err,result)=>{
            if (err) return res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
    orderdetil:(req,res)=>{
        const {id} = req.params
        var sql = `select u.username, o.buktibayar, o.tanggalorder, o.tanggalbayar, o.statusorder, o.alamat from orders o join users u on o.userid=u.id where o.id=${id};`
        mysqldb.query(sql,(err,order)=>{
            if (err) return res.status(500).send(err)
            sql = `select od.id, m.name as model, b.name as bahan, od.warna, od.jumlah, od.jadi, bs.*
                from order_detil od
                join models m on od.modelid=m.id
                join bahan b on od.bahanid=b.id
                left join bodysize bs on od.bodysizeid=bs.id
                where od.orderid=${id} group by od.id;`
            mysqldb.query(sql,(err,detil)=>{
                if (err) return res.status(500).send(err)
                return res.status(200).send({order,detil})
            })
        })
    },
    orderstat:(req,res)=>{
        const {orderid,statusorder} = req.body
        var sql = `update orders set statusorder=${statusorder} where id=${orderid}`
        mysqldb.query(sql,(err,result)=>{
            if (err) return res.status(500).send(err)
            sql = `select u.username, o.buktibayar, o.tanggalorder, o.tanggalbayar, o.statusorder, o.alamat from orders o join users u on o.userid=u.id where o.id=${orderid};`
            mysqldb.query(sql,(err,order)=>{
                if (err) return res.status(500).send(err)
                return res.status(200).send(order)
            })
        })
    },
    // ==============================================================================================================================
    sellmod:(req,res)=>{
        const {sort} = req.query
        var sql = `select gm.path, m.name, m.harga, k.name as kategori, m.terjual, m.dilihat
            from models m 
            left join gmbmodel gm on m.id=gm.modelid 
            join kategori k on m.kategoriid=k.id
            group by gm.modelid order by m.${sort} desc limit 10;`
        mysqldb.query(sql,(err,result)=>{
            if (err) return res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
    pickfab:(req,res)=>{
        var sql = `select * from bahan order by terjual desc limit 10;`
        mysqldb.query(sql,(err,result)=>{
            if (err) return res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
    total:(req,res)=>{
        var sql = `select sum(totharga) as total from orders where statusorder>0;`
        mysqldb.query(sql,(err,total)=>{
            if (err) return res.status(500).send(err)
            sql = `select sum(jumlah) as dipesan from order_detil where orderid>0;`
            mysqldb.query(sql,(err,dipesan)=>{
                if (err) return res.status(500).send(err)
                return res.status(200).send({total,dipesan})
            })
        })
    },
    statorder:(req,res)=>{
        var sql = 'select statusorder, count(statusorder) as jumlah from orders group by statusorder order by statusorder ;'
        mysqldb.query(sql,(err,result)=>{
            if (err) return res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
    trafic:(req,res)=>{
        var sql = `select * 
            from (select tanggalorder, count(tanggalorder) as pesan from orders group by tanggalorder) a
            left join (select tanggalbayar, count(tanggalbayar) as bayar, sum(totharga) as jumlah from orders where tanggalbayar is not null group by tanggalbayar) b
            on a.tanggalorder=b.tanggalbayar
            union
            select * 
            from (select tanggalorder, count(tanggalorder) as pesan from orders group by tanggalorder) a
            right join (select tanggalbayar, count(tanggalbayar) as bayar, sum(totharga) as jumlah from orders where tanggalbayar is not null group by tanggalbayar) b
            on a.tanggalorder=b.tanggalbayar
            order by tanggalbayar;`
        mysqldb.query(sql,(err,result)=>{
            if (err) return res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
    userstat:(req,res)=>{
        const {sort} = req.query
        var sql = `select a.pesan as pesan, b.username as username, b.bayar as bayar, b.bill as bill, b.potong as potong
            from (select a.username, count(id) as pesan
                from (select o.id, o.userid, u.username, o.statusorder, o.totharga, sum(od.jumlah) 
                    from orders o 
                    join order_detil od on o.id=od.orderid 
                    join users u on u.id=o.userid
                    group by o.id) a
                group by a.userid) a 
            join (select a.username, count(id) as bayar, sum(a.totharga) as bill, sum(a.jumlah) as potong
                from (select o.id, o.userid, u.username, o.statusorder, o.totharga, sum(od.jumlah) as jumlah
                    from orders o 
                    join order_detil od on o.id=od.orderid 
                    join users u on u.id=o.userid
                    group by o.id) a
                where a.statusorder>0
                group by a.userid) b 
            on a.username=b.username order by ${sort} desc;`
        mysqldb.query(sql,(err,result)=>{
            if (err) return res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
    // ======================= coba ===================================

    coba:(req,res)=>{
        var data = req.body
        // var {bahanid,path} = req.body
        // var data = {bahanid,path}
        var sql = 'insert into gmbbahan set ?'

        data.forEach((data)=>{
            mysqldb.query(sql,data,(err,result)=>{
                if(err) return res.status(500).send(err)
            })
        })

        sql = 'select * from gmbbahan'
        mysqldb.query(sql,(err,result)=>{
            if(err) return res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
}