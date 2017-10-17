angular.module('OrderController', ['AuthServices', 'queryService'])
  .controller('OrderCtrl', function($scope, Auth, qService) {
    $scope.saveOrder = function(order) {
      console.log(order);
      qService.query("POST", "/api/orders/", order).then(function(data) {
        if (data.data.order) {
          console.log(data.data.order);
        }
      }).catch(function(err) {
        console.log(err);
      });
    }

  });
