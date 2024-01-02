using Microsoft.EntityFrameworkCore;
using BestPolicyReport.Models.DailyPolicyReport;
using BestPolicyReport.Models.BillReport;
using BestPolicyReport.Models.CashierReport;
using BestPolicyReport.Models.OutputVatCommInReport;
using BestPolicyReport.Models.OutputVatOvInReport;
using BestPolicyReport.Models.ArApReport;
using BestPolicyReport.Models.PremInDirectReport;
using BestPolicyReport.Models.WhtReport;

namespace BestPolicyReport.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DailyPolicyReportResult>().HasNoKey();
            modelBuilder.Entity<BillReportResult>().HasNoKey();
            modelBuilder.Entity<CashierReportResult>().HasNoKey();
            modelBuilder.Entity<OutputVatCommInReportResult>().HasNoKey();
            modelBuilder.Entity<OutputVatOvInReportResult>().HasNoKey();
            modelBuilder.Entity<CommOutOvOutReportResult>().HasNoKey();
            modelBuilder.Entity<PremOutCommInOvInReportResult>().HasNoKey();
            modelBuilder.Entity<PremInReportResult>().HasNoKey();
            modelBuilder.Entity<PolicyGroupBillReportResult>().HasNoKey();
            modelBuilder.Entity<PremInDirectReportResult>().HasNoKey();
            modelBuilder.Entity<WhtCommOutReportResult>().HasNoKey();
            modelBuilder.Entity<WhtOvOutReportResult>().HasNoKey();
        }

        public DbSet<DailyPolicyReportResult> DailyPolicyReportResults { get; set; }
        public DbSet<BillReportResult> BillReportResults { get; set; }
        public DbSet<CashierReportResult> CashierReportResults { get; set; }
        public DbSet<OutputVatCommInReportResult> OutputVatCommInReportResults { get; set; }
        public DbSet<OutputVatOvInReportResult> OutputVatOvInReportResults { get; set; }
        public DbSet<CommOutOvOutReportResult> CommOutOvOutReportResults { get; set; }
        public DbSet<PremOutCommInOvInReportResult> PremOutCommInOvInReportResults { get; set; }
        public DbSet<PremInReportResult> PremInReportResults { get; set; }
        public DbSet<PolicyGroupBillReportResult> PolicyGroupBillReportResults { get; set; }
        public DbSet<PremInDirectReportResult> PremInDirectReportResults { get; set; }
        public DbSet<WhtCommOutReportResult> WhtCommOutReportResults { get; set; }
        public DbSet<WhtOvOutReportResult> WhtOvOutReportResults { get; set; }
    }
}
