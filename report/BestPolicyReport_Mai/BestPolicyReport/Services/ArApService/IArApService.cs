using BestPolicyReport.Models.ArApReport;

namespace BestPolicyReport.Services.ArApService
{
    public interface IArApService
    {
        Task<List<PremInReportResult>?> GetPremInOpenItemReportJson(ArApReportInput data);
        Task<List<PremInReportResult>?> GetPremInClearingReportJson(ArApReportInput data);
        Task<List<PremInReportResult>?> GetPremInOutstandingReportJson(ArApReportInput data);
        Task<List<CommOutOvOutReportResult>?> GetCommOutOvOutOpenItemReportJson(ArApReportInput data);
        Task<List<CommOutOvOutReportResult>?> GetCommOutOvOutClearingReportJson(ArApReportInput data);
        Task<List<CommOutOvOutReportResult>?> GetCommOutOvOutOutstandingReportJson(ArApReportInput data);
        Task<List<PremOutCommInOvInReportResult>?> GetPremOutOpenItemReportJson(ArApReportInput data);
        Task<List<PremOutCommInOvInReportResult>?> GetPremOutClearingReportJson(ArApReportInput data);
        Task<List<PremOutCommInOvInReportResult>?> GetPremOutOutstandingReportJson(ArApReportInput data);
        Task<List<PremOutCommInOvInReportResult>?> GetCommInOvInOpenItemReportJson(ArApReportInput data);
        Task<List<PremOutCommInOvInReportResult>?> GetCommInOvInClearingReportJson(ArApReportInput data);
        Task<List<PremOutCommInOvInReportResult>?> GetCommInOvInOutstandingReportJson(ArApReportInput data);
    }
}
