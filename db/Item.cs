using System;
using System.Collections.Generic;

namespace top5.db
{
    public partial class Item
    {
        public string TopId { get; set; }
        public int Posicao { get; set; }
        public string Nome { get; set; }
        public int Curtidas { get; set; }

        public virtual Top Top { get; set; }
    }
}
