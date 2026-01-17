// pricing.js - All 4 Group Pricing Tables + Band Logic
// Security: Pure data structure, no user input processing here

const PRICING_DATA = {
  // Group 1 Pricing Table
  group1: {
    widthBands: [610, 760, 910, 1060, 1210, 1360, 1510, 1660, 1810, 1960, 2110, 2260, 2410, 2560, 2710, 2860, 3010, 3160, 3310],
    dropBands: [900, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 3300],
    prices: [
      [49, 52, 55, 63, 65, 70, 74, 85, 86, 88, 92, 95, 98, 102, 116, 127, 133, 145, 157],
      [52, 55, 63, 65, 70, 74, 85, 86, 88, 92, 95, 98, 102, 116, 127, 133, 140, 151, 153],
      [55, 59, 65, 67, 71, 78, 88, 92, 94, 98, 100, 105, 111, 127, 137, 143, 147, 158, 170],
      [57, 63, 67, 71, 72, 81, 93, 97, 101, 104, 108, 114, 118, 134, 147, 152, 158, 170, 182],
      [58, 70, 72, 79, 86, 92, 102, 104, 106, 107, 114, 119, 128, 147, 158, 163, 170, 182, 194],
      [60, 73, 74, 81, 92, 95, 105, 107, 109, 117, 124, 128, 133, 151, 168, 172, 178, 190, 201],
      [63, 77, 80, 85, 94, 98, 109, 114, 117, 122, 130, 135, 142, 162, 175, 183, 191, 202, 214],
      [65, 84, 86, 88, 97, 100, 115, 121, 126, 127, 134, 144, 151, 173, 184, 195, 202, 214, 226],
      [68, 87, 91, 97, 102, 105, 118, 123, 128, 130, 137, 147, 154, 188, 194, 201, 209, 220, 231]
    ]
  },

  // Group 2 Pricing Table
  group2: {
    widthBands: [610, 760, 910, 1060, 1210, 1360, 1510, 1660, 1810, 1960, 2110, 2260, 2410, 2560, 2710, 2860, 3010, 3160, 3310],
    dropBands: [900, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 3300],
    prices: [
      [53, 56, 58, 67, 69, 74, 81, 91, 93, 95, 100, 102, 106, 109, 126, 137, 144, 160, 175],
      [56, 58, 67, 69, 74, 81, 91, 93, 95, 100, 102, 106, 109, 126, 137, 144, 151, 167, 182],
      [58, 63, 65, 72, 77, 84, 96, 100, 102, 106, 0, 113, 119, 137, 149, 154, 158, 174, 189],
      [60, 67, 70, 77, 78, 87, 100, 104, 109, 112, 116, 123, 128, 145, 158, 165, 171, 186, 202],
      [63, 75, 77, 85, 93, 100, 111, 112, 114, 116, 123, 129, 138, 158, 171, 177, 184, 200, 215],
      [65, 79, 81, 86, 100, 102, 113, 116, 118, 127, 134, 137, 144, 165, 182, 186, 193, 209, 224],
      [68, 84, 86, 91, 102, 105, 119, 123, 127, 132, 140, 146, 154, 175, 190, 198, 206, 221, 237],
      [70, 90, 93, 96, 104, 107, 124, 130, 136, 137, 145, 155, 162, 186, 199, 210, 219, 235, 250],
      [72, 93, 98, 104, 111, 113, 128, 133, 137, 140, 149, 158, 167, 203, 210, 219, 226, 241, 256]
    ]
  },

  // Group 3 Pricing Table
  group3: {
    widthBands: [610, 760, 910, 1060, 1210, 1360, 1510, 1660, 1810, 1960, 2110, 2260, 2410, 2560, 2710, 2860, 3010, 3160, 3310],
    dropBands: [900, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 3300],
    prices: [
      [56, 60, 68, 72, 77, 84, 87, 93, 97, 101, 111, 123, 128, 133, 150, 157, 170, 190, 210],
      [60, 68, 72, 77, 84, 87, 93, 97, 101, 111, 123, 128, 133, 150, 157, 170, 176, 196, 214],
      [65, 70, 79, 84, 88, 96, 102, 107, 112, 119, 130, 142, 146, 168, 175, 259, 197, 216, 235],
      [69, 77, 82, 88, 95, 105, 109, 116, 123, 130, 145, 154, 158, 183, 192, 207, 215, 235, 254],
      [73, 81, 88, 95, 105, 109, 116, 126, 134, 143, 156, 165, 175, 200, 211, 227, 238, 257, 276],
      [77, 85, 93, 102, 109, 116, 125, 135, 144, 152, 167, 178, 184, 219, 229, 245, 257, 276, 296],
      [79, 88, 97, 106, 115, 124, 133, 143, 152, 161, 179, 189, 198, 234, 247, 266, 275, 294, 314],
      [81, 90, 101, 109, 121, 132, 142, 150, 160, 170, 191, 198, 211, 248, 266, 287, 293, 313, 332],
      [84, 98, 106, 115, 128, 136, 147, 154, 165, 179, 203, 204, 217, 265, 273, 301, 310, 330, 349]
    ]
  },

  // Group 4 Pricing Table
  group4: {
    widthBands: [610, 760, 910, 1060, 1210, 1360, 1510, 1660, 1810, 1960, 2110, 2260, 2410, 2560, 2710, 2860, 3010, 3160, 3310],
    dropBands: [900, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 3300],
    prices: [
      [65, 70, 79, 84, 90, 98, 102, 109, 114, 119, 130, 145, 151, 158, 177, 186, 203, 226, 249],
      [70, 79, 84, 90, 98, 102, 109, 114, 119, 130, 145, 151, 158, 177, 186, 203, 210, 232, 256],
      [75, 81, 93, 98, 103, 113, 121, 127, 132, 142, 154, 168, 174, 199, 207, 224, 234, 257, 280],
      [81, 89, 96, 103, 112, 124, 130, 137, 145, 154, 171, 183, 188, 217, 228, 247, 257, 280, 303],
      [86, 94, 103, 112, 124, 130, 137, 149, 159, 169, 185, 196, 207, 240, 251, 270, 284, 306, 330],
      [89, 100, 109, 121, 129, 137, 148, 161, 170, 180, 198, 212, 219, 261, 273, 292, 305, 329, 352],
      [93, 103, 114, 125, 136, 147, 158, 169, 180, 191, 213, 224, 235, 278, 294, 317, 329, 351, 375],
      [95, 107, 119, 129, 144, 157, 168, 177, 190, 202, 228, 236, 251, 297, 317, 343, 350, 373, 396],
      [98, 115, 124, 136, 151, 161, 175, 182, 196, 213, 242, 242, 258, 315, 325, 359, 364, 387, 410]
    ]
  }
};

// Product Configuration - Defines which products use which groups
const PRODUCT_CONFIG = {
  'Roller Blinds': {
    categories: ['Screen', 'Blockout'],
    hasGroups: true,
    groups: [1, 2, 3, 4],
    hasSizeInput: true
  },
  'Roman Blinds': {
    categories: ['Blockout', 'Coated Fabric', 'Fabric with Lining'],
    hasGroups: true,
    groups: [3, 4], // Only groups 3 and 4 for Roman Blinds
    hasSizeInput: true
  },
  'Vertical Blinds': {
    categories: ['Blockout'],
    hasGroups: true,
    groups: [1, 2, 3, 4],
    hasSizeInput: true
  }
};

/**
 * Round UP to the next band value
 * SECURITY: Input validation to prevent injection
 * @param {number} value - The measurement to round
 * @param {Array<number>} bands - Array of band values
 * @returns {number|null} - The rounded band value or null if invalid
 */
function roundUpToBand(value, bands) {
  // Input validation
  const numValue = parseFloat(value);
  
  if (isNaN(numValue) || numValue <= 0 || !Array.isArray(bands) || bands.length === 0) {
    return null;
  }
  
  // Find the next higher band
  for (let i = 0; i < bands.length; i++) {
    if (numValue <= bands[i]) {
      return bands[i];
    }
  }
  
  // If value exceeds all bands, return the highest band
  return bands[bands.length - 1];
}

/**
 * Get pricing table for a specific group
 * SECURITY: Validates group number to prevent object injection
 * @param {number} groupNumber - The pricing group (1-4)
 * @returns {Object|null} - The pricing table or null if invalid
 */
function getPricingTable(groupNumber) {
  // Strict validation - only accept integers 1-4
  const validGroups = [1, 2, 3, 4];
  
  if (!validGroups.includes(parseInt(groupNumber))) {
    return null;
  }
  
  const groupKey = `group${groupNumber}`;
  return PRICING_DATA[groupKey] || null;
}

/**
 * Get product configuration
 * SECURITY: Validates product name against whitelist
 * @param {string} productName - The product name
 * @returns {Object|null} - Product config or null if invalid
 */
function getProductConfig(productName) {
  // Whitelist check - only return if product exists in config
  if (!PRODUCT_CONFIG.hasOwnProperty(productName)) {
    return null;
  }
  
  return PRODUCT_CONFIG[productName];
}

// Freeze objects to prevent modification
Object.freeze(PRICING_DATA);
Object.freeze(PRODUCT_CONFIG);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PRICING_DATA,
    PRODUCT_CONFIG,
    roundUpToBand,
    getPricingTable,
    getProductConfig
  };
}

// Make functions globally available
window.PRICING_DATA = PRICING_DATA;
window.PRODUCT_CONFIG = PRODUCT_CONFIG;
window.roundUpToBand = roundUpToBand;
window.getPricingTable = getPricingTable;
window.getProductConfig = getProductConfig;