angular.module('MainController', ['AuthServices', 'queryService'])
  .controller('MainCtrl', function($scope,Auth,qService) {
      // for post e.g.
      // qService.query('POST',"/api/orders/",OrderDate).then...etc
      getOrders = (function () {
        qService.query("GET", "/api/orders/").then(function(res) {
          if (res.data.success) {
            $scope.OrderList = res.data.orders;
            $scope.index = 0;
            console.log($scope.OrderList);
          } else {
            $scope.orderList  = null;
          }
        }).catch(function(err) {
          console.log(err);
        });
      })();

      $scope.selectOrder = function (orderIndex, thisorder){
        console.log(thisorder);
        $scope.index = orderIndex;

      }

      $scope.viewItem = function (item) {
        $scope.ItemToView = item;
        console.log($scope.ItemToView);
      }
  });
