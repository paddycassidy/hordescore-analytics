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
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1.js');
const { IamAuthenticator } = require('ibm-watson/auth');
const { response } = require('express');
const nlukey = 'QC9hCtsIqY47ZP_9dKDNqivN-4a4dUpzkYPHNpVSbetP';

//Natural Language Understanding service
const nlu = new NaturalLanguageUnderstandingV1({
    authenticator: new IamAuthenticator({apikey:nlukey}),
    version: '2019-07-12',
});

//function to analyze the parameters and return the results
const analyze = function(text,response){
    const analyzeParams = {
        'text': text,
        'features': {
            'categories': {
                'limit': 10
            }
        }
    }

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
    let text=request.query.text;
    analyze(text,response)
})

const port = 3002;
app.listen(port)
log('Server is listening on port: ' + port)