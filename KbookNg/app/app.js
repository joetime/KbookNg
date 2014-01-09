(function () {
    'use strict';
    
    var app = angular.module('app', [
        // Angular modules 
        'ngAnimate',        // animations
        'ngRoute',          // routing
        'ngSanitize',       // sanitizes html bindings (ex: sidebar.js)

        // Custom modules 
        'common',           // common functions, logger, spinner
        'common.bootstrap', // bootstrap dialog wrapper functions

        // 3rd Party Modules
        'ui.bootstrap',      // ui-bootstrap (ex: carousel, pagination, dialog)
        'ui',               // ui-utils (unique...)
        'siyfion.sfTypeahead'   // angular-typeahead
    ]);
    
    angular.module('app').
        filter('fromNow', function () {
          return function (dateString) {
              //return 'YO MAMA'
              return moment(dateString).fromNow()
          };
        });

    app.directive('scrollOnClick', function () {
        return {
            restrict: 'A',
            link: function (scope, $elm) {
                $elm.on('click', function () {
                    $("body").animate({
                        p: $elm.offset().top
                    }, "slow");
                });
            }
        }
    });

    app.filter('noNull', function () {
        return function (items) {
            
            if (!items) return;

            //console.log('noNull filter');
            var list = [];
            for (var i = 0; i < items.length; i++) {
                if (items[i]) {
                    list.push(items[i]);
                }
            }

            return list;

        }
    });

    app.filter('hasFavorite', function () {
        
        return function (artists, filterVal) {
            //console.log('hasFavorite filter');
            if (!filterVal) return artists;

            var list = [];
            for (var i = 0; i < artists.length; i++) {
                for (var j = 0; j < artists[i].songs.length; j++) {
                    if (artists[i].songs[j].isFavorite) {
                        list.push(artists[i]);
                        break;
                    }
                }
            }

            return list;
        }
    });

    app.directive('myCustomer', function() {
        return {
            template: 'Name: {{vm.song.name}} Address: {{song.Id}}'
        };
    });

    // Handle routing errors and success events
    app.run(['$route', 'repos', '$templateCache', function ($route, repos, $templateCache) {
        // Include $route to kick start the router.
        
        // prefetch templates!
        //$.get("app/directives/big-button.html", function (resp) {
        //    $templateCache.put("app/directives/big-button.html", resp)
        //})
        //$.get("app/song/song.html", function (resp) {
        //    $templateCache.put("app/song/song.html", resp)
        //})

        console.log('app.run')
        }]);        
})();