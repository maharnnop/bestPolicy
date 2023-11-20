using BestPolicy.Models;
using Microsoft.EntityFrameworkCore;

namespace BestPolicy.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DailyPolicyReport>().HasNoKey();
        }

        public DbSet<DailyPolicyReport> DailyPolicyReport { get; set; }
    }
}
