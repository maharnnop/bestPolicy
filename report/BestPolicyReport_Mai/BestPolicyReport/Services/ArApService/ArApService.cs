using BestPolicyReport.Data;
using BestPolicyReport.Models.ArApReport;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.EntityFrameworkCore;

namespace BestPolicyReport.Services.ArApService
{
    public class ArApService : IArApService
    {
        private readonly DataContext _dataContext;

        public ArApService(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        private static Task<string> GetWhereSql(ArApReportInput data, string sql, string type)
        {
            string currentDate = DateTime.Now.ToString("yyyy-MM-dd", new System.Globalization.CultureInfo("en-US"));
            if (!string.IsNullOrEmpty(data.StartPolicyIssueDate?.ToString()))
            {
                if (!string.IsNullOrEmpty(data.EndPolicyIssueDate?.ToString()))
                {
                    sql += $@"and p.""issueDate"" between '{data.StartPolicyIssueDate}' and '{data.EndPolicyIssueDate}' ";
                }
                else
                {
                    sql += $@"and p.""issueDate"" between '{data.StartPolicyIssueDate}' and '{currentDate}' ";
                }
            }
            if (!string.IsNullOrEmpty(data.CreateUserCode))
            {
                sql += $@"and p.createusercode = '{data.CreateUserCode}' ";
            }
            if (!string.IsNullOrEmpty(data.MainAccountContactPersonId))
            {
                sql += $@"and a.""contactPersonID"" = {data.MainAccountContactPersonId} ";
            }
            if (!string.IsNullOrEmpty(data.MainAccountCode))
            {
                sql += $@"and t.mainaccountcode = '{data.MainAccountCode}' ";
            }
            if (!string.IsNullOrEmpty(data.InsurerCode))
            {
                sql += $@"and t.""insurerCode"" = '{data.InsurerCode}' ";
            }
            if (!string.IsNullOrEmpty(data.PolicyStatus))
            {
                sql += $@"and p.status = '{data.PolicyStatus}' ";
            }
            if (!string.IsNullOrEmpty(data.Class))
            {
                sql += $@"and it.""class"" = '{data.Class}' ";
            }
            if (!string.IsNullOrEmpty(data.SubClass))
            {
                sql += $@"and it.""subClass"" = '{data.SubClass}' ";
            }
            if (type == "CommOutOvOut")
            {
                if (!string.IsNullOrEmpty(data.TransactionType))
                {
                    sql += $@"and t.""transType"" = '{data.TransactionType}' ";
                }
            }
            sql += $@"order by t.""policyNo"" asc, t.""transType"" asc, t.""seqNo"" asc;";
            return Task.FromResult(sql);
        }

        public async Task<List<CommOutOvOutReportResult>?> GetCommOutOvOutOpenItemReportJson(ArApReportInput data)
        {
            var sql = $@"select
                         t.""policyNo"",
                         t.""endorseNo"",
                         ard.""invoiceNo"",
                         t.""seqNo"",
                         ar.cashierreceiveno as ""cashierReceiveNo"",
                         c.cashierdate as ""cashierDate"",
                         ar.cashieramt as ""cashierAmt"",
                         c.receivetype as ""cashierReceiveType"",
                         c.refno as ""cashierRefNo"",
                         --c.refdate,
                         t.""premin-dfrpreferno"" as ""premInDfRpReferNo"",
                         t.rprefdate as ""rpRefDate"",
                         p.grossprem as ""grossPrem"",
                         p.specdiscrate as ""specDiscRate"",
                         p.specdiscamt as ""specDiscAmt"",
                         t.netgrossprem as ""netGrossPrem"",
                         t.duty,
                         t.tax,
                         t.totalprem as ""totalPrem"",
                         t.netflag as ""netFlag"",
                         p.""actDate"",
                         p.""expDate"",
                         t.mainaccountcode as ""mainAccountCode"",
                         case
                             when e.""personType"" = 'O' then concat(tt.""TITLETHAIBEGIN"", ' ', e.""t_ogName"", ' ', tt.""TITLETHAIEND"")
                             when e.""personType"" = 'P' then concat(tt.""TITLETHAIBEGIN"", ' ', e.""t_firstName"", ' ', e.""t_lastName"", ' ', tt.""TITLETHAIEND"")
                             else null
                         end as ""MainAccountName"",
                         p.""insureeCode"",
                         case
                             when e_i.""personType"" = 'O' then concat(tt_i.""TITLETHAIBEGIN"", ' ', e_i.""t_ogName"", ' ', tt_i.""TITLETHAIEND"")
                             when e_i.""personType"" = 'P' then concat(tt_i.""TITLETHAIBEGIN"", ' ', e_i.""t_firstName"", ' ', e_i.""t_lastName"", ' ', tt_i.""TITLETHAIEND"")
                             else null
                         end as ""insureeName"",
                         it.""class"",
                         it.""subClass"",
                         m.""licenseNo"",
                         pv.t_provincename as ""province"",
                         m.""chassisNo"",
                         p.commout_rate as ""commOutRate"",
                         p.ovout_rate as ""ovOutRate"",
                         t.ovamt as ""ovOutAmt"",
                         (select t2.dfrpreferno from static_data.""Transactions"" t2 where ""transType"" = 'COMM-OUT' and t2.id = t.id) as ""commOutDfRpReferNo"",
                         (select t2.rprefdate from static_data.""Transactions"" t2 where ""transType"" = 'COMM-OUT' and t2.id = t.id) as ""commOutRpRefDate"",
                         (select t2.paidamt from static_data.""Transactions"" t2 where ""transType"" = 'COMM-OUT' and t2.id = t.id) as ""commOutPaidAmt"",
                         (select t2.remainamt from static_data.""Transactions"" t2 where ""transType"" = 'COMM-OUT' and t2.id = t.id) as ""commOutDiffAmt"",
                         (select t2.paidamt from static_data.""Transactions"" t2 where ""transType"" = 'OV-OUT' and t2.id = t.id) as ""ovOutPaidAmt"",
                         (select t2.remainamt from static_data.""Transactions"" t2 where ""transType"" = 'OV-OUT' and t2.id = t.id) as ""ovOutDiffAmt"",
                         p.""issueDate"",
                         p.createusercode as ""policyCreateUserCode"",
                         a.""contactPersonID"" as ""mainAccountContactPersonId"",
                         t.""insurerCode"",
                         p.status as ""PolicyStatus"",
                         t.""transType"" as ""transactionType""
                         from
                         static_data.""Transactions"" t 
                         left join static_data.""Policies"" p on t.polid = p.id
                         left join static_data.""Insurees"" i on p.""insureeCode"" = i.""insureeCode""
                         left join static_data.""Entities"" e_i on i.""entityID"" = e_i.id
                         left join static_data.""Titles"" tt_i on tt_i.""TITLEID"" = e_i.""titleID""
                         left join static_data.""InsureTypes"" it on p.""insureID"" = it.id
                         left join static_data.""Motors"" m on p.""itemList"" = m.id
                         left join static_data.provinces pv on m.""motorprovinceID"" = pv.provinceid
                         left join static_data.b_jacashiers c on t.""premin-dfrpreferno"" = c.dfrpreferno
                         left join static_data.b_jaaraps ar on (ar.cashierreceiveno = c.cashierreceiveno)
                         left join static_data.b_jaarapds ard on ard.keyidm = ar.id and ard.polid = p.id
                         left join static_data.""Agents"" a on a.""agentCode"" = t.mainaccountcode 
                         left join static_data.""Entities"" e on a.""entityID"" = e.id
                         left join static_data.""Titles"" tt on tt.""TITLEID"" = e.""titleID""
                         where t.""transType"" in ('COMM-OUT', 'OV-OUT')
                         and t.txtype2 in ('1', '2', '3', '4', '5')
                         and t.status = 'N'
                         and t.""premin-dfrpreferno"" is not null
                         and t.""premin-rprefdate"" is not null ";
            sql = await GetWhereSql(data, sql, "CommOutOvOut");
            var json = await _dataContext.CommOutOvOutReportResults.FromSqlRaw(sql).ToListAsync();
            return json;
        }

        public async Task<List<CommOutOvOutReportResult>?> GetCommOutOvOutClearingReportJson(ArApReportInput data)
        {
            var sql = $@"select
                         t.""policyNo"",
                         t.""endorseNo"",
                         ard.""invoiceNo"",
                         t.""seqNo"",
                         ar.cashierreceiveno as ""cashierReceiveNo"",
                         c.cashierdate as ""cashierDate"",
                         ar.cashieramt as ""cashierAmt"",
                         c.receivetype as ""cashierReceiveType"",
                         c.refno as ""cashierRefNo"",
                         --c.refdate,
                         t.""premin-dfrpreferno"" as ""premInDfRpReferNo"",
                         t.rprefdate as ""rpRefDate"",
                         p.grossprem as ""grossPrem"",
                         p.specdiscrate as ""specDiscRate"",
                         p.specdiscamt as ""specDiscAmt"",
                         t.netgrossprem as ""netGrossPrem"",
                         t.duty,
                         t.tax,
                         t.totalprem as ""totalPrem"",
                         t.netflag as ""netFlag"",
                         p.""actDate"",
                         p.""expDate"",
                         t.mainaccountcode as ""mainAccountCode"",
                         case
                             when e.""personType"" = 'O' then concat(tt.""TITLETHAIBEGIN"", ' ', e.""t_ogName"", ' ', tt.""TITLETHAIEND"")
                             when e.""personType"" = 'P' then concat(tt.""TITLETHAIBEGIN"", ' ', e.""t_firstName"", ' ', e.""t_lastName"", ' ', tt.""TITLETHAIEND"")
                             else null
                         end as ""MainAccountName"",
                         p.""insureeCode"",
                         case
                             when e_i.""personType"" = 'O' then concat(tt_i.""TITLETHAIBEGIN"", ' ', e_i.""t_ogName"", ' ', tt_i.""TITLETHAIEND"")
                             when e_i.""personType"" = 'P' then concat(tt_i.""TITLETHAIBEGIN"", ' ', e_i.""t_firstName"", ' ', e_i.""t_lastName"", ' ', tt_i.""TITLETHAIEND"")
                             else null
                         end as ""insureeName"",
                         it.""class"",
                         it.""subClass"",
                         m.""licenseNo"",
                         pv.t_provincename as ""province"",
                         m.""chassisNo"",
                         p.commout_rate as ""commOutRate"",
                         p.ovout_rate as ""ovOutRate"",
                         t.ovamt as ""ovOutAmt"",
                         (select t2.dfrpreferno from static_data.""Transactions"" t2 where ""transType"" = 'COMM-OUT' and t2.id = t.id) as ""commOutDfRpReferNo"",
                         (select t2.rprefdate from static_data.""Transactions"" t2 where ""transType"" = 'COMM-OUT' and t2.id = t.id) as ""commOutRpRefDate"",
                         (select t2.paidamt from static_data.""Transactions"" t2 where ""transType"" = 'COMM-OUT' and t2.id = t.id) as ""commOutPaidAmt"",
                         (select t2.remainamt from static_data.""Transactions"" t2 where ""transType"" = 'COMM-OUT' and t2.id = t.id) as ""commOutDiffAmt"",
                         (select t2.paidamt from static_data.""Transactions"" t2 where ""transType"" = 'OV-OUT' and t2.id = t.id) as ""ovOutPaidAmt"",
                         (select t2.remainamt from static_data.""Transactions"" t2 where ""transType"" = 'OV-OUT' and t2.id = t.id) as ""ovOutDiffAmt"",
                         p.""issueDate"",
                         p.createusercode as ""policyCreateUserCode"",
                         a.""contactPersonID"" as ""mainAccountContactPersonId"",
                         t.""insurerCode"",
                         p.status as ""PolicyStatus"",
                         t.""transType"" as ""transactionType""
                         from
                         static_data.""Transactions"" t 
                         left join static_data.""Policies"" p on t.polid = p.id
                         left join static_data.""Insurees"" i on p.""insureeCode"" = i.""insureeCode""
                         left join static_data.""Entities"" e_i on i.""entityID"" = e_i.id
                         left join static_data.""Titles"" tt_i on tt_i.""TITLEID"" = e_i.""titleID""
                         left join static_data.""InsureTypes"" it on p.""insureID"" = it.id
                         left join static_data.""Motors"" m on p.""itemList"" = m.id
                         left join static_data.provinces pv on m.""motorprovinceID"" = pv.provinceid
                         left join static_data.b_jacashiers c on t.""premin-dfrpreferno"" = c.dfrpreferno
                         left join static_data.b_jaaraps ar on (ar.cashierreceiveno = c.cashierreceiveno)
                         left join static_data.b_jaarapds ard on ard.keyidm = ar.id and ard.polid = p.id
                         left join static_data.""Agents"" a on a.""agentCode"" = t.mainaccountcode 
                         left join static_data.""Entities"" e on a.""entityID"" = e.id
                         left join static_data.""Titles"" tt on tt.""TITLEID"" = e.""titleID""
                         where t.""transType"" in ('COMM-OUT', 'OV-OUT')
                         and t.txtype2 in ('1', '2', '3', '4', '5')
                         and t.status = 'N'
                         and t.""premin-dfrpreferno"" is not null
                         and t.""premin-rprefdate"" is not null
                         and t.dfrpreferno is not null
                         and t.rprefdate is not null ";
            sql = await GetWhereSql(data, sql, "CommOutOvOut");
            var json = await _dataContext.CommOutOvOutReportResults.FromSqlRaw(sql).ToListAsync();
            return json;
        }

        public async Task<List<CommOutOvOutReportResult>?> GetCommOutOvOutOutstandingReportJson(ArApReportInput data)
        {
            var sql = $@"select
                         t.""policyNo"",
                         t.""endorseNo"",
                         ard.""invoiceNo"",
                         t.""seqNo"",
                         ar.cashierreceiveno as ""cashierReceiveNo"",
                         c.cashierdate as ""cashierDate"",
                         ar.cashieramt as ""cashierAmt"",
                         c.receivetype as ""cashierReceiveType"",
                         c.refno as ""cashierRefNo"",
                         --c.refdate,
                         t.""premin-dfrpreferno"" as ""premInDfRpReferNo"",
                         t.rprefdate as ""rpRefDate"",
                         p.grossprem as ""grossPrem"",
                         p.specdiscrate as ""specDiscRate"",
                         p.specdiscamt as ""specDiscAmt"",
                         t.netgrossprem as ""netGrossPrem"",
                         t.duty,
                         t.tax,
                         t.totalprem as ""totalPrem"",
                         t.netflag as ""netFlag"",
                         p.""actDate"",
                         p.""expDate"",
                         t.mainaccountcode as ""mainAccountCode"",
                         case
                             when e.""personType"" = 'O' then concat(tt.""TITLETHAIBEGIN"", ' ', e.""t_ogName"", ' ', tt.""TITLETHAIEND"")
                             when e.""personType"" = 'P' then concat(tt.""TITLETHAIBEGIN"", ' ', e.""t_firstName"", ' ', e.""t_lastName"", ' ', tt.""TITLETHAIEND"")
                             else null
                         end as ""MainAccountName"",
                         p.""insureeCode"",
                         case
                             when e_i.""personType"" = 'O' then concat(tt_i.""TITLETHAIBEGIN"", ' ', e_i.""t_ogName"", ' ', tt_i.""TITLETHAIEND"")
                             when e_i.""personType"" = 'P' then concat(tt_i.""TITLETHAIBEGIN"", ' ', e_i.""t_firstName"", ' ', e_i.""t_lastName"", ' ', tt_i.""TITLETHAIEND"")
                             else null
                         end as ""insureeName"",
                         it.""class"",
                         it.""subClass"",
                         m.""licenseNo"",
                         pv.t_provincename as ""province"",
                         m.""chassisNo"",
                         p.commout_rate as ""commOutRate"",
                         p.ovout_rate as ""ovOutRate"",
                         t.ovamt as ""ovOutAmt"",
                         (select t2.dfrpreferno from static_data.""Transactions"" t2 where ""transType"" = 'COMM-OUT' and t2.id = t.id) as ""commOutDfRpReferNo"",
                         (select t2.rprefdate from static_data.""Transactions"" t2 where ""transType"" = 'COMM-OUT' and t2.id = t.id) as ""commOutRpRefDate"",
                         (select t2.paidamt from static_data.""Transactions"" t2 where ""transType"" = 'COMM-OUT' and t2.id = t.id) as ""commOutPaidAmt"",
                         (select t2.remainamt from static_data.""Transactions"" t2 where ""transType"" = 'COMM-OUT' and t2.id = t.id) as ""commOutDiffAmt"",
                         (select t2.paidamt from static_data.""Transactions"" t2 where ""transType"" = 'OV-OUT' and t2.id = t.id) as ""ovOutPaidAmt"",
                         (select t2.remainamt from static_data.""Transactions"" t2 where ""transType"" = 'OV-OUT' and t2.id = t.id) as ""ovOutDiffAmt"",
                         p.""issueDate"",
                         p.createusercode as ""policyCreateUserCode"",
                         a.""contactPersonID"" as ""mainAccountContactPersonId"",
                         t.""insurerCode"",
                         p.status as ""PolicyStatus"",
                         t.""transType"" as ""transactionType""
                         from
                         static_data.""Transactions"" t 
                         left join static_data.""Policies"" p on t.polid = p.id
                         left join static_data.""Insurees"" i on p.""insureeCode"" = i.""insureeCode""
                         left join static_data.""Entities"" e_i on i.""entityID"" = e_i.id
                         left join static_data.""Titles"" tt_i on tt_i.""TITLEID"" = e_i.""titleID""
                         left join static_data.""InsureTypes"" it on p.""insureID"" = it.id
                         left join static_data.""Motors"" m on p.""itemList"" = m.id
                         left join static_data.provinces pv on m.""motorprovinceID"" = pv.provinceid
                         left join static_data.b_jacashiers c on t.""premin-dfrpreferno"" = c.dfrpreferno
                         left join static_data.b_jaaraps ar on (ar.cashierreceiveno = c.cashierreceiveno)
                         left join static_data.b_jaarapds ard on ard.keyidm = ar.id and ard.polid = p.id
                         left join static_data.""Agents"" a on a.""agentCode"" = t.mainaccountcode 
                         left join static_data.""Entities"" e on a.""entityID"" = e.id
                         left join static_data.""Titles"" tt on tt.""TITLEID"" = e.""titleID""
                         where t.""transType"" in ('COMM-OUT', 'OV-OUT')
                         and t.txtype2 in ('1', '2', '3', '4', '5')
                         and t.status = 'N'
                         and t.""premin-dfrpreferno"" is not null
                         and t.""premin-rprefdate"" is not null
                         and ((t.dfrpreferno is null and t.rprefdate is null) ";
            if (!string.IsNullOrEmpty(data.AsAtDate))
            {
                sql += $@"or (t.dfrpreferno is not null and t.rprefdate is not null and t.rprefdate <= '{data.AsAtDate}') ";
            }
            sql += $@")";
            sql = await GetWhereSql(data, sql, "CommOutOvOut");
            var json = await _dataContext.CommOutOvOutReportResults.FromSqlRaw(sql).ToListAsync();
            return json;
        }

        public async Task<List<PremOutReportResult>?> GetPremOutOpenItemReportJson(ArApReportInput data)
        {
            var sql = $@"select
                         t.""policyNo"",
                         t.""endorseNo"",
                         ard.""invoiceNo"",
                         t.""seqNo"",
                         t.""premin-dfrpreferno"" as ""premInDfRpReferNo"",
                         t.""premin-rprefdate"" as ""premInRpRefDate"",
                         t.""premout-dfrpreferno"" as ""premOutDfRpReferNo"",
                         t.""premout-rprefdate"" as ""premOutRpRefDate"",
                         p.""actDate"",
                         p.""expDate"",
                         t.""insurerCode"",
                         case
                             when e_ier.""personType"" = 'O' then concat(tt_ier.""TITLETHAIBEGIN"", ' ', e_ier.""t_ogName"", ' ', tt_ier.""TITLETHAIEND"")
                             when e_ier.""personType"" = 'P' then concat(tt_ier.""TITLETHAIBEGIN"", ' ', e_ier.""t_firstName"", ' ', e_ier.""t_lastName"", ' ', tt_ier.""TITLETHAIEND"")
                             else null
                         end as ""insurerName"",
                         p.""insureeCode"",
                         case
                             when e_iee.""personType"" = 'O' then concat(tt_iee.""TITLETHAIBEGIN"", ' ', e_iee.""t_ogName"", ' ', tt_iee.""TITLETHAIEND"")
                             when e_iee.""personType"" = 'P' then concat(tt_iee.""TITLETHAIBEGIN"", ' ', e_iee.""t_firstName"", ' ', e_iee.""t_lastName"", ' ', tt_iee.""TITLETHAIEND"")
                             else null
                         end as ""insureeName"",
                         it.""class"",
                         it.""subClass"",
                         p.grossprem as ""grossPrem"",
                         p.specdiscrate as ""specDiscRate"",
                         p.specdiscamt as ""specDiscAmt"",
                         t.netgrossprem as ""netGrossPrem"",
                         t.duty,
                         t.tax,
                         t.totalprem as ""totalPrem"",
                         t.netflag as ""netFlag"",
                         p.commin_rate as ""commInRate"",
                         p.commin_amt as ""commInAmt"",
                         (select t2.dfrpreferno from static_data.""Transactions"" t2 where ""transType"" = 'COMM-IN' and t2.id = t.id) as ""commInDfRpReferNo"",
                         (select t2.rprefdate from static_data.""Transactions"" t2 where ""transType"" = 'COMM-IN' and t2.id = t.id) as ""commInRpRefDate"",
                         (select t2.paidamt from static_data.""Transactions"" t2 where ""transType"" = 'COMM-IN' and t2.id = t.id) as ""commInPaidAmt"",
                         (select t2.remainamt from static_data.""Transactions"" t2 where ""transType"" = 'COMM-IN' and t2.id = t.id) as ""commInDiffAmt"",
                         p.ovin_rate as ""ovInRate"",
                         p.ovin_amt as ""ovInAmt"",
                         (select t2.dfrpreferno from static_data.""Transactions"" t2 where ""transType"" = 'OV-IN' and t2.id = t.id) as ""ovInDfRpReferNo"",
                         (select t2.rprefdate from static_data.""Transactions"" t2 where ""transType"" = 'OV-IN' and t2.id = t.id) as ""ovInRpRefDate"",
                         (select t2.paidamt from static_data.""Transactions"" t2 where ""transType"" = 'OV-IN' and t2.id = t.id) as ""ovInPaidAmt"",
                         (select t2.remainamt from static_data.""Transactions"" t2 where ""transType"" = 'OV-IN' and t2.id = t.id) as ""ovInDiffAmt"",
                         p.""issueDate"",
                         p.createusercode as ""policyCreateUserCode"",
                         a.""contactPersonID"" as ""mainAccountContactPersonId"",
                         t.mainaccountcode as ""mainAccountCode"",
                         p.status as ""PolicyStatus"",
                         t.""transType"" as ""transactionType""
                         from
                         static_data.""Transactions"" t 
                         left join static_data.""Policies"" p on t.polid = p.id
                         left join static_data.""Insurers"" ier on t.""insurerCode"" = ier.""insurerCode""
                         left join static_data.""Entities"" e_ier on ier.""entityID"" = e_ier.id
                         left join static_data.""Titles"" tt_ier on tt_ier.""TITLEID"" = e_ier.""titleID""
                         left join static_data.""Insurees"" iee on p.""insureeCode"" = iee.""insureeCode""
                         left join static_data.""Entities"" e_iee on iee.""entityID"" = e_iee.id
                         left join static_data.""Titles"" tt_iee on tt_iee.""TITLEID"" = e_iee.""titleID""
                         left join static_data.""InsureTypes"" it on p.""insureID"" = it.id
                         left join static_data.b_jaaraps ar on (ar.billadvisorno = t.billadvisorno)
                         left join static_data.b_jaarapds ard on ard.keyidm = ar.id and ard.polid = p.id
                         left join static_data.""Agents"" a on a.""agentCode"" = t.mainaccountcode 
                         left join static_data.""Entities"" e on a.""entityID"" = e.id
                         left join static_data.""Titles"" tt on tt.""TITLEID"" = e.""titleID""
                         where t.""transType"" = 'PREM-OUT'
                         and t.txtype2 in ('1', '2', '3', '4', '5')
                         and t.status = 'N'
                         and t.""premin-dfrpreferno"" is not null
                         and t.""premin-rprefdate"" is not null ";
            sql = await GetWhereSql(data, sql, "PremOut");
            var json = await _dataContext.PremOutReportResults.FromSqlRaw(sql).ToListAsync();
            return json;
        }

        public async Task<List<PremOutReportResult>?> GetPremOutClearingReportJson(ArApReportInput data)
        {
            var sql = $@"select
                         t.""policyNo"",
                         t.""endorseNo"",
                         ard.""invoiceNo"",
                         t.""seqNo"",
                         t.""premin-dfrpreferno"" as ""premInDfRpReferNo"",
                         t.""premin-rprefdate"" as ""premInRpRefDate"",
                         t.""premout-dfrpreferno"" as ""premOutDfRpReferNo"",
                         t.""premout-rprefdate"" as ""premOutRpRefDate"",
                         p.""actDate"",
                         p.""expDate"",
                         t.""insurerCode"",
                         case
                             when e_ier.""personType"" = 'O' then concat(tt_ier.""TITLETHAIBEGIN"", ' ', e_ier.""t_ogName"", ' ', tt_ier.""TITLETHAIEND"")
                             when e_ier.""personType"" = 'P' then concat(tt_ier.""TITLETHAIBEGIN"", ' ', e_ier.""t_firstName"", ' ', e_ier.""t_lastName"", ' ', tt_ier.""TITLETHAIEND"")
                             else null
                         end as ""insurerName"",
                         p.""insureeCode"",
                         case
                             when e_iee.""personType"" = 'O' then concat(tt_iee.""TITLETHAIBEGIN"", ' ', e_iee.""t_ogName"", ' ', tt_iee.""TITLETHAIEND"")
                             when e_iee.""personType"" = 'P' then concat(tt_iee.""TITLETHAIBEGIN"", ' ', e_iee.""t_firstName"", ' ', e_iee.""t_lastName"", ' ', tt_iee.""TITLETHAIEND"")
                             else null
                         end as ""insureeName"",
                         it.""class"",
                         it.""subClass"",
                         p.grossprem as ""grossPrem"",
                         p.specdiscrate as ""specDiscRate"",
                         p.specdiscamt as ""specDiscAmt"",
                         t.netgrossprem as ""netGrossPrem"",
                         t.duty,
                         t.tax,
                         t.totalprem as ""totalPrem"",
                         t.netflag as ""netFlag"",
                         p.commin_rate as ""commInRate"",
                         p.commin_amt as ""commInAmt"",
                         (select t2.dfrpreferno from static_data.""Transactions"" t2 where ""transType"" = 'COMM-IN' and t2.id = t.id) as ""commInDfRpReferNo"",
                         (select t2.rprefdate from static_data.""Transactions"" t2 where ""transType"" = 'COMM-IN' and t2.id = t.id) as ""commInRpRefDate"",
                         (select t2.paidamt from static_data.""Transactions"" t2 where ""transType"" = 'COMM-IN' and t2.id = t.id) as ""commInPaidAmt"",
                         (select t2.remainamt from static_data.""Transactions"" t2 where ""transType"" = 'COMM-IN' and t2.id = t.id) as ""commInDiffAmt"",
                         p.ovin_rate as ""ovInRate"",
                         p.ovin_amt as ""ovInAmt"",
                         (select t2.dfrpreferno from static_data.""Transactions"" t2 where ""transType"" = 'OV-IN' and t2.id = t.id) as ""ovInDfRpReferNo"",
                         (select t2.rprefdate from static_data.""Transactions"" t2 where ""transType"" = 'OV-IN' and t2.id = t.id) as ""ovInRpRefDate"",
                         (select t2.paidamt from static_data.""Transactions"" t2 where ""transType"" = 'OV-IN' and t2.id = t.id) as ""ovInPaidAmt"",
                         (select t2.remainamt from static_data.""Transactions"" t2 where ""transType"" = 'OV-IN' and t2.id = t.id) as ""ovInDiffAmt"",
                         p.""issueDate"",
                         p.createusercode as ""policyCreateUserCode"",
                         a.""contactPersonID"" as ""mainAccountContactPersonId"",
                         t.mainaccountcode as ""mainAccountCode"",
                         p.status as ""PolicyStatus"",
                         t.""transType"" as ""transactionType""
                         from
                         static_data.""Transactions"" t 
                         left join static_data.""Policies"" p on t.polid = p.id
                         left join static_data.""Insurers"" ier on t.""insurerCode"" = ier.""insurerCode""
                         left join static_data.""Entities"" e_ier on ier.""entityID"" = e_ier.id
                         left join static_data.""Titles"" tt_ier on tt_ier.""TITLEID"" = e_ier.""titleID""
                         left join static_data.""Insurees"" iee on p.""insureeCode"" = iee.""insureeCode""
                         left join static_data.""Entities"" e_iee on iee.""entityID"" = e_iee.id
                         left join static_data.""Titles"" tt_iee on tt_iee.""TITLEID"" = e_iee.""titleID""
                         left join static_data.""InsureTypes"" it on p.""insureID"" = it.id
                         left join static_data.b_jaaraps ar on (ar.billadvisorno = t.billadvisorno)
                         left join static_data.b_jaarapds ard on ard.keyidm = ar.id and ard.polid = p.id
                         left join static_data.""Agents"" a on a.""agentCode"" = t.mainaccountcode 
                         left join static_data.""Entities"" e on a.""entityID"" = e.id
                         left join static_data.""Titles"" tt on tt.""TITLEID"" = e.""titleID""
                         where t.""transType"" = 'PREM-OUT'
                         and t.txtype2 in ('1', '2', '3', '4', '5')
                         and t.status = 'N'
                         and t.""premin-dfrpreferno"" is not null
                         and t.""premin-rprefdate"" is not null
                         and t.""premout-dfrpreferno"" is not null
                         and t.""premout-rprefdate"" is not null ";
            sql = await GetWhereSql(data, sql, "PremOut");
            var json = await _dataContext.PremOutReportResults.FromSqlRaw(sql).ToListAsync();
            return json;
        }

        public async Task<List<PremOutReportResult>?> GetPremOutOutstandingReportJson(ArApReportInput data)
        {
            var sql = $@"select
                         t.""policyNo"",
                         t.""endorseNo"",
                         ard.""invoiceNo"",
                         t.""seqNo"",
                         t.""premin-dfrpreferno"" as ""premInDfRpReferNo"",
                         t.""premin-rprefdate"" as ""premInRpRefDate"",
                         t.""premout-dfrpreferno"" as ""premOutDfRpReferNo"",
                         t.""premout-rprefdate"" as ""premOutRpRefDate"",
                         p.""actDate"",
                         p.""expDate"",
                         t.""insurerCode"",
                         case
                             when e_ier.""personType"" = 'O' then concat(tt_ier.""TITLETHAIBEGIN"", ' ', e_ier.""t_ogName"", ' ', tt_ier.""TITLETHAIEND"")
                             when e_ier.""personType"" = 'P' then concat(tt_ier.""TITLETHAIBEGIN"", ' ', e_ier.""t_firstName"", ' ', e_ier.""t_lastName"", ' ', tt_ier.""TITLETHAIEND"")
                             else null
                         end as ""insurerName"",
                         p.""insureeCode"",
                         case
                             when e_iee.""personType"" = 'O' then concat(tt_iee.""TITLETHAIBEGIN"", ' ', e_iee.""t_ogName"", ' ', tt_iee.""TITLETHAIEND"")
                             when e_iee.""personType"" = 'P' then concat(tt_iee.""TITLETHAIBEGIN"", ' ', e_iee.""t_firstName"", ' ', e_iee.""t_lastName"", ' ', tt_iee.""TITLETHAIEND"")
                             else null
                         end as ""insureeName"",
                         it.""class"",
                         it.""subClass"",
                         p.grossprem as ""grossPrem"",
                         p.specdiscrate as ""specDiscRate"",
                         p.specdiscamt as ""specDiscAmt"",
                         t.netgrossprem as ""netGrossPrem"",
                         t.duty,
                         t.tax,
                         t.totalprem as ""totalPrem"",
                         t.netflag as ""netFlag"",
                         p.commin_rate as ""commInRate"",
                         p.commin_amt as ""commInAmt"",
                         (select t2.dfrpreferno from static_data.""Transactions"" t2 where ""transType"" = 'COMM-IN' and t2.id = t.id) as ""commInDfRpReferNo"",
                         (select t2.rprefdate from static_data.""Transactions"" t2 where ""transType"" = 'COMM-IN' and t2.id = t.id) as ""commInRpRefDate"",
                         (select t2.paidamt from static_data.""Transactions"" t2 where ""transType"" = 'COMM-IN' and t2.id = t.id) as ""commInPaidAmt"",
                         (select t2.remainamt from static_data.""Transactions"" t2 where ""transType"" = 'COMM-IN' and t2.id = t.id) as ""commInDiffAmt"",
                         p.ovin_rate as ""ovInRate"",
                         p.ovin_amt as ""ovInAmt"",
                         (select t2.dfrpreferno from static_data.""Transactions"" t2 where ""transType"" = 'OV-IN' and t2.id = t.id) as ""ovInDfRpReferNo"",
                         (select t2.rprefdate from static_data.""Transactions"" t2 where ""transType"" = 'OV-IN' and t2.id = t.id) as ""ovInRpRefDate"",
                         (select t2.paidamt from static_data.""Transactions"" t2 where ""transType"" = 'OV-IN' and t2.id = t.id) as ""ovInPaidAmt"",
                         (select t2.remainamt from static_data.""Transactions"" t2 where ""transType"" = 'OV-IN' and t2.id = t.id) as ""ovInDiffAmt"",
                         p.""issueDate"",
                         p.createusercode as ""policyCreateUserCode"",
                         a.""contactPersonID"" as ""mainAccountContactPersonId"",
                         t.mainaccountcode as ""mainAccountCode"",
                         p.status as ""PolicyStatus"",
                         t.""transType"" as ""transactionType""
                         from
                         static_data.""Transactions"" t 
                         left join static_data.""Policies"" p on t.polid = p.id
                         left join static_data.""Insurers"" ier on t.""insurerCode"" = ier.""insurerCode""
                         left join static_data.""Entities"" e_ier on ier.""entityID"" = e_ier.id
                         left join static_data.""Titles"" tt_ier on tt_ier.""TITLEID"" = e_ier.""titleID""
                         left join static_data.""Insurees"" iee on p.""insureeCode"" = iee.""insureeCode""
                         left join static_data.""Entities"" e_iee on iee.""entityID"" = e_iee.id
                         left join static_data.""Titles"" tt_iee on tt_iee.""TITLEID"" = e_iee.""titleID""
                         left join static_data.""InsureTypes"" it on p.""insureID"" = it.id
                         left join static_data.b_jaaraps ar on (ar.billadvisorno = t.billadvisorno)
                         left join static_data.b_jaarapds ard on ard.keyidm = ar.id and ard.polid = p.id
                         left join static_data.""Agents"" a on a.""agentCode"" = t.mainaccountcode 
                         left join static_data.""Entities"" e on a.""entityID"" = e.id
                         left join static_data.""Titles"" tt on tt.""TITLEID"" = e.""titleID""
                         where t.""transType"" = 'PREM-OUT'
                         and t.txtype2 in ('1', '2', '3', '4', '5')
                         and t.status = 'N'
                         and t.""premin-dfrpreferno"" is not null
                         and t.""premin-rprefdate"" is not null
                         and ((t.""premout-dfrpreferno"" is null and t.""premout-rprefdate"" is null) ";
            if (!string.IsNullOrEmpty(data.AsAtDate))
            {
                sql += $@"or (t.""premout-dfrpreferno"" is not null and t.""premout-rprefdate"" is not null and t.""premout-rprefdate"" <= '{data.AsAtDate}')";
            }
            sql += $@")";
            sql = await GetWhereSql(data, sql, "PremOut");
            var json = await _dataContext.PremOutReportResults.FromSqlRaw(sql).ToListAsync();
            return json;
        }
    }
}
