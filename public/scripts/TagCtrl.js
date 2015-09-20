'use strict';

angular.module('Wakaw').controller('TagCtrl',['$scope','responseService',function($scope, responseService){
	$scope.name = '';
	$scope.submit = function(){
		var promise = responseService.postData('submitTag', {tagName:$scope.name});
		promise.then(function(response){
			if(response){
				$scope.name = '';
			}
		});
	};
}]);