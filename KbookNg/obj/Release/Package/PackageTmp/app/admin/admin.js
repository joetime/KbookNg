(function () {
    'use strict';
    var controllerId = 'admin';
    angular.module('app').controller(controllerId, ['common', 'repos', admin]);

    function admin(common, repos) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var vm = this;
        
        /// cache.manifest

        vm.readCache = function () { console.log(window.applicationCache); }


        /// DATA MODE

        vm.dataMode = "...";
        vm.setLocalStorage = function() { repos.setLocalStorage(); vm.dataMode = repos.getMode(); }
        vm.setRemote = function () { repos.setRemote(); vm.dataMode = repos.getMode(); }
        vm.setMemory = function () { repos.setMemory(); vm.dataMode = repos.getMode(); }

        /// REPOSITORY

        vm.repository = [];
        function getRepository() {
            vm.repository = [];
            var tmp = repos.repository();
            for (var i in tmp) {
                vm.repository.push({ key: i, size: tmp[i].length, data: tmp[i] });
            }
        }

        /// LOCAL STORAGE

        vm.localStorage = [];
        vm.clearLocalStorage = function () {
            localStorage.clear();
            getLocalStorage();
        }
        function getLocalStorage() {
            vm.localStorage = [];
            for (var i in localStorage) {
                vm.localStorage.push({ key: i, size: localStorage[i].length, data: localStorage[i] });
            }
        }

        activate();

        function activate() {
            common.activateController([], controllerId)
                .then(function () {
                    //
                    vm.dataMode = repos.getMode();
                    getLocalStorage();
                    
                });
        }
    }
})();