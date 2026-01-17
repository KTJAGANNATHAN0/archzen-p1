// quotation.js - Quotation Generation (Customer + Internal Views)
// SECURITY: HTML escaping to prevent XSS, no innerHTML direct injection

const QuotationGenerator = (function() {
  'use strict';
  
  /**
   * Escape HTML to prevent XSS attacks
   * @param {string} text
   * @returns {string}
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  /**
   * Generate quotation HTML
   * @param {Object} customer
   * @param {Array} items
   * @param {Object} totals
   * @param {string} quoteNumber
   * @param {string} viewMode - 'customer' or 'internal'
   * @returns {string}
   */
  function generateQuotationHTML(customer, items, totals, quoteNumber, viewMode) {
    const today = new Date().toLocaleDateString('en-AU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    const isInternal = viewMode === 'internal';
    
    // Generate table headers based on view mode
    let tableHeaders = `
      <tr style="background-color: #f3f4f6;">
        <th style="border: 1px solid #9ca3af; padding: 8px; text-align: center; font-weight: 600;">#</th>
        <th style="border: 1px solid #9ca3af; padding: 8px; font-weight: 600;">LOCATION</th>
        <th style="border: 1px solid #9ca3af; padding: 8px; font-weight: 600;">TYPE</th>
        <th style="border: 1px solid #9ca3af; padding: 8px; font-weight: 600;">Recess / Face fit</th>
        <th style="border: 1px solid #9ca3af; padding: 8px; font-weight: 600;">FABRIC</th>
        <th style="border: 1px solid #9ca3af; padding: 8px; font-weight: 600;">BLOCKOUT/SCREEN</th>
    `;
    
    if (isInternal) {
      tableHeaders += `
        <th style="border: 1px solid #9ca3af; padding: 8px; font-weight: 600;">Width mm</th>
        <th style="border: 1px solid #9ca3af; padding: 8px; font-weight: 600;">Drop mm</th>
      `;
    }
    
    tableHeaders += `
        <th style="border: 1px solid #9ca3af; padding: 8px; text-align: center; font-weight: 600;">QTY</th>
        <th style="border: 1px solid #9ca3af; padding: 8px; text-align: right; font-weight: 600;">PRICE</th>
      </tr>
    `;
    
    // Generate table rows
    const tableRows = items.map((item, index) => {
      const categoryDisplay = item.category === 'Screen' ? 'SCREEN' : 'BO';
      
      let row = `
        <tr>
          <td style="border: 1px solid #9ca3af; padding: 8px; text-align: center;">${index + 1}</td>
          <td style="border: 1px solid #9ca3af; padding: 8px;">${escapeHtml(item.location)}</td>
          <td style="border: 1px solid #9ca3af; padding: 8px;">${escapeHtml(item.product)}</td>
          <td style="border: 1px solid #9ca3af; padding: 8px;">${escapeHtml(item.recess)}</td>
          <td style="border: 1px solid #9ca3af; padding: 8px;">Group ${escapeHtml(item.group.toString())}</td>
          <td style="border: 1px solid #9ca3af; padding: 8px;">${categoryDisplay}</td>
      `;
      
      if (isInternal) {
        row += `
          <td style="border: 1px solid #9ca3af; padding: 8px; text-align: center;">${item.width}→${item.widthBand}</td>
          <td style="border: 1px solid #9ca3af; padding: 8px; text-align: center;">${item.drop}→${item.dropBand}</td>
        `;
      }
      
      row += `
          <td style="border: 1px solid #9ca3af; padding: 8px; text-align: center;">${item.quantity}</td>
          <td style="border: 1px solid #9ca3af; padding: 8px; text-align: right;">$${item.totalPrice.toFixed(2)}</td>
        </tr>
      `;
      
      return row;
    }).join('');
    
    const emptyRowColspan = isInternal ? '10' : '8';
    
    // Generate full HTML matching the exact format from the image
    return `
      <div style="border: 2px solid #1f2937; margin-bottom: 20px; background: white;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 20px; border-bottom: 2px solid #1f2937;">
          <div style="display: flex; align-items: center; gap: 20px;">
            <div style="width: 100px; height: 100px; background: #7c3aed; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 40px; font-weight: 700;">SP</div>
            <div>
              <h1 style="font-size: 28px; line-height: 1.2; margin: 0; font-weight: 700;">INTERIOR</h1>
              <h1 style="font-size: 28px; line-height: 1.2; margin: 0; font-weight: 700;">SOLUTIONS</h1>
              <p style="color: #7c3aed; font-style: italic; font-size: 14px; margin: 5px 0 0 0;">Inspired Interiors</p>
            </div>
          </div>
          <div style="text-align: right; font-size: 13px; line-height: 1.6;">
            <p style="margin: 2px 0; font-weight: 700;">SP Interior Solutions Pty Ltd</p>
            <p style="margin: 2px 0;">0449 736 429</p>
            <p style="margin: 2px 0;">info@spisolutions.com.au</p>
            <p style="margin: 2px 0;">fb.com/spinteriorsolutions</p>
            <p style="margin: 2px 0;">www.spisolutions.com.au</p>
            <p style="margin: 8px 0 0 0; font-weight: 700;">ABN 86 658 409 548</p>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; padding: 20px; gap: 40px;">
          <div style="font-size: 13px;">
            <p style="margin: 3px 0;"><strong>Name:</strong> ${escapeHtml(customer.name)}</p>
            <p style="margin: 3px 0;"><strong>Add:</strong> ${escapeHtml(customer.address)}</p>
            <p style="margin: 3px 0;"><strong>Phone:</strong> ${escapeHtml(customer.phone)}</p>
            <p style="margin: 3px 0;"><strong>Email:</strong> ${customer.email ? escapeHtml(customer.email) : 'xxx'}</p>
          </div>
          <div style="text-align: right; font-size: 13px;">
            <p style="margin: 3px 0;"><strong>Date:</strong> ${today}</p>
            <p style="margin: 3px 0;"><strong>Quote No:</strong> ${escapeHtml(quoteNumber)}</p>
          </div>
        </div>
      </div>
      
      <div style="text-align: center; margin: 20px 0;">
        <h2 style="font-size: 20px; font-weight: 700; color: #7c3aed; margin: 0;">QUOTATION FOR ROLLER BLINDS</h2>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
        <thead>
          ${tableHeaders}
        </thead>
        <tbody>
          ${tableRows}
          <tr>
            <td colspan="${emptyRowColspan}" style="border: none; padding: 10px;"></td>
          </tr>
        </tbody>
      </table>
      
      <div style="margin-left: auto; width: 320px; margin-bottom: 20px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tbody>
            <tr>
              <td style="border: 1px solid #4b5563; padding: 8px; text-align: right; font-weight: 600;">Total</td>
              <td style="border: 1px solid #4b5563; padding: 8px; text-align: right;">$${totals.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #4b5563; padding: 8px; text-align: right; font-weight: 600;">GST 10%</td>
              <td style="border: 1px solid #4b5563; padding: 8px; text-align: right;">$${totals.gst.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #4b5563; padding: 8px; text-align: right; font-weight: 700;">Total Payable</td>
              <td style="border: 1px solid #4b5563; padding: 8px; text-align: right; font-weight: 700;">$${totals.total.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #4b5563; padding: 8px; text-align: right; font-weight: 600;">50% Deposit</td>
              <td style="border: 1px solid #4b5563; padding: 8px; text-align: right;">$${totals.deposit.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #4b5563; padding: 8px; text-align: right; font-weight: 600;">Balance Payable</td>
              <td style="border: 1px solid #4b5563; padding: 8px; text-align: right;">$${totals.balance.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div style="border: 2px solid #4b5563; padding: 15px; margin: 20px 0; text-align: center; font-weight: 700; font-size: 13px;">
        <p style="margin: 3px 0;">Account Name : SP INTERIOR SOLUTIONS PTY LTD</p>
        <p style="margin: 3px 0;">BSB : xxx-xxx / Account number : xxxxxx / xxxxxx</p>
      </div>
      
      <div style="border: 2px solid #4b5563; padding: 15px; font-size: 12px; line-height: 1.6;">
        <h3 style="font-weight: 700; margin: 0 0 10px 0; font-size: 13px;">Additional information / terms and conditions</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <p style="margin: 3px 0;"><strong>Roller Blind Fabric</strong></p>
            <p style="margin: 3px 0;"><strong>Roller Blind Fabric -</strong></p>
            <p style="margin: 3px 0;"><strong>Roller Blind Mounted</strong></p>
            <p style="margin: 3px 0;"><strong>Surcharge on Group 2 & 3</strong></p>
            <p style="margin: 3px 0;"><strong>Roller Blinds Blockout fabric</strong></p>
            <p style="margin: 3px 0;"><strong>Fabric colours</strong></p>
            <p style="margin: 3px 0;"><strong>Confirmation</strong></p>
            <p style="margin: 3px 0;"><strong>ETA</strong></p>
            <p style="margin: 3px 0;"><strong>Quote</strong></p>
          </div>
          <div>
            <p style="margin: 3px 0;">Blockout: Group 03- TBC</p>
            <p style="margin: 3px 0;">SCREEN: Group 03- TBC</p>
            <p style="margin: 3px 0;">Face Fit / Recess Fit</p>
            <p style="margin: 3px 0;">Approx 5-10% increase for Group 02 and 15-25% increase for Group 03</p>
            <p style="margin: 3px 0;">Blockout fabric</p>
            <p style="margin: 3px 0;">May differ slightly from batch to batch from sample shown</p>
            <p style="margin: 3px 0;">50% deposit</p>
            <p style="margin: 3px 0;">Blinds 2-3 wks</p>
            <p style="margin: 3px 0;">Price is for the above quantities and valid for 14 days only. Price includes supply and installation</p>
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * Generate data for n8n webhook
   * SECURITY: Sanitized data only, no raw HTML
   * @param {Object} customer
   * @param {Array} items
   * @param {Object} totals
   * @param {string} quoteNumber
   * @returns {Object}
   */
  function generateN8nPayload(customer, items, totals, quoteNumber) {
    return {
      quoteNumber: quoteNumber,
      date: new Date().toISOString(),
      customer: {
        name: customer.name,
        address: customer.address,
        phone: customer.phone,
        email: customer.email || null
      },
      items: items.map(item => ({
        location: item.location,
        product: item.product,
        category: item.category,
        group: item.group,
        recess: item.recess,
        width: item.width,
        drop: item.drop,
        widthBand: item.widthBand,
        dropBand: item.dropBand,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice
      })),
      totals: {
        subtotal: totals.subtotal,
        gst: totals.gst,
        total: totals.total,
        deposit: totals.deposit,
        balance: totals.balance
      },
      metadata: {
        currency: 'AUD',
        gstRate: 0.10,
        depositRate: 0.50
      }
    };
  }
  
  /**
   * Trigger browser print
   */
  function printQuotation() {
    window.print();
  }
  
  /**
   * Download quotation - Opens in new window with CTRL+P instructions
   * @param {string} html
   * @param {string} filename
   */
  function downloadQuotation(html, filename) {
    try {
      console.log('📥 Opening quotation for PDF save...');
      
      // Create new window
      const win = window.open('', '_blank');
      
      if (!win) {
        alert('⚠️ Pop-up blocked!\n\nPlease:\n1. Click the pop-up icon in your address bar\n2. Allow pop-ups for this site\n3. Try again');
        return;
      }
      
      // Write HTML
      win.document.write(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${filename}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    @media print {
      body { margin: 0; }
      @page { size: A4; margin: 15mm; }
    }
    .instructions {
      position: fixed;
      top: 10px;
      right: 10px;
      background: #7c3aed;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 9999;
      font-size: 14px;
      max-width: 300px;
    }
    .instructions h3 {
      margin: 0 0 10px 0;
      font-size: 16px;
    }
    .instructions ol {
      margin: 10px 0 10px 20px;
      padding: 0;
    }
    .instructions li {
      margin: 5px 0;
    }
    .instructions button {
      margin-top: 10px;
      padding: 8px 16px;
      background: white;
      color: #7c3aed;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      width: 100%;
    }
    @media print {
      .instructions { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="instructions" id="instructions">
    <h3>📄 Save as PDF</h3>
    <ol>
      <li>Press <strong>Ctrl + P</strong> (Windows) or <strong>Cmd + P</strong> (Mac)</li>
      <li>Select <strong>"Save as PDF"</strong></li>
      <li>Click <strong>Save</strong></li>
    </ol>
    <button onclick="window.print(); document.getElementById('instructions').style.display='none';">
      Print Now (Ctrl+P)
    </button>
  </div>
  
  ${html}
</body>
</html>
      `);
      
      win.document.close();
      console.log('✅ Quotation window opened');
      
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Error opening quotation: ' + error.message);
    }
  }
  
  // Public API
  return {
    generateQuotationHTML,
    generateN8nPayload,
    printQuotation,
    downloadQuotation
  };
})();

// Freeze to prevent modification
Object.freeze(QuotationGenerator);

// Make globally available
window.QuotationGenerator = QuotationGenerator;