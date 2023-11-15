using System.ComponentModel.DataAnnotations.Schema;

namespace BestPolicyReport.Models.ArApReport
{
    public class CommOutOvOutReportResult
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
        public double? GrossPrem { get; set; }
        public double? SpecDiscRate { get; set; }
        public double? SpecDiscAmt { get; set; }
        public double? NetGrossPrem { get; set; }
        public double? Duty { get; set; }
        public double? Tax { get; set; }
        public double? TotalPrem { get; set; }
        public string? NetFlag { get; set; }
        public DateTime? ActDate { get; set; }
        public DateTime? ExpDate { get; set; }
        public string? MainAccountCode { get; set; }
        public string? MainAccountName { get; set; }
        public string? InsureeCode { get; set; }
        public string? InsureeName { get; set; }
        public string? Class { get; set; }
        public string? SubClass { get; set; }
        public string? LicenseNo { get; set; }
        public string? Province { get; set; }
        public string? ChassisNo { get; set; }
        public double? CommOutRate { get; set; }
        public double? OvOutRate { get; set; }
        public double? OvOutAmt { get; set; }
        public string? CommOutDfRpReferNo { get; set; }
        public DateTime? CommOutRpRefDate { get; set; }
        public double? CommOutPaidAmt { get; set; }
        public double? CommOutDiffAmt { get; set; }
        public double? OvOutPaidAmt { get; set; }
        public double? OvOutDiffAmt { get; set; }
        public DateTime? IssueDate { get; set; }
        public string? PolicyCreateUserCode { get; set; }
        public int? MainAccountContactPersonId { get; set; }
        public string? InsurerCode { get; set; }
        public string? PolicyStatus { get; set; }
        public string? TransactionType { get; set; }
    }
}
