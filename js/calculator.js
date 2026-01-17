// calculator.js - Price Calculation Engine
// SECURITY: Pure functions, no side effects, input validation

const PriceCalculator = (function() {
  'use strict';
  
  const GST_RATE = 0.10; // 10% GST for Australia
  const DEPOSIT_RATE = 0.50; // 50% deposit
  
  /**
   * Calculate unit price for an item
   * SECURITY: Validates all inputs before calculation
   * @param {Object} item - Item with width, drop, group
   * @returns {number} - Unit price or 0 if invalid
   */
  function calculateUnitPrice(item) {
    try {
      // Validate inputs
      if (!item || typeof item !== 'object') {
        return 0;
      }
      
      const width = parseFloat(item.width);
      const drop = parseFloat(item.drop);
      const group = parseInt(item.group);
      
      // Validation checks
      if (isNaN(width) || isNaN(drop) || isNaN(group)) {
        return 0;
      }
      
      if (width <= 0 || drop <= 0) {
        return 0;
      }
      
      if (![1, 2, 3, 4].includes(group)) {
        return 0;
      }
      
      // Get pricing table
      const pricingTable = window.getPricingTable(group);
      if (!pricingTable) {
        return 0;
      }
      
      // Round to bands
      const widthBand = window.roundUpToBand(width, pricingTable.widthBands);
      const dropBand = window.roundUpToBand(drop, pricingTable.dropBands);
      
      if (!widthBand || !dropBand) {
        return 0;
      }
      
      // Find indices
      const widthIndex = pricingTable.widthBands.indexOf(widthBand);
      const dropIndex = pricingTable.dropBands.indexOf(dropBand);
      
      if (widthIndex === -1 || dropIndex === -1) {
        return 0;
      }
      
      // Get price from table
      const price = pricingTable.prices[dropIndex][widthIndex];
      
      // Validate price is a positive number
      return typeof price === 'number' && price > 0 ? price : 0;
      
    } catch (error) {
      console.error('Price calculation error:', error);
      return 0;
    }
  }
  
  /**
   * Calculate total price for an item (unit price × quantity)
   * @param {Object} item - Item with unitPrice and quantity
   * @returns {number}
   */
  function calculateItemTotal(item) {
    try {
      const unitPrice = parseFloat(item.unitPrice);
      const quantity = parseInt(item.quantity);
      
      if (isNaN(unitPrice) || isNaN(quantity)) {
        return 0;
      }
      
      if (unitPrice < 0 || quantity < 1) {
        return 0;
      }
      
      return unitPrice * quantity;
      
    } catch (error) {
      console.error('Item total calculation error:', error);
      return 0;
    }
  }
  
  /**
   * Calculate all totals for a quotation
   * @param {Array} items - Array of items
   * @returns {Object} - Totals breakdown
   */
  function calculateQuotationTotals(items) {
    try {
      // Validate input
      if (!Array.isArray(items) || items.length === 0) {
        return {
          subtotal: 0,
          gst: 0,
          total: 0,
          deposit: 0,
          balance: 0
        };
      }
      
      // Calculate subtotal
      const subtotal = items.reduce((sum, item) => {
        const itemTotal = parseFloat(item.totalPrice) || 0;
        return sum + itemTotal;
      }, 0);
      
      // Calculate GST (10%)
      const gst = subtotal * GST_RATE;
      
      // Calculate total (subtotal + GST)
      const total = subtotal + gst;
      
      // Calculate deposit (50% of total)
      const deposit = total * DEPOSIT_RATE;
      
      // Calculate balance (total - deposit)
      const balance = total - deposit;
      
      return {
        subtotal: roundToTwoDecimals(subtotal),
        gst: roundToTwoDecimals(gst),
        total: roundToTwoDecimals(total),
        deposit: roundToTwoDecimals(deposit),
        balance: roundToTwoDecimals(balance)
      };
      
    } catch (error) {
      console.error('Totals calculation error:', error);
      return {
        subtotal: 0,
        gst: 0,
        total: 0,
        deposit: 0,
        balance: 0
      };
    }
  }
  
  /**
   * Round number to 2 decimal places
   * @param {number} num
   * @returns {number}
   */
  function roundToTwoDecimals(num) {
    if (typeof num !== 'number' || isNaN(num)) {
      return 0;
    }
    return Math.round(num * 100) / 100;
  }
  
  /**
   * Format number as currency (AUD)
   * @param {number} amount
   * @returns {string}
   */
  function formatCurrency(amount) {
    const num = parseFloat(amount);
    
    if (isNaN(num)) {
      return '$0.00';
    }
    
    return '$' + num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  
  /**
   * Calculate band data for display (shows rounding)
   * @param {Object} item
   * @returns {Object}
   */
  function calculateBandData(item) {
    try {
      const group = parseInt(item.group);
      
      if (![1, 2, 3, 4].includes(group)) {
        return {
          widthBand: null,
          dropBand: null
        };
      }
      
      const pricingTable = window.getPricingTable(group);
      
      if (!pricingTable) {
        return {
          widthBand: null,
          dropBand: null
        };
      }
      
      const widthBand = window.roundUpToBand(item.width, pricingTable.widthBands);
      const dropBand = window.roundUpToBand(item.drop, pricingTable.dropBands);
      
      return {
        widthBand,
        dropBand
      };
      
    } catch (error) {
      console.error('Band calculation error:', error);
      return {
        widthBand: null,
        dropBand: null
      };
    }
  }
  
  // Public API
  return {
    calculateUnitPrice,
    calculateItemTotal,
    calculateQuotationTotals,
    calculateBandData,
    formatCurrency,
    roundToTwoDecimals,
    
    // Constants for external use
    GST_RATE,
    DEPOSIT_RATE
  };
})();

// Freeze to prevent modification
Object.freeze(PriceCalculator);

// Make globally available
window.PriceCalculator = PriceCalculator;