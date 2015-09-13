'use strict';
angular.module('Wakaw').controller('MainCtrl', ['$scope', '$route', 'LxDialogService','$rootScope','LoginService',
    function($scope, $route, LxDialogService,$rootScope,LoginService) {

        $scope.userStatus = {
            isLogged:false
        };

        $rootScope.$on('isLogged', function(event, data){
            $scope.userStatus = data;
        });

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