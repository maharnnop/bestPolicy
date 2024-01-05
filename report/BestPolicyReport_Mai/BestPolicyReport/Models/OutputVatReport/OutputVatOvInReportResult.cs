namespace BestPolicyReport.Models.OutputVatReport
{
    public class OutputVatOvInReportResult
    {
        public string? DfRpReferNo { get; set; }
        public DateTime? RpRefDate { get; set; }
        public string? InsurerCode { get; set; }
        public string? InsurerName { get; set; }
        public double? OvInAmt { get; set; }
        public double? VatOvInAmt { get; set; }
        public string? ArApStatus { get; set; }
        public string? TransactionType { get; set; }
    }
}
