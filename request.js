
const app = require('express')();
const request = require('request');
const bodyParser = require('body-parser');
const fs= require('fs');
const _ = require('underscore');
const path = require('path');
const async = require('async');


var jsonParser = bodyParser.json();


app.post("/craw", jsonParser, (req, res)=>{

    var urls = req.body;
    var finalResp =[];

    let len = Object.keys(urls).length;
    //async
    async.forEachOf(urls, (v,k)=>{

            let path = `./downloads/${k}.html`;
            let fileStream = fs.createWriteStream(path);
    
            fileStream.on('close', ()=>{
                
                let resp = require('./controller/html_analyzer').parseContent(path);   
                finalResp.push(resp);
                // async
                if(finalResp.length==len)
                    res.send(JSON.stringify(finalResp));
                
            });
            
            request(v).pipe(fileStream);

        }, (err) =>{

            if(err) 
                console.err(error.message);
            return;

        });
 
 });

 app.get("/help", (req,res)=>{


    res.send( `specialized crawler: 1. DBS personal loan:\n https://www.dbs.com.sg/personal/loans/personal-loans/dbs-personalloan
                                    2. Underscore: \n    http://underscorejs.org/      
                generic crawler:    any website.
                payload format:     {name: url} or {name1: url1, name2:url2, name3:url3....}  `);

 })

app.listen(3000, ()=>{

    console.log("app listening to port 3000");

})