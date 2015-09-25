'use strict';
var opts = [{
		path: '_by',
		select: 'userName'
	}, {
		path: '_tags',
		select: 'name'
	}, {
		path: '_comments._by',
		select: 'userName'
	}],
	tagsArr = [{
		name: 'HTML5'
	}, {
		name: 'HADOOP'
	}, {
		name: 'JAVA'
	}, {
		name: 'JAVASCRIPT'
	}, {
		name: 'NODEJS'
	}, {
		name: 'SPARK'
	}, {
		name: 'HIVE'
	}, {
		name: 'SQL'
	}, {
		name: 'HIBERNATE'
	}, {
		name: 'SPRING'
	}, {
		name: 'MYSQL'
	}];

function toData(body, Model, userData) {
	return new Model({
		title: body.title,
		type: body.type,
		link: body.link,
		description: body.description,
		_tags: body.tags,
		_by: userData.user._id,
		slug: body.title.replace(/^\s+|\s+$/g, '').toLowerCase().replace(/[^a-z0-9]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
	});
}
exports.create = function(model, request, response) {
	var post = toData(request.body, model, request.session.passport);
	post.save(function(err) {
		if (!err) {
			post.save();
			response.send('Saved Data');
		} else {
			model.findOne({
				slug: post.slug
			}, function(error, data) {
				if (error) {
					if (response !== null) {
						response.status(500).send('Internal Error Occured');
					}
					return;
				} else {
					if (data) {
						response.send('Duplicate Entry Exists');
					} else {
						response.send('Error');
					}
				}
			});
		}
	});
};
exports.listOne = function(model, request, response) {
	model.find({
		slug: request.body.slug
	}, function(err, result) {
		if (err) {
			response.status(200).send('Error Fetching List');
		}
		if (result !== null) {
			model.populate(result, opts, function(err, data) {
				if (!err) {
					response.status(200).send(data);
				} else {
					response.status(200).send('Error Bro');
				}
			});
		} else {
			response.status(501).send('Server Error');
		}
	});
};
exports.updatePoints = function(model, req, res) {
	var condition = {
			_id: req.body._id
		},
		update = {
			$inc: {
				points: 5
			}
		};
	model.update(condition, update, function(err, result) {
		if (err) {
			res.status(500).send('Internal Error Occured');
		}
		if (!err) {
			res.status(200).send('Updated');
		}
	});
};
exports.listTag = function(model, request, response) {
	model.find(function(err, result) {
		if (err) {
			response.status(200).send('Error Fetching List');
		}
		if (result !== null) {
			if (result.length === 0) {
				model.collection.insert(tagsArr, function(err, data) {
					if (err) {
						response.send('Error');
					} else {
						response.status(200).send(data.ops);
					}
				});
			} else {
				response.status(200).send(result);
			}
		} else {
			response.status(501).send('Server Error');
		}
	});
};
exports.submitTag = function(Model, request, response) {
	var tag = new Model({
		name: request.body.tagName
	});
	tag.save(function(err) {
		if (!err) {
			tag.save();
			response.send('Saved Data');
		} else {
			tag.findOne({
				name: request.body.tagName
			}, function(error, data) {
				if (error) {
					if (response !== null) {
						response.status(500).send('Internal Error Occured');
					}
					return;
				} else {
					if (data) {
						response.send('Duplicate Entry Exists');
					} else {
						response.send('Error');
					}
				}
			});
		}
	});
};
exports.listAll = function(model, request, response) {
	model.find(function(err, result) {
		if (err) {
			response.status(200).send('Error Fetching List');
		}
		if (response !== null) {
			model.populate(result, opts, function(err, data) {
				if (err) {
					response.status(200).send('Error Boy');
				}
				if (data !== null) {
					var list = {};
					list.news = [];
					list.ask = [];
					for (var i in data) {
						if (data[i].type === 'news') {
							list.news.push(data[i]);
						}
						if (data[i].type === 'ask') {
							list.ask.push(data[i]);
						}
					}
					response.status(200).send(JSON.stringify(list));
				}
			});
		} else {
			response.status(501).send('Server Error');
		}
	});
};
exports.listByType = function(model, request, response) {
	if (request.body.orderBy === 'Latest') {
		model.find({
			type: request.body.type
		}, {}, {
			sort: {
				'time': -1
			}
		}, function(err, data) {
			if (!err) {
				model.populate(data, [{
					path: '_by',
					select: 'userName'
				}], function(err, result) {
					if (!err) {
						response.status(200).send(result);
					} else {
						response.status(500).send(err);
					}
				});
			} else {
				response.status(500).send(err);
			}
		});
	} else {
		model.find({
			type: request.body.type
		}, {}, {
			sort: {
				'time': 1
			}
		}, function(err, data) {
			if (!err) {
				model.populate(data, [{
					path: '_by',
					select: 'userName'
				}], function(err, result) {
					if (!err) {
						response.status(200).send(result);
					} else {
						response.status(500).send(err);
					}
				});
			} else {
				response.status(500).send(err);
			}
		});
	}
};
exports.postComment = function(Model, request, response) {
	Model.findByIdAndUpdate(request.body.postId, {
		$push: {
			_comments: {
				'text': request.body.commentText,
				'_by': request.session.passport.user._id
			}
		}
	}, {
		safe: true,
		upsert: true,
		new: true
	}, function(err, data) {
		if (!err) {
			Model.populate(data, opts, function(err, result) {
				if (!err) {
					response.status(200).send(result);
				} else {
					response.status(500).send(err);
				}
			});
		} else {
			response.status(500).send(err);
		}
	});
};