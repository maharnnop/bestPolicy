namespace BestPolicyReport.Models.ArApReport
{
    public class PremOutCommInOvInReportResult
    {
        public string? PolicyNo { get; set; }
        public string? EndorseNo { get; set; }
        public string? InvoiceNo { get; set; }
        public int? SeqNo { get; set; }
        public string? PremInDfRpReferNo { get; set; }
        public DateTime? PremInRpRefDate { get; set; }
        public string? PremOutDfRpReferNo { get; set; }
        public DateTime? PremOutRpRefDate { get; set; }
        public DateTime? ActDate { get; set; }
        public DateTime? ExpDate { get; set; }
        public string? InsurerCode { get; set; }
        public string? InsurerName { get; set; }
        public string? InsureeCode { get; set; }
        public string? InsureeName { get; set; }
        public string? Class { get; set; }
        public string? SubClass { get; set; }
        public double? GrossPrem { get; set; }
        public double? SpecDiscRate { get; set; }
        public double? SpecDiscAmt { get; set; }
        public double? NetGrossPrem { get; set; }
        public double? Duty { get; set; }
        public double? Tax { get; set; }
        public double? TotalPrem { get; set; }
        public string? NetFlag { get; set; }
        public double? CommInRate { get; set; }
        public double? CommInAmt { get; set; }
        public string? CommInDfRpReferNo { get; set; }
        public DateTime? CommInRpRefDate { get; set; }
        public double? CommInPaidAmt { get; set; }
        public double? CommInDiffAmt { get; set; }
        public double? OvInRate { get; set; }
        public double? OvInAmt { get; set; }
        public string? OvInDfRpReferNo { get; set; }
        public DateTime? OvInRpRefDate { get; set; }
        public double? OvInPaidAmt { get; set; }
        public double? OvInDiffAmt { get; set; }
        public DateTime? IssueDate { get; set; }
        public string? PolicyCreateUserCode { get; set; }
        public int? MainAccountContactPersonId { get; set; }
        public string? MainAccountCode { get; set; }
        public string? PolicyStatus { get; set; }
        public string? TransactionType { get; set; }
    }
}
