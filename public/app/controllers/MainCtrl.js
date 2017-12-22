angular.module('MainController', ['AuthServices', 'queryService'])
  .controller('MainCtrl', function($scope,$window,$location,$interval,$timeout,toastr,Auth,qService) {
      // for post e.g.
      // qService.query('POST',"/api/orders/",OrderDate).then...etc
      $scope.loadme = false;
      if (Auth.isLoggedIn()) {
        // Check if a the token expired
        Auth.getUser().then(function(data) {
          // Check if the returned user is undefined (expired)
          if (data.data.UserName === undefined) {
            Auth.Logout(); // Log the user out
            $scope.isLoggedIn = false; // Set session to false
            $location.path('/'); // Redirect to home page
            $scope.loadme = true; // Allow loading of page
          }
          $scope.getOrders();
          $scope.loadme = true;
          $scope.UserName = data.data.UserName;
        });
      }else {
        $location.path('/login'); // Redirect to home page
      }

        $scope.index = 0;
        $scope.getOrders = function () {
        qService.query("GET", "/api/orders/").then(function(res) {
          if (res.data.success) {
            $scope.OrderList = res.data.orders;
            $scope.selectedOrder = $scope.OrderList[$scope.index]
            $scope.CalculatePayments(1);
            $scope.OrderPaymentStatus(1);
          } else {
            $scope.orderList  = null;
          }
        }).catch(function(err) {
          console.log(err);
        });
      };

      $scope.selectOrder = function (orderIndex){
        $scope.index = orderIndex;
        $scope.selectedOrder = $scope.OrderList[orderIndex];
        $scope.CalculatePayments(2);

      }

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

      $scope.doLogin = function(LoginData) {
        $scope.errorMsg = false;
        Auth.Login(LoginData).then(function(data) {
          if (data.data.success) {
            $scope.successMsg = data.data.message + " redirecting ...";
            $timeout(function() {
              $location.path('/');
              $scope.LoginData = undefined;
              $scope.checkSession();
                $scope.successMsg = false;
            }, 1300);
          } else {
            $scope.errorMsg = data.data.message;
            Auth.Logout();
          }
        });
      };

      $scope.Logout = function() {
        Auth.Logout();
        $location.path('/login');
      };

      $scope.ChangeOrderStatus = function (Status) {
      data = {
        "orderId":$scope.OrderList[$scope.index]._id,
        "Status": Status
      }
      qService.query('PUT','/api/orders/status/',data,null).then(function(data){
      if(!data.data.success){
        toastr.error(data.data.message);
        }else {
          toastr.success(data.data.message);
          $scope.OrderList[$scope.index].Status = Status
          }
      }).catch(function(err) {
      console.log(err);
    });
      }

    $scope.CalculatePayments = function(action) {
      if(action==1){
        for(var i = 0; i < $scope.OrderList.length; i++){
          var total = 0;
          for(var j = 0; j < $scope.OrderList[i].Payments.length; j++){
              var payment =  $scope.OrderList[i].Payments[j].Ammount;
              total += payment;
          }
            $scope.OrderList[i].TotalPayments = total;
            $scope.OrderList[i].Remaning =  $scope.OrderList[i].TotalPrice - total;
        }
      }
      if(action==2){
        var total = 0;
        for(var i = 0; i < $scope.selectedOrder.Payments.length; i++){
            var payment =  $scope.selectedOrder.Payments[i].Ammount;
            total += payment;
        }
          $scope.selectedOrder.TotalPayments = total;
          $scope.selectedOrder.Remaning =  $scope.selectedOrder.TotalPrice - total;
          console.log($scope.selectedOrder.Remaning);
      }
    }

    $scope.OrderPaymentStatus = function () {
      for(var i = 0; i < $scope.OrderList.length; i++){
        $scope.OrderList[i].OrderPaymentStatus = null;
        if($scope.OrderList[i].Remaning == 0){
          $scope.OrderList[i].OrderPaymentStatus = 3
        }else if ($scope.OrderList[i].Remaning == $scope.OrderList[i].TotalPrice) {
          $scope.OrderList[i].OrderPaymentStatus = 1
        }else {
          $scope.OrderList[i].OrderPaymentStatus = 2
        }
      }
    }

    $scope.addNewPayment = function (payment) {
      if(payment>$scope.selectedOrder.Remaning || payment<=0){
        toastr.warning("!!!");
      }else {
        data = {"orderId":$scope.selectedOrder._id,
        "Ammount":payment}
        qService.query('PUT','/api/orders/payments/',data,null).then(function(data){
        if(!data.data.success){
          toastr.error(data.data.message);
          }else {
            toastr.success(data.data.message);
            $scope.selectedOrder.Payments = data.data.order.Payments
            $scope.CalculatePayments(2);
            }
        }).catch(function(err) {
        console.log(err);
      });
      }
    }
      $scope.checkSession = function() {
        // Only run check if user is logged in
        if (Auth.isLoggedIn()) {
          $scope.checkingSession = true; // Use variable to keep track if the interval is already running
          // Run interval ever 30000 milliseconds (30 seconds)
          var interval = $interval(function() {
            var token = $window.localStorage.getItem('token'); // Retrieve the user's token from the client local storage
            // Ensure token is not null (will normally not occur if interval and token expiration is setup properly)
            if (!token) {
              $interval.cancel(interval); // Cancel interval if token is null
              $scope.isLoggedIn = false; // Set session to false
              $scope.loadme = true; // Allow loading of page
            } else {
              // Parse JSON Web Token using AngularJS for timestamp conversion
              self.parseJwt = function(token) {
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace('-', '+').replace('_', '/');
                return JSON.parse($window.atob(base64));
              };
              var expireTime = self.parseJwt(token); // Save parsed token into variable
              var timeStamp = Math.floor(Date.now() / 1000); // Get current datetime timestamp
              var timeCheck = expireTime.exp - timeStamp; // Subtract to get remaining time of token
              // Check if token has expired
              if (timeCheck <= 5) {
                $interval.cancel(interval); // Stop interval
                // console.log("session expired");
              } else {
                // console.log("session NOT expired yet");
              }
            }
          }, 30000);
        }
      };

      $scope.checkSession();
          // Will run code every time a route changes
          $scope.$on('$routeChangeStart', function(event, next, current) {
            $scope.checkSession();
            // Check if user is logged in
            if (Auth.isLoggedIn()) {
              $scope.isLoggedIn = true; // Variable to deactivate ng-show on index
              Auth.getUser().then(function(data) {
                $scope.UserName = data.data.UserName;
                //console.log("mian ",data.data);
                $scope.loadme = true;
                console.log($scope.isLoggedIn);
                if (next.$$route) {
                  if (next.$$route.originalPath == '/') {
                    $location.path('/');
                  }
                }
              });
            } else {
              $scope.errorMsg =false;
              $scope.successMsg=false;
              $scope.LoginData=null;
              $scope.isLoggedIn = false;
              $scope.loadme = true;
              if (!$scope.isLoggedIn && next.$$route.originalPath == '/' ) {
                $location.path('/login');
              }
            }
          });
  });
