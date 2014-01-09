(function () {
    'use strict';

    var serviceId = 'datacontext';
    angular.module('app').factory(serviceId,
        ['common', 'asmx', datacontext]);

    function datacontext(common, asmx) {
        var $q = common.$q;

        var service = {

            getArtists: getArtists,
            getSong: getSong,

            addArtist: addArtist,

            saveSong: saveSong,
            nullSong: nullSong,

            //flags
            flagFavorite: flagFavorite,
            //flagHidden: flagHidden,
            //flagDelete: flagDelete
        };

        return service;

        function flagFavorite(id, favorite) {
            
            var data = {
                id: id,
                favorite: favorite
            };
            console.log("[datacontext] flagFavorite: ");
            console.log(data);
            return asmx.get("Services/Flags.asmx/Favorite", data);
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
        
        function getArtists() {
            return asmx.get("Services/Main.asmx/GetArtists");
        }

        function getSong(id) {
            var data = { id: id };
            return asmx.get("Services/Main.asmx/GetSong", data);
        }

        function saveSong(song) {
            var data = {
                id: song.id,
                name: song.name,
                lyrics: song.lyrics,
                notes: song.notes,
                artistId: song.artist.id
            };
            return asmx.get("Services/Main.asmx/SaveSong", data);
        }

        function addArtist(name) {
            var data = { name: name };
            return asmx.get("Services/Main.asmx/AddArtist", data);
        }
    }
})();