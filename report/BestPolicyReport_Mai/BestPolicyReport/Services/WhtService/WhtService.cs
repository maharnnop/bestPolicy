using BestPolicyReport.Data;
using BestPolicyReport.Models.WhtReport;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.EntityFrameworkCore;

namespace BestPolicyReport.Services.WhtService
{
    public class WhtService : IWhtService
    {
        private readonly DataContext _dataContext;

        public WhtService(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        private static Task<string> GetWhereSql(WhtReportInput data, string sql)
        {
            if (!string.IsNullOrEmpty(data.AgentCode))
            {
                sql += $@"and a.""agentCode"" = '{data.AgentCode}' ";
            }
            if (!string.IsNullOrEmpty(data.StartRpRefDate) && !string.IsNullOrEmpty(data.EndRpRefDate))
            {
                sql += $@"and ar.rprefdate between '{data.StartRpRefDate}' and '{data.EndRpRefDate}' ";
            }
            sql += $@";";
            return Task.FromResult(sql);
        }
       
        public async Task<List<WhtCommOutReportResult>?> GetWhtCommOutReportJson(WhtReportInput data)
        {
            var sql = $@" ";
            sql = await GetWhereSql(data, sql);
            var json = await _dataContext.WhtCommOutReportResults.FromSqlRaw(sql).ToListAsync();
            return json;
        }

        public async Task<List<WhtOvOutReportResult>?> GetWhtOvOutReportJson(WhtReportInput data)
        {
            var sql = $@" ";
            sql = await GetWhereSql(data, sql);
            var json = await _dataContext.WhtOvOutReportResults.FromSqlRaw(sql).ToListAsync();
            return json;
        }
    }
}
