using System;
using System.Collections.Generic;

namespace top5.db
{
    public partial class Top
    {
        public Top()
        {
            Item = new HashSet<Item>();
        }

        public string Id { get; set; }
        public string Titulo { get; set; }
        public int Curtidas { get; set; }

        public virtual ICollection<Item> Item { get; set; }
    }
}
