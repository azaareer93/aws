angular.module('OrderController', ['AuthServices', 'queryService'])
  .controller('OrderCtrl', function($scope, $location,Auth, qService, toastr) {
    $scope.Order = {}
    $scope.Order.Client = {}
    $scope.Order.Items=[]
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
        $scope.getclients();
        $scope.Order.date = new Date();
        $scope.loadme = true;
        $scope.UserName = data.data.UserName;
      });
    }else {
      $location.path('/login'); // Redirect to home page
    }

    $scope.getclients = function () {
    qService.query("GET", "/api/clients/").then(function(data) {
      if (data.data.success) {
        $scope.ClientList = data.data.clients;
      }
      }).catch(function(err) {
        toastr.error(data.data.message);
      });
    };

    $scope.chooseClient = function (client) {
      $scope.isClientSelected = true;
      $scope.selectedClient = client;
      $scope.Order.ClientId = client._id;
      $scope.Order.Client = null;
    };

    $scope.clearClient = function (client) {
      $scope.isClientSelected = false;
      $scope.selectedClient = null;
      $scope.Order.ClientId = null;

    };

    $scope.addItem = function (item) {
      $scope.Order.Items.push(item)
      $scope.item = null
    }

    $scope.deleteItem= function (itemIndex) {
      $scope.Order.Items.splice(itemIndex,1);
    }

    $scope.saveOrder = function() {
      order = $scope.Order
      if(!order.ClientId){
        if(!order.Client.Name){
          toastr.error("الرجاء ادخال اسم الزبون ");
          return false
        }
        if(!order.Client.Address){
          toastr.error("الرجاء ادخال عنوان الزبون !");
          return false
        }
        if(!order.Client.Tel1){
          toastr.error("الرجاء ادخال الهاتف1 ");
          return false
        }
        if(!order.Client.Email){
          toastr.error("الرجاء ادخال البريد الاكتروني");
          return false
        }
      }
        qService.query('POST', "/api/orders/", order).then(function(data) {
          if (data.data.success) {
            toastr.success(data.data.message);
            console.log(data.data);
              $location.path('/');
          }
          else if (data.data.err) {
            var error = data.data.err
              if (error.code== 11000) {
                toastr.error("رقم الهاتف او البريد الالكتروني مستخدم مسبقاً لزبون آخر");
              }
          }
        }).catch(function(err) {
          console.log(err);
          toastr.error(data.data.err);

        });

   }

  });
