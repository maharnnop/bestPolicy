using BestPolicyReport.Data;
using BestPolicyReport.Models.PremInDirectReport;
using Microsoft.EntityFrameworkCore;

namespace BestPolicyReport.Services.PremInDirectService
{
    public class PremInDirectService : IPremInDirectService
    {
        private readonly DataContext _dataContext;

        public PremInDirectService(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<List<PremInDirectReportResult>?> GetPremInDirectReportJson(PremInDirectReportInput data)
        {
            var sql = $@" ";
            if (!string.IsNullOrEmpty(data.InsurerCode))
            {
                sql += $@"and p.""insurerCode"" = '{data.InsurerCode}' ";
            }
            if (!string.IsNullOrEmpty(data.AgentCode1?.ToString()))
            {
                sql += $@"and p.""agentCode"" = '{data.AgentCode1}' ";
            }
            if (!string.IsNullOrEmpty(data.StartDfRpReferNo?.ToString()) && !string.IsNullOrEmpty(data.EndDfRpReferNo?.ToString()))
            {
                sql += $@"and ar.dfrpreferno between '{data.StartDfRpReferNo}' and '{data.EndDfRpReferNo}' ";
            }
            string currentDate = DateTime.Now.ToString("yyyy-MM-dd", new System.Globalization.CultureInfo("en-US"));
            if (!string.IsNullOrEmpty(data.StartRpRefDate?.ToString()))
            {
                if (!string.IsNullOrEmpty(data.EndRpRefDate?.ToString()))
                {
                    sql += $@"and ar.rprefdate between '{data.StartRpRefDate}' and '{data.EndRpRefDate}' ";
                }
                else
                {
                    sql += $@"and ar.rprefdate between '{data.StartRpRefDate}' and '{currentDate}' ";
                }
            }
            sql += $@";";
            var json = await _dataContext.PremInDirectReportResults.FromSqlRaw(sql).ToListAsync();
            return json;
        }
    }
}
