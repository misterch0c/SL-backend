var webpagePreview = require('webpage-preview');
var alexa = require('alexarank');
var request = require('request');
var parse = require('xml-parser');
var isUp = require('is-up');
var metadata = require('web-metadata');
var phantom = require('phantom');
var WebPage = require('webpage');
var screenshot = require('url-to-screenshot');
var webshot = require('webshot');
var fs = require('fs');



module.exports = {

    createBase: function(options) {
        console.log(options);

        var params = options;
        console.log(params);
        pathArray = params.link.split('/');
        protocol = pathArray[0];
        host = pathArray[2];
        url = protocol + '//' + host;
        url = url.replace(/.*?:\/\//g, ""); //Strip http,https
        console.log(url);
        //var rawLink=params.link.replace(/.*?:\/\//g, "");//Strip http,https
        //rawLink=rawLink.replace(/\/$/, ""); // Strip trailing slash
        //console.log('RAAAAAAAAAAAw'+rawLink);
        console.log(params.title);

        console.log('-----------------');
        console.log(params.link);


        // var renderStream = webshot(params.link);
        // var file = fs.createWriteStream('assets/screenshots/' + params.title + '.png', {
        //     encoding: 'binary'
        // });

        // renderStream.on('data', function(data) {
        //     file.write(data.toString('binary'), 'binary');
        //     console.log("WRITTEEEEEEEEEEEEN");
        // });
        getAlexa(params.link, function(jayz) {


            isUp(url, function(err, up) {
                getDescTitle(params.link, function(rez) {
                    //console.log("cbbbbbbbbb");
                    //console.log(rez);
                    getPreview(params.link, params.title);

                    Link.create({
                        title: params.title,
                        link: params.link,
                        description: rez.description,
                        lang: params.lang,
                        type: params.type,
                        rank: jayz.rank,
                        delta: jayz.delta,
                        isup: up,
                    }).exec(function(e, r) {
                        console.log("created this");
                        console.log(r);
                    });

                });
            });
        });


    },


    getDesc: function(options) {
        var link = options;
        console.log('getDesc : ' + link);
        var opts = {
            url: link
        };
        metadata(opts, function(err, data) {
            console.log(data);
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

            return desc;
        });
    },
};

function getPreview(url, title) {
    var renderStream = webshot(url);
    var file = fs.createWriteStream('assets/screenshots/' + title + '.png', {
        encoding: 'binary'
    });

    renderStream.on('data', function(data) {
        file.write(data.toString('binary'), 'binary');
        console.log("< --- Screenshot written --- >");
    });
}

function getAlexa(url, alexaCB) {
    //alexa might block ip if too much requests
    request('http://data.alexa.com/data?cli=10&url=' + url, function(error, response, body) {

        if (!error && response.statusCode == 200) {
            var obj = parse(body);
            var ch;
            for (var i = 0; i < obj.root.children.length; ++i) {
                if (obj.root.children[i].name == 'SD') {
                    ch = obj.root.children[i];
                }
            }

            //console.log(ch.children[1].attributes.RANK);
            // console.log(ch.children);
            //console.log(ch.children[2].attributes.DELTA);
            //var rank = ch.children[1].attributes.RANK;
            console.log(ch);
            if (typeof ch !== 'undefined') {
                if (typeof ch.children[2] !== 'undefined') {

                    var delta = ch.children[2].attributes.DELTA;
                } else {
                    var delta = "no";
                }

                if (typeof ch.children[1] !== 'undefined') {

                    var rank = ch.children[1].attributes.RANK;
                } else {
                    var rank = "no";
                }

            }

            var jayz = {
                rank: rank,
                delta: delta
            }
            alexaCB(jayz);
        }

    });
}

function getDescTitle(url, descCB) {
    var link = url;
    var desc;
    var title;

    console.log('getDesc : ' + link);
    var opts = {
        url: link
    };
    metadata(opts, function(err, data) {
        console.log(data);
        if (err === null) {
            console.log(data.title);
            console.log(err);
            if (typeof data.meta.description !== "undefined") {
                console.log(data.meta.description);

                desc = data.meta.description;
                title = data.title
            } else {
                console.log(data.meta.DESCRIPTION);

                desc = data.meta.DESCRIPTION
                title = data.title
            }

            var rez = {
                title: title,
                description: desc
            }
            descCB(rez);
        }

    });
}
