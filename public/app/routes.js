var app = angular.module('appRoute',['ngRoute'])
  .config(function($routeProvider,$locationProvider) {

   $locationProvider.html5Mode({
       enabled:true,
       requireBase:false
   }).hashPrefix('');

  $routeProvider
      .when('/',{
            templateUrl:'app/views/orders/main.html',
            controller: 'MainCtrl'
            })
      .when('/new',{
            templateUrl:'app/views/orders/new.html',
            controller: 'OrderCtrl'
            })
      .when('/login',{
            templateUrl:'app/views/users/login.html',
            controller: 'MainCtrl'
            })
      .otherwise({redirectTo:'/'});

});
