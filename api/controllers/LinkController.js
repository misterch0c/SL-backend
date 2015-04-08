var alexa = require('alexarank');
var metadata = require('web-metadata');

module.exports = {

    test: function(req, res) {

    },

    create: function(req, res) {
        var params = req.allParams();
        //getAlexaRank(params.link, req);

        alexa(params.link, function(error, rk) {

            Link.create({
                title: params.title,
                link: params.link,
                description: params.description,
                lang: params.lang,
                type: params.type,
                rank: rk.rank,
            }).exec(function(e, r) {
                console.log(r);
            });
            //console.log(params.link);

            //console.log('ransqsqsk = ' + req.rank);
        });
    },
	
	getDesc: function(req, res){		
		
		var link = req.param('link');
		
		console.log('getDesc : ' + link);
		var opts = {
			url: link
		};
		metadata(opts, function(err, data) {	
			var desc;		
			if (err === null){
				console.log(data.title);
				console.log(err);
				if (typeof data.meta.description !== "undefined"){
					console.log(data.meta.description);			
					desc = data.meta.description;
				}
				else {
					console.log(data.meta.DESCRIPTION);			
					desc = data.meta.DESCRIPTION;				
				}
			}
			return res.json(200,desc);
		});
	}

};

//########################## END CONTROLLER ################################
