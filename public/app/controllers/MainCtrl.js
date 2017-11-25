angular.module('MainController', ['AuthServices', 'queryService'])
  .controller('MainCtrl', function($scope,$window,toastr,Auth,qService) {
      // for post e.g.
      // qService.query('POST',"/api/orders/",OrderDate).then...etc
      getOrders = (function () {
        qService.query("GET", "/api/orders/").then(function(res) {
          if (res.data.success) {
            $scope.OrderList = res.data.orders;
            $scope.index = 0;
          } else {
            $scope.orderList  = null;
          }
        }).catch(function(err) {
          console.log(err);
        });
      })();

      $scope.selectOrder = function (orderIndex){
        $scope.index = orderIndex;
      }

      $scope.viewItem = function (item) {
        $scope.ItemToView = item;
        console.log($scope.ItemToView);
      }

      $scope.getFile = function () {
            $scope.$apply(function(scope) {
              $scope.FileToUplad = $('#orderFile')[0].files;
              if($scope.FileToUplad.length>=1){
                $scope.uploadButton = true;
                $scope.File = $scope.FileToUplad[0]
              }else {
                $scope.uploadButton = false;
              }
            });
      }

      $scope.uploadfile = function () {
        $scope.uploading = true;
        var fd = new FormData;
        orderId =  $scope.OrderList[$scope.index]._id
        orderFile =   $scope.File;

        console.log("orderId:", orderId);
        console.log("orderFile:", orderFile);

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
              $scope.OrderList[$scope.index] = data.data.order;
              $scope.uploadButton = false;
            }
          }).catch(function(err) {
          console.log(err);
        });
      }
  });
