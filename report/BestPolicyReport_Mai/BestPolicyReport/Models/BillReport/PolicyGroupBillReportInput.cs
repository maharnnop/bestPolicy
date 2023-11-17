namespace BestPolicyReport.Models.BillReport
{
    public class PolicyGroupBillReportInput
    {
        public string? ListBillAdvisorNo { get; set; } //ListBillAdvisorNo should be => 'bill1', 'bill2', 'bill3'
        public string? CreateUserCode { get; set; }
        public string? StartBillDate { get; set; }
        public string? EndBillDate { get; set; }
    }
}
