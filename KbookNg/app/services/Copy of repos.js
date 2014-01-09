(function () {
    'use strict';

    var serviceId = 'repos';
    angular.module('app').factory(serviceId,
        ['common', 'asmx', 'datacontext', repos]);

    function repos(common, asmx, datacontext) {
        var rep = this;
        var $q = common.$q;

        var mode = "memory";
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
            primeForce: primeForce,

            songCount: getSongCount,
            lastRefreshed: getLastRefreshed,

            helloWorld: HelloWorld,
            //getArtists: getArtists,
            getArtistList: getArtistList,


            getSong: getSong,
            getSongs: getSongs,

            addArtist: addArtist,

            saveSong: saveSong,
            nullSong: nullSong,

            //flags
            flagFavorite: flagFavorite,

            repository: repository
        };

        return service;

        function repository() { return repository; }

        function flagFavorite(id, favorite) {
            return datacontext.flagFavorite(id, favorite)
                .then(function () {
                    repository.songHash[id].isFavorite = favorite;
                    localStorage["everything"] = JSON.stringify(repository);
                    return favorite;
                });
        }

        function getSongCount () {
            return 0; //epository.songHash.length;
        }

        function getSongs() {
            return repository.songHash;
        }

        function getLastRefreshed() {
            return 0; //repository.lastRefreshed;
        }


        function nullSong() {
            return {
                id: 0,
                name: "",
                artist: {},
                notes: "",
                lyrics: ""
            };
        }

        var repository;

        function primeForce(callback) {
            prime(callback, true);
        }

        function prime(callback, force) {

            force = (force || mode == "remote");

            if (!force && localStorage["everything"]) {

                console.log("ALL DATA FROM LOCAL STORAGE");

                if (!repository) {
                    repository = JSON.parse(localStorage["everything"]);
                }
                if (callback) callback();
            }
            else {
                repository = {};
                return asmx.get("Services/Main.asmx/Everything").then(function (data) {

                    // caches ALL data for the app!
                    // repository = data;
                    repository.songHash = [];
                    repository.artistHash = [];
                    repository.artistList = [];
                    repository.artistTypeahead = [];

                    // hashes songs and artists
                    angular.forEach(data.songs, function (song) {

                        if (song) {
                            repository.songHash[song.id] = song;

                            if (!repository.artistHash[song.artist.id])
                                repository.artistHash[song.artist.id] =
                                    {
                                        name: song.artist.name,
                                        id: song.artist.id,
                                        songs: []
                                    };

                            repository.artistHash[song.artist.id].songs.push({
                                name: song.name, id: song.id, isFavorite: song.isFavorite
                            });
                        }
                    });

                    // artist hash to artist list

                    for (var key in repository.artistHash) {
                        if (repository.artistHash[key])
                            repository.artistList.push(repository.artistHash[key])
                    };

                    //console.log(repository.artistList);

                    localStorage["everything"] = JSON.stringify(repository);
                    console.log("Everything size: " + localStorage["everything"].length);

                    return;
                });
            }
        }

        function getArtistList() {
            return repository.artistList;
        }

        function getSong(id) {

            // check the repository first
            if (repository.songHash && repository.songHash[id]) {
                console.log('song from repos:');
                console.log(repository.songHash[id]);
                return $q.when(repository.songHash[id]);
            }

            var data = { id: id };
            return asmx.get("Services/Main.asmx/GetSong", data)
                // add song to cache
                .then(function (song) {
                    if (repository.songHash)
                        repository.songHash[song.id] = song;
                    localStorage["everything"] = JSON.stringify(repository);    // refresh the cache
                    return song;
                });
        }

        function saveSong(song) {
            var data = {
                id: song.id,
                name: song.name,
                lyrics: song.lyrics,
                notes: song.notes,
                artistName: song.artist.name
            };
            return asmx.get("Services/Main.asmx/SaveSong", data)
                // add song to cache
                .then(function (song) {
                    repository.songHash[song.id] = song;
                    localStorage["everything"] = JSON.stringify(repository);    // refresh the cache
                    return song;
                });
        }

        function addArtist(name) {
            var data = { name: name };
            return asmx.get("Services/Main.asmx/AddArtist", data);
        }



        function HelloWorld() {
            return asmx.get("Services/Main.asmx/HelloWorld");
        }

        function getMessageCount() { return $q.when(72); }

        function getPeople() {
            var people = [
                { firstName: 'John', lastName: 'Papa', age: 25, location: 'Florida' },
                { firstName: 'Ward', lastName: 'Bell', age: 31, location: 'California' },
                { firstName: 'Colleen', lastName: 'Jones', age: 21, location: 'New York' },
                { firstName: 'Madelyn', lastName: 'Green', age: 18, location: 'North Dakota' },
                { firstName: 'Ella', lastName: 'Jobs', age: 18, location: 'South Dakota' },
                { firstName: 'Landon', lastName: 'Gates', age: 11, location: 'South Carolina' },
                { firstName: 'Haley', lastName: 'Guthrie', age: 35, location: 'Wyoming' }
            ];
            return $q.when(people);
        }
    }
})();