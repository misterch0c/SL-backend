/**
* Link.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	schema: true,
  attributes: {

  	title:{
      type:'string',
      unique:true,
    },
  	link:'string',
  	description:'string',
    rank:'string',
  	delta:'string',
  	lang:'string',
  	type: 'string',
  	isup: 'boolean',
    preview: 'string'
  }
};

