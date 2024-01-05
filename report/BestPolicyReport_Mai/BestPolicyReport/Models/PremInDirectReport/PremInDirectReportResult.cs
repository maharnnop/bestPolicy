namespace BestPolicyReport.Models.PremInDirectReport
{
    public class PremInDirectReportResult
    {
        public string? InsurerCode { get; set; }
        public string? AgentCode1 { get; set; }
        public DateTime? DueDate { get; set; }
        public string? PolicyNo { get; set; }
        public string? EndorseNo { get; set; }
        public string? InvoiceNo { get; set; }
        public int? SeqNo { get; set; }
        public string? InsureeCode { get; set; }
        public string? InsureeName { get; set; }
        public string? LicenseNo { get; set; }
        public string? Province { get; set; }
        public string? ChassisNo { get; set; }
        public double? GrossPrem { get; set; }
        public double? Duty { get; set; }
        public double? Tax { get; set; }
        public double? TotalPrem { get; set; }
        public double? CommOutRate { get; set; }
        public double? CommOutAmt { get; set; }
        public double? OvOutRate { get; set; }
        public double? OvOutAmt { get; set; }
        public string? NetFlag { get; set; }
        public double? BillPremium { get; set; }
        public string? DfRpReferNo { get; set; }
        public DateTime? RpRefDate { get; set; }
        public string? TransactionType { get; set; }
    }
}
