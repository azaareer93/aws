angular.module('MainController', ['AuthServices', 'queryService', 'angularUtils.directives.dirPagination'])
  .controller('MainCtrl', function($scope, $filter, $window, $location, $interval, $timeout, toastr, Auth, qService) {
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
        $scope.User = data.data;
        $scope.ProcessCurrentRout();

      });
    } else {
      Auth.Logout();
      $location.path('/login'); // Redirect to home page
    }

    $scope.getOrders = function() {
      qService.query("GET", "/api/orders/").then(function(res) {
        if (res.data.success) {
          $scope.OrderList = res.data.orders;
          $scope.selectedOrder = $scope.OrderList[$scope.OrderList.length-1]
          $scope.CalculatePayments(1);
          $scope.OrderPaymentStatus(1);
          $scope.assignClients();
        } else {
          $scope.orderList = null;
        }
      }).catch(function(err) {
        console.log(err);
      });
    };

    $scope.getUsers = function() {
      qService.query("GET", "/api/users/").then(function(res) {
        if (res.data.success) {
          $scope.Users = res.data.users;
        } else {
          $scope.Users = null;
        }
      }).catch(function(err) {
        toastr.error("تأكد من صحة البيانات المدخلة");
      });
    };

    $scope.saveUsers = function(user) {
      if(user){
      if(user.Password != user.conPassword | user.Password == null){
        toastr.error("خطأ في كلمة المرور");
        return 0
      }
      qService.query("POST", "/api/users/",user,null).then(function(res) {
        console.log(res.data);
        if (res.data.success) {
          $scope.Users.push(res.data.user);
          toastr.success(res.data.message);
        }else {
          toastr.error(res.data.message);
        }
      }).catch(function(err) {
      });
      }
    };


    $scope.getLogs = function() {
      qService.query("GET", "/api/logs/").then(function(res) {
        if (res.data.success) {
          $scope.Logs = res.data.logs;
        } else {
          $scope.Logs = null;
        }
      }).catch(function(err) {
        toastr.error("تأكد من صحة البيانات المدخلة");
      });
    };


    $scope.assignClients = function() {
      qService.query("GET", "/api/clients/").then(function(data) {
        if (data.data.success) {
          for (var i = 0; i < $scope.OrderList.length; i++) {
            for (var j = 0; j < data.data.clients.length; j++) {
              if ($scope.OrderList[i].ClientId == data.data.clients[j]._id) {
                $scope.OrderList[i].Client = data.data.clients[j];
              }
            }
          }
        }
      });
    }
    $scope.selectOrder = function(orderId) {
        // We filter the array by id, the result is an array
     // so we select the element 0
     $scope.selectedOrder = $filter('filter')($scope.OrderList,
          function (d) {return d._id == orderId;
          })[0];
      $scope.CalculatePayments(2);
    }

    $scope.sort = function(keyname) {
      $scope.sortBy = keyname; //set the sortBy to the param passed
      $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    $scope.sortu = function(keyname) {
      $scope.sortByu = keyname; //set the sortBy to the param passed
      $scope.reverse1 = !$scope.reverse1; //if true make it false and vice versa
    }

    $scope.printDiv = function(divName) {
    var printContents = document.getElementById(divName).innerHTML;
    var popupWin = window.open('', '_blank', 'width=300,height=300');
    popupWin.document.open();
    popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css" /> <link rel="stylesheet" type="text/css" href="assets/css/bootstrap-rtl.css" /> <link rel="stylesheet" type="text/css" href="assets/css/style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
    popupWin.document.close();
  }

    $scope.viewItem = function(item) {
      $scope.ItemToView = item;
    }

    $scope.ChangeitemStatus = function(item, itemStatus) {
        item.Status = itemStatus
        $scope.EditItem (item);
    }

    $scope.fileChaned = function() {
      $scope.uploadButton = true;

      $scope.File = $('#orderFile')[0].files[0];
      if ($scope.File) {
        $scope.$apply();
        $scope.uploadButton = true;
      } else {
        $scope.uploadButton = false;
      }

    }

    $scope.uploadfile = function() {
      $scope.uploading = true;
      var fd = new FormData;
      orderId =   $scope.selectedOrder._id
      orderFile = $scope.File;

      fd.append('orderId', orderId)
      fd.append('orderFile', orderFile)

      var config = {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      };

      qService.query('PUT', '/api/orders/files/', fd, null, config.headers, config.transformRequest).then(function(data) {
        if (!data.data.success) {
          toastr.error(data.data.message);
        } else {
          toastr.success(data.data.message);
          $scope.selectedOrder.files = data.data.order.files;
          $scope.uploadButton = false;
          $scope.File
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

    $scope.ChangeOrderStatus = function(Status) {
      data = {
        "orderId":  $scope.selectedOrder._id,
        "Status": Status
      }
      qService.query('PUT', '/api/orders/status/', data, null).then(function(data) {
        if (!data.data.success) {
          toastr.error(data.data.message);
        } else {
          toastr.success(data.data.message);
          $scope.selectedOrder.Status = Status
        }
      }).catch(function(err) {
        toastr.error("تأكد من صحة البيانات المدخلة");
      });
    }

    $scope.CalculatePayments = function(action) {
      if (action == 1) {
        for (var i = 0; i < $scope.OrderList.length; i++) {
          var total = 0;
          for (var j = 0; j < $scope.OrderList[i].Payments.length; j++) {
            var payment = $scope.OrderList[i].Payments[j].Ammount;
            total += payment;
          }
          $scope.OrderList[i].TotalPayments = total;
          $scope.OrderList[i].Remaning = $scope.OrderList[i].TotalPrice - total;
        }
      }
      if (action == 2) {
        var total = 0;
        for (var i = 0; i < $scope.selectedOrder.Payments.length; i++) {
          var payment = $scope.selectedOrder.Payments[i].Ammount;
          total += payment;
        }
        $scope.selectedOrder.TotalPayments = total;
        $scope.selectedOrder.Remaning = $scope.selectedOrder.TotalPrice - total;
      }
    }

    $scope.OrderPaymentStatus = function(action) {
      if (action == 1) {
        for (var i = 0; i < $scope.OrderList.length; i++) {
          $scope.OrderList[i].OrderPaymentStatus = null;
          if ($scope.OrderList[i].Remaning == 0) {
            $scope.OrderList[i].OrderPaymentStatus = 3
          } else if ($scope.OrderList[i].Remaning == $scope.OrderList[i].TotalPrice) {
            $scope.OrderList[i].OrderPaymentStatus = 1
          } else {
            $scope.OrderList[i].OrderPaymentStatus = 2
          }
        }
      }
      if (action == 2) {
        if ($scope.selectedOrder.Remaning == 0) {
          $scope.selectedOrder.OrderPaymentStatus = 3
        } else if ($scope.selectedOrder.Remaning == $scope.selectedOrder.TotalPrice) {
          $scope.selectedOrder.OrderPaymentStatus = 1
        } else {
          $scope.selectedOrder.OrderPaymentStatus = 2
        }
      }
    }

    $scope.addNewPayment = function(payment) {
      if (payment > $scope.selectedOrder.Remaning || payment <= 0 || !payment) {
        toastr.warning("!!!");
      } else {
        data = {
          "orderId": $scope.selectedOrder._id,
          "Ammount": payment
        }
        qService.query('PUT', '/api/orders/payments/', data, null).then(function(data) {
          if (!data.data.success) {
            toastr.error(data.data.message);
          } else {
            toastr.success(data.data.message);
            $scope.selectedOrder.Payments = data.data.order.Payments
            $scope.CalculatePayments(2);
            $scope.OrderPaymentStatus(2);
          }
          $timeout(function() {
            scrollDown("payment-body");
          }, 0, false);

        }).catch(function(err) {
          toastr.error("تأكد من صحة البيانات المدخلة");
        });
      }
    }

    $scope.removeItem = function(itemId) {
      data = {
        "orderId": $scope.selectedOrder._id,
        "itemId": itemId
      }
      qService.query('PUT', '/api/orders/delete-items/', data, null).then(function(data) {
        if (!data.data.success) {
          toastr.error(data.data.message);
        } else {
          toastr.success(data.data.message);
          if (data.data.order.Items.length == 0) {
            $scope.selectedOrder.Items = []
          } else {
            $scope.selectedOrder.Items = data.data.order.Items
          }
        }
      }).catch(function(err) {
        toastr.error("تأكد من صحة البيانات المدخلة");
      });

    }

    $scope.removePayment = function(payment_id) {
      data = {
        "orderId": $scope.selectedOrder._id,
        "payment_id": payment_id
      }
      qService.query('PUT', '/api/orders/delete-payments/', data, null).then(function(data) {
        if (!data.data.success) {
          toastr.error(data.data.message);
        } else {
          toastr.success(data.data.message);
          if (data.data.order.Payments.length == 0) {
            $scope.selectedOrder.Payments = []
          } else {
            $scope.selectedOrder.Payments = data.data.order.Payments
          }
          $scope.CalculatePayments(2);
          $scope.OrderPaymentStatus(2);
        }
      }).catch(function(err) {
        toastr.error("تأكد من صحة البيانات المدخلة");
      });

    }

    $scope.addNewItem = function(item) {
      data = {
        "orderId": $scope.selectedOrder._id,
        "item": item
      }
      qService.query('PUT', '/api/orders/put-items/', data, null).then(function(data) {
        if (!data.data.success) {
          toastr.error(data.data.message);
        } else {
          toastr.success(data.data.message);
          if (data.data.order.Items.length == 0) {
            $scope.selectedOrder.Items = []
          } else {
            $scope.selectedOrder.Items = data.data.order.Items
          }
        }
      }).catch(function(err) {
        toastr.error("تأكد من صحة البيانات المدخلة");
      });
      $scope.item = {}
    }

    $scope.PutItemToEdit = function(item) {
      $scope.itemToEdit = item
    }

    $scope.EditItem = function(item) {
      data = {
        "orderId": $scope.selectedOrder._id,
        "item": item
      }
      qService.query('PUT', '/api/orders/put-items/', data, null).then(function(data) {
        if (!data.data.success) {
          toastr.error(data.data.message);
        } else {
          toastr.success(data.data.message);
                }
      }).catch(function(err) {
        console.log(err);
        toastr.error("تأكد من صحة البيانات المدخلة");
      });
      $scope.item = {}
    }

    $scope.EditClient = function(client) {
      qService.query('PUT', '/api/orders/client/', client, null).then(function(data) {
        if (!data.data.success) {
          toastr.error(data.data.message);
        } else {
          toastr.success(data.data.message);
          $scope.selectedOrder.Client = data.data.client;
        }
      }).catch(function(err) {
        toastr.error("تأكد من صحة البيانات المدخلة");
      });
    }

    $scope.EditPrice = function() {
      $scope.PriceEditMode = true
    }

    $scope.SavePrice = function(orderId, price) {
      data = {
        "orderId": orderId,
        "Price": price
      }
      qService.query('PUT', '/api/orders/price/', data, null).then(function(data) {
        if (!data.data.success) {
          toastr.error(data.data.message);
        } else {
          toastr.success(data.data.message);
          $scope.selectedOrder.TotalPrice = data.data.order.TotalPrice;
        }
        $scope.PriceEditMode = false
        $scope.CalculatePayments(2);
        $scope.OrderPaymentStatus(2);

      }).catch(function(err) {
        toastr.error("تأكد من صحة البيانات المدخلة");
      });
    }

    scrollDown = function(id) {
      var scroller = document.getElementById(id);
      scroller.scrollTop = scroller.scrollHeight + 100;
    }

    $scope.PutUserToEdit = function (user) {
      $scope.UserToEdit = user
      $scope.UserEditMode = true
    }

    $scope.EditUsers = function (EditUsers) {
      if(EditUsers.Password !=EditUsers.conPassword){
        toastr.error("كلمة السر غير مساوية للتأكيد");
        return false
      }

      if(!EditUsers.Password || EditUsers.Password.length<4){
        toastr.error("كلمة السر قصيرة .. الحد الادنى 4 ");
        return false
      }

      qService.query('PUT','/api/editUser/', EditUsers, null).then(function(data) {
        if (!data.data.success) {
          toastr.error(data.data.message);
        } else {
          toastr.success(data.data.message);
          $scope.getUsers();
          $scope.getLogs();
          $scope.UserEditMode = false;
        }
      }).catch(function(err) {
        toastr.error("تأكد من صحة البيانات المدخلة");
      });
    }

    $scope.CancelEditUsers = function () {
      $scope.UserToEdit = null
      $scope.UserEditMode = false
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
    $scope.ProcessCurrentRout = function() {
      if ($location.path() == '/users' & $scope.User.Role!="ADMIN") {
        $location.path('/');
      }else if ($location.path() == '/users' & $scope.User.Role == "ADMIN") {
        $scope.getUsers();
        $scope.getLogs();

      }

    }

    $scope.$on('$routeChangeStart', function(event, next, current) {
      $scope.checkSession();
      // Check if user is logged in
      if (Auth.isLoggedIn()) {
        $scope.isLoggedIn = true; // Variable to deactivate ng-show on index
        Auth.getUser().then(function(data) {
          $scope.user = data.data;
          //console.log("mian ",data.data);
          $scope.loadme = true;
          if (next.$$route) {
            if (next.$$route.originalPath == '/') {
              $location.path('/');
            }
          }
        });
      } else {
        $scope.errorMsg = false;
        $scope.successMsg = false;
        $scope.LoginData = null;
        $scope.isLoggedIn = false;
        $scope.loadme = true;
        if (!$scope.isLoggedIn && next.$$route.originalPath == '/') {
          $location.path('/login');
        }
      }
    });
  });
