var prima=(a)=>{
    var output=''
    var arr=[]
    for (i=0 ; i<a ; i++){
        if (i===2){
            output+=`2 `
            arr.push(i)
            console.log(output)
            console.log(arr)
        }
        if (i>2){
            var prima=false
            
        }
        // if(i<=5 && i>2){
        //     if(i%2 !== 0){
        //         output+=`${i} `
        //         arr.push(i)
        //     }
        // }
        // if(i>5){
        //     if(i%2 !== 0 && i%3 !== 0 && i%5 !== 0 && i%7 !== 0){
        //         output+=`${i} `
        //         arr.push(i)
        //     }
        // }
    }
    console.log(arr)
    return output
}

console.log(prima(30))