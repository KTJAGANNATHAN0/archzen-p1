// ui.js - DOM Manipulation and Event Handlers
// SECURITY: No innerHTML, uses textContent and DOM manipulation

const UI = (function() {
  'use strict';
  
  // Cache DOM elements
  const elements = {};
  
  /**
   * Initialize DOM element cache
   */
  function cacheDOMElements() {
    // Sections
    elements.customerSection = document.getElementById('customer-section');
    elements.itemsSection = document.getElementById('items-section');
    elements.reviewSection = document.getElementById('review-section');
    elements.quotationSection = document.getElementById('quotation-section');
    
    // Forms
    elements.customerForm = document.getElementById('customer-form');
    elements.itemForm = document.getElementById('item-form');
    
    // Customer inputs
    elements.customerName = document.getElementById('customer-name');
    elements.customerAddress = document.getElementById('customer-address');
    elements.customerPhone = document.getElementById('customer-phone');
    elements.customerEmail = document.getElementById('customer-email');
    
    // Item inputs
    elements.itemLocation = document.getElementById('item-location');
    elements.itemProduct = document.getElementById('item-product');
    elements.itemCategory = document.getElementById('item-category');
    elements.itemGroup = document.getElementById('item-group');
    elements.itemWidth = document.getElementById('item-width');
    elements.itemDrop = document.getElementById('item-drop');
    elements.itemQuantity = document.getElementById('item-quantity');
    
    // Other location
    elements.otherLocationGroup = document.getElementById('other-location-group');
    elements.otherLocationInput = document.getElementById('other-location-input');
    
    // Groups
    elements.categoryGroup = document.getElementById('category-group');
    elements.groupGroup = document.getElementById('group-group');
    
    // Hints
    elements.widthHint = document.getElementById('width-hint');
    elements.dropHint = document.getElementById('drop-hint');
    
    // Price preview
    elements.pricePreview = document.getElementById('price-preview');
    elements.unitPrice = document.getElementById('unit-price');
    elements.totalPrice = document.getElementById('total-price');
    
    // Buttons
    elements.itemBtnText = document.getElementById('item-btn-text');
    elements.cancelEditBtn = document.getElementById('cancel-edit-btn');
    elements.customerViewBtn = document.getElementById('customer-view-btn');
    elements.internalViewBtn = document.getElementById('internal-view-btn');
    elements.downloadQuoteBtn = document.getElementById('download-quote-btn');
    
    // Quotation
    elements.quotationContent = document.getElementById('quotation-content');
    
    // Progress steps
    elements.steps = document.querySelectorAll('.step');
  }
  
  /**
   * Update progress steps UI
   * @param {string} currentStep
   */
  function updateProgressSteps(currentStep) {
    elements.steps.forEach(step => {
      const stepName = step.getAttribute('data-step');
      if (stepName === currentStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
  }
  
  /**
   * Show specific section
   * @param {string} sectionName
   */
  function showSection(sectionName) {
    // Hide all sections
    const allSections = document.querySelectorAll('.section');
    allSections.forEach(section => section.classList.remove('active'));
    
    // Show requested section
    const sectionMap = {
      'customer': 'customer-section',
      'items': 'items-section',
      'review': 'review-section',
      'quotation': 'quotation-section'
    };
    
    const sectionId = sectionMap[sectionName];
    if (sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.classList.add('active');
      }
    }
    
    updateProgressSteps(sectionName);
  }
  
  /**
   * Populate customer form from state
   * @param {Object} customer
   */
  function populateCustomerForm(customer) {
    if (elements.customerName) elements.customerName.value = customer.name || '';
    if (elements.customerAddress) elements.customerAddress.value = customer.address || '';
    if (elements.customerPhone) elements.customerPhone.value = customer.phone || '';
    if (elements.customerEmail) elements.customerEmail.value = customer.email || '';
  }
  
  /**
   * Update product configuration UI (categories and groups)
   * @param {string} productName
   */
  function updateProductConfig(productName) {
    const config = window.getProductConfig(productName);
    
    if (!config) {
      elements.categoryGroup.style.display = 'none';
      elements.groupGroup.style.display = 'none';
      return;
    }
    
    // Update categories
    elements.categoryGroup.style.display = 'block';
    elements.itemCategory.innerHTML = '<option value="">Select category</option>';
    
    config.categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      elements.itemCategory.appendChild(option);
    });
    
    // Update groups
    if (config.hasGroups) {
      elements.groupGroup.style.display = 'block';
      elements.itemGroup.innerHTML = '<option value="">Select group</option>';
      
      config.groups.forEach(group => {
        const option = document.createElement('option');
        option.value = group.toString();
        option.textContent = `Group ${group}`;
        elements.itemGroup.appendChild(option);
      });
    } else {
      elements.groupGroup.style.display = 'none';
    }
  }
  
  /**
   * Handle location change - show/hide "Other" input
   */
  function handleLocationChange() {
    const location = elements.itemLocation.value;
    
    if (location === 'Other') {
      elements.otherLocationGroup.style.display = 'block';
      elements.otherLocationInput.required = true;
    } else {
      elements.otherLocationGroup.style.display = 'none';
      elements.otherLocationInput.required = false;
      elements.otherLocationInput.value = '';
    }
  }
  
  /**
   * Update band hints for width/drop
   */
  function updateBandHints() {
    const group = elements.itemGroup.value;
    const width = elements.itemWidth.value;
    const drop = elements.itemDrop.value;
    
    if (!group || !width || !drop) {
      elements.widthHint.textContent = '';
      elements.dropHint.textContent = '';
      return;
    }
    
    const pricingTable = window.getPricingTable(parseInt(group));
    if (!pricingTable) return;
    
    const widthBand = window.roundUpToBand(parseFloat(width), pricingTable.widthBands);
    const dropBand = window.roundUpToBand(parseFloat(drop), pricingTable.dropBands);
    
    if (widthBand) {
      elements.widthHint.textContent = `Rounds up to: ${widthBand}mm`;
    }
    
    if (dropBand) {
      elements.dropHint.textContent = `Rounds up to: ${dropBand}mm`;
    }
  }
  
  /**
   * Update price preview
   */
  function updatePricePreview() {
    const item = {
      width: elements.itemWidth.value,
      drop: elements.itemDrop.value,
      group: elements.itemGroup.value,
      quantity: elements.itemQuantity.value
    };
    
    const unitPrice = window.PriceCalculator.calculateUnitPrice(item);
    const totalPrice = unitPrice * (parseInt(item.quantity) || 1);
    
    if (unitPrice > 0) {
      elements.pricePreview.style.display = 'block';
      elements.unitPrice.textContent = unitPrice.toFixed(2);
      elements.totalPrice.textContent = totalPrice.toFixed(2);
    } else {
      elements.pricePreview.style.display = 'none';
    }
  }
  
  /**
   * Populate item form from existing item (for editing)
   * @param {Object} item
   */
  function populateItemForm(item) {
    elements.itemLocation.value = item.location;
    elements.itemProduct.value = item.product;
    
    updateProductConfig(item.product);
    
    setTimeout(() => {
      elements.itemCategory.value = item.category;
      elements.itemGroup.value = item.group;
      elements.itemWidth.value = item.width;
      elements.itemDrop.value = item.drop;
      elements.itemQuantity.value = item.quantity;
      
      const recessRadio = document.querySelector(`input[name="recess"][value="${item.recess}"]`);
      if (recessRadio) recessRadio.checked = true;
      
      updateBandHints();
      updatePricePreview();
    }, 50);
  }
  
  /**
   * Clear item form
   */
  function clearItemForm() {
    elements.itemForm.reset();
    elements.categoryGroup.style.display = 'none';
    elements.groupGroup.style.display = 'none';
    elements.pricePreview.style.display = 'none';
    elements.widthHint.textContent = '';
    elements.dropHint.textContent = '';
    elements.itemBtnText.textContent = 'Add Item';
    elements.cancelEditBtn.style.display = 'none';
  }
  
  /**
   * Render review table
   * @param {Array} items
   */
  function renderReviewTable(items) {
    const reviewTableBody = document.getElementById('review-table-body');
    const totals = window.PriceCalculator.calculateQuotationTotals(items);
    
    // Update totals
    document.getElementById('review-subtotal').textContent = totals.subtotal.toFixed(2);
    document.getElementById('review-gst').textContent = totals.gst.toFixed(2);
    document.getElementById('review-total').textContent = totals.total.toFixed(2);
    
    // Clear table
    reviewTableBody.innerHTML = '';
    
    // Add rows
    items.forEach((item, index) => {
      const row = document.createElement('tr');
      
      // Create cells
      const cells = [
        index + 1,
        item.location,
        item.product,
        item.category,
        `${item.width}→${item.widthBand} × ${item.drop}→${item.dropBand}mm`,
        item.quantity,
        `$${item.totalPrice.toFixed(2)}`
      ];
      
      cells.forEach(content => {
        const td = document.createElement('td');
        td.textContent = content;
        row.appendChild(td);
      });
      
      // Actions cell
      const actionsTd = document.createElement('td');
      actionsTd.className = 'action-buttons';
      
      // Edit button
      const editBtn = document.createElement('button');
      editBtn.className = 'btn-icon btn-edit';
      editBtn.innerHTML = '✏️';
      editBtn.title = 'Edit';
      editBtn.onclick = () => {
        AppState.setStep('items');
        showSection('items');
        handleEditItem(index);
      };
      
      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn-icon btn-delete';
      deleteBtn.innerHTML = '🗑️';
      deleteBtn.title = 'Delete';
      deleteBtn.onclick = () => {
        if (confirm('Delete this item?')) {
          handleDeleteItem(index);
          const updatedItems = AppState.getItems();
          if (updatedItems.length > 0) {
            renderReviewTable(updatedItems);
          } else {
            AppState.setStep('items');
            showSection('items');
            alert('No items remaining. Please add items.');
          }
        }
      };
      
      actionsTd.appendChild(editBtn);
      actionsTd.appendChild(deleteBtn);
      row.appendChild(actionsTd);
      
      reviewTableBody.appendChild(row);
    });
  }
  
  /**
   * Render quotation
   * @param {Object} data
   */
  function renderQuotation(data) {
    const { customer, items, totals, quoteNumber, viewMode } = data;
    
    const html = window.QuotationGenerator.generateQuotationHTML(
      customer,
      items,
      totals,
      quoteNumber,
      viewMode
    );
    
    elements.quotationContent.innerHTML = html;
  }
  
  /**
   * Update view toggle buttons
   * @param {string} viewMode
   */
  function updateViewToggle(viewMode) {
    if (viewMode === 'customer') {
      elements.customerViewBtn.classList.add('active');
      elements.internalViewBtn.classList.remove('active');
    } else {
      elements.customerViewBtn.classList.remove('active');
      elements.internalViewBtn.classList.add('active');
    }
  }
  
  /**
   * Handle edit item
   * @param {number} index
   */
  function handleEditItem(index) {
    const item = AppState.getItem(index);
    if (!item) return;
    
    AppState.setEditingIndex(index);
    populateItemForm(item);
    elements.itemBtnText.textContent = 'Update Item';
    elements.cancelEditBtn.style.display = 'block';
    
    // Scroll to form
    elements.itemForm.scrollIntoView({ behavior: 'smooth' });
  }
  
  /**
   * Handle delete item
   * @param {number} index
   */
  function handleDeleteItem(index) {
    AppState.deleteItem(index);
  }
  
  // Public API
  return {
    init() {
      cacheDOMElements();
    },
    
    showSection,
    populateCustomerForm,
    updateProductConfig,
    handleLocationChange,
    updateBandHints,
    updatePricePreview,
    populateItemForm,
    clearItemForm,
    renderReviewTable,
    renderQuotation,
    updateViewToggle,
    handleEditItem,
    handleDeleteItem,
    
    // Expose elements for direct access if needed
    elements
  };
})();

// Freeze to prevent modification
Object.freeze(UI);

// Make globally available
window.UI = UI;