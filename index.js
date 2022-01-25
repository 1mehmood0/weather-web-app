const http=require("http");
const fs=require("fs");
var requests=require("requests");//request npm package


const homeFile=fs.readFileSync("home.html","utf-8");//reading html file


//Replacing the value in HTML file with that of API's value
const replaceValue=(temp_val,org_val)=>{
    let temperature=temp_val.replace("{%tempValue%}",org_val.main.temp); //temperature becomes the whole html page that is replaced
    temperature=temperature.replace("{%tempMin%}",org_val.main.temp_min);
    temperature=temperature.replace("{%tempMax%}",org_val.main.temp_max);
    temperature=temperature.replace("{%city%}",org_val.name);
    temperature=temperature.replace("{%country%}",org_val.sys.country);
    temperature=temperature.replace("{%tempType%}",org_val.weather[0].main);//change the icon vale with the type 

    return temperature;
};

const server=http.createServer((req,res)=>{ //creating Server
    if(req.url=="/")
    {
        requests("http://api.openweathermap.org/data/2.5/weather?q=Lucknow&appid=120db43a2f90b8476dc604b556dfe60c&units=metric")//api link
        .on("data",(chunk)=>{   //Stream Module type-2
            const objData=JSON.parse(chunk);//converting the JSON to javascript object
            arrData=[objData];//converting the object to array
           // console.log(arrData[0].main.temp); 
            const realTimeData=arrData
            .map((val)=>replaceValue(homeFile,val))//mapping the array with callback function to replace value
            .join("");//using to convert the data to string
            res.write(realTimeData);
            //console.log(realTimeData);
            })
            .on("end",(err)=>{
            if(err)
            {
                return console.log("conncection closed",err);
            }
            res.end();
            });
    }
    else{
        res.end("file not found");
    }
    
});
server.listen(6969,"127.0.0.1",()=>console.log("Server Runing on port 6969"));//listening to server
