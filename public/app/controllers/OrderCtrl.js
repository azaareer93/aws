angular.module('OrderController', ['AuthServices', 'queryService'])
  .controller('OrderCtrl', function($scope, Auth, qService) {
    $scope.Order = {}
    $scope.Order.Items=[]
    $scope.addItem = function (item) {
      console.log(item);
      $scope.Order.Items.push(item)
      $scope.item = null
    }

    $scope.saveOrder = function(order) {
      order = $scope.Order
      console.log(order);
      qService.query('POST', "/api/orders/", order).then(function(data) {
        if (data.data.success) {
          console.log(data.data.message);
        }
        console.log(data.data.message);

      }).catch(function(err) {
        console.log(err);
      });
   }

  });
