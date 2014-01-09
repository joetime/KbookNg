(function () { 
    'use strict';
    
    var controllerId = 'shell';
    angular.module('app').controller(controllerId,
        ['$rootScope', 'common', 'config', 'repos', shell]);

    function shell($rootScope, common, config, repos) {
        var vm = this;
        var logSuccess = common.logger.getLogFn(controllerId, 'success');
        var events = config.events;

        ////vm.busyMessage = 'Please wait ...';
        ////vm.isBusy = true;
        ////vm.spinnerOptions = {};

        //vm.songCount = '??';
        //vm.lastRefreshed = '??';

        //activate();

        //function activate() {
            
        //    var promises = [];

        //    common.activateController(promises, controllerId)
        //        .then(function (count, date) {
        //            console.log('shell activated...?');
                    
        //            vm.songCount = repos.songCount();
        //            vm.lastRefreshed = repos.lastRefreshed();
        //        });
        //}

        //vm.refreshData = function () {
        //    console.log("forcing refresh")
        //    return repos.primeForce(function () {
        //        vm.songCount = repos.songCount();
        //        vm.lastRefreshed = repos.lastRefreshed();
        //        //window.location.href="/"
        //    });
        //};

        //function primeData() {
        //    return repos.prime(function () {
        //        return;
        //    });
        //}


        //function toggleSpinner(on) { vm.isBusy = on; }

        //$rootScope.$on('$routeChangeStart',
        //    function (event, next, current) { toggleSpinner(true); }
        //);
        
        //$rootScope.$on(events.controllerActivateSuccess,
        //    function (data) { toggleSpinner(false); }
        //);

        //$rootScope.$on(events.spinnerToggle,
        //    function (data) { toggleSpinner(data.show); }
        //);
    };
})();