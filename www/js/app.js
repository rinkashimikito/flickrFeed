// http://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=flickr.cb&tags=london

angular.module('flickr', ['ionic'])
    .controller('ItemsCtrl', ['$scope', '$http', '$ionicModal', function($scope, $http, $ionicModal) {
        $scope.items =  [];
        $scope.tag = '';
        $scope.feed = {};

        //if ($scope.updated)

        $scope.flickrUrl = 'http://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=JSON_CALLBACK&tags=';

        $ionicModal.fromTemplateUrl('new-tag.html', function(modal) {
            $scope.taskModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });

        $scope.fetch = function() {
            $scope.code = null;
            $scope.response = null;

            $http({method: 'jsonp', url: $scope.flickrUrl + $scope.tag}).
                then(function(response) {
                    $scope.status = response.status;
                    $scope.data = response.data;
                    angular.forEach(response.data.items, function(item){
                        $scope.items.push(item);
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
            $scope.tag = tag;
            $scope.items =  [];
            $scope.fetch();
            $scope.taskModal.hide();
        };

        $scope.doRefresh = function() {
            $scope.fetch();
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$apply()
        };

    }]);