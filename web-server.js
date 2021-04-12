//express is the webserver library
const express = require('express');
//moment is a library for working with dates (may not be required)
const moment = require('moment');

const app = express();

//serve static web pages
app.use(express.static(__dirname + '/public'));

//function to timestamp all logs
const log = function(message){
    var time = moment().format()
    console.log('[Server] '+ time + ' ' + message)
}

//Watson Services
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
//Natural Language Understanding service
const nlu = new NaturalLanguageUnderstandingV1({
    version: '2019-07-12',
    authenticator: new IamAuthenticator({
      apikey: 'QC9hCtsIqY47ZP_9dKDNqivN-4a4dUpzkYPHNpVSbetP',
    }),
    serviceUrl: 'https://api.au-syd.natural-language-understanding.watson.cloud.ibm.com/instances/351da398-946d-490d-b8dc-9bf80396610c',
  });

//function to analyze the parameters and return the results
const analyze = function(company,response){
    //replace the text with the crawled data set
    let text = "Zip Co Limited provides point-of-sale credit and digital payment services to consumers and merchants in Australia, the United Kingdom, the United States, New Zealand, and South Africa. The company operates through ZIP AU, Zip Global, and Spotcap segments. It offers integrated retail finance solutions to merchants in the retail, education, health, and travel industries through online and in store. The company provides Zip Pay and Zip Money, which are digital wallets; and Pocketbook, a personal finance application to help people manage their finances, budget, and savings, as well as unsecured loans to small and medium sized businesses. In addition, it offers a Buy Now Pay Later services whereby consumers split repayments into equal instalments. The company was formerly known as ZipMoney Limited and changed its name to Zip Co Limited in December 2017. Zip Co Limited was incorporated in 2009 and is based in Sydney, Australia.";
    const analyzeParams = {
        'text': text,
        'features': {
            'sentiment': {
                'targets': [company]
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
    let company=request.query.company;
    analyze(company,response)
})

const port = 3002;
app.listen(port)
log('Server is listening on port: ' + port)