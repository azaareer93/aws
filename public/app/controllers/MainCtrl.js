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
        });
      }else {
        $location.path('/login'); // Redirect to home page
      }

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
        app.errorMsg = false;
        Auth.Login(LoginData).then(function(data) {
          if (data.data.success) {
            app.successMsg = data.data.message + " redirecting ...";
            $timeout(function() {
              $location.path('/');
              $scope.LoginData = undefined;
              $scope.checkSession();
                $scope.successMsg = false;
            }, 1300);
          } else {
            app.errorMsg = data.data.message;
            Auth.Logout();
          }
        });
      };

      $scope.checkSession = function() {
        // Only run check if user is logged in
        if (Auth.isLoggedIn()) {
          app.checkingSession = true; // Use variable to keep track if the interval is already running
          // Run interval ever 30000 milliseconds (30 seconds)
          var interval = $interval(function() {
            var token = $window.localStorage.getItem('token'); // Retrieve the user's token from the client local storage
            // Ensure token is not null (will normally not occur if interval and token expiration is setup properly)
            if (!token) {
              $interval.cancel(interval); // Cancel interval if token is null
              app.isLoggedIn = false; // Set session to false
              app.loadme = true; // Allow loading of page


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
              // console.log(" expireTime: "+expireTime.exp);
              // console.log("timeStamp : "+timeStamp);
              // console.log(" timeCheck : "+timeCheck);
              // Check if token has expired
              if (timeCheck <= 25) {
                showModal(1); // Open bootstrap modal and let user decide what to do
                $interval.cancel(interval); // Stop interval
                // console.log("session expired");
              } else {
                // console.log("session NOT expired yet");
              }

            }
          }, 30000);
        }
      };

  });
