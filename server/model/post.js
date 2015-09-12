'use strict';

exports.create = function(model, request, response){
	var post = toData(request.body, model, request.session.passport);
	post.save(function(err){
		if(!err){
			post.save();
			response.send('Saved Data');
		}
		else{
			console.log('Checking if duplicate entry exists');
			model.findOne({slug:post.slug}, function(error, data){
				if(error){
					console.log(error);
					if(response !== null){
						response.status(500).send('Internal Error Occured');
					}
					return;
				}else{					
					if(data){
						response.send('Duplicate Entry Exists');
					}else{
						response.send('Error');
					}
				}
			});
		}
	});
};


function toData(body, Model, userData) {
	return new Model({
	title:body.title,
	type:body.type,
	link:body.link,
	description:body.description,
	tags:body.tags,
	by:userData.userName,
	slug:body.title.replace(/^\s+|\s+$/g,'').toLowerCase().replace(/[^a-z0-9]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-')
	});
}