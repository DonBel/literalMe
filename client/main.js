import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
import '../lib/collections.js';

Template.mainBody.helpers({
	profAll(){
		return bookDB.find({}, {sort:{Likes: -1}});
	}
});



Template.mainBody.events({
  'click .js-thumbs-up'(event, instance) {
  	var likes = bookDB.findOne({'_id':this._id}).Likes;
  	var dislikes = bookDB.findOne({'_id':this._id}).Dislikes;
  	if(!likes){
		likes=0;
	}
	likes++;
	var ratio1 = (likes/(likes+dislikes)) *100;
	var ratio2 = (dislikes/(likes+dislikes)) *100;
	bookDB.update({"_id":this._id}, {$set:{'Likes':likes, 'LikeRatio':ratio1, 'DislikeRatio':ratio2}});
  },

  'click .js-thumbs-down'(event, instance) {
  	var likes = bookDB.findOne({'_id':this._id}).Likes;
  	var dislikes = bookDB.findOne({'_id':this._id}).Dislikes;
  	if(!dislikes){
		dislikes=0;
	}
	dislikes++;
	var ratio1 = (likes/(likes+dislikes)) *100;
	var ratio2 = (dislikes/(likes+dislikes)) *100;
	bookDB.update({"_id":this._id}, {$set:{'Dislikes':dislikes, 'LikeRatio':ratio1, 'DislikeRatio':ratio2}});
  },

  'click .js-showbook'(event, instance) {
  	var modalname = '#viewinfo' + this._id;
	$(modalname).modal('show');
  	var views = bookDB.findOne({'_id':this._id}).Views;
  	if(!views){
		views=0;
	}
	views++;
	bookDB.update({"_id":this._id}, {$set:{'Views':views}});
  },

  'click .js-delete'(event, instance) {
	var profID = this._id;
	$('#editbook' + this._id).modal('hide');
	$("#" + profID).fadeOut("slow","swing",function(){
		bookDB.remove({_id:profID}); 	
	});
  },

  'click .js-addbook'(event, instance) {
  	var title = $('#addBook input[id="Title"]').val();
  	var a_name = $('#addBook input[id="author"]').val();
  	var image = $('#addBook input[id="Cover"]').val();
  	var desc = $('#addBook textarea[id="Description"]').val();
  	$('#addBook input[id="Title"]').val('');
  	$('#addBook input[id="author"]').val('');
  	$('#addBook input[id="Cover"]').val('');
  	$('#addBook textarea[id="Description"]').val('');
  	$('#addBook').modal('hide');
	bookDB.insert({'Title':title, 'author':a_name, 'Cover':image, 'desc':desc, 'Likes':0, 'Dislikes':0, 'LikeRatio':0, 'DislikeRatio':0, 'Views':0});
  },

  'click .js-savebook'(event, instance) {
  	var profID = this._id;
  	var modalname = '#editbook' + this._id;
  	var title = $(modalname + ' input[id="Title"]').val();
  	var a_name = $(modalname + ' input[id="author"]').val();
  	var image = $(modalname + ' input[id="Cover"]').val();
  	var desc = $(modalname + ' textarea[id="Description"]').val();
  	if(title==""){
  		title = this.Title;
  	}
  	if(a_name==""){
  		a_name = this.author;
  	}
  	if(image==""){
  		image = this.Cover;
  	}
  	if(desc==""){
  		desc = this.desc;
  	}
  	$(modalname + ' input[id="Title"]').val('');
  	$(modalname + ' input[id="author"]').val('');
  	$(modalname + ' input[id="Cover"]').val('');
  	$(modalname + ' textarea[id="Description"]').val('');
  	$(modalname).modal('hide');
	bookDB.update({"_id":profID}, {$set:{'Title':title, 'author':a_name, 'Cover':image, 'desc':desc}});
  },
});
