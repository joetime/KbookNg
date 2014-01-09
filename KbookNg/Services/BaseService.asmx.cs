using KbookNg.DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;

namespace KbookNg.Services
{
    /// <summary>
    /// Summary description for BaseService
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class BaseService : System.Web.Services.WebService
    {
        protected KbookEntities DB = new KbookEntities();

        [WebMethod]
        public string HelloWorld()
        {
            return "Hello World";
        }
    }
}
