angular.module('app')
    .directive('glyph', function () {
        return {
            restrict: 'E',
            template: '<i class="glyphicon glyphicon-{{icon}} {{class}}"></i>',
            scope: {
                icon: '@',
                class: '@'
            }
        };
    });
