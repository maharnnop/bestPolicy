using BestPolicyReport.Models.PremInDirectReport;
using BestPolicyReport.Services.PremInDirectService;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;

namespace BestPolicyReport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PremInDirectController : ControllerBase
    {
        private readonly IPremInDirectService _premInDirectService;

        public PremInDirectController(IPremInDirectService premInDirectService)
        {
            _premInDirectService = premInDirectService;
        }

        [HttpPost("json")]
        public async Task<ActionResult<List<PremInDirectReportResult>?>> GetPremInDirectReportJson(PremInDirectReportInput data)
        {
            var result = await _premInDirectService.GetPremInDirectReportJson(data);
            if (result == null)
            {
                return Ok(new List<PremInDirectReportResult>());
            }
            return Ok(result);
        }

        [HttpPost("excel")]
        public async Task<IActionResult?> GetPremInDirectReportExcel(PremInDirectReportInput data)
        {
            var result = await _premInDirectService.GetPremInDirectReportJson(data);
            if (result == null)
            {
                return BadRequest("sql result = null");
            }
            using var workbook = new XLWorkbook();
            var sheetName = "ลูกค้าจ่ายเบี้ยที่ประกันโดยตรง";
            var worksheet = workbook.Worksheets.Add(sheetName);

            // Headers
            var headers = new string[]
             {
                 "รหัสบริษัทประกัน",
                 "รหัสผู้แนะนำ 1",
                 "วันที่กำหนดชำระ",
                 "หมายเลขกรมธรรม์",
                 "เลขสลักหลัง",
                 "เลขที่ใบแจ้งหนี้",
                 "เลขที่งวด",
                 "รหัสผู้เอาประกัน",
                 "ชื่อผู้เอาประกัน",
                 "ทะเบียนรถ",
                 "จังหวัด",
                 "เลขตัวถัง",
                 "เบี้ยรวม",
                 "อากร",
                 "ภาษี",
                 "เบี้ยประกันภัยรับรวม",
                 "อัตราคอมมิชชั่นจ่าย",
                 "ยอดคอมมิชชั่นจ่าย",
                 "อัตรา OV จ่าย",
                 "ยอด OV จ่าย",
                 "netFlag",
                 "billPremium"
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
                worksheet.Cell(row, col++).Value = i.Duty;
                worksheet.Cell(row, col++).Value = i.Tax;
                worksheet.Cell(row, col++).Value = i.TotalPrem;
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
