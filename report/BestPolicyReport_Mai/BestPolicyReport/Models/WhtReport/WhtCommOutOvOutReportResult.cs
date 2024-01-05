namespace BestPolicyReport.Models.WhtReport
{
    public class WhtCommOutOvOutReportResult
    {
        public string? DfRpReferNo { get; set; }
        public DateTime? RpRefDate { get; set; }
        public string? AgentCode { get; set; }
        public string? AgentName { get; set; }
        public double? CommOutAmt { get; set; }
        public double? WhtCommOutAmt { get; set; }
        public double? OvOutAmt { get; set; }
        public double? WhtOvOutAmt { get; set; }
        public string? TransactionType { get; set; }
    }
}
