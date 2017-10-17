angular.module('MainController', ['AuthServices', 'queryService'])
  .controller('MainCtrl', function($scope,Auth,qService) {

    if (Auth.isLoggedIn()) {
      // for post e.g.
      // qService.query('POST',"/api/orders/",OrderDate).then...etc

      qService.query("GET", "/api/orders/").then(function(data) {
        if (data.data.orders.length) {
          $scope.orderList  = data.data.orders;
        } else {
          $scope.orderList  = null;
        }
      }).catch(function(err) {
        console.log(err);
      });
    }

  });
