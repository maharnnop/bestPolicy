using System.ComponentModel.DataAnnotations.Schema;

namespace BestPolicyReport.Models.BillReport
{
    public class PolicyGroupBillReportResult
    {
        public string? LicenseNo { get; set; }
        public string? Brand { get; set; }
        public string? Model { get; set; }
        public string? InsureeName { get; set; }
        public int? ModelYear { get; set; }
        public string? ChassisNo { get; set; }
        public double? CoverAmt { get; set; }
        public string? PolicyNo { get; set; }
        public DateTime? ActDate { get; set; }
        public DateTime? ExpDate { get; set; }
        public double NetGrossPrem { get; set; }
        public double Duty { get; set; }
        public double NetGrossPremBeforeTax { get; set; }
        public double Tax { get; set; }
        public double TotalPrem { get; set; }
        public double WithHeld { get; set; }
        public double BillPremium { get; set; }
        public string? NetFlag { get; set; }
        public string? BillAdvisorNo { get; set; }
        public string? CreateUserCode { get; set; }
        public DateTime? BillDate { get; set; }
    }
}
