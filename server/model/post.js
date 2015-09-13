'use strict';

exports.create = function(model, request, response){
	var post = toData(request.body, model, request.session.passport);
	post.save(function(err){
		if(!err){
			post.save();
			response.send('Saved Data');
		}
		else{
			model.findOne({slug:post.slug}, function(error, data){
				if(error){
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

exports.listAll = function(model, request, response){
	model.find(function(err, result){
		if(err){
			response.status(200).send('Error Fetching List');
		}
		if(response !== null){
			var list = {};
			list.news = [];
			list.ask = [];

			for(var i in result){
				if(result[i].type === 'news'){
					list.news.push(result[i]);
				}
				if(result[i].type === 'ask'){
					list.ask.push(result[i]);
				}
			}
			response.status(200).send(JSON.stringify(list));
		}else{
			response.status(501).send('Server Error');
		}
	});
};

exports.listByType = function(model, request, response){
	model.find({}, function(err, result){
		if(err){
			response.status(200).send('Error Fetching List');
		}
		if(response !== null){
			response.status(200).send(JSON.stringify(result));
		}else{
			response.status(501).send('Server Error');
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
	by:userData.user.userName,
	slug:body.title.replace(/^\s+|\s+$/g,'').toLowerCase().replace(/[^a-z0-9]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-')
	});
}