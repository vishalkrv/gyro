'use strict';
angular.module('Wakaw').controller('MainCtrl', ['$scope', '$route', 'responseService', 'LxDialogService','$rootScope','LoginService','$location',
    function($scope, $route, responseService, LxDialogService,$rootScope,LoginService, $location) {

        $scope.userStatus = {
            isLogged:false
        };

        $rootScope.$on('isLogged', function(event, data){
            $scope.userStatus = data;
        });

        $scope.updatePoints = function(id){
            var promise = responseService.postData('updatePoints',{_id:id});
            promise.then(function(response){
                console.log(response);
            }); 
        };

        $scope.redirect = function(slug, type){
            $location.url(type+'/'+slug);
        };       

        $scope.layout = 'views/layout.html';

        $scope.logout =  function(){
            LoginService.logoutUser();
        };

        $scope.openDialog = function(dialogId) {
            LxDialogService.open(dialogId);
        };
        $scope.findFilter = function(event, searchText) {
            if (event.keyCode === 13) {
                console.log(searchText);
            }
        };
    }
]);