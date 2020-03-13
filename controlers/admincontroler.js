const crypto=require('../helper/crypto')
const {mysqldb}=require('../connection')
const transporter=require('../helper/mailer')
const fs=require('fs')
const multer=require('multer')
const path=require('path')
const {uploader}=require('../helper/uploader')

const upload = multer ({
    storage: multer.diskStorage({
        destination: './public/bahan',
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
    getmod:(req,res)=>{
        var sql='select m.*, gm.path from models m left join gmbmodel gm on m.id=gm.modelid group by m.id;'
        mysqldb.query(sql,(err,result)=>{
            if(err) return res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
    getgmb:(req,res)=>{
        const {id} = req.params
        var sql = `select * from gmbmodel where modelid=${id}`
        mysqldb.query(sql,(err,result)=>{
            if(err) return res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
    addmod:(req,res)=>{
        var {name,desk,harga,kategoriid} = req.body
        var datamodel={name,desk,harga,kategoriid}
        // var sql='insert into models set ?'
        // mysqldb.query(sql,datamodel,(err1,result1)=>{
        //     if(err1) return res.status(500).send(err1)
        //     sql='select m.*, gm.path from models m left join gmbmodel gm on m.id=gm.modelid group by m.id'
        //     mysqldb.query(sql,(err2,result2)=>{
        //         if(err2) return res.status(500).send(err2)
        //         return res.status(200).send(result2)
        //     })
        // })
        var sql=`select * from models where name='${name}' and kategoriid=${kategoriid}`
        mysqldb.query(sql,(err,result)=>{
            if(err) return res.status(500).send(err)
            if(result.length>0){
                return res.status(200).send({message:`There's already model with same name and category`})
            }else{
                sql='insert into models set ?'
                mysqldb.query(sql,datamodel,(err1,result1)=>{
                    if(err1) return res.status(500).send(err1)
                    sql='select m.*, gm.path from models m left join gmbmodel gm on m.id=gm.modelid group by m.id;'
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
            sql = `select m.*, gm.path from models m left join gmbmodel gm on m.id=gm.modelid group by m.id;`
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
            return res.status(200).send(result)
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
    dlt:(req,res)=>{
        const {id} = req.params
        var sql = `delete from bahan_model where idmodel=${id}`
        mysqldb.query(sql,(err,result)=>{
            if(err) return res.status(500).send(err)
            sql = `select * from bahan_model where idmodel=${id}`
            mysqldb.query(sql,(err,result)=>{
                if(err) return res.status(500).send(err)
                return res.status(200).send(result)
            })
        })
    },
    // ======================= coba ===================================

    coba:(req,res)=>{
        console.log(req.body)
        var data = req.body
        // var {bahanid,path} = req.body
        // var data = {bahanid,path}
        var sql = 'insert into gmbbahan set ?'

        data.forEach((data)=>{
            console.log(data)
            mysqldb.query(sql,data,(err,result)=>{
                if(err) return res.status(500).send(err)
                sql = 'select * from gmbbahan'
                mysqldb.query(sql,(err,result)=>{
                    if(err) return res.status(500).send(err)
                    return res.status(200).send(result)
                })
            })
        })
    },
    upl:(req,res)=>{
        // console.log(req.file)
        upload (req,res,(err) => {
            if (err) {
                console.log('ga')
                return res.send(err)
            } else {
                console.log(req.file)
                console.log(req.body.bahanid)
                // disini sudah ter-upload, bisa dilihat properti yg perlu digunakan
                const path = ubah(req.file.path)
                const {bahanid} = req.body
                const data = {bahanid,path}
                console.log(data)
                var sql = 'insert into gmbbahan set ?'
                mysqldb.query(sql,data,(err,result)=>{
                    if(err) return res.status(500).send(err)
                    return res.status(200).send('ok')
                })
            }
        })
    }
}