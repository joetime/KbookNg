angular.module('app')
    .directive('row', function () {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,

            template: '<div class="row" ng-transclude></div>',

            scope: {
                class: '@'
            }
        };
    })

    .directive('col', function () {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,

            template: '<div class="col-sm-12" ng-transclude></div>',

            scope: {
                span: '@',                
            }
        };
    });