const cheerio = require("cheerio");
const fs = require('fs');
const _ = require('underscore');


//		"dbsPeronalLoan": "https://www.dbs.com.sg/personal/loans/personal-loans/dbs-personalloan",
function parseContent(filePath)

{
    console.log(filePath);

    if(filePath ==="./downloads/underscore.html" )
        return _underscoreParser(filePath);
    else if(filePath === "./downloads/dbsPeronalLoan.html")
        return _dbsPersonalLoanParser(filePath);
    else
        return _universalParser(filePath);

}

function _universalParser(filePath){

    let $ = cheerio.load(fs.readFileSync(filePath));
    let result =[];


    $("h1,h2,h3,h4,h5").each(function(i,index){

        result.push($(this).text());

    });

    return result;
}


function _dbsPersonalLoanParser(filePath)
{
    let result = {
            amount:{summary:null, terms:null},
            availablity: {summary:null, terms:null},
            rates:{summary:null, terms:null},
            eligibility:{
                nationality:null,
                age: null,
                minWage:null
            }
     };

    let $ = cheerio.load(fs.readFileSync(filePath));
    
    $('.media.dark-media').each(function(i, index){

        if(i==0)
            result.amount.summary = $(this).text();
        else if(i==1)
            result.availablity.summary= $(this).text();
        else if(i==2)
            result.rates.summary = $(this).text();

    });

   $('table.tbl-primary').eq(0).find("tr:nth-child(2)>td").each(function(i,index){

         if(i==0)
            result.amount.terms = $(this).text();
         else if(i==1)
            result.availablity.terms = $(this).text();
         else if(i==2)
            result.rates.terms = $(this).text();

   });

   $('table.tbl-primary').eq(1).find("tr").each(function(i,index){

    if(i==1)
       result.eligibility.nationality = $(this).find('td:nth-child(2)').text();
    else if(i==2)
       result.eligibility.age = $(this).find('td:nth-child(2)').text();
    else if(i==3)
       result.eligibility.minWage = $(this).find('td:nth-child(2)').text();

});


    return result;

}



function _underscoreParser(filePath)
{

    let result = {};
    let category = "";
    
    let $ = cheerio.load(fs.readFileSync(filePath));

    $('#documentation>*').each(function(i,index){


        //console.log(Object.prototype.toString.call(index));
        if(index.tagName=="h2")
        {
            category = index.attribs.id;
            result[category] = [];
        }
        else if (index.name =="p" && index.attribs.id)
        {
            result[category].push(
                {
                method: index.attribs.id,
                description: $(this).text(),
                examples: $(this).next().text()
                }
            );
        }
   
     });
 
    return result;

}

exports.parseContent = parseContent;