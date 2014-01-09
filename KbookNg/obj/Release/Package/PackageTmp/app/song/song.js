(function () {
    'use strict';
    var controllerId = 'song';
    angular.module('app').controller(controllerId, ['common', 'repos', '$routeParams', song]);

    function song(common, repos, $routeParams) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var vm = this;

        vm.artists = [];                    // for dropdown
        vm.songId = $routeParams.songId;

        vm.song = null;
        vm.song_orig = null;
        vm.artist = {};

        vm.randomId = 0;
        vm.selectedArtist = null;
        vm.artistList = null;

        vm.saveSong = function () {
            
            repos.saveSong(vm.song).then(function (song) {

                // navigate to added song
                window.location.href = "#/song/" + song.id;
                vm.toggleEditMode();
                //window.scrollTo(0);
                //vm.setFocus();
            });
        }

        vm.setFocus = function () {
            //console.log($("#name-input"));
            //$("#lyrics-input").select();
            //$("#name-input").select;
        }

        vm.cancelEdit = function () {
            //log('cancel edit');
            vm.song = angular.copy(vm.song_orig);        // restore song to pristene state
            vm.toggleEditMode();
        }

        function getSong() {
            console.log["[song] getSong..."]
            return repos.getSong(vm.songId).then(function (data) {
                vm.song = data;
                vm.song_orig = angular.copy(vm.song);   // store a pristene copy
                console.log["[song] song fetched..."]
            });
        }

        activate();

        function activate() {

            console.log("[song] activating...")
            window.scrollTo(0);
            
            var promises = [repos.prime()];

            if ($routeParams.songId == 0) {
                
                setupNewSong();             // prep for new song
            }
            else {
                promises.push(getSong());   // we will fetch the song
            }

            common.activateController(promises, controllerId)
                .then(function () {
                    console.log("[song] promises returned")

                    // artists for typeahead
                    vm.artists = repos.getArtistList();

                    getRandomSongId();
                });
        }

        function getRandomSongId() {
            // get a random number
            var songs = repos.getSongs();
            if (songs) {
                var random;
                while (!random)
                    random = songs[Math.floor(Math.random() * songs.length)];
                vm.randomId = random.id;
            }
        }

        vm.showme = true;
        vm.chooseArtist = function (str) {
            vm.song.artist.name = str;
            vm.showme = false;
            $("#lyrics-input").focus();
            return false;
        }

        function setupNewSong() {

            // if the song id is 0, its a new song
            // get a blank copy of the song object

            console.log("New song...")
            vm.editMode = true;

            vm.song = repos.nullSong();

            if ($routeParams.artistId) {
                vm.song.artist.name = $routeParams.artistId;
            }

            vm.song_orig = angular.copy(vm.song);

            $("#name-input").select;
        }

        // debug
        vm.debug = false;
        vm.toggleDebugMode = function () {
            //console.log("toggleDebugMode");
            vm.debug = !vm.debug
        };

        // for edit mode (false is default)
        //vm.editMode = false;
        vm.toggleEditMode = function () {
            vm.editMode = !vm.editMode;
            if (vm.editMode) {
                console.log("edit mode on")
                //window.scrollTo(0);
                $("#name-input").select;
                //vm.setFocus();
            }
        };

        // heart button
        vm.toggleFavorite = function () {
            repos.flagFavorite(vm.song)
                .then(function (newValue) {
                    console.log("[song] isFavorite: " + newValue)
                });
        }


    }
})();