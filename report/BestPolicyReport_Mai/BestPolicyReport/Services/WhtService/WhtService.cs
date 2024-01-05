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
       
        public async Task<List<WhtCommOutOvOutReportResult>?> GetWhtCommOutOvOutReportJson(WhtReportInput data)
        {
            var sql = $@"select ar.dfrpreferno as ""dfRpReferNo"",
                         ar.rprefdate as ""rpRefDate"",
                         a.""agentCode"",
                         case 
                         	when e.""personType"" = 'O' then concat(t.""TITLETHAIBEGIN"", ' ', e.""t_ogName"", ' ', t.""TITLETHAIEND"") 
                         	when e.""personType"" = 'P' then concat(t.""TITLETHAIBEGIN"", ' ', e.""t_firstName"", ' ', e.""t_lastName"", ' ', t.""TITLETHAIEND"") 
                         	else null
                         end as ""agentName"",
                         ar.commout as ""commOutAmt"",
                         ar.whtcommout as ""whtCommOutAmt"",
                         ar.ovout as ""ovOutAmt"",
                         ar.whtovout as ""whtOvOutAmt"",
                         ar.transactiontype as ""transactionType""
                         from static_data.b_jaaraps ar
                         left join static_data.""Agents"" a on ar.advisorno = a.id
                         left join static_data.""Entities"" e on a.""entityID"" = e.id
                         left join static_data.""Titles"" t on e.""titleID"" = t.""TITLEID""
                         where ar.transactiontype = 'COMM-OUT'
                         and ar.status = 'A' ";
            sql = await GetWhereSql(data, sql);
            var json = await _dataContext.WhtCommOutOvOutReportResults.FromSqlRaw(sql).ToListAsync();
            return json;
        }
    }
}
