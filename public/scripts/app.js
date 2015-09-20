'use strict';

angular.module('Wakaw', ['ngRoute', 'lumx', 'angularMoment','ngCookies']).config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
    }).when('/news/:slug', {
        templateUrl: 'views/post.html',
        controller: 'NewsCtrl'
    }).when('/ask/:slug', {
        templateUrl: 'views/post.html',
        controller: 'AskCtrl'
    }).when('/submitTag', {
        templateUrl: 'views/tags.html',
        controller: 'TagCtrl'
    }).otherwise({
        redirectTo: '/'
    });
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
}]).factory('LoginService', ['$rootScope','responseService','$cookieStore', function($rootScope,responseService,$cookieStore) {
    var loginDetails = {
        isLogged: false,
        userDetails: {
            userName: '',
            email: ''
        }
    };
    this.reset = function() {
        loginDetails = {
            isLogged: false,
            userDetails: {
                userName: '',
                email: ''
            }
        };
    };
    this.setLoggedIn = function(name, email) {
        loginDetails.isLogged = true;
        this.setUserDetails(name, email);
        $rootScope.$broadcast('isLogged', loginDetails);
    };
    this.setUserDetails = function(name, email) {
        loginDetails.userDetails.userName = name;
        loginDetails.userDetails.email = email;
    };
    this.getState = function() {
        return loginDetails.isLogged;
    };
    this.getUserDetails = function() {
        return loginDetails.userDetails;
    };
    this.getUserInfo = function(){
        var promise = responseService.getData('user'),
            self = this;
        promise.then(function(response){
            if(response.userName){
                self.setLoggedIn(response.userName,response.email);
           }else{
            console.error(response);
            }
        });
    };
    this.logoutUser = function() {
        var promise = responseService.getData('logout');
        promise.then(function(response){
            if(response){
                $cookieStore.remove('Gyro_isLogged');
            }
        });
        this.reset();
        $rootScope.$broadcast('isLogged', loginDetails);
    };
    return this;
}]);

angular.module('Wakaw').run(['$cookieStore','LoginService',function($cookieStore,LoginService){
    var isLogged = $cookieStore.get('Gyro_isLogged');
    if(isLogged){
        LoginService.getUserInfo();
    }
}]);

