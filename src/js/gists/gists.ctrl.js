require("../app.js");
require("../filters/pager.filter.js");

angular.module("gisty").controller("GistsCtrl", function ($scope, $http, $log, $q) {
  $scope.pagination = {
    currentPage: 1,
    perPage: 2,
    getOffset: function () {
      return $scope.pagination.currentPage * $scope.pagination.perPage;
    },
    prevPage: function () {
      $scope.pagination.currentPage--;
    },
    nextPage: function () {
      $scope.pagination.currentPage++;
    }
  };

  $http.get("https://api.github.com/users/miketierney/gists",  {
    headers: {
      "Authorization": "token 27843b9dbaf0afe2e6cae9069b14cabb5183f965",
    }
  }).then(successHandler, errorHandler);

  function successHandler(response) {
    var data = response.data;

    // DON'T DO THIS IN PRODUCTION. It's really inefficient.
    angular.forEach(data, function(gist) {
      angular.forEach(gist.files, function (file) {

        $http.get(file.raw_url).then(function (resp) {
          file.content = resp.data;
        }, function (resp) {
          $log.error("Something went wrong requesting " + file.raw_url, resp);
        });
      });
    })

    $scope.gists = response.data;
    $log.info("response", response);
  }

  function errorHandler(response) {
    $scope.error = response.data;
    $log.error("response", response);
  }
});
