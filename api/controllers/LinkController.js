/**
 * LinkController
 *
 * @description :: Server-side logic for managing links
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
test : function(req,res){
var alexa = require('alexarank');

alexa("http://www.zenk-security.com/", function(error, result) {
    if (!error) {
        console.log(JSON.stringify(result));
    } else {
        console.log(error);
    }
});
}

};

