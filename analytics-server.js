//express is the webserver library
const express = require('express');
//moment is a library for working with dates (may not be required)
const moment = require('moment');
//cors library
const cors = require('cors');
// use environment variables
require('dotenv').config()

const app = express();

//serve static web pages
app.use(express.static(__dirname + '/public'));

//function to timestamp all logs
const log = function(message){
    var time = moment().format()
    console.log('[Server] '+ time + ' ' + message)
}

//config cors 
app.use(cors())

//Watson Services
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
//Natural Language Understanding service
const nlu = new NaturalLanguageUnderstandingV1({
    version: '2019-07-12',
    authenticator: new IamAuthenticator({
      apikey: process.env.API_KEY,
    }),
    serviceUrl: 'https://api.au-syd.natural-language-understanding.watson.cloud.ibm.com/instances/351da398-946d-490d-b8dc-9bf80396610c',
  });

//function to analyze the parameters and return the results
const analyze = function(companyName, companyCode, response){
    //replace the static text with the crawled data set
    let text = "KGN operates as an online retailer in Australia. It sells bad products, but makes a lot of money. I say buy Kogan, as it has a big future. Zip Co Limited provides point-of-sale credit and digital payment services to consumers and merchants in Australia, the United Kingdom, the United States, New Zealand, and South Africa. In addition, it offers a Buy Now Pay Later services whereby consumers split repayments into equal instalments. It is overvalued at the current price, and the price will crash soon. If you buy ZIP now, be prepared to lose your money. It's too risky. Commonwealth bank on the other hand is a good bet. Commonwealth Bank of Australia (CBA) provides integrated financial services in Australia. It operates through 940 branches and 2,700 ATMs. The company was founded in 1911 and is based in Sydney, Australia. Westpac (WBC) is another bank that is a solid performer, more of an investment for the risk-averse investor but there will always be a business for banking, so Westpac has a strong future";
    

    //const urlCrawler = 'http://localhost:8080/crawler'
    //let text = app.get(urlCrawler, function(data){
        //console.log('Crawler has returned: ' + data)
        //return data;
    //});

    
    const analyzeParams = {
        'text': text,
        'features': {
            'sentiment': {
                'targets': [companyName, companyCode] //change
            },
    },
};

nlu.analyze(analyzeParams)
.then(analysisResults => {
    console.log(JSON.stringify(analysisResults, null, 2));
    response.send({data: analysisResults.result})
})
.catch(err => {
    console.log('error: ', err);
});
};



app.get('/analyze',function(request,response){
    let companyName=request.query.companyName; //change
    let companyCode=request.query.companyCode; //change
    console.log(companyName);
    console.log(companyCode)
    analyze(companyName,companyCode,response)
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`CORS-enabled web server is listening on port ${port}`)
})