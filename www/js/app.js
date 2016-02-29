// http://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=flickr.cb&tags=london

angular.module('flickr', ['ionic'])
    .controller('ItemsCtrl', ['$scope', '$http', '$ionicModal', '$ionicSideMenuDelegate', function($scope, $http, $ionicModal, $ionicSideMenuDelegate) {
        $scope.flickr = {
            items: [],
            tag: '',
            feed: {},
            flickrUrl: 'http://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=JSON_CALLBACK&tags='
        };

        $ionicModal.fromTemplateUrl('new-tag.html', function(modal) {
            $scope.taskModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });

        $scope.fetch = function() {
            $scope.code = null;
            $scope.response = null;

            $http({method: 'jsonp', url: $scope.flickr.flickrUrl + $scope.flickr.tag}).
                then(function(response) {
                    angular.forEach(response.data.items, function(item){
                        item.media.m = item.media.m.replace('_m.jpg', '.jpg');
                        $scope.flickr.items.push(item);
                    });
                }, function(response) {
                    $scope.data = response.data || "Request failed";
                    $scope.status = response.status;
                });
        };

        $scope.fetch();

        $scope.newTag = function() {
            $scope.taskModal.show();
        };

        $scope.closeNewTag = function() {
            $scope.taskModal.hide();
        };

        $scope.createTag = function (tag) {
            $scope.flickr.tag = tag;
            $scope.flickr.items =  [];
            $scope.fetch();
            $scope.taskModal.hide();
        };

        $scope.doRefresh = function() {
            $scope.flickr.items =  [];
            $scope.fetch();
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$apply()
        };

    }])
    .filter("sanitize", ['$sce', function($sce) {
      return function(htmlCode){
          return $sce.trustAsHtml(htmlCode);
      }
    }]);