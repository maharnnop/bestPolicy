using BestPolicyReport.Models.ArApReport;

namespace BestPolicyReport.Services.ArApService
{
    public interface IArApService
    {
        Task<List<CommOutOvOutReportResult>?> GetCommOutOvOutOpenItemReportJson(ArApReportInput data);
        Task<List<CommOutOvOutReportResult>?> GetCommOutOvOutClearingReportJson(ArApReportInput data);
        Task<List<CommOutOvOutReportResult>?> GetCommOutOvOutOutstandingReportJson(ArApReportInput data);
        Task<List<PremOutReportResult>?> GetPremOutOpenItemReportJson(ArApReportInput data);
        Task<List<PremOutReportResult>?> GetPremOutClearingReportJson(ArApReportInput data);
        Task<List<PremOutReportResult>?> GetPremOutOutstandingReportJson(ArApReportInput data);
    }
}
