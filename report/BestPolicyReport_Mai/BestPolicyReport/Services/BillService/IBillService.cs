using BestPolicyReport.Models.BillReport;

namespace BestPolicyReport.Services.BillService
{
    public interface IBillService
    {
        Task<List<BillReportResult>?> GetBillReportJson(BillReportInput data);
        Task<List<PolicyGroupBillReportResult>?> GetPolicyGroupBillReportJson(PolicyGroupBillReportInput data);
    }
}
