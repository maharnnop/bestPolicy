using BestPolicyReport.Data;
using BestPolicyReport.Models.DailyPolicyReport;
using Microsoft.EntityFrameworkCore;

namespace BestPolicyReport.Services.DailyPolicyService
{
    public class DailyPolicyService : IDailyPolicyService
    {
        private readonly DataContext _dataContext;

        public DailyPolicyService(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<List<DailyPolicyReportResult>?> GetDailyPolicyReportJson(DailyPolicyReportInput data)
        {

            var sql = $@"select p.""applicationNo"", 
                         p.""policyNo"",
                         p.""policyDate"", 
                         p.""actDate"", 
                         p.""expDate"", 
                         p.""issueDate"", 
                         p.createusercode as ""CreateUserCode"", 
                         u.""userName"" as ""Username"",
                         a1.""contactPersonID"" as ""contactPersonId1"",
                         case
                         	when e_cp1.""personType"" = 'O' then concat(t_cp1.""TITLETHAIBEGIN"", ' ', e_cp1.""t_ogName"", ' ', t_cp1.""TITLETHAIEND"") 
                         	when e_cp1.""personType"" = 'P' then concat(t_cp1.""TITLETHAIBEGIN"", ' ', e_cp1.""t_firstName"", ' ', e_cp1.""t_lastName"", ' ', t_cp1.""TITLETHAIEND"") 
                         	else null
                         end
                         as ""contactPersonName1"",
                         a2.""contactPersonID"" as ""contactPersonId2"",
                         case 
                         	when e_cp2.""personType"" = 'O' then concat(t_cp2.""TITLETHAIBEGIN"", ' ', e_cp2.""t_ogName"", ' ', t_cp2.""TITLETHAIEND"") 
                         	when e_cp2.""personType"" = 'P' then concat(t_cp2.""TITLETHAIBEGIN"", ' ', e_cp2.""t_firstName"", ' ', e_cp2.""t_lastName"", ' ', t_cp2.""TITLETHAIEND"") 
                         	else null
                         end	
                         as ""contactPersonName2"",
                         p.""agentCode"" as ""agentCode1"", 
                         case 
                         	when e_a1.""personType"" = 'O' then concat(t_a1.""TITLETHAIBEGIN"", ' ', e_a1.""t_ogName"", ' ', t_a1.""TITLETHAIEND"") 
                         	when e_a1.""personType"" = 'P' then concat(t_a1.""TITLETHAIBEGIN"", ' ', e_a1.""t_firstName"", ' ', e_a1.""t_lastName"", ' ', t_a1.""TITLETHAIEND"") 
                         	else null
                         end	
                         as ""agentName1"",
                         p.""agentCode2"", 
                         case 
                         	when e_a2.""personType"" = 'O' then concat(t_a2.""TITLETHAIBEGIN"", ' ', e_a2.""t_ogName"", ' ', t_a2.""TITLETHAIEND"") 
                         	when e_a2.""personType"" = 'P' then concat(t_a2.""TITLETHAIBEGIN"", ' ', e_a2.""t_firstName"", ' ', e_a2.""t_lastName"", ' ', t_a2.""TITLETHAIEND"") 
                         	else null
                         end	
                         as ""agentName2"",
                         p.""insureeCode"",
                         case 
                         	when e_i.""personType"" = 'O' then concat(t_i.""TITLETHAIBEGIN"", ' ', e_i.""t_ogName"", ' ', t_i.""TITLETHAIEND"") 
                         	when e_i.""personType"" = 'P' then concat(t_i.""TITLETHAIBEGIN"", ' ', e_i.""t_firstName"", ' ', e_i.""t_lastName"", ' ', t_i.""TITLETHAIEND"") 
                         	else null
                         end	
                         as ""insureeName"",
                         it.""class"",
                         it.""subClass"",
                         case 
                         	when p.""itemList"" is not null then m.""licenseNo""
                         	else null
                         end	
                         as ""licenseNo"",
                         case 
                         	when p.""itemList"" is not null then pv.t_provincename
                         	else null
                         end	
                         as province,
                         case 
                         	when p.""itemList"" is not null then m.""chassisNo""
                         	else null
                         end	
                         as ""chassisNo"",
                         p.grossprem as ""grossPrem"", 
                         p.specdiscrate as ""specDiscRate"", 
                         p.specdiscamt as ""specDiscAmt"", 
                         p.netgrossprem as ""netGrossPrem"", 
                         p.duty, 
                         p.tax, 
                         p.totalprem as ""totalPrem"", 
                         p.commin_rate as ""commInRate"", 
                         p.commin_amt as ""commInAmt"", 
                         p.commin_taxamt as ""commInTaxAmt"", 
                         p.ovin_rate as ""ovInRate"", 
                         p.ovin_amt as ""ovInAmt"", 
                         p.ovin_taxamt as ""ovInTaxAmt"", 
                         p.commout_rate as ""commOutRate"", 
                         p.commout_amt as ""commOutAmt"", 
                         p.ovout_rate as ""ovOutRate"", 
                         p.ovout_amt as ""ovOutAmt"",
                         p.""insurerCode"" 
                         from static_data.""Policies"" p
                         left join static_data.""Users"" u on u.""empCode"" = p.createusercode
                         left join static_data.""Agents"" a1 on (a1.""agentCode"" = p.""agentCode"" and a1.lastversion = 'Y')
                         left join static_data.""Entities"" e_a1 on e_a1.id = a1.""entityID""
                         left join static_data.""Titles"" t_a1 on e_a1.""titleID"" = t_a1.""TITLEID""
                         left join static_data.""Entities"" e_cp1 on e_cp1.id = a1.""contactPersonID""
                         left join static_data.""Titles"" t_cp1 on e_cp1.""titleID"" = t_cp1.""TITLEID""
                         left join static_data.""Agents"" a2 on (a2.""agentCode"" = p.""agentCode2"" and a2.lastversion = 'Y')
                         left join static_data.""Entities"" e_a2 on e_a2.id = a2.""entityID""
                         left join static_data.""Titles"" t_a2 on e_a2.""titleID"" = t_a2.""TITLEID""
                         left join static_data.""Entities"" e_cp2 on e_cp2.id = a2.""contactPersonID""
                         left join static_data.""Titles"" t_cp2 on e_cp2.""titleID"" = t_cp2.""TITLEID""
                         left join static_data.""Insurees"" i on p.""insureeCode"" = i.""insureeCode""
                         left join static_data.""Entities"" e_i on i.""entityID"" = e_i.id
                         left join static_data.""Titles"" t_i on e_i.""titleID"" = t_i.""TITLEID""
                         left join static_data.""InsureTypes"" it on it.id = p.""insureID""
                         left join static_data.""Motors"" m on m.id = p.""itemList""
                         left join static_data.provinces pv on m.""motorprovinceID"" = pv.provinceid
                         where p.""endorseNo"" is null 
                         and p.""lastVersion"" = 'Y' ";
            string currentDate = DateTime.Now.ToString("yyyy-MM-dd", new System.Globalization.CultureInfo("en-US"));
            if (!string.IsNullOrEmpty(data.StartPolicyDate?.ToString()))
            {
                if (!string.IsNullOrEmpty(data.EndPolicyDate?.ToString()))
                {
                    sql += $@"and p.""policyDate"" between '{data.StartPolicyDate}' and '{data.EndPolicyDate}' ";
                }
                else
                {
                    sql += $@"and p.""policyDate"" between '{data.StartPolicyDate}' and '{currentDate}' ";
                }
            }
            if (!string.IsNullOrEmpty(data.CreateUserCode?.ToString()))
            {
                sql += $@"and p.createusercode = '{data.CreateUserCode}' ";
            }
            if (!string.IsNullOrEmpty(data.ContactPersonId1?.ToString()))
            {
                sql += $@"and a1.""contactPersonID"" = {data.ContactPersonId1} ";
            }
            if (!string.IsNullOrEmpty(data.ContactPersonId2?.ToString()))
            {
                sql += $@"and a2.""contactPersonID"" = {data.ContactPersonId2} ";
            }
            if (!string.IsNullOrEmpty(data.AgentCode1?.ToString()))
            {
                sql += $@"and p.""agentCode"" = '{data.AgentCode1}' ";
            }
            if (!string.IsNullOrEmpty(data.AgentCode2?.ToString()))
            {
                sql += $@"and p.""agentCode2"" = '{data.AgentCode2}' ";
            }
            if (!string.IsNullOrEmpty(data.InsurerCode?.ToString()))
            {
                sql += $@"and p.""insurerCode"" = '{data.InsurerCode}' ";
            }
            if (!string.IsNullOrEmpty(data.Status?.ToString()))
            {
                sql += $@"and p.status = '{data.Status}' ";
            }
            if (!string.IsNullOrEmpty(data.Class?.ToString()))
            {
                sql += $@"and it.""class"" = '{data.Class}' ";
            }
            if (!string.IsNullOrEmpty(data.SubClass?.ToString()))
            {
                sql += $@"and it.""subClass"" = '{data.SubClass}' ";
            }
            if (!string.IsNullOrEmpty(data.OrderBy?.ToString()))
            {
                if (data.OrderBy.ToString() == "ผู้บันทึก")
                {
                    sql += $@"order by p.createusercode asc";
                }
                else if (data.OrderBy.ToString() == "ผู้ดูแล")
                {
                    sql += $@"order by a1.""contactPersonID"" asc, a2.""contactPersonID"" asc";
                }
                else if (data.OrderBy.ToString() == "ผู้แนะนำ")
                {
                    sql += $@"order by p.""agentCode"" asc, p.""agentCode2"" asc";
                }
            }
            sql += $@";";
            var json = await _dataContext.DailyPolicyReportResults.FromSqlRaw(sql).ToListAsync();
            return json;
        }
    }
}
