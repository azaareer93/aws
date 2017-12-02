angular.module('OrderController', ['AuthServices', 'queryService'])
  .controller('OrderCtrl', function($scope, $location,Auth, qService, toastr) {
    $scope.Order = {}
    $scope.Order.Items=[]

    $scope.addItem = function (item) {
      $scope.Order.Items.push(item)
      $scope.item = null
    }

    $scope.deleteItem= function (itemIndex) {
      console.log(itemIndex);
      $scope.Order.Items.splice(itemIndex,1);
    }

    $scope.saveOrder = function(order) {
      order = $scope.Order
      qService.query('POST', "/api/orders/", order).then(function(data) {
        if (data.data.success) {
          toastr.success(data.data.message);
          console.log(data.data);
            $location.path('/');
        }
        else {
          console.log(data.data);
          toastr.error(data.data.message);
        }
      }).catch(function(err) {
        console.log(data.data);
        toastr.error(data.data.message);
      });
   }

  });
