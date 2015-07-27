var alexa = require('alexarank');
var phantom = require('phantom');
var request = require('request');
var fs = require('fs');
var inspect = require('util').inspect;

module.exports = {

    test: function(req, res) {
        // //Get ip address
        // var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        // console.log(ip);
        // getAlexa('www.zenk-security.com', function(jayz) {
        //     console.log(jayz);
        // });        
        // getPreview('https://www.zenk-security.com', 'fgf', function(jayz) {
        //     console.log(jayz);
        // });
        var params=req.allParams();
        base.createBase(params);
        
    },

    create: function(req, res) {
        var params = req.allParams();


        base.createBase(params);
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

    getTitle: function(req, res) {

        var link = req.param('link');

        console.log('getTitle : ' + link);
        var opts = {
            url: link
        };
        metadata(opts, function(err, data) {
            var desc;
            if (err === null) {
                //console.log(data);
                console.log(err);
                if (typeof data.title !== "undefined") {
                    console.log(data.title);
                    title = data.title;
                } else {
                    console.log("error");
                }
            }
            return res.json(200, title);
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



