using BestPolicyReport.Models.OutputVatReport;
using BestPolicyReport.Services.OutputVatService;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;

namespace BestPolicyReport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OutputVatController : ControllerBase
    {
        private readonly IOutputVatService _outputVatService;

        public OutputVatController(IOutputVatService outputVatService)
        {
            _outputVatService = outputVatService;
        }

        [HttpPost("outputVatCommIn/json")]
        public async Task<ActionResult<List<OutputVatCommInReportResult>?>> GetOutputVatCommInReportJson(OutputVatReportInput data)
        {
            var result = await _outputVatService.GetOutputVatCommInReportJson(data);
            if (result == null)
            {
                return Ok(new List<OutputVatCommInReportResult>());
            }
            return Ok(result);
        }

        [HttpPost("outputVatCommIn/excel")]
        public async Task<IActionResult?> GetOutputVatCommInReportExcel(OutputVatReportInput data)
        {
            var result = await _outputVatService.GetOutputVatCommInReportJson(data);
            if (result == null)
            {
                return BadRequest("sql result = null");
            }
            using var workbook = new XLWorkbook();
            var sheetName = "ภาษีขาย_CommIn";
            var worksheet = workbook.Worksheets.Add(sheetName);

            // Headers
            var headers = new string[]
            {
                "เลขที่ตัดรับ", 
                "วันที่ตัดรับ", 
                "รหัสบริษัทประกัน", 
                "ชื่อบริษัทประกัน", 
                "ยอดคอมมิชชั่นรับ", 
                "ยอดภาษีขายคอมมิชชั่นรับ", 
                "สถานะตัดรับ",
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
                worksheet.Cell(row, col++).Value = i.DfRpReferNo;
                worksheet.Cell(row, col++).Value = i.RpRefDate;
                worksheet.Cell(row, col++).Value = i.InsurerCode;
                worksheet.Cell(row, col++).Value = i.InsurerName;
                worksheet.Cell(row, col++).Value = i.CommInAmt;
                worksheet.Cell(row, col++).Value = i.VatCommInAmt;
                worksheet.Cell(row, col++).Value = i.ArApStatus;
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

        [HttpPost("outputVatOvIn/json")]
        public async Task<ActionResult<List<OutputVatOvInReportResult>?>> GetOutputVatOvInReportJson(OutputVatReportInput data)
        {
            var result = await _outputVatService.GetOutputVatOvInReportJson(data);
            if (result == null)
            {
                return Ok(new List<OutputVatOvInReportResult>());
            }
            return Ok(result);
        }

        [HttpPost("outputVatOvIn/excel")]
        public async Task<IActionResult?> GetOutputVatOvInReportExcel(OutputVatReportInput data)
        {
            var result = await _outputVatService.GetOutputVatOvInReportJson(data);
            if (result == null)
            {
                return BadRequest("sql result = null");
            }
            using var workbook = new XLWorkbook();
            var sheetName = "ภาษีขาย_OvIn";
            var worksheet = workbook.Worksheets.Add(sheetName);

            // Headers
            var headers = new string[]
            {
                "เลขที่ตัดรับ",
                "วันที่ตัดรับ",
                "รหัสบริษัทประกัน",
                "ชื่อบริษัทประกัน",
                "ยอด OV รับ",
                "ยอดภาษีขาย OV รับ",
                "สถานะตัดรับ",
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
                worksheet.Cell(row, col++).Value = i.DfRpReferNo;
                worksheet.Cell(row, col++).Value = i.RpRefDate;
                worksheet.Cell(row, col++).Value = i.InsurerCode;
                worksheet.Cell(row, col++).Value = i.InsurerName;
                worksheet.Cell(row, col++).Value = i.OvInAmt;
                worksheet.Cell(row, col++).Value = i.VatOvInAmt;
                worksheet.Cell(row, col++).Value = i.ArApStatus;
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
    }
}
