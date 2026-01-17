// state.js - Centralized State Management
// SECURITY: Immutable state pattern, input sanitization

const AppState = (function() {
  'use strict';
  
  // Private state object
  let state = {
    customer: {
      name: '',
      address: '',
      phone: '',
      email: ''
    },
    items: [],
    currentStep: 'customer',
    quoteNumber: generateQuoteNumber(),
    editingIndex: null,
    viewMode: 'customer' // 'customer' or 'internal'
  };
  
  // Listeners for state changes
  const listeners = [];
  
  /**
   * Generate unique quote number
   * @returns {string}
   */
  function generateQuoteNumber() {
    const timestamp = Date.now().toString().slice(-6);
    return `QU${timestamp}`;
  }
  
  /**
   * Sanitize string input - prevents XSS
   * @param {string} input
   * @returns {string}
   */
  function sanitizeString(input) {
    if (typeof input !== 'string') {
      return '';
    }
    
    // Remove HTML tags and dangerous characters
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .trim();
  }
  
  /**
   * Sanitize number input
   * @param {any} input
   * @returns {number}
   */
  function sanitizeNumber(input) {
    const num = parseFloat(input);
    return isNaN(num) || num < 0 ? 0 : num;
  }
  
  /**
   * Validate customer data
   * @param {Object} customer
   * @returns {boolean}
   */
  function validateCustomer(customer) {
    return customer &&
           typeof customer.name === 'string' && customer.name.trim() !== '' &&
           typeof customer.address === 'string' && customer.address.trim() !== '' &&
           typeof customer.phone === 'string' && customer.phone.trim() !== '';
  }
  
  /**
   * Validate item data
   * @param {Object} item
   * @returns {boolean}
   */
  function validateItem(item) {
    return item &&
           typeof item.location === 'string' && item.location.trim() !== '' &&
           typeof item.product === 'string' && item.product.trim() !== '' &&
           typeof item.category === 'string' && item.category.trim() !== '' &&
           typeof item.group === 'string' && item.group.trim() !== '' &&
           sanitizeNumber(item.width) > 0 &&
           sanitizeNumber(item.drop) > 0 &&
           sanitizeNumber(item.quantity) > 0;
  }
  
  /**
   * Notify all listeners of state change
   */
  function notifyListeners() {
    listeners.forEach(callback => {
      try {
        callback(getState());
      } catch (error) {
        console.error('Listener error:', error);
      }
    });
  }
  
  return {
    /**
     * Get current state (immutable copy)
     * @returns {Object}
     */
    getState() {
      return JSON.parse(JSON.stringify(state));
    },
    
    /**
     * Subscribe to state changes
     * @param {Function} callback
     */
    subscribe(callback) {
      if (typeof callback === 'function') {
        listeners.push(callback);
      }
    },
    
    /**
     * Set customer data
     * @param {Object} customerData
     */
    setCustomer(customerData) {
      if (!validateCustomer(customerData)) {
        throw new Error('Invalid customer data');
      }
      
      state.customer = {
        name: sanitizeString(customerData.name),
        address: sanitizeString(customerData.address),
        phone: sanitizeString(customerData.phone),
        email: sanitizeString(customerData.email || '')
      };
      
      notifyListeners();
    },
    
    /**
     * Get customer data
     * @returns {Object}
     */
    getCustomer() {
      return { ...state.customer };
    },
    
    /**
     * Add item to list
     * @param {Object} item
     */
    addItem(item) {
      if (!validateItem(item)) {
        throw new Error('Invalid item data');
      }
      
      const sanitizedItem = {
        location: sanitizeString(item.location),
        product: sanitizeString(item.product),
        category: sanitizeString(item.category),
        group: sanitizeString(item.group),
        width: sanitizeNumber(item.width),
        drop: sanitizeNumber(item.drop),
        widthBand: sanitizeNumber(item.widthBand),
        dropBand: sanitizeNumber(item.dropBand),
        quantity: Math.max(1, Math.floor(sanitizeNumber(item.quantity))),
        recess: sanitizeString(item.recess),
        unitPrice: sanitizeNumber(item.unitPrice),
        totalPrice: sanitizeNumber(item.totalPrice)
      };
      
      state.items.push(sanitizedItem);
      notifyListeners();
    },
    
    /**
     * Update item at index
     * @param {number} index
     * @param {Object} item
     */
    updateItem(index, item) {
      if (!Number.isInteger(index) || index < 0 || index >= state.items.length) {
        throw new Error('Invalid item index');
      }
      
      if (!validateItem(item)) {
        throw new Error('Invalid item data');
      }
      
      const sanitizedItem = {
        location: sanitizeString(item.location),
        product: sanitizeString(item.product),
        category: sanitizeString(item.category),
        group: sanitizeString(item.group),
        width: sanitizeNumber(item.width),
        drop: sanitizeNumber(item.drop),
        widthBand: sanitizeNumber(item.widthBand),
        dropBand: sanitizeNumber(item.dropBand),
        quantity: Math.max(1, Math.floor(sanitizeNumber(item.quantity))),
        recess: sanitizeString(item.recess),
        unitPrice: sanitizeNumber(item.unitPrice),
        totalPrice: sanitizeNumber(item.totalPrice)
      };
      
      state.items[index] = sanitizedItem;
      notifyListeners();
    },
    
    /**
     * Delete item at index
     * @param {number} index
     */
    deleteItem(index) {
      if (!Number.isInteger(index) || index < 0 || index >= state.items.length) {
        throw new Error('Invalid item index');
      }
      
      state.items.splice(index, 1);
      notifyListeners();
    },
    
    /**
     * Get all items
     * @returns {Array}
     */
    getItems() {
      return [...state.items];
    },
    
    /**
     * Get item at index
     * @param {number} index
     * @returns {Object|null}
     */
    getItem(index) {
      if (!Number.isInteger(index) || index < 0 || index >= state.items.length) {
        return null;
      }
      return { ...state.items[index] };
    },
    
    /**
     * Set current step
     * @param {string} step
     */
    setStep(step) {
      const validSteps = ['customer', 'items', 'review', 'quotation'];
      if (!validSteps.includes(step)) {
        throw new Error('Invalid step');
      }
      
      state.currentStep = step;
      notifyListeners();
    },
    
    /**
     * Get current step
     * @returns {string}
     */
    getStep() {
      return state.currentStep;
    },
    
    /**
     * Set editing index
     * @param {number|null} index
     */
    setEditingIndex(index) {
      if (index !== null && (!Number.isInteger(index) || index < 0)) {
        throw new Error('Invalid editing index');
      }
      
      state.editingIndex = index;
      notifyListeners();
    },
    
    /**
     * Get editing index
     * @returns {number|null}
     */
    getEditingIndex() {
      return state.editingIndex;
    },
    
    /**
     * Set view mode
     * @param {string} mode
     */
    setViewMode(mode) {
      const validModes = ['customer', 'internal'];
      if (!validModes.includes(mode)) {
        throw new Error('Invalid view mode');
      }
      
      state.viewMode = mode;
      notifyListeners();
    },
    
    /**
     * Get view mode
     * @returns {string}
     */
    getViewMode() {
      return state.viewMode;
    },
    
    /**
     * Get quote number
     * @returns {string}
     */
    getQuoteNumber() {
      return state.quoteNumber;
    },
    
    /**
     * Reset state (for testing or clearing data)
     */
    reset() {
      state = {
        customer: {
          name: '',
          address: '',
          phone: '',
          email: ''
        },
        items: [],
        currentStep: 'customer',
        quoteNumber: generateQuoteNumber(),
        editingIndex: null,
        viewMode: 'customer'
      };
      
      notifyListeners();
    }
  };
})();

// Prevent state object modification from outside
Object.freeze(AppState);

// Make globally available
window.AppState = AppState;