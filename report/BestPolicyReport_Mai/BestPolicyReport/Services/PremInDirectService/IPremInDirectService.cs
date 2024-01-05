using BestPolicyReport.Models.PremInDirectReport;

namespace BestPolicyReport.Services.PremInDirectService
{
    public interface IPremInDirectService
    {
        Task<List<PremInDirectReportResult>?> GetPremInDirectReportJson(PremInDirectReportInput data);
    }
}
