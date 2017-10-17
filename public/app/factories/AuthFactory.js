angular.module('AuthServices',[])
.factory('Auth',function($http,AuthToken,$window){
var  AuthFactory = {};
  AuthFactory.Login = function(LoginData) {
    return $http.post('/api/authenticate',LoginData).then(function(data){
      AuthToken.setToken(data.data.token);
      return data;
    });
  };
  //Auth.isLoggedIn();
  AuthFactory.isLoggedIn = function(){
     if (AuthToken.getToken()) {
       return true;
     } else {
        return false;
     }
  };
  //Auth.getUser();
  AuthFactory.getUser = function () {
    if (AuthToken.getToken()) {
    return  $http.post('/api/me');
    } else {
      $q.reject({message:'user has no token'});
    }
  };

//Auth.Logout();
  AuthFactory.Logout = function(){
    $window.localStorage.removeItem('token');
  };


 return AuthFactory;

})

.factory('AuthToken',function($window){
    var  AuthTokenFactory = {};
    //AuthToken.setToken(token);
    AuthTokenFactory.setToken=function(token){
        $window.localStorage.setItem('token',token);
    };

    //AuthToken.getToken();
    AuthTokenFactory.getToken=function(){
    return  $window.localStorage.getItem('token');

    };

    return AuthTokenFactory;
})
.factory('AuthInerceptors',function(AuthToken){
    var AuthInerceptorsFactory ={};
    //AuthInerceptors.request();
      AuthInerceptorsFactory.request = function (config) {
        var token = AuthToken.getToken();

        if (token) config.headers['x-access-token'] = token;

        return config;
      };
    return AuthInerceptorsFactory;
});
