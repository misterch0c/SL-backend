var alexa = require('alexarank');


module.exports = {

    test: function(req, res) {

    },

    create: function(req,res){
    	var params=req.allParams();
    	//Link.create({title:params.title,link:params.link,description:params.description,
    	//	lang:params.lang,rank})
		console.log(params.link);
		var rank=getAlexaRank(params.link); //undefined
		console.log('rank = ',rank);

    },

};

//########################## END CONTROLLER ################################

function getAlexaRank(url){

    alexa(url, function(error, result) {
        if (!error) {
            console.log(JSON.stringify(result));
        } else {
            console.log(error);
        }
        return result;
    });

}