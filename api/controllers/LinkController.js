var alexa = require('alexarank');


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

};

//########################## END CONTROLLER ################################
