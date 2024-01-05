namespace BestPolicyReport.Models.PremInDirectReport
{
    public class PremInDirectReportInput
    {
        public string? InsurerCode { get; set; }
        public string? AgentCode1 { get; set; }
        public string? StartDfRpReferNo { get; set; }
        public string? EndDfRpReferNo { get; set; }
        public string? StartRpRefDate { get; set; }
        public string? EndRpRefDate { get; set; }
    }
}
