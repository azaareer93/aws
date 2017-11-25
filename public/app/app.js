angular.module('myApp',
  [
    'appRoute',
    'MainController',
    'OrderController',
    'queryService',
    'AuthServices',
    'toastr'

  ])
  .config(function($httpProvider,toastrConfig){
    $httpProvider.interceptors.push('AuthInerceptors');
    angular.extend(toastrConfig, {
      autoDismiss: false,
      maxOpened: 0,
      timeOut: 1250,
      extendedTimeOut :0,
      tapToDismiss: true,
      closeButton: true,
      newestOnTop: true,
      positionClass: 'toast-bottom-right',
      preventDuplicates: false,
      preventOpenDuplicates: false,
    });
  });
