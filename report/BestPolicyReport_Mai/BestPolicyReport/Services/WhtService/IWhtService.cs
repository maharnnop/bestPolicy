using BestPolicyReport.Models.WhtReport;

namespace BestPolicyReport.Services.WhtService
{
    public interface IWhtService
    {
        Task<List<WhtCommOutReportResult>?> GetWhtCommOutReportJson(WhtReportInput data);
        Task<List<WhtOvOutReportResult>?> GetWhtOvOutReportJson(WhtReportInput data);
    }
}
