'use strict';
angular.module('Wakaw').controller('submissionCtrl', ['$scope', 'LxDialogService','responseService', function($scope, LxDialogService, responseService) {
    $scope.init = function() {
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
    $scope.selectSections = {
        '<i class="mdi mdi-android"></i>List': [{
            uid: '5',
            name: 'CSS'
        }, {
            uid: '6',
            name: 'JAVASCRIPT'
        }, {
            uid: '7',
            name: 'HTML'
        }, {
            uid: '8',
            name: 'JAVA'
        }]
    };
    $scope.init();
}])