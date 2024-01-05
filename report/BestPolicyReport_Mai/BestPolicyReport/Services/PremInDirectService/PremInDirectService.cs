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
            var sql = $@"select p.""insurerCode"",
                         p.""agentCode"" as ""agentCode1"",
                         t.""dueDate"",
                         ard.""policyNo"",
                         ard.""endorseNo"",
                         ard.""invoiceNo"",
                         ard.""seqNo"",
                         p.""insureeCode"",
                         case 
                         	when e_i.""personType"" = 'O' then concat(t_i.""TITLETHAIBEGIN"", ' ', e_i.""t_ogName"", ' ', t_i.""TITLETHAIEND"") 
                         	when e_i.""personType"" = 'P' then concat(t_i.""TITLETHAIBEGIN"", ' ', e_i.""t_firstName"", ' ', e_i.""t_lastName"", ' ', t_i.""TITLETHAIEND"") 
                         	else null
                         end as ""insureeName"",
                         case 
                         	when p.""itemList"" is not null then m.""licenseNo""
                         	else null
                         end as ""licenseNo"",
                         case 
                         	when p.""itemList"" is not null then pv.t_provincename
                         	else null
                         end as province,
                         case 
                         	when p.""itemList"" is not null then m.""chassisNo""
                         	else null
                         end as ""chassisNo"",
                         pg.grossprem as ""grossPrem"",
                         pg.duty,
                         pg.tax,
                         pg.totalprem as ""totalPrem"",
                         p.commout_rate as ""commOutRate"",
                         case 
                         	when ard.netflag = 'N' then pg.commout1_amt
                         	else null
                         end as ""commOutAmt"",
                         p.ovout_rate as ""ovOutRate"",
                         case 
                         	when ard.netflag = 'N' then pg.ovout1_amt
                         	else null
                         end as ""ovOutAmt"",
                         ard.netflag as ""netFlag"",
                         bad.billpremium as ""billPremium"",
                         ar.dfrpreferno as ""dfRpReferNo"",
                         ar.rprefdate as ""rpRefDate"",
                         ar.transactiontype as ""transactionType""
                         from static_data.b_jaaraps ar
                         left join static_data.b_jaarapds ard on ar.id = ard.keyidm
                         left join static_data.""Policies"" p on ard.polid = p.id
                         left join static_data.""Transactions"" t on p.id = t.polid
                         left join static_data.b_jabilladvisordetails bad on p.id = bad.polid
                         left join static_data.""Insurees"" i on p.""insureeCode"" = i.""insureeCode""
                         left join static_data.""Entities"" e_i on i.""entityID"" = e_i.id
                         left join static_data.""Titles"" t_i on e_i.""titleID"" = t_i.""TITLEID""
                         left join static_data.""Motors"" m on m.id = p.""itemList""
                         left join static_data.provinces pv on m.""motorprovinceID"" = pv.provinceid
                         left join static_data.b_jupgrs pg on (t.polid = pg.polid and t.""seqNo"" = pg.""seqNo"")
                         where ar.transactiontype = 'PREM-INS'
                         and t.""transType"" = 'PREM-IN'
                         and ar.status = 'A'
                         and pg.""installmenttype"" ='A' ";
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
