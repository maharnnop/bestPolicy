using BestPolicyReport.Data;
using BestPolicyReport.Models.BillReport;
using Microsoft.EntityFrameworkCore;

namespace BestPolicyReport.Services.BillService
{
    public class BillService : IBillService
    {
        private readonly DataContext _dataContext;

        public BillService(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<List<BillReportResult>?> GetBillReportJson(BillReportInput data)
        {
            var subString = "BILL";
            var sql = $@"select * from (select p.""insurerCode"", p.""agentCode"" as ""agentCode1"", p.""agentCode2"", t.""dueDate"", p.""policyNo"", p.""endorseNo"", 
                         p.""invoiceNo"", bjd.seqno as ""seqNo"", i.""insureeCode"",
                         case 
                         	when e_i.""personType"" = 'O' then concat(t_i.""TITLETHAIBEGIN"", ' ', e_i.""t_ogName"", ' ', t_i.""TITLETHAIEND"") 
                         	when e_i.""personType"" = 'P' then concat(t_i.""TITLETHAIBEGIN"", ' ', e_i.""t_firstName"", ' ', e_i.""t_lastName"", ' ', t_i.""TITLETHAIEND"") 
                         	else ''
                         end	as ""insureeName"",
                         case 
                         	when p.""itemList"" is not null then m.""licenseNo""
                         	else null
                         end	as ""licenseNo"",
                         case 
                         	when p.""itemList"" is not null then pv.t_provincename
                         	else null
                         end	as province,
                         case 
                         	when p.""itemList"" is not null then m.""chassisNo""
                         	else null
                         end	as ""chassisNo"",
                         bjd.grossprem as ""grossPrem"", p.specdiscrate as ""specDiscRate"", p.specdiscamt as ""specDiscAmt"", p.netgrossprem as ""netGrossPrem"", 
                         bjd.duty, bjd.tax, bjd.totalprem as ""totalPrem"", p.commout1_rate as ""commOutRate1"", p.commout1_amt as ""commOutAmt1"",  
                         p.ovout1_rate as ""ovOutRate1"", p.ovout1_amt as ""ovOutAmt1"", p.commout2_rate as ""commOutRate2"", p.commout2_amt as ""commOutAmt2"", 
                         p.ovout2_rate as ""ovOutRate2"", p.ovout2_amt as ""ovOutAmt2"", bjd.""comm-out%"" as ""commOutRate"", bjd.""comm-out-amt"" as ""commOutAmt"", 
                         bjd.""ov-out%"" as ""ovOutRate"", bjd.""ov-out-amt"" as ""ovOutAmt"", bjd.netflag as ""netFlag"", bjd.billpremium as ""billPremium"",
                         bj.billadvisorno as ""billAdvisorNo"",
                         CAST(SUBSTRING(bj.billadvisorno FROM POSITION('{subString}' IN bj.billadvisorno) + LENGTH('{subString}')) AS INTEGER) as ""billAdvisorSubNo"",
                         bj.billdate as ""billDate""
                         from static_data.b_jabilladvisors bj, static_data.b_jabilladvisordetails bjd, static_data.""Transactions"" t, static_data.""Insurees"" i,
                         static_data.""Entities"" e_i, static_data.""Titles"" t_i, static_data.""Policies"" p left join static_data.""Motors"" m on m.id = p.""itemList""
                         left join static_data.provinces pv on m.""motorprovinceID"" = pv.provinceid
                         where bj.id = bjd.keyidm and bj.billadvisorno = t.billadvisorno and bjd.polid = p.id and bjd.customerid = i.id and i.""entityID"" = e_i.id
                         and e_i.""titleID"" = t_i.""TITLEID"" and t.billadvisorno is not null) as query where true ";
            if (!string.IsNullOrEmpty(data.InsurerCode))
            {
                sql += $@"and ""insurerCode"" = '{data.InsurerCode}' ";
            }
            if (!string.IsNullOrEmpty(data.AgentCode1))
            {
                sql += $@"and ""agentCode1"" = '{data.AgentCode1}' ";
            }
            if (!string.IsNullOrEmpty(data.AgentCode2))
            {
                sql += $@"and ""agentCode2"" = '{data.AgentCode2}' ";
            }
            if (!string.IsNullOrEmpty(data.StartBillAdvisorNo) && !string.IsNullOrEmpty(data.EndBillAdvisorNo))
            {
                sql += $@"and ""billAdvisorSubNo"" between {data.StartBillAdvisorNo} and {data.EndBillAdvisorNo} ";
            }
            string currentDate = DateTime.Now.ToString("yyyy-MM-dd", new System.Globalization.CultureInfo("en-US"));
            if (!string.IsNullOrEmpty(data.StartBillDate?.ToString()))
            {
                if (!string.IsNullOrEmpty(data.EndBillDate?.ToString()))
                {
                    sql += $@"and ""billDate"" between '{data.StartBillDate}' and '{data.EndBillDate}' ";
                }
                else
                {
                    sql += $@"and ""billDate"" between '{data.StartBillDate}' and '{currentDate}' ";
                }
            }

            sql += $@";";
            var json = await _dataContext.BillReportResults.FromSqlRaw(sql).ToListAsync();
            return json;
        }
    }
}
