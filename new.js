const arrOfObj = [
    {
        name:"mubariz",
        info:[
            {maths:23 , english:20}
        ],
        status:""
    },{
        name:"imran",
        info:[
            {maths:3 , english:2}
        ],
        status:""
    }
]

arrOfObj.map(obj =>{
    obj.info.map(elem =>{
        if(elem.english > 10 && elem.maths >10){
            obj.status = "passed"
        }else{
            obj.status = "failed"
        }
    })
})

console.log(arrOfObj)