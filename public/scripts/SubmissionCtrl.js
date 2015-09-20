'use strict';
angular.module('Wakaw').controller('submissionCtrl', ['$scope', 'LxDialogService','responseService', function($scope, LxDialogService, responseService) {
    $scope.init = function() {
        loadTag();
        if (this.textFields) {
            for (var i in this.textFields) {
                delete this.textFields[i];
            }
        } else {
            this.textFields = {};
        }
    };
    $scope.dialogClose = function() {
        this.init();
        LxDialogService.close($scope.lxDialogElement[0].id);
    };
    $scope.dialogSave = function() {
        this.textFields.type = this.textFields.description === '' ? 'news' : 'ask';
        var promise = responseService.postData('submit', this.textFields);
        promise.then(function(response){
            console.log(response);
        });
        this.dialogClose();
    };

    function loadTag (){
        var data = responseService.getData('listTag');
        data.then(function(response){
            $scope.selectSections = response;
        });
    }
    $scope.init();
}]);