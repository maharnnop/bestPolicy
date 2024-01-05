using System.ComponentModel.DataAnnotations.Schema;

namespace BestPolicyReport.Models.ArApReport
{
    public class PremInReportResult
    {
        public string? PolicyNo { get; set; }
        public string? EndorseNo { get; set; }
        public string? InvoiceNo { get; set; }
        public int? SeqNo { get; set; }
        public string? CashierReceiveNo { get; set; }
        public DateTime? CashierDate { get; set; }
        public double? CashierAmt { get; set; }
        public string? CashierReceiveType { get; set; }
        public string? CashierRefNo { get; set; }
        [NotMapped]
        public DateTime? CashierRefDate { get; set; }
        public string? PremInDfRpReferNo { get; set; }
        public DateTime? RpRefDate { get; set; }
        public string? NetFlag { get; set; }
        public double? PremInPaidAmt { get; set; }
        public double? PremInDiffAmt { get; set; }
        public string? PolicyStatus { get; set; }
        public DateTime? ActDate { get; set; }
        public DateTime? ExpDate { get; set; }
        public string? MainAccountCode { get; set; }
        public string? MainAccountName { get; set; }
        public string? InsureeCode { get; set; }
        public string? InsureeName { get; set; }
        public string? Class { get; set; }
        public string? SubClass { get; set; }
        public double? Duty { get; set; }
        public double? Tax { get; set; }
        public double? TotalPrem { get; set; }
        public double? CommOutRate { get; set; }
        public double? CommOutAmt { get; set; }
        public double? OvOutRate { get; set; }
        public double? OvOutAmt { get; set; }
        public double? CommOutRate1 { get; set; }
        public double? CommOutAmt1 { get; set; }
        public double? OvOutRate1 { get; set; }
        public double? OvOutAmt1 { get; set; }
        public double? CommOutRate2 { get; set; }
        public double? CommOutAmt2 { get; set; }
        public DateTime? IssueDate { get; set; }
        public string? PolicyCreateUserCode { get; set; }
        public int? MainAccountContactPersonId { get; set; }
        public string? InsurerCode { get; set; }
        public string? TransactionType { get; set; }
    }
}
