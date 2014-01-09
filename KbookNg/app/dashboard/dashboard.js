(function () {
    'use strict';
    var controllerId = 'dashboard';
    angular.module('app').controller(controllerId, ['common', 'repos', dashboard]);

    function dashboard(common, repos) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var vm = this;
        

        vm.artists = [];
        vm.songs = [];
        
        vm.ready = false;

        activate();

        function activate() {
            var promises = [repos.prime()];
            common.activateController(promises, controllerId)
                .then(function () {
                     
                    vm.songs = repos.getSongs();
                    vm.artists = repos.getArtistList();

                    vm.ready = true;
                });
        }

        //function getData() {

        //}
    }
})();