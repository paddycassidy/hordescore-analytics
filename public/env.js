//wait until the document is loaded
$(document).ready(function(){
    console.log('Document is ready');

    //bind the lookup button to the lookup function
    $('#lookupBtn').click(function(){
        var investmentId=$('#investment').val()
        var investmentSearch={
            investment:investmentId
        }
        console.log(investmentId);
        $.get("http://localhost:4000/codelookup", investmentSearch, function(data){
            console.log('Data has returned: ' + data)
            $('#result').val(data);
        });
    })
})