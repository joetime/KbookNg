using KbookNg.DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;

namespace KbookNg.Services
{
    /// <summary>
    /// Summary description for Flags
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class Flags : BaseService
    {
        [WebMethod]
        public object Favorite(int id, bool favorite)
        {
            Song song = DB.Songs.Find(id);
            song.IsFavorite = favorite;
            DB.SaveChanges();
            return favorite;
        }

        [WebMethod]
        public object Hidden(int id, bool hidden)
        {
            Song song = DB.Songs.Find(id);
            song.IsHidden = hidden;
            DB.SaveChanges();
            return hidden;
        }

        [WebMethod]
        public object DeleteSong(int id)
        {
            Song song = DB.Songs.Find(id);
            song.IsDeleted = true;
            DB.SaveChanges();
            return song;
        }

        [WebMethod]
        public object DeleteArtist(int id)
        {
            Artist artist = DB.Artists.Find(id);
            artist.IsDeleted = true;
            DB.SaveChanges();
            return artist;
        }
    }
}
