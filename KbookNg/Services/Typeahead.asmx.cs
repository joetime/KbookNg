using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;

namespace KbookNg.Services
{
    public class Typeahead : BaseService
    {
        [WebMethod]
        public object Artists()
        {
            var arr = from artist in DB.Artists
                      where !artist.IsDeleted
                      select new
                      {
                          key = artist.Id,
                          value = artist.Name
                      };
            
            return arr;
        }
    }
}
