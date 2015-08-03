var alexa = require('alexarank');
var phantom = require('phantom');
var request = require('request');
var fs = require('fs');
var inspect = require('util').inspect;
var isUp = require('is-up');

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
        // var params=req.allParams();
        // base.createBase(params);

        isUp('at4re.com/f/forum.php', function(err, up) {
            console.log(up);
        });
        
    },

    migrate: function(req,res){
        var i = 0;
        fs.readFile('linkbase.json','utf-8',function(err,data){
            var json = JSON.parse(data);
            console.log("nn");
            for (var test in json){
                console.log("NUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUM");
                console.log(i++);




                var params={
                    link:json[test].url[0],
                    title:json[test].name,
                    lang:shortLang(json[test].lang),
                    type:"board"

                }
                console.log(params.lang);
                base.createBase(params);
            }
            res.ok();

        });
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


function shortLang(lang){
    switch(lang){
        case 'Russian':
            return 'ru';
            break;
        case 'English':
            return 'us';
            break;        
        case 'Vietnamese':
            return 'vn';
            break;        
        case 'French':
            return 'fr';
            break;        
        case 'German':
            return 'de';
    
            break;
        case 'Arabic':
            return 'ae';
            break;
        case 'Azerbaijan':
            return 'az';
            break;
        case 'Bosnian':
            return 'ba';
            break;
        case 'Chinese':
            return 'ca';
            break;
        case 'Indonesia':
            return 'id';
            break;

        case 'Italian':
            return 'it';
            break;

        case 'Persian':
            return 'ir';
            break;

        case 'Polish':
            return 'pl';
            break;

        case 'Portuguese':
            return 'pt';
            break;

        case 'Romanian':
            return 'ro';
            break;

        case 'Spanish':
            return 'es';
            break;

        case 'Thai':
            return 'th';
            break;

        case 'Turkish':
            return 'tr';
            break;

        case 'Vietnamese':
            return 'vn';
            break;
    }


}
