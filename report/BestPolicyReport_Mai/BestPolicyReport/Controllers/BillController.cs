using BestPolicyReport.Models.BillReport;
using BestPolicyReport.Services.BillService;
using ClosedXML.Excel;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Mvc;

namespace BestPolicyReport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BillController : ControllerBase
    {
        private readonly IBillService _billService;

        public BillController(IBillService billService)
        {
            _billService = billService;
        }

        [HttpPost("json")]
        public async Task<ActionResult<List<BillReportResult>?>> GetBillReportJson(BillReportInput data)
        {
            var result = await _billService.GetBillReportJson(data);
            if (result == null)
            {
                return Ok(new List<BillReportResult>());
            }
            return Ok(result);
        }

        [HttpPost("excel")]
        public async Task<IActionResult?> GetBillReportExcel(BillReportInput data)
        {
            var result = await _billService.GetBillReportJson(data);
            if (result == null)
            {
                return BadRequest("sql result = null");
            }
            using var workbook = new XLWorkbook();
            var sheetName = "ใบวางบิล";
            var worksheet = workbook.Worksheets.Add(sheetName);

            // Headers
            var headers = new string[]
            {
            "บริษัทประกัน", "รหัสผู้แนะนำ 1", "รหัสผู้แนะนำ 2", "วันที่กำหนดชำระ", "หมายเลขกรมธรรม์", "เลขสลักหลัง", "เลขที่ใบแจ้งหนี้",
            "เลขที่งวด", "รหัสผู้เอาประกัน", "ชื่อผู้เอาประกัน", "ทะเบียนรถ", "จังหวัด", "เลขตัวถัง",
            "เบี้ยรวม", "อัตราส่วนลด", "มูลค่าส่วนลด", "เบี้ยสุทธิ", "อากร", "ภาษี",
            "เบี้ยประกันภัยรับรวม", "อัตราคอมมิชชั่นจ่ายของผู้แนะนำ 1", "ยอดคอมมิชชั่นจ่ายของผู้แนะนำ 1", "อัตรา OV จ่ายของผู้แนะนำ 1", "ยอด OV จ่ายของผู้แนะนำ 1",
            "อัตราคอมมิชชั่นจ่ายของผู้แนะนำ 2", "ยอดคอมมิชชั่นจ่ายของผู้แนะนำ 2", "อัตรา OV จ่ายของผู้แนะนำ 2", "ยอด OV จ่ายของผู้แนะนำ 2",
            "อัตราคอมมิชชั่นจ่าย", "ยอดคอมมิชชั่นจ่าย", "อัตรา OV จ่าย", "ยอด OV จ่าย", "netFlag", "billPremium"
            };

            for (int col = 1; col <= headers.Length; col++)
            {
                worksheet.Cell(1, col).Value = headers[col - 1];
            }

            // Data
            int row = 2;
            foreach (var i in result)
            {
                int col = 1;
                worksheet.Cell(row, col++).Value = i.InsurerCode;
                worksheet.Cell(row, col++).Value = i.AgentCode1;
                worksheet.Cell(row, col++).Value = i.AgentCode2;
                worksheet.Cell(row, col++).Value = i.DueDate;
                worksheet.Cell(row, col++).Value = i.PolicyNo;
                worksheet.Cell(row, col++).Value = i.EndorseNo;
                worksheet.Cell(row, col++).Value = i.InvoiceNo;
                worksheet.Cell(row, col++).Value = i.SeqNo;
                worksheet.Cell(row, col++).Value = i.InsureeCode;
                worksheet.Cell(row, col++).Value = i.InsureeName;
                worksheet.Cell(row, col++).Value = i.LicenseNo;
                worksheet.Cell(row, col++).Value = i.Province;
                worksheet.Cell(row, col++).Value = i.ChassisNo;
                worksheet.Cell(row, col++).Value = i.GrossPrem;
                worksheet.Cell(row, col++).Value = i.SpecDiscRate;
                worksheet.Cell(row, col++).Value = i.SpecDiscAmt;
                worksheet.Cell(row, col++).Value = i.NetGrossPrem;
                worksheet.Cell(row, col++).Value = i.Duty;
                worksheet.Cell(row, col++).Value = i.Tax;
                worksheet.Cell(row, col++).Value = i.TotalPrem;
                worksheet.Cell(row, col++).Value = i.CommOutRate1;
                worksheet.Cell(row, col++).Value = i.CommOutAmt1;
                worksheet.Cell(row, col++).Value = i.OvOutRate1;
                worksheet.Cell(row, col++).Value = i.OvOutAmt1;
                worksheet.Cell(row, col++).Value = i.CommOutRate2;
                worksheet.Cell(row, col++).Value = i.CommOutAmt2;
                worksheet.Cell(row, col++).Value = i.OvOutRate2;
                worksheet.Cell(row, col++).Value = i.OvOutAmt2;
                worksheet.Cell(row, col++).Value = i.CommOutRate;
                worksheet.Cell(row, col++).Value = i.CommOutAmt;
                worksheet.Cell(row, col++).Value = i.OvOutRate;
                worksheet.Cell(row, col++).Value = i.OvOutAmt;
                worksheet.Cell(row, col++).Value = i.NetFlag;
                worksheet.Cell(row, col++).Value = i.BillPremium;
                row++;
            }

            var tableRange = worksheet.RangeUsed();
            var table = tableRange.AsTable();
            table.Name = "Table";
            table.ShowAutoFilter = true;
            worksheet.Columns().AdjustToContents();

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            var content = stream.ToArray();

            return File(
                content,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                $"รายงาน{sheetName}.xlsx");
        }

        [HttpPost("policyGroup/json")]
        public async Task<ActionResult<List<PolicyGroupBillReportResult>?>> GetPolicyGroupBillReportJson(PolicyGroupBillReportInput data)
        {
            var result = await _billService.GetPolicyGroupBillReportJson(data);
            if (result == null)
            {
                return Ok(new List<PolicyGroupBillReportResult>());
            }
            return Ok(result);
        }

        [HttpPost("policyGroup/excel")]
        public async Task<IActionResult?> GetPolicyGroupBillReportExcel(PolicyGroupBillReportInput data)
        {
            var result = await _billService.GetPolicyGroupBillReportJson(data);
            if (result == null)
            {
                return BadRequest("sql result = null");
            }
            using var workbook = new XLWorkbook();
            var sheetName = "ตารางแนบใบวางบิล";
            var worksheet = workbook.Worksheets.Add(sheetName);

            // Headers
            var headers = new string[]
            {
                "no.",
                "ทะเบียนรถ",
                "ยี่ห้อ",
                "รุ่น",
                "ผู้เอาประกัน",
                "ปี",
                "เลขถังรถ",
                "ทุนประกันภัย",
                "เลขที่กรมธรรม์",
                "วันที่เริ่มต้น",
                "วันที่สิ้นสุด",
                "เบี้ยประกัน",
                "อากร",
                "ก่อน Vat",
                "Vat 7%",
                "รวมเป็นเงิน",
                "หัก 1%",
                "ยอดจ่ายสุทธิ"
            };

            for (int col = 1; col <= headers.Length; col++)
            {
                worksheet.Cell(1, col).Value = headers[col - 1];
            }

            // Data
            int row = 2;
            int count = 1;
            foreach (var i in result)
            {
                int col = 1;
                worksheet.Cell(row, col++).Value = count++;
                worksheet.Cell(row, col++).Value = i.LicenseNo;
                worksheet.Cell(row, col++).Value = i.Brand;
                worksheet.Cell(row, col++).Value = i.Model;
                worksheet.Cell(row, col++).Value = i.InsureeName;
                worksheet.Cell(row, col++).Value = i.ModelYear;
                worksheet.Cell(row, col++).Value = i.ChassisNo;
                worksheet.Cell(row, col++).Value = i.CoverAmt;
                worksheet.Cell(row, col++).Value = i.PolicyNo;
                worksheet.Cell(row, col++).Value = i.ActDate;
                worksheet.Cell(row, col++).Value = i.ExpDate;
                worksheet.Cell(row, col++).Value = i.NetGrossPrem;
                worksheet.Cell(row, col++).Value = i.Duty;
                worksheet.Cell(row, col++).Value = i.NetGrossPremBeforeTax;
                worksheet.Cell(row, col++).Value = i.Tax;
                worksheet.Cell(row, col++).Value = i.TotalPrem;
                worksheet.Cell(row, col++).Value = i.WithHeld;
                worksheet.Cell(row, col++).Value = i.BillPremium;
                row++;
            }

            var tableRange = worksheet.RangeUsed();
            var table = tableRange.AsTable();
            table.Name = "Table";
            table.ShowAutoFilter = true;

            worksheet.Cell(row, 12).FormulaA1 = $"SUM(L2:L{row - 1})"; // NetGrossPrem
            worksheet.Cell(row, 13).FormulaA1 = $"SUM(M2:M{row - 1})"; // Duty
            worksheet.Cell(row, 14).FormulaA1 = $"SUM(N2:N{row - 1})"; // NetGrossPremBeforeTax
            worksheet.Cell(row, 15).FormulaA1 = $"SUM(O2:O{row - 1})"; // Tax
            worksheet.Cell(row, 16).FormulaA1 = $"SUM(P2:P{row - 1})"; // TotalPrem
            worksheet.Cell(row, 17).FormulaA1 = $"SUM(Q2:Q{row - 1})"; // WithHeld
            worksheet.Cell(row, 18).FormulaA1 = $"SUM(R2:R{row - 1})"; // BillPremium
            worksheet.Row(row).Style.Font.Bold = true;
            worksheet.Columns().AdjustToContents();

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            var content = stream.ToArray();

            return File(
                content,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                $"รายงาน{sheetName}.xlsx");
        }
    }
}
