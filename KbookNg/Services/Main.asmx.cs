using KbookNg.DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;

namespace KbookNg.Services
{
    public class ArtistService : BaseService
    {
        [WebMethod]
        public object Everything()
        {
            return new
            {
                artists = GetArtists(),
                songs = GetSongs(),
                lastRefreshed = DateTime.Now
            };
        }

        [WebMethod]
        public object GetArtists()
        {
            var data = from Artist artist in DB.Artists
                       where !artist.IsDeleted
                       orderby artist.Name
                       select new
                       {
                           id = artist.Id,
                           name = artist.Name,
                           
                           // song names and id for artist
                           songs = from s in artist.Songs
                                   where !s.IsDeleted
                                   select new
                                   {
                                       id = s.Id,
                                       name = s.Name,
                                       // flags
                                       isFavorite = s.IsFavorite,
                                       isHidden = s.IsHidden,

                                   }
                       };
            return data;
        }

        [WebMethod]
        public object GetSongs()
        {
            var data = from Song song in DB.Songs
                       where !song.IsDeleted
                       orderby song.Name
                       select new
                       {
                           id = song.Id,
                           name = song.Name,
                           lyrics = song.Lyrics,
                           notes = song.Notes,

                           // flags
                           isFavorite = song.IsFavorite,
                           isHidden = song.IsHidden,

                           // artist name and id for song
                           artist =
                                   new
                                   {
                                       id = song.Artist.Id,
                                       name = song.Artist.Name
                                   }
                       };

            return data;
        }

        [WebMethod]
        public object GetSong(int id)
        {
            var data = from Song song in DB.Songs
                       where song.Id == id
                       select new
                       {
                           id = song.Id,
                           name = song.Name,
                           lyrics = song.Lyrics,
                           notes = song.Notes,

                           // flags
                           isFavorite = song.IsFavorite,
                           isHidden = song.IsHidden,

                           // artist name and id for song
                           artist = 
                                   new
                                   {
                                       id = song.Artist.Id,
                                       name = song.Artist.Name
                                   }
                       };

            return data.First();

        }

        [WebMethod]
        public object AddArtist(string name)
        {
            Artist artist = new Artist();
            artist.Name = name.Trim();
            artist.DateAdded = DateTime.Today;

            DB.Artists.Add(artist);
            DB.SaveChanges();

            return name + " added.";
        }
        

        [WebMethod]
        public object SaveSong(int id, string artistName, string name, string lyrics, string notes)
        {
            /// 1. Find song by id, or create new song
            /// 2. Set song properties
            /// 3. Find the artist, by name
            /// 4. If the artist does not exist, create it
            /// 5. Set artist
            /// 6. Save changes and return the updated song

            /// 1
            Song song = DB.Songs.Find(id);
            if (song == null)
            {
                song = new Song();        // create a new one
                DB.Songs.Add(song);         // add to set
                song.DateAdded = DateTime.Today;
            }

            /// 2
            song.Name = name.Trim();
            song.Lyrics = lyrics.Trim();
            song.Notes = notes.Trim();

            /// 3
            Artist artist = DB.Artists.FirstOrDefault(x => x.Name == artistName);

            /// 4
            if (artist == null)
            {
                artist = new Artist() { Name = artistName, DateAdded = DateTime.Now };
                DB.Artists.Add(artist);
            }

            /// 5
            song.Artist = artist;

            /// 6
            DB.SaveChanges();
            return GetSong(song.Id);
        }
    }
}
