const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

// Invoice HTML template matching the Figma design exactly
const invoiceTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Pretendard:wght@300;400;500;600;700&family=Mukta:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Rubik:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background: #FFF;
            width: 595px;
            height: 737px;
            position: relative;
            padding: 23px;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 49px;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 4.556px;
            width: 115px;
            height: 37px;
        }
        
        .logo-text {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: -1.082px;
        }
        
        .company-name {
            color: #000;
            font-family: 'Pretendard', sans-serif;
            font-size: 17.311px;
            font-weight: 300;
            line-height: 160%;
        }
        
        .company-subtitle {
            width: 71.947px;
            color: #000;
            font-family: 'Pretendard', sans-serif;
            font-size: 6.491px;
            font-weight: 300;
            line-height: 160%;
        }
        
        .invoice-title {
            display: flex;
            width: 167px;
            height: 40px;
            flex-direction: column;
            align-items: flex-end;
            gap: 3px;
            flex-shrink: 0;
        }
        
        .invoice-title h1 {
            color: #0A0A0A;
            text-align: right;
            font-family: 'Inter', sans-serif;
            font-size: 16px;
            font-weight: 600;
            line-height: 24.114px;
            margin: 0;
        }
        
        .invoice-title p {
            color: #333;
            font-family: 'Inter', sans-serif;
            font-size: 9.995px;
            font-weight: 500;
            line-height: 11.423px;
            opacity: 0.6;
            margin: 0;
        }
        
        .divider {
            width: 594px;
            height: 1px;
            background: #EAEAEA;
            margin-bottom: 20px;
        }
        
        .customer-section {
            width: 549px;
            height: 86px;
            border-radius: 10px;
            background: radial-gradient(116.09% 116.08% at 50.43% 51.58%, #191919 0%, rgba(0, 0, 0, 0.00) 100%), 
                        radial-gradient(55.35% 63.52% at 53.55% 87.4%, #0F0F0F 0%, #303661 100%), 
                        #165FE3;
            position: relative;
            margin-bottom: 105px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 29px;
        }
        
        .customer-info {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
            width: 106px;
            height: 43px;
        }
        
        .customer-label {
            color: rgba(204, 204, 204, 0.80);
            font-family: 'Rubik', sans-serif;
            font-size: 12px;
            font-weight: 400;
            line-height: normal;
        }
        
        .customer-name {
            color: #CCF575;
            font-family: 'Rubik', sans-serif;
            font-size: 16px;
            font-weight: 400;
            line-height: normal;
        }
        
        .customer-date {
            color: #DDD;
            text-align: right;
            font-family: 'Rubik', sans-serif;
            font-size: 12px;
            font-weight: 400;
            line-height: normal;
            position: absolute;
            right: 29px;
            top: 17px;
            width: 88px;
            height: 14px;
        }
        
        .customer-email {
            display: flex;
            padding: 5px 7px;
            justify-content: flex-end;
            align-items: center;
            gap: 10px;
            border-radius: 28px;
            background: #FFF;
            position: absolute;
            right: 29px;
            bottom: 12px;
            min-width: 128px;
            max-width: 260px;
            color: #000;
            text-align: right;
            font-family: 'Rubik', sans-serif;
            font-size: 12px;
            font-weight: 400;
            line-height: normal;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        
        .products-table {
            display: flex;
            width: 551px;
            flex-direction: column;
            align-items: flex-end;
            margin-bottom: 41px;
        }
        
        .table-header {
            display: flex;
            padding: 9.995px;
            justify-content: flex-end;
            align-items: flex-start;
            gap: 7.14px;
            align-self: stretch;
            border-radius: 78px;
            background: linear-gradient(91deg, #303661 10.65%, #263406 114.19%);
        }
        
        .table-header-cell {
            display: flex;
            align-items: flex-start;
            gap: 7.14px;
            flex: 1 0 0;
            color: #FFF;
            font-family: 'Inter', sans-serif;
            font-size: 9.995px;
            font-weight: 500;
            line-height: 11.423px;
        }
        
        .table-row-even {
            display: flex;
            padding: 9.995px;
            align-items: center;
            gap: 7.14px;
            align-self: stretch;
            border-radius: 20px;
            background: #FFF;
        }
        
        .table-row-odd {
            display: flex;
            padding: 9.995px;
            align-items: center;
            gap: 7.14px;
            align-self: stretch;
            border-radius: 20px;
            background: #FAFAFA;
        }
        
        .table-cell {
            flex: 1 0 0;
            color: #333;
            font-family: 'Inter', sans-serif;
            font-size: 9.995px;
            font-weight: 500;
            line-height: 11.423px;
        }
        
        .invoice-date {
            display: flex;
            width: 544px;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 41px;
            height: 13px;
        }
        
        .invoice-date span {
            color: #515151;
            font-family: 'Inter', sans-serif;
            font-size: 8.367px;
            font-weight: 700;
            line-height: 160%;
        }
        
        .total-section {
            display: flex;
            width: 253px;
            height: 104px;
            padding: 11.866px;
            flex-direction: column;
            align-items: flex-start;
            gap: 11.866px;
            flex-shrink: 0;
            border-radius: 8px;
            border: 1px solid #A2A2A2;
            background: #FFF;
            margin-left: auto;
            margin-bottom: 46px;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            align-self: stretch;
        }
        
        .total-row span:first-child {
            width: 96.705px;
            height: 17.205px;
            color: rgba(10, 10, 10, 0.55);
            font-family: 'Inter', sans-serif;
            font-size: 10px;
            font-weight: 500;
            line-height: 16.782px;
        }
        
        .total-row span:last-child {
            width: 106.198px;
            height: 17.205px;
            color: rgba(10, 10, 10, 0.55);
            text-align: right;
            font-family: 'Inter', sans-serif;
            font-size: 10px;
            font-weight: 500;
            line-height: 16.782px;
        }
        
        .total-row-final {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            align-self: stretch;
        }
        
        .total-row-final span:first-child {
            width: 96.705px;
            height: 17.205px;
            color: #0A0A0A;
            font-family: 'Inter', sans-serif;
            font-size: 12px;
            font-weight: 700;
            line-height: 16.782px;
        }
        
        .total-row-final span:last-child {
            height: 17.205px;
            flex: 1 0 0;
            color: #175EE2;
            text-align: right;
            font-family: 'Inter', sans-serif;
            font-size: 12px;
            font-weight: 700;
            line-height: 16.782px;
        }
        
        .footer {
            display: flex;
            padding: 10px 30px;
            justify-content: center;
            align-items: center;
            gap: 10px;
            border-radius: 40px;
            background: #272833;
            width: 463px;
            height: 46px;
            margin: 0 auto;
        }
        
        .footer p {
            width: 403px;
            color: #FFF;
            text-align: center;
            font-family: 'Inter', sans-serif;
            font-size: 8.367px;
            font-weight: 500;
            line-height: 160%;
            margin: 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">
            <svg width="36" height="37" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M35.3116 18.459L26.7101 36.1148H22.6357H8.87666L5.00735 28.4187L0 18.459L8.60155 0.803223H12.676H26.7101L30.4595 8.49934L35.3116 18.459Z" fill="black"/>
                <path d="M22.6353 28.4165L27.6152 18.4568L22.6353 8.49713L30.7842 18.4568L22.6353 28.4165Z" fill="white"/>
                <path d="M11.3175 10.3094L12.6756 8.49854L7.69577 18.4582L12.6756 28.4179L4.97949 18.4582L11.3175 10.3094Z" fill="white"/>
            </svg>
            <div class="logo-text">
                <div class="company-name">Levitation</div>
                <div class="company-subtitle">Infotech</div>
            </div>
        </div>
        
        <div class="invoice-title">
            <h1>INVOICE GENERATOR</h1>
            <p>Sample Output should be this</p>
        </div>
    </div>

    <div class="divider"></div>

    <div class="customer-section">
        <div class="customer-info">
            <div class="customer-label">Name</div>
            <div class="customer-name">{{customerName}}</div>
        </div>
        <div class="customer-date">Date : {{currentDate}}</div>
        <div class="customer-email">{{customerEmail}}</div>
    </div>

    <div class="products-table">
        <div class="table-header">
            <div class="table-header-cell">Product</div>
            <div class="table-header-cell">Qty</div>
            <div class="table-header-cell">Rate</div>
            <div class="table-header-cell">Total Amount</div>
        </div>
        
        {{#each products}}
        <div class="{{#if @even}}table-row-even{{else}}table-row-odd{{/if}}">
            <div class="table-cell">{{name}}</div>
            <div class="table-cell">{{quantity}}</div>
            <div class="table-cell">{{price}}</div>
            <div class="table-cell">USD {{totalPrice}}</div>
        </div>
        {{/each}}
    </div>

    <div class="invoice-date">
        <span>Date: {{currentDate}}</span>
    </div>

    <div class="total-section">
    <div class="total-row">
        <span>Total Charges</span>
        <span>{{subtotal}}</span>
    </div>
    <div class="total-row">
        <span>GST (18%)</span>
        <span>{{gstAmount}}</span>
    </div>
    <div class="total-row-final">
        <span>Total Amount</span>
        <span>₹ {{totalAmount}}</span>
    </div>
</div>

    <div class="footer">
        <p>We are pleased to provide any further information you may require and look forward to assisting with your next order. Rest assured, it will receive our prompt and dedicated attention.</p>
    </div>
</body>
</html>
`;

const generateInvoicePDF = async (invoiceData) => {
  let browser;

  try {
    // Compile the Handlebars template
    const template = handlebars.compile(invoiceTemplate);

    // Prepare data for template
    const templateData = {
      customerName: invoiceData.customerName || "Person_name",
      customerEmail: invoiceData.customerEmail || "example@email.com",
      currentDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }),
      products: invoiceData.products,
      subtotal: invoiceData.subtotal.toFixed(0),
      gstAmount: invoiceData.gstAmount.toFixed(0),
      totalAmount: Math.round(invoiceData.totalAmount),
    };

    // Generate HTML from template
    const html = template(templateData);

    // Launch Puppeteer
    browser = await puppeteer.launch({
      headless: "new",
      executablePath: "/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
        "--single-process"
      ],
    });

    const page = await browser.newPage();

    // Set content and wait for fonts to load
    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Generate PDF with exact dimensions matching the design
    const pdfBuffer = await page.pdf({
      width: "595px",
      height: "737px",
      printBackground: true,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    });

    return pdfBuffer;
  } catch (error) {
    console.error("PDF generation error:", error);
    throw new Error("Failed to generate PDF");
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

module.exports = {
  generateInvoicePDF,
};
