(function () {
    'use strict';

    var serviceId = 'repos';
    angular.module('app').factory(serviceId,
        ['common', 'asmx', 'datacontext', repos]);

    function repos(common, asmx, datacontext) {
        var rep = this;
        var $q = common.$q;
        
        var repository;

        var mode = "localStorage";
        function getMode() { return mode; }
        function setLocalStorage() { mode = "localStorage"; }
        function setRemote() { mode = "remote"; }
        function setMemory() { mode = "memory"; }

        var service = {
            
            getMode: getMode,
            setLocalStorage: setLocalStorage,
            setRemote: setRemote,
            setMemory: setMemory,

            prime: prime,
            primeForce: function () { return prime(true); },

            getArtistList: function () { return repository.artistList; },
            getSongs: function () { return repository.songHash; },

            getSong: getSong,



            nullSong: nullSong,

            
            saveSong: saveSong,
            flagFavorite: flagFavorite, // to set favorite flag

            repository: function () { return repository; }      // for admin only
        };

        return service;

        /// gets data from appropriate location
        ///
        function prime(forceRefresh) {

            console.log("[repos] prime:");
            console.log("mode: " + mode);
            console.log("repository: " + repository)
            console.log("localStorage: " + localStorage.length)

            if (
                // forcing a refresh
                forceRefresh ||

                // remote always
                (mode == "remote") ||

                // memory, but no data in memory
                (mode == "memory" && !repository) ||

                // localStorage, but no data available
                (mode == "localStorage" &&
                    (!repository || repository.length == 0) &&
                    localStorage.length == 0)
                ) {

                console.log("[repos] getting data remote")
                
                return getDataRemote();
            }
            else if
                // localStorage, but no data in memory
                // (like a restart of the app)
                (mode == "localStorage" &&
                    (!repository || repository.length == 0)) {

                console.log("[repos] getting data local")
                return getDataLocal();

            }
            else {
                // do nothing, data is in memory
                console.log("[repos] data already loaded")
            }
        }

        function getDataLocal() {

            // just restore the repository from the localStorage
            return repository = JSON.parse(localStorage["everything"]);
        }

        function getDataRemote() {

            repository = {};

            return asmx.get("Services/Main.asmx/Everything")
                .then(function (data) {

                    doHashAll(data);

                    if (mode == "localStorage") doCache();
                    
                });

        }

        function doHash(song) {

            if (!song || !repository.songHash) return;

            // add song to repos
            repository.songHash[song.id] = song;

            // if this is a new artist, 
            // add the artist to the list of artists
            if (!repository.artistHash[song.artist.id])
                repository.artistHash[song.artist.id] =
                    {
                        name: song.artist.name,
                        id: song.artist.id,
                        songs: [] 
                    };

            // ... finally add song to the artists list of songs...
            repository.artistHash[song.artist.id].songs.push({
                name: song.name, id: song.id, isFavorite: song.isFavorite
            });
        }
        
        function doHashAll(data) {

            repository.songHash = [];
            repository.artistHash = [];
            repository.artistList = [];

            // hashes songs and artists
            angular.forEach(data.songs, function (song) {
                doHash(song);
            });

            // artist hash to artist list
            // (just a data conversion.. should find another way)
            for (var key in repository.artistHash) {
                if (repository.artistHash[key])
                    repository.artistList.push(repository.artistHash[key])
            };
        }

        function doCache() {
            localStorage["everything"] = JSON.stringify(repository);
            console.log("[repos] data saved in localStorage");
        }

        function getSong(id) {

            console.log("[repos] getSong: " + id)

            // check the repository first
            if (repository.songHash && repository.songHash[id]) {

                console.log('[repos] song from repos');
                return $q.when(repository.songHash[id]);
            }

            // otherwise go remote

            var data = { id: id };
            return asmx.get("Services/Main.asmx/GetSong", data)
                .then(function (song) {

                    // hash and cache!
                    doHash(song);
                    if (mode == "localStorage") doCache();

                    return song;
                });
        }

        function saveSong(song) {

            // format data for send
            var data = {
                id: song.id,
                name: song.name,
                lyrics: song.lyrics,
                notes: song.notes,
                artistName: song.artist.name
            };

            return asmx.get("Services/Main.asmx/SaveSong", data)
                
                .then(function (song) {

                    // rebuild the hashtables (might be an easier way, but...)
                    getDataRemote();

                    return song;
                });
        }

        function flagFavorite(song) {
            
            return datacontext.flagFavorite(song.id, !song.isFavorite)
                .then(function () {
                    
                    song.isFavorite = !song.isFavorite;
                    fixArtistList(song);

                    doCache();

                    return song.isFavorite;
                });
        }

        // fixes isFavorite of a song
        function fixArtistList(song) {
            angular.forEach(repository.artistList, function (artist) {
                if (artist.id == song.artist.id) {
                    //console.log(artist);
                    angular.forEach(artist.songs, function (s) {
                        if (s.id == song.id) {
                            //s.name = song.name;
                            s.isFavorite = song.isFavorite;
                            
                            return;
                        }
                    })
                };
            })
        }


        function nullSong() { return { id: 0, name: "", artist: {}, notes: "", lyrics: "" }; }
    }
})();