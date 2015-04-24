var alexa = require('alexarank');
var metadata = require('web-metadata');
var phantom = require('phantom');
var webpagePreview = require('webpage-preview');
var isUp = require('is-up');

module.exports = {

    test: function(req, res) {

    },

    create: function(req, res) {
        var params = req.allParams();
        //getAlexaRank(params.link, req);

        alexa(params.link, function(error, rk) {
            isUp(params.link, function(err, up) {

                Link.create({
                    title: params.title,
                    link: params.link,
                    description: params.description,
                    lang: params.lang,
                    type: params.type,
                    rank: rk.rank,
                    isup: up,
                }).exec(function(e, r) {
                    console.log(r);
                });
                //console.log(params.link);

                //console.log('ransqsqsk = ' + req.rank);
            });
        });
    },


    test: function(req, res) {
        webpagePreview.generatePreview('http://google.com/', 'google', '/home/unkn0wn/genpic' + '/public/previews', null, null, function(error, sizePaths) {
            if (error) {
                console.log(error);
            } else {
                console.log(sizePaths);
            }
        });
    },

    getDesc: function(req, res) {

        var link = req.param('link');

        console.log('getDesc : ' + link);
        var opts = {
            url: link
        };
        metadata(opts, function(err, data) {
            var desc;
            if (err === null) {
                console.log(data.title);
                console.log(err);
                if (typeof data.meta.description !== "undefined") {
                    console.log(data.meta.description);
                    desc = data.meta.description;
                } else {
                    console.log(data.meta.DESCRIPTION);
                    desc = data.meta.DESCRIPTION;
                }
            }
            return res.json(200, desc);
        });
    },

    //do a cronjob that call this
    daily: function(req, res) {
        var updated = [];
        Link.find().exec(function(err, links) {
            async.each(links, function(link, callback) {
                alexa(link.link, function(error, rk) {

                    link.rank = rk.rank;
                    link.isup = 'true';
                    console.log(link);
                    link.save(function(err, saved) {
                        updated.push(saved);
                        console.log(saved);
                        callback()
                    });
                });
            }, function(err) {
                res.json(200, updated);
            });

        });
    }

};

//########################## END CONTROLLER ################################