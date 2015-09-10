'use strict';
angular.module('Wakaw', ['ngRoute', 'lumx', 'angularMoment']).config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
    }).when('/news/:id', {
        templateUrl: 'views/post.html',
        controller: 'NewsCtrl'
    }).when('/ask/:id', {
        templateUrl: 'views/post.html',
        controller: 'AskCtrl'
    }).otherwise({
        redirectTo: '/'
    });
    //$locationProvider.html5Mode(true);
}).factory('responseService', ['$http', 'LxNotificationService', function($http, LxNotificationService) {
    return {
        path: '/api/v1/',
        successCb: function(response) {
            return response.data;
        },
        errorCb: function(err) {
            var text = err.config.url + ' : ' + err.data.message;
            LxNotificationService.error(err.data.message);
            throw text;
        },
        getData: function(url) {
            var self = this;
            return $http.get(self.path + url).then(self.successCb, self.errorCb);
        },
        postData: function(url, postData) {
            var self = this;
            return $http.post(self.path + url, angular.toJson(postData)).then(self.successCb, self.errorCb);
        }
    };
}]).factory('LoginService', ['$rootScope', function($rootScope) {
    var loginDetails = {
        isLoggedIn: false,
        userDetails: {
            userName: '',
            email: ''
        }
    };
    this.reset = function() {
        loginDetails = {
            isLoggedIn: false,
            userDetails: {
                userName: '',
                email: ''
            }
        };
    };
    this.setLoggedIn = function(name, email) {
        loginDetails.isLoggedIn = true;
        this.setUserDetails(name, email);
        $rootScope.$broadcast('isLoggedIn', loginDetails);
    };
    this.setUserDetails = function(name, email) {
        loginDetails.userDetails.userName = name;
        loginDetails.userDetails.email = email;
    };
    this.getState = function() {
        return loginDetails.isLoggedIn;
    };
    this.getUserDetails = function() {
        return loginDetails.userDetails;
    };
    this.logoutUser = function() {
        this.reset();
        $rootScope.$broadcast('isLoggedIn', loginDetails);
    };
    return this;
}]);