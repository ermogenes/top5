using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace top5.db
{
    public partial class top5Context : DbContext
    {
        public top5Context()
        {
        }

        public top5Context(DbContextOptions<top5Context> options)
            : base(options)
        {
        }

        public virtual DbSet<Item> Item { get; set; }
        public virtual DbSet<Top> Top { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Item>(entity =>
            {
                entity.HasKey(e => new { e.TopId, e.Posicao })
                    .HasName("PRIMARY");

                entity.ToTable("item");

                entity.HasIndex(e => e.TopId)
                    .HasName("fk_item_top_idx");

                entity.Property(e => e.TopId)
                    .HasColumnName("top_id")
                    .HasMaxLength(36);

                entity.Property(e => e.Posicao).HasColumnName("posicao");

                entity.Property(e => e.Curtidas).HasColumnName("curtidas");

                entity.Property(e => e.Nome)
                    .IsRequired()
                    .HasColumnName("nome")
                    .HasMaxLength(50);

                entity.HasOne(d => d.Top)
                    .WithMany(p => p.Item)
                    .HasForeignKey(d => d.TopId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_item_top");
            });

            modelBuilder.Entity<Top>(entity =>
            {
                entity.ToTable("top");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasMaxLength(36);

                entity.Property(e => e.Curtidas).HasColumnName("curtidas");

                entity.Property(e => e.Titulo)
                    .IsRequired()
                    .HasColumnName("titulo")
                    .HasMaxLength(100);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
