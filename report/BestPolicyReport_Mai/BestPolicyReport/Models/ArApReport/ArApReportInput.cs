namespace BestPolicyReport.Models.ArApReport
{
    public class ArApReportInput
    {
        public string? StartPolicyIssueDate { get; set; }
        public string? EndPolicyIssueDate { get; set; }
        public string? AsAtDate { get; set; }
        public string? CreateUserCode { get; set; }
        public string? MainAccountContactPersonId { get; set; }
        public string? MainAccountCode { get; set; }
        public string? InsurerCode { get; set; }
        public string? PolicyStatus { get; set; }
        public string? Class { get; set; }
        public string? SubClass { get; set; }
        public string? TransactionType { get; set; }
    }
}
