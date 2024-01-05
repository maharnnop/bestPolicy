using BestPolicyReport.Models.WhtReport;

namespace BestPolicyReport.Services.WhtService
{
    public interface IWhtService
    {
        Task<List<WhtCommOutOvOutReportResult>?> GetWhtCommOutOvOutReportJson(WhtReportInput data);
    }
}
