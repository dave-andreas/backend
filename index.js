const express=require('express')
const app=express()
const BodyParser=require('body-parser')
const cors=require('cors')
const bearerToken=require('express-bearer-token')
const {authrouter,adminrouter,userrouter}=require('./routers')
const schedule=require('node-schedule')

const port=2020

app.use(cors())
app.use(bearerToken())
app.use(BodyParser.json())
app.use(BodyParser.urlencoded({extended:false}))//buat upload gambar
app.use('/public',express.static('./public'))//buat upload gambar nanti

app.get('/',(req,res)=>{
    return res.status(200).send('welcome to jAHiTiN api')
})

// app.use('/user',userRouters)
app.use('/auth',authrouter)
app.use('/admin',adminrouter)
app.use('/user',userrouter)

app.listen(port,()=>console.log('jAHiTiN aktif di '+port))

// var a=0
// schedule.scheduleJob('*/1 * * * * *', ()=>{
//     console.log(`tiap ${a+=1} detik`)
// })
//coba2 node-schedule