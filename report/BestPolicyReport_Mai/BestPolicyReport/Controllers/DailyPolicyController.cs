using BestPolicyReport.Models.DailyPolicyReport;
using BestPolicyReport.Services.DailyPolicyService;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;

namespace BestPolicyReport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DailyPolicyController : ControllerBase
    {
        private readonly IDailyPolicyService _dailyPolicyService;

        public DailyPolicyController(IDailyPolicyService dailyPolicyService)
        {
            _dailyPolicyService = dailyPolicyService;
        }

        [HttpPost("json")]
        public async Task<ActionResult<List<DailyPolicyReportResult>?>> GetDailyPolicyReportJson(DailyPolicyReportInput data)
        {
            var result = await _dailyPolicyService.GetDailyPolicyReportJson(data);
            if (result == null)
            {
                return Ok(new List<DailyPolicyReportResult>());
            }
            return Ok(result);
        }

        [HttpPost("excel")]
        public async Task<IActionResult?> GetDailyPolicyReportExcel(DailyPolicyReportInput data)
        {
            var result = await _dailyPolicyService.GetDailyPolicyReportJson(data);
            if (result == null)
            {
                return BadRequest("sql result = null");
            }
            using var workbook = new XLWorkbook();
            var sheetName = "บันทึกกธประจำวัน";
            if (!string.IsNullOrEmpty(data.OrderBy?.ToString()))
            {
                sheetName += $"_ตาม{data.OrderBy}";
            }
            var worksheet = workbook.Worksheets.Add(sheetName);

            // Headers
            var headers = new string[]
             {
                 "ApplicationNo", 
                 "หมายเลขกรมธรรม์", 
                 "วันที่นำข้อมูลเข้า", 
                 "วันที่เริ่มคุ้มครอง", 
                 "วันที่สิ้นสุดคุ้มครอง",
                 "วันที่ทำสัญญา", 
                 "รหัสผู้บันทึก", 
                 "Username ผู้บันทึก", 
                 "รหัสผู้ดูแล 1", 
                 "ชื่อผู้ดูแล 1",
                 "รหัสผู้ดูแล 2", 
                 "ชื่อผู้ดูแล 2", 
                 "รหัสผู้แนะนำ 1", 
                 "ชื่อผู้แนะนำ 1", 
                 "รหัสผู้แนะนำ 2", 
                 "ชื่อผู้แนะนำ 2",
                 "รหัสผู้เอาประกัน", 
                 "ชื่อผู้เอาประกัน", 
                 "ประเภทประกัน", 
                 "ประเภทย่อยประกัน", 
                 "ทะเบียนรถ", 
                 "จังหวัด", 
                 "เลขตัวถัง",
                 "เบี้ยรวม", 
                 "อัตราส่วนลด", 
                 "มูลค่าส่วนลด", 
                 "เบี้ยสุทธิ", 
                 "อากร", 
                 "ภาษี",
                 "เบี้ยประกันภัยรับรวม", 
                 "อัตราคอมมิชชั่นรับ", 
                 "ยอดคอมมิชชั่นรับ", 
                 "ยอดภาษีคอมมิชชั่นรับ", 
                 "อัตรา OV รับ", 
                 "ยอด OV รับ", 
                 "ยอดภาษี OV รับ",
                 "อัตราคอมมิชชั่นจ่าย", 
                 "ยอดคอมมิชชั่นจ่าย", 
                 "อัตรา OV จ่าย", 
                 "ยอด OV จ่าย", 
                 "บริษัทประกัน"
            };

            for (int col = 1; col <= headers.Length; col++)
            {
                worksheet.Cell(1, col).Value = headers[col - 1];
            }

            // Data
            int row = 2;
            foreach (var dailyPolicy in result)
            {
                int col = 1;
                worksheet.Cell(row, col++).Value = dailyPolicy.ApplicationNo;
                worksheet.Cell(row, col++).Value = dailyPolicy.PolicyNo;
                worksheet.Cell(row, col++).Value = dailyPolicy.PolicyDate;
                worksheet.Cell(row, col++).Value = dailyPolicy.ActDate;
                worksheet.Cell(row, col++).Value = dailyPolicy.ExpDate;
                worksheet.Cell(row, col++).Value = dailyPolicy.IssueDate;
                worksheet.Cell(row, col++).Value = dailyPolicy.CreateUserCode;
                worksheet.Cell(row, col++).Value = dailyPolicy.Username;
                worksheet.Cell(row, col++).Value = dailyPolicy.ContactPersonId1;
                worksheet.Cell(row, col++).Value = dailyPolicy.ContactPersonName1;
                worksheet.Cell(row, col++).Value = dailyPolicy.ContactPersonId2;
                worksheet.Cell(row, col++).Value = dailyPolicy.ContactPersonName2;
                worksheet.Cell(row, col++).Value = dailyPolicy.AgentCode1;
                worksheet.Cell(row, col++).Value = dailyPolicy.AgentName1;
                worksheet.Cell(row, col++).Value = dailyPolicy.AgentCode2;
                worksheet.Cell(row, col++).Value = dailyPolicy.AgentName2;
                worksheet.Cell(row, col++).Value = dailyPolicy.InsureeCode;
                worksheet.Cell(row, col++).Value = dailyPolicy.InsureeName;
                worksheet.Cell(row, col++).Value = dailyPolicy.Class;
                worksheet.Cell(row, col++).Value = dailyPolicy.SubClass;
                worksheet.Cell(row, col++).Value = dailyPolicy.LicenseNo;
                worksheet.Cell(row, col++).Value = dailyPolicy.Province;
                worksheet.Cell(row, col++).Value = dailyPolicy.ChassisNo;
                worksheet.Cell(row, col++).Value = dailyPolicy.GrossPrem;
                worksheet.Cell(row, col++).Value = dailyPolicy.SpecDiscRate;
                worksheet.Cell(row, col++).Value = dailyPolicy.SpecDiscAmt;
                worksheet.Cell(row, col++).Value = dailyPolicy.NetGrossPrem;
                worksheet.Cell(row, col++).Value = dailyPolicy.Duty;
                worksheet.Cell(row, col++).Value = dailyPolicy.Tax;
                worksheet.Cell(row, col++).Value = dailyPolicy.TotalPrem;
                worksheet.Cell(row, col++).Value = dailyPolicy.CommInRate;
                worksheet.Cell(row, col++).Value = dailyPolicy.CommInAmt;
                worksheet.Cell(row, col++).Value = dailyPolicy.CommInTaxAmt;
                worksheet.Cell(row, col++).Value = dailyPolicy.OvInRate;
                worksheet.Cell(row, col++).Value = dailyPolicy.OvInAmt;
                worksheet.Cell(row, col++).Value = dailyPolicy.OvInTaxAmt;
                worksheet.Cell(row, col++).Value = dailyPolicy.CommOutRate;
                worksheet.Cell(row, col++).Value = dailyPolicy.CommOutAmt;
                worksheet.Cell(row, col++).Value = dailyPolicy.OvOutRate;
                worksheet.Cell(row, col++).Value = dailyPolicy.OvOutAmt;
                worksheet.Cell(row, col).Value = dailyPolicy.InsurerCode;

                row++;
            }

            var tableRange = worksheet.RangeUsed();
            var table = tableRange.AsTable();

            // You can set the table name and style here if needed
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
    }
}
