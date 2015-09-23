'use strict';
angular.module('Wakaw').controller('HomeCtrl', ['$scope', 'responseService', function($scope, responseService) {
    $scope.orderList = ['Latest', 'Trending'];
    $scope.homeList = {
        news: '',
        ask: ''
    };

    $scope.getList = function(type, orderBy) {
    	if(type){
    	var promise = responseService.postData('homeList',{type:type,orderBy:orderBy});
        promise.then(function(response) {
            $scope.homeList[type] = response;
        });
    	}else{
    		var promis = responseService.postData('homeList');
        	promis.then(function(response) {
            $scope.homeList.news = response.news;
            $scope.homeList.ask = response.ask;
        	});
    	}
        
    };

    $scope.getList();
}]);