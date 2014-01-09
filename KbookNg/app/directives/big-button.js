angular.module('app')

    .directive('bigButton', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/directives/big-button.html',
            scope: {
                caption: '@',
                icon: '@',
                href: '@'
            }
        };
    });
