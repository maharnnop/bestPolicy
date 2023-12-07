namespace BestPolicyReport.Models.CashierReport
{
    public class CashierReportInput
    {
        public string? StartCashierDate { get; set; }
        public string? EndCashierDate { get; set; }
        public string? StartCashierReceiveNo { get; set; }
        public string? EndCashierReceiveNo { get; set; }
        public string? TransactionType { get; set; }
    }
}
