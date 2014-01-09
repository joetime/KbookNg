(function () {
    'use strict';

    var serviceId = 'asmx';
    angular.module('app').factory(serviceId,
        ['common', '$http', asmx]);

    function asmx(common, $http) {
        var $q = common.$q;

        var service = {
            get: checkCache
        };

        var hash = {};

        return service;

        // nice experiment...
        function checkCache(url, data) {
            //if (hash[url + '?' + JSON.stringify(data)]) {
            //    console.log('from cache: ' + url + '?' + JSON.stringify(data))

            //    // build a dummy promise and resolve it from cache
            //    var deferred = $q.defer();
            //    deferred.resolve(hash[url + '?' + JSON.stringify(data)]);
            //    return deferred.promise;
            //}
            //else {
                return getCommon(url, data);
            //}
        }

        function getCommon(url, data) {
            var deferred = $q.defer();

            // fill data if empty 
            // service needs the empty object to work
            var send = data || {};

            $http({
                method: 'POST',
                url: url,
                data: send,
                headers: {
                    'Accept': 'application/json, text/javascript, */*; q=0.01',
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).success(function (resp) {
                //hash[url + '?' + JSON.stringify(data)] = resp.d;
                //console.log("hash");
                //console.log(hash);
                deferred.resolve(resp.d);
            });

            return deferred.promise;
        }
    }
})();