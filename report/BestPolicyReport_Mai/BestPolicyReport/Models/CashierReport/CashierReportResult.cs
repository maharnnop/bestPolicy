using System.ComponentModel.DataAnnotations.Schema;

namespace BestPolicyReport.Models.CashierReport
{
    public class CashierReportResult
    {
        public string? CashierReceiveNo { get; set; }
        public DateTime? CashierDate { get; set; }
        public string? BillAdvisorNo { get; set; }
        public DateTime? BillDate { get; set; }
        public string? ReceiveFrom { get; set; }
        public string? ReceiveName { get; set; }
        public string? ReceiveType { get; set; }
        public string? RefNo { get; set; }
        [NotMapped]
        public DateTime? RefDate { get; set; }
        public string? TransactionType { get; set; }
        public double? CashierAmt { get; set; }
        public string? DfRpReferNo { get; set; }
        public DateTime? RpRefDate { get; set; }
        public double? ActualValue { get; set; }
        public double? DiffAmt { get; set; }
        public string? Status { get; set; }
    }
}
