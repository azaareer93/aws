angular.module('MainController', ['AuthServices', 'queryService'])
  .controller('MainCtrl', function($scope,$window,toastr,Auth,qService) {
      // for post e.g.
      // qService.query('POST',"/api/orders/",OrderDate).then...etc
        $scope.index = 0;
        $scope.getOrders = function () {
        qService.query("GET", "/api/orders/").then(function(res) {
          if (res.data.success) {
            $scope.OrderList = res.data.orders;
          } else {
            $scope.orderList  = null;
          }
        }).catch(function(err) {
          console.log(err);
        });
      };
      $scope.selectOrder = function (orderIndex){
        $scope.index = orderIndex;
      }

      $scope.getOrders();




      $scope.viewItem = function (item) {
        $scope.ItemToView = item;
        console.log($scope.ItemToView);
      }

      $scope.fileChaned = function () {
        $scope.uploadButton = true;

        $scope.File = $('#orderFile')[0].files[0];
        if ($scope.File) {
          $scope.uploadButton = true;
        }else {
            $scope.uploadButton = false;
        }
        $scope.$apply();

      }

      $scope.uploadfile = function () {
        $scope.uploading = true;
        var fd = new FormData;
        orderId =  $scope.OrderList[$scope.index]._id
        orderFile =   $scope.File;

        fd.append('orderId',orderId)
        fd.append('orderFile',orderFile)

        var  config={
             transformRequest:angular.identity,
            headers:{'Content-Type': undefined }
           };

          qService.query('PUT','/api/orders/files/',fd,null,config.headers,config.transformRequest).then(function(data){
          if(!data.data.success){
            toastr.error(data.data.message);
            }else {
              toastr.success(data.data.message);
              // $scope.OrderList[$scope.index].files = data.data.order.files
              $scope.getOrders()
              }
          }).catch(function(err) {
          console.log(err);
        });
      }
  });
