using BestPolicyReport.Data;
using BestPolicyReport.Models.OutputVatCommInReport;
using Microsoft.EntityFrameworkCore;

namespace BestPolicyReport.Services.OutputVatCommInService
{
    public class OutputVatCommInService : IOutputVatCommInService
    {
        private readonly DataContext _dataContext;

        public OutputVatCommInService(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<List<OutputVatCommInReportResult>?> GetOutputVatCommInReportJson(OutputVatCommInReportInput data)
        {
            var sql = $@"select t.dfrpreferno as ""dfRpReferNo"", 
                         t.rprefdate as ""rpRefDate"", 
                         t.""insurerCode"", 
                         case 
                         	when e.""personType"" = 'O' then concat(tt.""TITLETHAIBEGIN"", ' ', e.""t_ogName"", ' ', tt.""TITLETHAIEND"") 
                         	when e.""personType"" = 'P' then concat(tt.""TITLETHAIBEGIN"", ' ', e.""t_firstName"", ' ', e.""t_lastName"", ' ', tt.""TITLETHAIEND"") 
                         	else ''
                         end as ""insurerName"",
                         t.commamt as ""commInAmt"", 
                         t.commtaxamt as ""vatCommInAmt"", 
                         t.status as ""transactionStatus"", 
                         t.""transType"" as ""transactionType"", 
                         p.status as ""policyStatus""
                         from static_data.""Transactions"" t, 
                         static_data.""Insurers"" i, 
                         static_data.""Entities"" e, 
                         static_data.""Titles"" tt, 
                         static_data.""Policies"" p 
                         where i.""insurerCode"" = t.""insurerCode"" 
                         and i.""entityID"" = e.id 
                         and e.""titleID"" = tt.""TITLEID"" 
                         and t.polid = p.id 
                         and p.status = 'A'
                         and t.""transType"" = 'COMM-IN' 
                         and t.txtype2 in (1, 2, 3, 4, 5) 
                         and t.dfrpreferno is not null ";
            if (!string.IsNullOrEmpty(data.InsurerCode))
            {
                sql += $@"and t.""insurerCode"" = '{data.InsurerCode}' ";
            }
            string currentDate = DateTime.Now.ToString("yyyy-MM-dd", new System.Globalization.CultureInfo("en-US"));
            if (!string.IsNullOrEmpty(data.StartRpRefDate?.ToString()))
            {
                if (!string.IsNullOrEmpty(data.EndRpRefDate?.ToString()))
                {
                    sql += $@"and t.rprefdate between '{data.StartRpRefDate}' and '{data.EndRpRefDate}' ";
                }
                else
                {
                    sql += $@"and t.rprefdate between '{data.StartRpRefDate}' and '{currentDate}' ";
                }
            }
            sql += $@"order by t.""insurerCode"" asc, t.dfrpreferno asc, t.rprefdate asc;";
            var json = await _dataContext.OutputVatCommInReportResults.FromSqlRaw(sql).ToListAsync();
            return json;
        }
    }
}
