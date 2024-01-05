using BestPolicyReport.Models.OutputVatReport;

namespace BestPolicyReport.Services.OutputVatService
{
    public interface IOutputVatService
    {
        Task<List<OutputVatCommInReportResult>?> GetOutputVatCommInReportJson(OutputVatReportInput data);
        Task<List<OutputVatOvInReportResult>?> GetOutputVatOvInReportJson(OutputVatReportInput data);
    }
}
