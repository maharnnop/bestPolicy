namespace BestPolicy.Models
{
    public class DailyPolicyReport
    {
        public string? ApplicationNo { get; set; }
        public string? PolicyNo { get; set; }
        public DateOnly? PolicyDate { get; set; }
        public DateOnly? ActDate { get; set; }
        public DateOnly? ExpDate { get; set; }
        public DateTime? IssueDate { get; set; }
        public string? CreateUserCode { get; set; }
        public string? Username { get; set; }
        public int? ContactPersonId1 { get; set; }
        public string? ContactPersonName1 { get; set; }
        public int? ContactPersonId2 { get; set; }
        public string? ContactPersonName2 { get; set; }
        public string? AgentCode1 { get; set; }
        public string? AgentName1 { get; set; }
        public string? AgentCode2 { get; set; }
        public string? AgentName2 { get; set; }
        public string? InsureeCode { get; set; }
        public string? InsureeName { get; set; }
    }                                              
}                                                  
                                                   