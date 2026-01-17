// app.js - Application Bootstrap and Event Handlers
// SECURITY: Event delegation, input validation, CSP-compliant

(function() {
  'use strict';
  
  /**
   * Initialize the application
   */
  function init() {
    // Initialize UI
    window.UI.init();
    
    // Subscribe to state changes
    window.AppState.subscribe(handleStateChange);
    
    // Attach event listeners
    attachEventListeners();
    
    // Initial render
    window.UI.showSection('customer');
    
    console.log('✅ CPQ System initialized successfully');
  }
  
  /**
   * Handle state changes
   * @param {Object} state
   */
  function handleStateChange(state) {
    console.log('📊 State changed:', state);
    
    // Update items count in continue button
    const itemsCount = state.items.length;
    const continueBtn = document.getElementById('continue-to-review');
    const countSpan = document.getElementById('items-added-count');
    
    console.log('📦 Items count:', itemsCount);
    
    if (continueBtn && countSpan) {
      if (itemsCount > 0) {
        continueBtn.style.display = 'block';
        countSpan.textContent = itemsCount;
        console.log('✅ Continue button SHOWN');
      } else {
        continueBtn.style.display = 'none';
        console.log('❌ Continue button HIDDEN');
      }
    } else {
      console.error('❌ Continue button elements not found!');
    }
  }
  
  /**
   * Attach all event listeners
   */
  function attachEventListeners() {
    const elements = window.UI.elements;
    
    // Customer form submission
    elements.customerForm.addEventListener('submit', handleCustomerSubmit);
    
    // Item form submission
    elements.itemForm.addEventListener('submit', handleItemSubmit);
    
    // Location change - show/hide "Other" input
    elements.itemLocation.addEventListener('change', () => {
      window.UI.handleLocationChange();
    });
    
    // Product change - update categories/groups
    elements.itemProduct.addEventListener('change', handleProductChange);
    
    // Width/Drop change - update hints and price
    elements.itemWidth.addEventListener('input', handleSizeChange);
    elements.itemDrop.addEventListener('input', handleSizeChange);
    elements.itemGroup.addEventListener('change', handleSizeChange);
    elements.itemQuantity.addEventListener('input', handleQuantityChange);
    
    // Cancel edit button
    elements.cancelEditBtn.addEventListener('click', handleCancelEdit);
    
    // Continue to review button
    const reviewBtn = document.getElementById('review-items-btn');
    if (reviewBtn) {
      reviewBtn.addEventListener('click', handleContinueToReview);
    }
    
    // Generate quotation button
    const generateBtn = document.getElementById('generate-quote-btn');
    if (generateBtn) {
      generateBtn.addEventListener('click', handleGenerateQuotation);
    }
    
    // View toggle buttons
    elements.customerViewBtn.addEventListener('click', () => handleViewToggle('customer'));
    elements.internalViewBtn.addEventListener('click', () => handleViewToggle('internal'));
    
    // Navigation buttons
    const backToItemsBtn = document.getElementById('back-to-items-btn');
    if (backToItemsBtn) {
      backToItemsBtn.addEventListener('click', handleBackToItems);
    }
    
    const backToReviewBtn = document.getElementById('back-to-review-btn');
    if (backToReviewBtn) {
      backToReviewBtn.addEventListener('click', handleBackToReview);
    }
    
    // Download and Send buttons
    elements.downloadQuoteBtn.addEventListener('click', handleDownloadQuotation);
    
    const sendBtn = document.getElementById('send-quote-btn');
    if (sendBtn) {
      sendBtn.addEventListener('click', handleSendQuotation);
    }
    
    console.log('✅ All event listeners attached');
  }
  
  /**
   * Handle customer form submission
   * @param {Event} e
   */
  function handleCustomerSubmit(e) {
    e.preventDefault();
    
    try {
      const elements = window.UI.elements;
      
      const customerData = {
        name: elements.customerName.value.trim(),
        address: elements.customerAddress.value.trim(),
        phone: elements.customerPhone.value.trim(),
        email: elements.customerEmail.value.trim()
      };
      
      // Validate
      if (!customerData.name || !customerData.address || !customerData.phone) {
        alert('Please fill in all required fields');
        return;
      }
      
      // Save to state
      window.AppState.setCustomer(customerData);
      
      // Move to next step
      window.AppState.setStep('items');
      window.UI.showSection('items');
      
      console.log('✅ Customer saved, moved to items');
      
    } catch (error) {
      console.error('❌ Customer submission error:', error);
      alert('Error saving customer data. Please try again.');
    }
  }
  
  /**
   * Handle item form submission
   * @param {Event} e
   */
  function handleItemSubmit(e) {
    e.preventDefault();
    
    try {
      const elements = window.UI.elements;
      
      // Get recess value
      const recessRadio = document.querySelector('input[name="recess"]:checked');
      const recess = recessRadio ? recessRadio.value : 'Face fit';
      
      // Get location - use custom if "Other" selected
      let location = elements.itemLocation.value;
      if (location === 'Other') {
        const customLocation = elements.otherLocationInput.value.trim();
        if (!customLocation) {
          alert('Please specify the location name');
          return;
        }
        location = customLocation;
      }
      
      // Get form data
      const itemData = {
        location: location,
        product: elements.itemProduct.value,
        category: elements.itemCategory.value,
        group: elements.itemGroup.value,
        width: parseFloat(elements.itemWidth.value),
        drop: parseFloat(elements.itemDrop.value),
        quantity: parseInt(elements.itemQuantity.value),
        recess: recess
      };
      
      console.log('📝 Item data:', itemData);
      
      // Calculate band data
      const bandData = window.PriceCalculator.calculateBandData(itemData);
      itemData.widthBand = bandData.widthBand;
      itemData.dropBand = bandData.dropBand;
      
      // Calculate prices
      itemData.unitPrice = window.PriceCalculator.calculateUnitPrice(itemData);
      itemData.totalPrice = window.PriceCalculator.calculateItemTotal({
        unitPrice: itemData.unitPrice,
        quantity: itemData.quantity
      });
      
      console.log('💰 Calculated price:', itemData.unitPrice);
      
      // Validate
      if (itemData.unitPrice === 0) {
        alert('Unable to calculate price. Please check your inputs.');
        return;
      }
      
      // Check if editing
      const editingIndex = window.AppState.getEditingIndex();
      
      if (editingIndex !== null) {
        // Update existing item
        window.AppState.updateItem(editingIndex, itemData);
        window.AppState.setEditingIndex(null);
        console.log('✅ Item updated at index:', editingIndex);
      } else {
        // Add new item
        window.AppState.addItem(itemData);
        console.log('✅ Item added to state');
      }
      
      // Clear form
      window.UI.clearItemForm();
      
      // FORCE show continue button
      const continueBtn = document.getElementById('continue-to-review');
      const countSpan = document.getElementById('items-added-count');
      const items = window.AppState.getItems();
      
      console.log('🔄 After add - items count:', items.length);
      
      if (continueBtn && countSpan) {
        continueBtn.style.display = 'block';
        countSpan.textContent = items.length;
        console.log('✅ FORCED button display');
        
        // Scroll to button
        setTimeout(() => {
          continueBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
      
      // Show success message
      alert('✅ Item added successfully! Total items: ' + items.length);
      
    } catch (error) {
      console.error('❌ Item submission error:', error);
      alert('Error saving item: ' + error.message);
    }
  }
  
  /**
   * Handle product change
   */
  function handleProductChange() {
    const elements = window.UI.elements;
    const product = elements.itemProduct.value;
    window.UI.updateProductConfig(product);
    
    // Reset dependent fields
    elements.itemCategory.value = '';
    elements.itemGroup.value = '';
    elements.widthHint.textContent = '';
    elements.dropHint.textContent = '';
    elements.pricePreview.style.display = 'none';
  }
  
  /**
   * Handle size change (width/drop/group)
   */
  function handleSizeChange() {
    window.UI.updateBandHints();
    window.UI.updatePricePreview();
  }
  
  /**
   * Handle quantity change
   */
  function handleQuantityChange() {
    window.UI.updatePricePreview();
  }
  
  /**
   * Handle cancel edit
   */
  function handleCancelEdit() {
    window.AppState.setEditingIndex(null);
    window.UI.clearItemForm();
  }
  
  /**
   * Handle continue to review
   */
  function handleContinueToReview() {
    const items = window.AppState.getItems();
    
    console.log('📋 Continue to review clicked, items:', items.length);
    
    if (items.length === 0) {
      alert('Please add at least one item before continuing.');
      return;
    }
    
    // Render review table
    window.UI.renderReviewTable(items);
    
    // Show review section
    window.AppState.setStep('review');
    window.UI.showSection('review');
    
    console.log('✅ Moved to review screen');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  /**
   * Handle generate quotation
   */
  function handleGenerateQuotation() {
    const items = window.AppState.getItems();
    
    if (items.length === 0) {
      alert('Please add at least one item before generating quotation.');
      return;
    }
    
    // Calculate totals
    const totals = window.PriceCalculator.calculateQuotationTotals(items);
    
    // Render quotation
    window.UI.renderQuotation({
      customer: window.AppState.getCustomer(),
      items: items,
      totals: totals,
      quoteNumber: window.AppState.getQuoteNumber(),
      viewMode: window.AppState.getViewMode()
    });
    
    // Show quotation section
    window.AppState.setStep('quotation');
    window.UI.showSection('quotation');
    
    console.log('✅ Quotation generated');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  /**
   * Handle view toggle
   * @param {string} mode
   */
  function handleViewToggle(mode) {
    window.AppState.setViewMode(mode);
    window.UI.updateViewToggle(mode);
    
    // Re-render quotation
    const items = window.AppState.getItems();
    const totals = window.PriceCalculator.calculateQuotationTotals(items);
    
    window.UI.renderQuotation({
      customer: window.AppState.getCustomer(),
      items: items,
      totals: totals,
      quoteNumber: window.AppState.getQuoteNumber(),
      viewMode: mode
    });
  }
  
  /**
   * Handle back to items
   */
  function handleBackToItems() {
    window.AppState.setStep('items');
    window.UI.showSection('items');
  }
  
  /**
   * Handle back to review
   */
  function handleBackToReview() {
    const items = window.AppState.getItems();
    window.UI.renderReviewTable(items);
    window.AppState.setStep('review');
    window.UI.showSection('review');
  }
  
  /**
   * Handle download quotation
   */
  function handleDownloadQuotation() {
    try {
      const items = window.AppState.getItems();
      const totals = window.PriceCalculator.calculateQuotationTotals(items);
      const customer = window.AppState.getCustomer();
      const quoteNumber = window.AppState.getQuoteNumber();
      const viewMode = window.AppState.getViewMode();
      
      const html = window.QuotationGenerator.generateQuotationHTML(
        customer,
        items,
        totals,
        quoteNumber,
        viewMode
      );
      
      // Create filename from customer name
      const customerName = customer.name.trim() || 'Customer';
      const safeCustomerName = customerName.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `${safeCustomerName}_Quote_${quoteNumber}`;
      
      console.log('📥 Downloading PDF as:', filename);
      
      window.QuotationGenerator.downloadQuotation(html, filename);
      
    } catch (error) {
      console.error('Download error:', error);
      alert('Error downloading quotation. Please try again.');
    }
  }
  
  /**
   * Handle send quotation
   */
  function handleSendQuotation() {
    try {
      const items = window.AppState.getItems();
      const totals = window.PriceCalculator.calculateQuotationTotals(items);
      const customer = window.AppState.getCustomer();
      const quoteNumber = window.AppState.getQuoteNumber();
      
      const payload = window.QuotationGenerator.generateN8nPayload(
        customer,
        items,
        totals,
        quoteNumber
      );
      
      // TODO: Replace with your actual n8n webhook URL
      const n8nWebhookUrl = 'YOUR_N8N_WEBHOOK_URL_HERE';
      
      // Show payload in console for testing
      console.log('📤 n8n Payload:', JSON.stringify(payload, null, 2));
      
      alert('✅ Send functionality ready!\n\nPayload logged to console (F12).\nUpdate webhook URL in app.js to enable sending via n8n.');
      
    } catch (error) {
      console.error('Send error:', error);
      alert('Error preparing quotation data.');
    }
  }
  
  // Initialize app when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();