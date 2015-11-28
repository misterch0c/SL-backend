var alexa = require('alexarank');
var phantom = require('phantom');
var request = require('request');
var fs = require('fs');
var inspect = require('util').inspect;
var isUp = require('is-up');
var webshot = require('webshot');
var metadata = require('web-metadata');

module.exports = {
_config: {
    actions: true,
    shortcuts: true,
    rest: true,

},

    create: function(req, res) {
        var params = req.allParams();


       base.createBase(params);
     //  base.sendmail(params);
    },

    count: function(req,res){
        Link.find().exec(function(er,rez){
            console.log(rez.length);
            res.json(rez.length);
        });
    },
    get: function(req,res){
        var type = req.param('type');
        Link.find().where({type:type}).exec(function(err,data){
           // console.log(data);
            res.ok(data);
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
    // daily: function(req, res) {
    //     var updated = [];
    //     Link.find().exec(function(err, links) {
    //         async.each(links, function(link, callback) {
    //             alexa(link.link, function(error, rk) {

    //                 link.rank = rk.rank;
    //                 link.isup = 'true';
    //                 console.log(link);
    //                 link.save(function(err, saved) {
    //                     updated.push(saved);
    //                     console.log(saved);
    //                     callback()
    //                 });
    //             });
    //         }, function(err) {
    //             res.json(200, updated);
    //         });

    //     });
    // }
    //to dump link-base.json into db
    // migrate: function(req,res){
    //     var i = 0;
    //     fs.readFile('link-base.json','utf-8',function(err,data){
    //         var json = JSON.parse(data);
    //         console.log("nn");
    //         for (var test in json){
    //             console.log(i++);
    //             var params={
    //                 link:json[test].url[0],
    //                 title:json[test].name,
    //                 lang:shortLang(json[test].lang),
    //                 type:"board"
    //             }
    //             console.log(params.lang);
    //             base.createBase(params);
    //         }
    //         res.ok();
    //
    //     });
    // },

};

//########################## END CONTROLLER ################################


function shortLang(lang){ //yeah that's stupid
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
    }


}
