using BestPolicyReport.Models.ArApReport;
using BestPolicyReport.Services.ArApService;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;

namespace BestPolicyReport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArApController : ControllerBase
    {
        private readonly IArApService _arApService;

        public ArApController(IArApService arApService)
        {
            _arApService = arApService;
        }

        [HttpPost("commOutOvOutOpenItem/json")]
        public async Task<ActionResult<List<CommOutOvOutReportResult>?>> GetCommOutOvOutOpenItemReportJson(ArApReportInput data)
        {
            var result = await _arApService.GetCommOutOvOutOpenItemReportJson(data);
            if (result == null)
            {
                return Ok(new List<CommOutOvOutReportResult>());
            }
            return Ok(result);
        }

        [HttpPost("commOutOvOutOpenItem/excel")]
        public async Task<IActionResult?> GetCommOutOvOutOpenItemReportExcel(ArApReportInput data)
        {
            var result = await _arApService.GetCommOutOvOutOpenItemReportJson(data);
            if (result == null)
            {
                return BadRequest("sql result = null");
            }
            using var workbook = new XLWorkbook();
            var sheetName = "ตัดจ่าย_CommOutOvOut_ตัวตั้ง";
            var worksheet = workbook.Worksheets.Add(sheetName);

            // Headers
            var headers = new string[]
             {
                 "หมายเลขกรมธรรม์", 
                 "หมายเลขสลักหลัง", 
                 "หมายเลขใบแจ้งหนี้", 
                 "เลขที่งวด", 
                 "เลขที่แคชเชียร์", 
                 "วันที่แคชเชียร์", 
                 "ยอดแคชเชียร์", 
                 "CashierReceiveType", 
                 "CashierRefNo", 
                 "CashierRefDate", 
                 "เลขที่ตัดหนี้ PremIn", 
                 "วันที่ตัดหนี้", 
                 "เบี้ยรวม", 
                 "อัตราส่วนลด", 
                 "มูลค่าส่วนลด", 
                 "เบี้ยสุทธิ", 
                 "อากร", 
                 "ภาษี", 
                 "เบี้ยประกันภัยรับรวม", 
                 "NetFlag", 
                 "วันที่เริ่มคุ้มครอง", 
                 "วันที่สิ้นสุดคุ้มครอง", 
                 "รหัส Main Account", 
                 "ชื่อ Main Account", 
                 "รหัสผู้เอาประกัน", 
                 "ชื่อผู้เอาประกัน", 
                 "ประเภทประกัน", 
                 "ประเภทย่อยประกัน", 
                 "ทะเบียนรถ", 
                 "จังหวัด", 
                 "เลขตัวถัง", 
                 "อัตราคอมมิชชั่นจ่าย", 
                 "อัตรา OV จ่าย", 
                 "ยอด OV จ่าย", 
                 "CommOutDfRpReferNo", 
                 "CommOutRpRefDate", 
                 "CommOutPaidAmt", 
                 "CommOutDiffAmt", 
                 "OvOutPaidAmt", 
                 "OvOutDiffAmt"
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
                worksheet.Cell(row, col++).Value = i.PolicyNo;
                worksheet.Cell(row, col++).Value = i.EndorseNo;
                worksheet.Cell(row, col++).Value = i.InvoiceNo;
                worksheet.Cell(row, col++).Value = i.SeqNo;
                worksheet.Cell(row, col++).Value = i.CashierReceiveNo;
                worksheet.Cell(row, col++).Value = i.CashierDate;
                worksheet.Cell(row, col++).Value = i.CashierAmt;
                worksheet.Cell(row, col++).Value = i.CashierReceiveType;
                worksheet.Cell(row, col++).Value = i.CashierRefNo;
                worksheet.Cell(row, col++).Value = i.CashierRefDate;
                worksheet.Cell(row, col++).Value = i.PremInDfRpReferNo;
                worksheet.Cell(row, col++).Value = i.RpRefDate;
                worksheet.Cell(row, col++).Value = i.GrossPrem;
                worksheet.Cell(row, col++).Value = i.SpecDiscRate;
                worksheet.Cell(row, col++).Value = i.SpecDiscAmt;
                worksheet.Cell(row, col++).Value = i.NetGrossPrem;
                worksheet.Cell(row, col++).Value = i.Duty;
                worksheet.Cell(row, col++).Value = i.Tax;
                worksheet.Cell(row, col++).Value = i.TotalPrem;
                worksheet.Cell(row, col++).Value = i.NetFlag;
                worksheet.Cell(row, col++).Value = i.ActDate;
                worksheet.Cell(row, col++).Value = i.ExpDate;
                worksheet.Cell(row, col++).Value = i.MainAccountCode;
                worksheet.Cell(row, col++).Value = i.MainAccountName;
                worksheet.Cell(row, col++).Value = i.InsureeCode;
                worksheet.Cell(row, col++).Value = i.InsureeName;
                worksheet.Cell(row, col++).Value = i.Class;
                worksheet.Cell(row, col++).Value = i.SubClass;
                worksheet.Cell(row, col++).Value = i.LicenseNo;
                worksheet.Cell(row, col++).Value = i.Province;
                worksheet.Cell(row, col++).Value = i.ChassisNo;
                worksheet.Cell(row, col++).Value = i.CommOutRate;
                worksheet.Cell(row, col++).Value = i.OvOutRate;
                worksheet.Cell(row, col++).Value = i.OvOutAmt;
                worksheet.Cell(row, col++).Value = i.CommOutDfRpReferNo;
                worksheet.Cell(row, col++).Value = i.CommOutRpRefDate;
                worksheet.Cell(row, col++).Value = i.CommOutPaidAmt;
                worksheet.Cell(row, col++).Value = i.CommOutDiffAmt;
                worksheet.Cell(row, col++).Value = i.OvOutPaidAmt;
                worksheet.Cell(row, col).Value = i.OvOutDiffAmt;

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

        [HttpPost("commOutOvOutClearing/json")]
        public async Task<ActionResult<List<CommOutOvOutReportResult>?>> GetCommOutOvOutClearingReportJson(ArApReportInput data)
        {
            var result = await _arApService.GetCommOutOvOutClearingReportJson(data);
            if (result == null)
            {
                return Ok(new List<CommOutOvOutReportResult>());
            }
            return Ok(result);
        }

        [HttpPost("commOutOvOutClearing/excel")]
        public async Task<IActionResult?> GetCommOutOvOutClearingReportExcel(ArApReportInput data)
        {
            var result = await _arApService.GetCommOutOvOutClearingReportJson(data);
            if (result == null)
            {
                return BadRequest("sql result = null");
            }
            using var workbook = new XLWorkbook();
            var sheetName = "ตัดจ่าย_CommOutOvOut_ตัวตัด";
            var worksheet = workbook.Worksheets.Add(sheetName);

            // Headers
            var headers = new string[]
             {
                 "หมายเลขกรมธรรม์",
                 "หมายเลขสลักหลัง",
                 "หมายเลขใบแจ้งหนี้",
                 "เลขที่งวด",
                 "เลขที่แคชเชียร์",
                 "วันที่แคชเชียร์",
                 "ยอดแคชเชียร์",
                 "CashierReceiveType",
                 "CashierRefNo",
                 "CashierRefDate",
                 "เลขที่ตัดหนี้ PremIn",
                 "วันที่ตัดหนี้",
                 "เบี้ยรวม",
                 "อัตราส่วนลด",
                 "มูลค่าส่วนลด",
                 "เบี้ยสุทธิ",
                 "อากร",
                 "ภาษี",
                 "เบี้ยประกันภัยรับรวม",
                 "NetFlag",
                 "วันที่เริ่มคุ้มครอง",
                 "วันที่สิ้นสุดคุ้มครอง",
                 "รหัส Main Account",
                 "ชื่อ Main Account",
                 "รหัสผู้เอาประกัน",
                 "ชื่อผู้เอาประกัน",
                 "ประเภทประกัน",
                 "ประเภทย่อยประกัน",
                 "ทะเบียนรถ",
                 "จังหวัด",
                 "เลขตัวถัง",
                 "อัตราคอมมิชชั่นจ่าย",
                 "อัตรา OV จ่าย",
                 "ยอด OV จ่าย",
                 "CommOutDfRpReferNo",
                 "CommOutRpRefDate",
                 "CommOutPaidAmt",
                 "CommOutDiffAmt",
                 "OvOutPaidAmt",
                 "OvOutDiffAmt"
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
                worksheet.Cell(row, col++).Value = i.PolicyNo;
                worksheet.Cell(row, col++).Value = i.EndorseNo;
                worksheet.Cell(row, col++).Value = i.InvoiceNo;
                worksheet.Cell(row, col++).Value = i.SeqNo;
                worksheet.Cell(row, col++).Value = i.CashierReceiveNo;
                worksheet.Cell(row, col++).Value = i.CashierDate;
                worksheet.Cell(row, col++).Value = i.CashierAmt;
                worksheet.Cell(row, col++).Value = i.CashierReceiveType;
                worksheet.Cell(row, col++).Value = i.CashierRefNo;
                worksheet.Cell(row, col++).Value = i.CashierRefDate;
                worksheet.Cell(row, col++).Value = i.PremInDfRpReferNo;
                worksheet.Cell(row, col++).Value = i.RpRefDate;
                worksheet.Cell(row, col++).Value = i.GrossPrem;
                worksheet.Cell(row, col++).Value = i.SpecDiscRate;
                worksheet.Cell(row, col++).Value = i.SpecDiscAmt;
                worksheet.Cell(row, col++).Value = i.NetGrossPrem;
                worksheet.Cell(row, col++).Value = i.Duty;
                worksheet.Cell(row, col++).Value = i.Tax;
                worksheet.Cell(row, col++).Value = i.TotalPrem;
                worksheet.Cell(row, col++).Value = i.NetFlag;
                worksheet.Cell(row, col++).Value = i.ActDate;
                worksheet.Cell(row, col++).Value = i.ExpDate;
                worksheet.Cell(row, col++).Value = i.MainAccountCode;
                worksheet.Cell(row, col++).Value = i.MainAccountName;
                worksheet.Cell(row, col++).Value = i.InsureeCode;
                worksheet.Cell(row, col++).Value = i.InsureeName;
                worksheet.Cell(row, col++).Value = i.Class;
                worksheet.Cell(row, col++).Value = i.SubClass;
                worksheet.Cell(row, col++).Value = i.LicenseNo;
                worksheet.Cell(row, col++).Value = i.Province;
                worksheet.Cell(row, col++).Value = i.ChassisNo;
                worksheet.Cell(row, col++).Value = i.CommOutRate;
                worksheet.Cell(row, col++).Value = i.OvOutRate;
                worksheet.Cell(row, col++).Value = i.OvOutAmt;
                worksheet.Cell(row, col++).Value = i.CommOutDfRpReferNo;
                worksheet.Cell(row, col++).Value = i.CommOutRpRefDate;
                worksheet.Cell(row, col++).Value = i.CommOutPaidAmt;
                worksheet.Cell(row, col++).Value = i.CommOutDiffAmt;
                worksheet.Cell(row, col++).Value = i.OvOutPaidAmt;
                worksheet.Cell(row, col).Value = i.OvOutDiffAmt;

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

        [HttpPost("commOutOvOutOutstanding/json")]
        public async Task<ActionResult<List<CommOutOvOutReportResult>?>> GetCommOutOvOutOutstandingReportJson(ArApReportInput data)
        {
            var result = await _arApService.GetCommOutOvOutOutstandingReportJson(data);
            if (result == null)
            {
                return Ok(new List<CommOutOvOutReportResult>());
            }
            return Ok(result);
        }

        [HttpPost("commOutOvOutOutstanding/excel")]
        public async Task<IActionResult?> GetCommOutOvOutOutstandingReportExcel(ArApReportInput data)
        {
            var result = await _arApService.GetCommOutOvOutOutstandingReportJson(data);
            if (result == null)
            {
                return BadRequest("sql result = null");
            }
            using var workbook = new XLWorkbook();
            var sheetName = "ตัดจ่าย_CommOutOvOut_ตัวคงเหลือ";
            var worksheet = workbook.Worksheets.Add(sheetName);

            // Headers
            var headers = new string[]
             {
                 "หมายเลขกรมธรรม์",
                 "หมายเลขสลักหลัง",
                 "หมายเลขใบแจ้งหนี้",
                 "เลขที่งวด",
                 "เลขที่แคชเชียร์",
                 "วันที่แคชเชียร์",
                 "ยอดแคชเชียร์",
                 "CashierReceiveType",
                 "CashierRefNo",
                 "CashierRefDate",
                 "เลขที่ตัดหนี้ PremIn",
                 "วันที่ตัดหนี้",
                 "เบี้ยรวม",
                 "อัตราส่วนลด",
                 "มูลค่าส่วนลด",
                 "เบี้ยสุทธิ",
                 "อากร",
                 "ภาษี",
                 "เบี้ยประกันภัยรับรวม",
                 "NetFlag",
                 "วันที่เริ่มคุ้มครอง",
                 "วันที่สิ้นสุดคุ้มครอง",
                 "รหัส Main Account",
                 "ชื่อ Main Account",
                 "รหัสผู้เอาประกัน",
                 "ชื่อผู้เอาประกัน",
                 "ประเภทประกัน",
                 "ประเภทย่อยประกัน",
                 "ทะเบียนรถ",
                 "จังหวัด",
                 "เลขตัวถัง",
                 "ประเภทตัดจ่าย",
                 "อัตราคอมมิชชั่นจ่าย",
                 "อัตรา OV จ่าย",
                 "ยอด OV จ่าย",
                 "CommOutDfRpReferNo",
                 "CommOutRpRefDate",
                 "CommOutPaidAmt",
                 "CommOutDiffAmt",
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
                worksheet.Cell(row, col++).Value = i.PolicyNo;
                worksheet.Cell(row, col++).Value = i.EndorseNo;
                worksheet.Cell(row, col++).Value = i.InvoiceNo;
                worksheet.Cell(row, col++).Value = i.SeqNo;
                worksheet.Cell(row, col++).Value = i.CashierReceiveNo;
                worksheet.Cell(row, col++).Value = i.CashierDate;
                worksheet.Cell(row, col++).Value = i.CashierAmt;
                worksheet.Cell(row, col++).Value = i.CashierReceiveType;
                worksheet.Cell(row, col++).Value = i.CashierRefNo;
                worksheet.Cell(row, col++).Value = i.CashierRefDate;
                worksheet.Cell(row, col++).Value = i.PremInDfRpReferNo;
                worksheet.Cell(row, col++).Value = i.RpRefDate;
                worksheet.Cell(row, col++).Value = i.GrossPrem;
                worksheet.Cell(row, col++).Value = i.SpecDiscRate;
                worksheet.Cell(row, col++).Value = i.SpecDiscAmt;
                worksheet.Cell(row, col++).Value = i.NetGrossPrem;
                worksheet.Cell(row, col++).Value = i.Duty;
                worksheet.Cell(row, col++).Value = i.Tax;
                worksheet.Cell(row, col++).Value = i.TotalPrem;
                worksheet.Cell(row, col++).Value = i.NetFlag;
                worksheet.Cell(row, col++).Value = i.ActDate;
                worksheet.Cell(row, col++).Value = i.ExpDate;
                worksheet.Cell(row, col++).Value = i.MainAccountCode;
                worksheet.Cell(row, col++).Value = i.MainAccountName;
                worksheet.Cell(row, col++).Value = i.InsureeCode;
                worksheet.Cell(row, col++).Value = i.InsureeName;
                worksheet.Cell(row, col++).Value = i.Class;
                worksheet.Cell(row, col++).Value = i.SubClass;
                worksheet.Cell(row, col++).Value = i.LicenseNo;
                worksheet.Cell(row, col++).Value = i.Province;
                worksheet.Cell(row, col++).Value = i.ChassisNo;
                worksheet.Cell(row, col++).Value = i.TransactionType;
                worksheet.Cell(row, col++).Value = i.CommOutRate;
                worksheet.Cell(row, col++).Value = i.OvOutRate;
                worksheet.Cell(row, col++).Value = i.OvOutAmt;
                worksheet.Cell(row, col++).Value = i.CommOutDfRpReferNo;
                worksheet.Cell(row, col++).Value = i.CommOutRpRefDate;
                worksheet.Cell(row, col++).Value = i.CommOutPaidAmt;
                worksheet.Cell(row, col++).Value = i.CommOutDiffAmt;

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

        [HttpPost("premOutOpenItem/json")]
        public async Task<ActionResult<List<PremOutReportResult>?>> GetPremOutOpenItemReportJson(ArApReportInput data)
        {
            var result = await _arApService.GetPremOutOpenItemReportJson(data);
            if (result == null)
            {
                return Ok(new List<PremOutReportResult>());
            }
            return Ok(result);
        }

        [HttpPost("premOutOpenItem/excel")]
        public async Task<IActionResult?> GetPremOutOpenItemReportExcel(ArApReportInput data)
        {
            var result = await _arApService.GetPremOutOpenItemReportJson(data);
            if (result == null)
            {
                return BadRequest("sql result = null");
            }
            using var workbook = new XLWorkbook();
            var sheetName = "ตัดจ่าย_PremOut_ตัวตั้ง";
            var worksheet = workbook.Worksheets.Add(sheetName);

            // Headers
            var headers = new string[]
             {
                 "หมายเลขกรมธรรม์",
                 "หมายเลขสลักหลัง",
                 "หมายเลขใบแจ้งหนี้",
                 "เลขที่งวด",
                 "เลขที่ตัดหนี้ PremIn",
                 "วันที่ตัดหนี้ PremIn",
                 "เลขที่ตัดหนี้ PremOut",
                 "วันที่ตัดหนี้ PremOut",
                 "วันที่เริ่มคุ้มครอง",
                 "วันที่สิ้นสุดคุ้มครอง",
                 "รหัสบริษัทประกัน",
                 "ชื่อบริษัทประกัน",
                 "รหัสผู้เอาประกัน",
                 "ชื่อผู้เอาประกัน",
                 "ประเภทประกัน",
                 "ประเภทย่อยประกัน",
                 "เบี้ยรวม",
                 "อัตราส่วนลด",
                 "มูลค่าส่วนลด",
                 "เบี้ยสุทธิ",
                 "อากร",
                 "ภาษี",
                 "เบี้ยประกันภัยรับรวม",
                 "NetFlag",
                 "อัตราคอมมิชชั่นรับ",
                 "ยอดคอมมิชชั่นรับ",
                 "เลขที่ตัดหนี้ CommIn",
                 "วันที่ตัดหนี้ CommIn",
                 "จำนวนเงิน CommIn ตัดรับ",
                 "จำนวนเงิน CommIn คงเหลือ",
                 "อัตรา OV รับ",
                 "ยอด OV รับ",
                 "เลขที่ตัดหนี้ OvIn",
                 "วันที่ตัดหนี้ OvIn",
                 "จำนวนเงิน OvIn ตัดรับ",
                 "จำนวนเงิน OvIn คงเหลือ",
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
                worksheet.Cell(row, col++).Value = i.PolicyNo;
                worksheet.Cell(row, col++).Value = i.EndorseNo;
                worksheet.Cell(row, col++).Value = i.InvoiceNo;
                worksheet.Cell(row, col++).Value = i.SeqNo;
                worksheet.Cell(row, col++).Value = i.PremInDfRpReferNo;
                worksheet.Cell(row, col++).Value = i.PremInRpRefDate;
                worksheet.Cell(row, col++).Value = i.PremOutDfRpReferNo;
                worksheet.Cell(row, col++).Value = i.PremOutRpRefDate;
                worksheet.Cell(row, col++).Value = i.ActDate;
                worksheet.Cell(row, col++).Value = i.ExpDate;
                worksheet.Cell(row, col++).Value = i.InsurerCode;
                worksheet.Cell(row, col++).Value = i.InsurerName;
                worksheet.Cell(row, col++).Value = i.InsureeCode;
                worksheet.Cell(row, col++).Value = i.InsureeName;
                worksheet.Cell(row, col++).Value = i.Class;
                worksheet.Cell(row, col++).Value = i.SubClass;
                worksheet.Cell(row, col++).Value = i.GrossPrem;
                worksheet.Cell(row, col++).Value = i.SpecDiscRate;
                worksheet.Cell(row, col++).Value = i.SpecDiscAmt;
                worksheet.Cell(row, col++).Value = i.NetGrossPrem;
                worksheet.Cell(row, col++).Value = i.Duty;
                worksheet.Cell(row, col++).Value = i.Tax;
                worksheet.Cell(row, col++).Value = i.TotalPrem;
                worksheet.Cell(row, col++).Value = i.NetFlag;
                worksheet.Cell(row, col++).Value = i.CommInRate;
                worksheet.Cell(row, col++).Value = i.CommInAmt;
                worksheet.Cell(row, col++).Value = i.CommInDfRpReferNo;
                worksheet.Cell(row, col++).Value = i.CommInRpRefDate;
                worksheet.Cell(row, col++).Value = i.CommInPaidAmt;
                worksheet.Cell(row, col++).Value = i.CommInDiffAmt;
                worksheet.Cell(row, col++).Value = i.OvInRate;
                worksheet.Cell(row, col++).Value = i.OvInAmt;
                worksheet.Cell(row, col++).Value = i.OvInDfRpReferNo;
                worksheet.Cell(row, col++).Value = i.OvInRpRefDate;
                worksheet.Cell(row, col++).Value = i.OvInPaidAmt;
                worksheet.Cell(row, col).Value = i.OvInDiffAmt;

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

        [HttpPost("PremOutClearing/json")]
        public async Task<ActionResult<List<PremOutReportResult>?>> GetPremOutClearingReportJson(ArApReportInput data)
        {
            var result = await _arApService.GetPremOutClearingReportJson(data);
            if (result == null)
            {
                return Ok(new List<PremOutReportResult>());
            }
            return Ok(result);
        }

        [HttpPost("PremOutClearing/excel")]
        public async Task<IActionResult?> GetPremOutClearingReportExcel(ArApReportInput data)
        {
            var result = await _arApService.GetPremOutClearingReportJson(data);
            if (result == null)
            {
                return BadRequest("sql result = null");
            }
            using var workbook = new XLWorkbook();
            var sheetName = "ตัดจ่าย_PremOut_ตัวตัด";
            var worksheet = workbook.Worksheets.Add(sheetName);

            // Headers
            var headers = new string[]
             {
                 "หมายเลขกรมธรรม์",
                 "หมายเลขสลักหลัง",
                 "หมายเลขใบแจ้งหนี้",
                 "เลขที่งวด",
                 "เลขที่ตัดหนี้ PremIn",
                 "วันที่ตัดหนี้ PremIn",
                 "เลขที่ตัดหนี้ PremOut",
                 "วันที่ตัดหนี้ PremOut",
                 "วันที่เริ่มคุ้มครอง",
                 "วันที่สิ้นสุดคุ้มครอง",
                 "รหัสบริษัทประกัน",
                 "ชื่อบริษัทประกัน",
                 "รหัสผู้เอาประกัน",
                 "ชื่อผู้เอาประกัน",
                 "ประเภทประกัน",
                 "ประเภทย่อยประกัน",
                 "เบี้ยรวม",
                 "อัตราส่วนลด",
                 "มูลค่าส่วนลด",
                 "เบี้ยสุทธิ",
                 "อากร",
                 "ภาษี",
                 "เบี้ยประกันภัยรับรวม",
                 "NetFlag",
                 "อัตราคอมมิชชั่นรับ",
                 "ยอดคอมมิชชั่นรับ",
                 "เลขที่ตัดหนี้ CommIn",
                 "วันที่ตัดหนี้ CommIn",
                 "จำนวนเงิน CommIn ตัดรับ",
                 "จำนวนเงิน CommIn คงเหลือ",
                 "อัตรา OV รับ",
                 "ยอด OV รับ",
                 "เลขที่ตัดหนี้ OvIn",
                 "วันที่ตัดหนี้ OvIn",
                 "จำนวนเงิน OvIn ตัดรับ",
                 "จำนวนเงิน OvIn คงเหลือ",
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
                worksheet.Cell(row, col++).Value = i.PolicyNo;
                worksheet.Cell(row, col++).Value = i.EndorseNo;
                worksheet.Cell(row, col++).Value = i.InvoiceNo;
                worksheet.Cell(row, col++).Value = i.SeqNo;
                worksheet.Cell(row, col++).Value = i.PremInDfRpReferNo;
                worksheet.Cell(row, col++).Value = i.PremInRpRefDate;
                worksheet.Cell(row, col++).Value = i.PremOutDfRpReferNo;
                worksheet.Cell(row, col++).Value = i.PremOutRpRefDate;
                worksheet.Cell(row, col++).Value = i.ActDate;
                worksheet.Cell(row, col++).Value = i.ExpDate;
                worksheet.Cell(row, col++).Value = i.InsurerCode;
                worksheet.Cell(row, col++).Value = i.InsurerName;
                worksheet.Cell(row, col++).Value = i.InsureeCode;
                worksheet.Cell(row, col++).Value = i.InsureeName;
                worksheet.Cell(row, col++).Value = i.Class;
                worksheet.Cell(row, col++).Value = i.SubClass;
                worksheet.Cell(row, col++).Value = i.GrossPrem;
                worksheet.Cell(row, col++).Value = i.SpecDiscRate;
                worksheet.Cell(row, col++).Value = i.SpecDiscAmt;
                worksheet.Cell(row, col++).Value = i.NetGrossPrem;
                worksheet.Cell(row, col++).Value = i.Duty;
                worksheet.Cell(row, col++).Value = i.Tax;
                worksheet.Cell(row, col++).Value = i.TotalPrem;
                worksheet.Cell(row, col++).Value = i.NetFlag;
                worksheet.Cell(row, col++).Value = i.CommInRate;
                worksheet.Cell(row, col++).Value = i.CommInAmt;
                worksheet.Cell(row, col++).Value = i.CommInDfRpReferNo;
                worksheet.Cell(row, col++).Value = i.CommInRpRefDate;
                worksheet.Cell(row, col++).Value = i.CommInPaidAmt;
                worksheet.Cell(row, col++).Value = i.CommInDiffAmt;
                worksheet.Cell(row, col++).Value = i.OvInRate;
                worksheet.Cell(row, col++).Value = i.OvInAmt;
                worksheet.Cell(row, col++).Value = i.OvInDfRpReferNo;
                worksheet.Cell(row, col++).Value = i.OvInRpRefDate;
                worksheet.Cell(row, col++).Value = i.OvInPaidAmt;
                worksheet.Cell(row, col).Value = i.OvInDiffAmt;

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

        [HttpPost("premOutOutstanding/json")]
        public async Task<ActionResult<List<PremOutReportResult>?>> GetPremOutOutstandingReportJson(ArApReportInput data)
        {
            var result = await _arApService.GetPremOutOutstandingReportJson(data);
            if (result == null)
            {
                return Ok(new List<PremOutReportResult>());
            }
            return Ok(result);
        }

        [HttpPost("premOutOutstanding/excel")]
        public async Task<IActionResult?> GetPremOutOutstandingReportExcel(ArApReportInput data)
        {
            var result = await _arApService.GetPremOutOutstandingReportJson(data);
            if (result == null)
            {
                return BadRequest("sql result = null");
            }
            using var workbook = new XLWorkbook();
            var sheetName = "ตัดจ่าย_PremOut_ตัวคงเหลือ";
            var worksheet = workbook.Worksheets.Add(sheetName);

            // Headers
            var headers = new string[]
             {
                 "หมายเลขกรมธรรม์",
                 "หมายเลขสลักหลัง",
                 "หมายเลขใบแจ้งหนี้",
                 "เลขที่งวด",
                 "เลขที่ตัดหนี้ PremIn",
                 "วันที่ตัดหนี้ PremIn",
                 "เลขที่ตัดหนี้ PremOut",
                 "วันที่ตัดหนี้ PremOut",
                 "วันที่เริ่มคุ้มครอง",
                 "วันที่สิ้นสุดคุ้มครอง",
                 "รหัสบริษัทประกัน",
                 "ชื่อบริษัทประกัน",
                 "รหัสผู้เอาประกัน",
                 "ชื่อผู้เอาประกัน",
                 "ประเภทประกัน",
                 "ประเภทย่อยประกัน",
                 "เบี้ยรวม",
                 "อัตราส่วนลด",
                 "มูลค่าส่วนลด",
                 "เบี้ยสุทธิ",
                 "อากร",
                 "ภาษี",
                 "เบี้ยประกันภัยรับรวม",
                 "NetFlag",
                 "อัตราคอมมิชชั่นรับ",
                 "ยอดคอมมิชชั่นรับ",
                 "เลขที่ตัดหนี้ CommIn",
                 "วันที่ตัดหนี้ CommIn",
                 "จำนวนเงิน CommIn ตัดรับ",
                 "จำนวนเงิน CommIn คงเหลือ",
                 "อัตรา OV รับ",
                 "ยอด OV รับ",
                 "เลขที่ตัดหนี้ OvIn",
                 "วันที่ตัดหนี้ OvIn",
                 "จำนวนเงิน OvIn ตัดรับ",
                 "จำนวนเงิน OvIn คงเหลือ",
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
                worksheet.Cell(row, col++).Value = i.PolicyNo;
                worksheet.Cell(row, col++).Value = i.EndorseNo;
                worksheet.Cell(row, col++).Value = i.InvoiceNo;
                worksheet.Cell(row, col++).Value = i.SeqNo;
                worksheet.Cell(row, col++).Value = i.PremInDfRpReferNo;
                worksheet.Cell(row, col++).Value = i.PremInRpRefDate;
                worksheet.Cell(row, col++).Value = i.PremOutDfRpReferNo;
                worksheet.Cell(row, col++).Value = i.PremOutRpRefDate;
                worksheet.Cell(row, col++).Value = i.ActDate;
                worksheet.Cell(row, col++).Value = i.ExpDate;
                worksheet.Cell(row, col++).Value = i.InsurerCode;
                worksheet.Cell(row, col++).Value = i.InsurerName;
                worksheet.Cell(row, col++).Value = i.InsureeCode;
                worksheet.Cell(row, col++).Value = i.InsureeName;
                worksheet.Cell(row, col++).Value = i.Class;
                worksheet.Cell(row, col++).Value = i.SubClass;
                worksheet.Cell(row, col++).Value = i.GrossPrem;
                worksheet.Cell(row, col++).Value = i.SpecDiscRate;
                worksheet.Cell(row, col++).Value = i.SpecDiscAmt;
                worksheet.Cell(row, col++).Value = i.NetGrossPrem;
                worksheet.Cell(row, col++).Value = i.Duty;
                worksheet.Cell(row, col++).Value = i.Tax;
                worksheet.Cell(row, col++).Value = i.TotalPrem;
                worksheet.Cell(row, col++).Value = i.NetFlag;
                worksheet.Cell(row, col++).Value = i.CommInRate;
                worksheet.Cell(row, col++).Value = i.CommInAmt;
                worksheet.Cell(row, col++).Value = i.CommInDfRpReferNo;
                worksheet.Cell(row, col++).Value = i.CommInRpRefDate;
                worksheet.Cell(row, col++).Value = i.CommInPaidAmt;
                worksheet.Cell(row, col++).Value = i.CommInDiffAmt;
                worksheet.Cell(row, col++).Value = i.OvInRate;
                worksheet.Cell(row, col++).Value = i.OvInAmt;
                worksheet.Cell(row, col++).Value = i.OvInDfRpReferNo;
                worksheet.Cell(row, col++).Value = i.OvInRpRefDate;
                worksheet.Cell(row, col++).Value = i.OvInPaidAmt;
                worksheet.Cell(row, col).Value = i.OvInDiffAmt;

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
