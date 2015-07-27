var webpagePreview = require('webpage-preview');
var alexa = require('alexarank');
var request = require('request');
var parse = require('xml-parser');
var isUp = require('is-up');
var metadata = require('web-metadata');


module.exports = {

    createBase: function(options) {
        console.log(options);

        var params = options;
        var rawLink=params.link.replace(/.*?:\/\//g, "");//Strip http,https
        rawLink=rawLink.replace(/\/$/, ""); // Strip trailing slash
        console.log('RAAAAAAAAAAAw'+rawLink);
        console.log(params.title);
        getPreview(params.link, params.title, function(sizePaths) {
            console.log('dfefd');
            getAlexa(params.link, function(jayz) {

                isUp(rawLink, function(err, up) {
                    getDescTitle(params.link,function(rez){
                        console.log("cbbbbbbbbb");
                        console.log(rez);


                        Link.create({
                            title: rez.title,
                            link: params.link,
                            description: rez.description,
                            lang: params.lang,
                            type: params.type,
                            rank: jayz.rank,
                            delta: jayz.delta,
                            isup: up,
                        }).exec(function(e, r) {
                            console.log(r);
                        });

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
            //console.log(desc);
            return desc;
        });
    },
};

function getPreview(url, title, prevCB) {
    //need to generate unique title here otherwise we'll get pwnd 
    webpagePreview.generatePreview(url, title, '/home/unkn0wn/web/SL-backend/assets/prev/', null, {
        small: {
            width: 160,
            height: 120
        }
    }, function(error, sizePaths) {
        if (error) {
            console.log(error);
        } else {
            console.log(sizePaths);
            console.log("hey");

        }
            prevCB(sizePaths);

    });
}

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

function getDescTitle(url,descCB){
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
                console.log("TIIIIIIIIIIIII");
                console.log(data.title);
                console.log(err);
                if (typeof data.meta.description !== "undefined") {
                    console.log(data.meta.description);

                    desc = data.meta.description;
                    title=data.title
                } else {
                    console.log(data.meta.DESCRIPTION);
                   
                        desc=data.meta.DESCRIPTION
                        title=data.title
                }

                var rez={title:title,
                    description:desc
                }
                descCB(rez);
            }

        });
}