var alexa = require('alexarank');
var metadata = require('web-metadata');
var phantom = require('phantom');
var webpagePreview = require('webpage-preview');
var isUp = require('is-up');
var request = require('request');
var fs = require('fs');
var parse = require('xml-parser');
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
        isUp('crack-wifi.com', function(err, res) {
            console.log(res)
        });
    },

    create: function(req, res) {
        var params = req.allParams();
        //getAlexaRank(params.link, req);
        var rawLink=params.link.replace(/.*?:\/\//g, "");//Strip http,https
        rawLink=rawLink.replace(/\/$/, ""); // Strip trailing slash
        console.log('RAAAAAAAAAAA'+rawLink);
        getPreview(params.link, params.title, function(sizePaths) {
            console.log('dfefd');
            getAlexa(params.link, function(jayz) {

                isUp(rawLink, function(err, up) {

                    Link.create({
                        title: params.title,
                        link: params.link,
                        description: params.description,
                        lang: params.lang,
                        type: params.type,
                        rank: jayz.rank,
                        delta: jayz.delta,
                        isup: up,
                    }).exec(function(e, r) {
                        console.log(r);
                    });
                    //console.log(params.link);

                    //console.log('ransqsqsk = ' + req.rank);
                });
            });
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

function getAlexa(url, alexaCB) {
    request('http://data.alexa.com/data?cli=10&url=' + url, function(error, response, body) {

        if (!error && response.statusCode == 200) {
            var obj = parse(body);
            var ch;
            for (var i =0; i<obj.root.children.length;++i){
                if(obj.root.children[i].name=='SD'){
                    ch = obj.root.children[i];
                }
            }

            console.log(ch);
            var rank = ch.children[1].attributes.RANK;
            var delta = ch.children[2].attributes.DELTA;
            var jayz = {
                rank: rank,
                delta: delta
            }
            alexaCB(jayz);
        }

    });
}

function getPreview(url, title, prevCB) {
    webpagePreview.generatePreview(url, title, '/home/unkn0wn/angular/yop/SL-backend/assets/prev/', null, {
        small: {
            width: 160,
            height: 120
        }
    }, function(error, sizePaths) {
        if (error) {
            console.log(error);
        } else {
            console.log(sizePaths);

        }
            prevCB(sizePaths);

    });
}