using BestPolicyReport.Data;
using BestPolicyReport.Models.OutputVatReport;
using BestPolicyReport.Models.WhtReport;
using Microsoft.EntityFrameworkCore;

namespace BestPolicyReport.Services.OutputVatService
{
    public class OutputVatService : IOutputVatService
    {
        private readonly DataContext _dataContext;

        public OutputVatService(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        private static Task<string> GetWhereSql(OutputVatReportInput data, string sql)
        {
            if (!string.IsNullOrEmpty(data.InsurerCode))
            {
                sql += $@"and i.""insurerCode"" = '{data.InsurerCode}' ";
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
            sql += $@"order by i.""insurerCode"" asc, ar.dfrpreferno asc, ar.rprefdate asc;";
            return Task.FromResult(sql);
        }

        public async Task<List<OutputVatCommInReportResult>?> GetOutputVatCommInReportJson(OutputVatReportInput data)
        {
            var sql = $@"select ar.dfrpreferno as ""dfRpReferNo"", 
                         ar.rprefdate as ""rpRefDate"", 
                         i.""insurerCode"", 
                         case 
                         	when e_i.""personType"" = 'O' then concat(t_i.""TITLETHAIBEGIN"", ' ', e_i.""t_ogName"", ' ', t_i.""TITLETHAIEND"") 
                         	when e_i.""personType"" = 'P' then concat(t_i.""TITLETHAIBEGIN"", ' ', e_i.""t_firstName"", ' ', e_i.""t_lastName"", ' ', t_i.""TITLETHAIEND"") 
                         	else null
                         end as ""insurerName"",
                         ar.commin as ""commInAmt"", 
                         ar.vatcommin as ""vatCommInAmt"", 
                         ar.status as ""arApStatus"",
                         ar.transactiontype as ""transactionType""
                         from static_data.b_jaaraps ar
                         left join static_data.""Insurers"" i on p.""insurerCode"" = i.""insurerCode"" 
                         left join static_data.""Entities"" e_i on i.""entityID"" = e_i.id
                         left join static_data.""Titles"" t_i on e_i.""titleID"" = t_i.""TITLEID""
                         where ar.status = 'A'
                         and ar.transactiontype = 'COMM-IN'
                         and ar.dfrpreferno is not null ";
            sql = await GetWhereSql(data, sql);
            var json = await _dataContext.OutputVatCommInReportResults.FromSqlRaw(sql).ToListAsync();
            return json;
        }

        public async Task<List<OutputVatOvInReportResult>?> GetOutputVatOvInReportJson(OutputVatReportInput data)
        {
            var sql = $@"select ar.dfrpreferno as ""dfRpReferNo"", 
                         ar.rprefdate as ""rpRefDate"", 
                         i.""insurerCode"", 
                         case 
                         	when e_i.""personType"" = 'O' then concat(t_i.""TITLETHAIBEGIN"", ' ', e_i.""t_ogName"", ' ', t_i.""TITLETHAIEND"") 
                         	when e_i.""personType"" = 'P' then concat(t_i.""TITLETHAIBEGIN"", ' ', e_i.""t_firstName"", ' ', e_i.""t_lastName"", ' ', t_i.""TITLETHAIEND"") 
                         	else null
                         end as ""insurerName"",
                         ar.ovin as ""ovInAmt"", 
                         ar.vatovin as ""vatOvInAmt"",
                         ar.status as ""arApStatus"",
                         ar.transactiontype as ""transactionType""
                         from static_data.b_jaaraps ar
                         left join static_data.""Insurers"" i on ar.insurerno  = i.id  
                         left join static_data.""Entities"" e_i on i.""entityID"" = e_i.id
                         left join static_data.""Titles"" t_i on e_i.""titleID"" = t_i.""TITLEID""
                         where ar.status = 'A'
                         and ar.transactiontype = 'COMM-IN'
                         and ar.dfrpreferno is not null ";
            sql = await GetWhereSql(data, sql);
            var json = await _dataContext.OutputVatOvInReportResults.FromSqlRaw(sql).ToListAsync();
            return json;
        }
    }
}
