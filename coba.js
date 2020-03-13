// var prima=(a)=>{
//     var output=''
//     var arr=[]
//     for (i=0 ; i<a ; i++){
//         if (i===2){
//             output+=`2 `
//             arr.push(i)
//             console.log(output)
//             console.log(arr)
//         }
//         if (i>2){
//             var prima=false
            
//         }
//         // if(i<=5 && i>2){
//         //     if(i%2 !== 0){
//         //         output+=`${i} `
//         //         arr.push(i)
//         //     }
//         // }
//         // if(i>5){
//         //     if(i%2 !== 0 && i%3 !== 0 && i%5 !== 0 && i%7 !== 0){
//         //         output+=`${i} `
//         //         arr.push(i)
//         //     }
//         // }
//     }
//     console.log(arr)
//     return output
// }

// console.log(prima(30))

// var obj = {
//     apa:'',
//     kenapa:'',
//     siapa:''
// }

// var obj2 = {
//     kemana:'oke',
//     gimana:'gitu'
// }

// var path = ['path1','path2']

// console.log({...obj, path})



// const storage = multer.diskStorage({
//     destination: './public/upload',
//     filename: function(req,file,cb){
//         cb(null,file.fieldname+Date.now()+path.extname(file.originalname))
//     }
// })

// const upload = multer ({
//     storage: storage,
//     fileFilter: function (req,file,cb) {
//         checkFileType(file,cb)
//     }
// }).single('image')

// function checkFileType(file, cb){
//     // Allowed ext
//     const filetypes = /jpeg|jpg|png|gif/;
//     // Check ext
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
//     // Check mime
//     const mimetype = filetypes.test(file.mimetype)
  
//     if(mimetype && extname){
//         return cb(null,true)
//     } else {
//         cb('Error: Images Only!') // bisa jadi caption error
//     }
// }



// var dest = 'public\\upload\\image1583823058763.JPG'
// // dest = dest.split('\\')
// // var newdest = ''
// // for (let i = 0; i < dest.length; i++) {
// //     if ( i === dest.length-1 ) {
// //         newdest += ( dest[i] )
// //     } else {
// //         newdest += ( dest[i] + '/' )
// //     }
// // }

// const ubah = (dest) => {
//     var arr = dest.split('\\')
//     var newdest = ''
//     for (let i = 0; i < arr.length; i++) {
//         if ( i === arr.length-1 ) {
//             newdest += ( arr[i] )
//         } else {
//             newdest += ( arr[i] + '/' )
//         }
//     }
//     return newdest
// }

// var path = ubah(dest)

// console.log(path)
// // console.log(ubah(dest))
// console.log(typeof(ubah(dest)))

var newarr = [1,3,5,7]
var oldarr = [1,2,3,4]

function check (narr,oarr) {
    var add = []
    var del = []
    narr.forEach((valnew)=>{
        var n = 0
        oarr.forEach((valold)=>{
            if(valnew===valold){
                n+=1
            }
        })
        if(n===0){
            add.push(valnew)
        }
    })
    oarr.forEach(valold=>{
        var n = 0
        narr.forEach(valnew=>{
            if(valold===valnew){
                n+=1
            }
        })
        if(n===0){
            del.push(valold)
        }
    })
    return {add,del}
}
console.log(check(newarr,oldarr))
