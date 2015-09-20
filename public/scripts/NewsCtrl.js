'use strict';

angular.module('Wakaw').controller('NewsCtrl',['$scope','$routeParams','responseService', function($scope, $routeParams,responseService){

	$scope.init = function(){
		var promise = responseService.postData('homeList', {slug:$routeParams.slug});
		promise.then(function(response){
			if(response){
				$scope.item = response[0];
			}
		});
		$scope.commentText = '';
	};

	$scope.reply = function(){
		var promise = responseService.postData('addComment', {
			postId:$scope.item._id,
			commentText:$scope.commentText
		});

		promise.then(function(response){
			console.log(response);
		});
	};

	$scope.init();

}]);