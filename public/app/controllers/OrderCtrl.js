angular.module('OrderController', ['AuthServices', 'queryService'])
  .controller('OrderCtrl', function($scope, $location,Auth, qService, toastr) {
    $scope.Order = {}
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
    };

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
