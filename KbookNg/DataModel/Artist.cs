//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace KbookNg.DataModel
{
    using System;
    using System.Collections.Generic;
    
    public partial class Artist
    {
        public Artist()
        {
            this.Songs = new HashSet<Song>();
        }
    
        public int Id { get; set; }
        public string Name { get; set; }
        public string AltName { get; set; }
        public System.DateTime DateAdded { get; set; }
        public bool IsDeleted { get; set; }
        public string Temp { get; set; }
    
        public virtual ICollection<Song> Songs { get; set; }
    }
}