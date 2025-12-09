/* ==========================================================================
   CATEGORY PAGE JAVASCRIPT
   Complete functionality for Category Index page
   ========================================================================== */

/* ==========================================================================
   SECTION 1: PAGINATION STATE & CONFIGURATION
   Manages pagination state and settings
   ========================================================================== */
const paginationState = {
    currentPage: 1,
    itemsPerPage: 10,
    allRows: [],
    sortColumn: null,
    sortDirection: 'asc'
};

/* ==========================================================================
   SECTION 2: INITIALIZATION
   Sets up all functionality when page loads
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function () {
    console.log('Category page loaded - Initializing...');
    initializePagination();
    setupSortingHandlers();
    setupDeleteHandlers();
    console.log('Initialization complete');
});

/* ==========================================================================
   SECTION 3: PAGINATION LOGIC
   Handles displaying 10 items per page with navigation
   ========================================================================== */

/**
 * Initialize pagination system
 * Collects all table rows and displays first page
 */
function initializePagination() {
    const tableBody = document.getElementById('tableBody');
    if (!tableBody) {
        console.warn('Table body not found - skipping pagination');
        return;
    }

    paginationState.allRows = Array.from(tableBody.querySelectorAll('tr'));
    const totalPages = Math.ceil(paginationState.allRows.length / paginationState.itemsPerPage);

    console.log(`Pagination initialized: ${paginationState.allRows.length} items, ${totalPages} pages`);

    displayPage(paginationState.currentPage);
    updatePaginationControls(totalPages);
}

/**
 * Display specific page of results
 * @param {number} pageNum - Page number to display (1-indexed)
 */
function displayPage(pageNum) {
    const start = (pageNum - 1) * paginationState.itemsPerPage;
    const end = start + paginationState.itemsPerPage;
    const visibleRows = paginationState.allRows.slice(start, end);

    // Hide all rows
    paginationState.allRows.forEach(row => {
        row.style.display = 'none';
        row.classList.remove('fade-in');
    });

    // Show current page rows with staggered animation
    visibleRows.forEach((row, index) => {
        row.style.display = '';
        setTimeout(() => row.classList.add('fade-in'), index * 30);
    });

    // Update pagination info text
    const itemsShown = Math.min(end, paginationState.allRows.length);
    document.getElementById('itemsShown').textContent = itemsShown;
    document.getElementById('currentPage').textContent = pageNum;
}

/**
 * Update pagination button states
 * @param {number} totalPages - Total number of pages
 */
function updatePaginationControls(totalPages) {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const totalPagesSpan = document.getElementById('totalPages');

    if (!prevBtn || !nextBtn || !totalPagesSpan) return;

    totalPagesSpan.textContent = totalPages;

    // Disable/enable buttons
    prevBtn.disabled = paginationState.currentPage === 1;
    nextBtn.disabled = paginationState.currentPage === totalPages;

    // Visual feedback
    prevBtn.classList.toggle('disabled', paginationState.currentPage === 1);
    nextBtn.classList.toggle('disabled', paginationState.currentPage === totalPages);
}

/**
 * Navigate to previous page
 */
function previousPage() {
    const totalPages = Math.ceil(paginationState.allRows.length / paginationState.itemsPerPage);
    if (paginationState.currentPage > 1) {
        paginationState.currentPage--;
        displayPage(paginationState.currentPage);
        updatePaginationControls(totalPages);
    }
}

/**
 * Navigate to next page
 */
function nextPage() {
    const totalPages = Math.ceil(paginationState.allRows.length / paginationState.itemsPerPage);
    if (paginationState.currentPage < totalPages) {
        paginationState.currentPage++;
        displayPage(paginationState.currentPage);
        updatePaginationControls(totalPages);
    }
}

/* ==========================================================================
   SECTION 4: SORTING FUNCTIONALITY
   Handles column sorting with visual indicators
   ========================================================================== */

/**
 * Setup click handlers for sortable columns
 */
function setupSortingHandlers() {
    document.querySelectorAll('th.sortable').forEach(header => {
        header.addEventListener('click', function () {
            const columnIndex = parseInt(this.dataset.column);
            sortTable(columnIndex, this);
        });
    });
    console.log('Sorting handlers attached');
}

/**
 * Sort table by column
 * @param {number} columnIndex - Column index to sort by
 * @param {HTMLElement} headerElement - Header element clicked
 */
function sortTable(columnIndex, headerElement) {
    // Toggle sort direction
    const isCurrentSort = paginationState.sortColumn === columnIndex;
    paginationState.sortDirection = isCurrentSort && paginationState.sortDirection === 'asc' ? 'desc' : 'asc';
    paginationState.sortColumn = columnIndex;

    console.log(`Sorting column ${columnIndex} in ${paginationState.sortDirection} order`);

    // Clear other sort indicators
    document.querySelectorAll('.sort-arrow').forEach(arrow => arrow.textContent = '');

    // Set current sort indicator
    const arrow = headerElement.querySelector('.sort-arrow');
    arrow.textContent = paginationState.sortDirection === 'asc' ? '▲' : '▼';

    // Sort rows
    paginationState.allRows.sort((rowA, rowB) => {
        const textA = rowA.cells[columnIndex].textContent.trim();
        const textB = rowB.cells[columnIndex].textContent.trim();
        const comparison = textA.localeCompare(textB);
        return paginationState.sortDirection === 'asc' ? comparison : -comparison;
    });

    // Reset to page 1 after sort
    paginationState.currentPage = 1;
    displayPage(paginationState.currentPage);
    const totalPages = Math.ceil(paginationState.allRows.length / paginationState.itemsPerPage);
    updatePaginationControls(totalPages);
}

/* ==========================================================================
   SECTION 5: DELETE FUNCTIONALITY
   Handles category deletion with confirmation modal
   ========================================================================== */

// Delete state variables
let deleteUrl = '';
let currentCategoryId = null;

/**
 * Setup delete button handlers using event delegation
 */
function setupDeleteHandlers() {
    const tableBody = document.getElementById('tableBody');
    if (!tableBody) {
        console.warn('Table body not found - skipping delete handlers');
        return;
    }

    // Event delegation for delete buttons
    tableBody.addEventListener('click', function (e) {
        const deleteBtn = e.target.closest('.delete-btn');
        if (deleteBtn) {
            e.preventDefault();
            e.stopPropagation();

            const categoryId = deleteBtn.getAttribute('data-id');
            const categoryName = deleteBtn.getAttribute('data-name');

            console.log('Delete clicked:', categoryId, categoryName);

            if (categoryId && categoryName) {
                showDeleteModal(categoryId, categoryName);
            }
        }
    });

    console.log('Delete handlers attached');
}

/**
 * Show delete confirmation modal
 * @param {string} categoryId - Category ID to delete
 * @param {string} categoryName - Category name for display
 */
window.showDeleteModal = function (categoryId, categoryName) {
    console.log('showDeleteModal called for:', categoryName);

    const modal = document.getElementById('deleteModal');
    const nameElement = document.getElementById('categoryName');

    if (!modal) {
        console.error('Modal element not found');
        return;
    }
    if (!nameElement) {
        console.error('Category name element not found');
        return;
    }

    // Store delete information
    currentCategoryId = categoryId;
    nameElement.textContent = categoryName;
    deleteUrl = '/Category/Delete/' + categoryId;

    console.log('Delete URL:', deleteUrl);

    // Show modal
    modal.style.display = 'flex';
    modal.style.opacity = '1';
    document.body.style.overflow = 'hidden';

    console.log('Modal displayed');
};

/**
 * Close delete confirmation modal
 */
window.closeDeleteModal = function () {
    console.log('Closing modal');

    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    // Clear delete state
    currentCategoryId = null;
    deleteUrl = '';
};

/**
 * Confirm and execute delete operation
 */
window.confirmDelete = function () {
    console.log('=== CONFIRM DELETE CALLED ===');
    console.log('Delete URL:', deleteUrl);
    console.log('Category ID:', currentCategoryId);

    if (!deleteUrl || !currentCategoryId) {
        console.error('Invalid delete state');
        alert('Error: Invalid category');
        closeDeleteModal();
        return;
    }

    // Get CSRF token
    const token = document.querySelector('input[name="__RequestVerificationToken"]')?.value;
    console.log('CSRF Token:', token ? 'Found' : 'Not found');

    // Disable button during request
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Deleting...';
    }

    console.log('Sending DELETE request...');

    // Send delete request
    fetch(deleteUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: token ? `__RequestVerificationToken=${encodeURIComponent(token)}` : ''
    })
        .then(response => {
            console.log('Response received:', response.status, response.statusText);

            if (response.ok || response.status === 200 || response.status === 204) {
                console.log('Delete successful - reloading page');
                closeDeleteModal();
                location.reload();
            } else {
                return response.text().then(text => {
                    throw new Error(`Delete failed: ${response.status} - ${text.substring(0, 100)}`);
                });
            }
        })
        .catch(error => {
            console.error('Delete error:', error);
            alert('Error deleting category: ' + error.message);

            // Re-enable button
            if (confirmBtn) {
                confirmBtn.disabled = false;
                confirmBtn.textContent = 'Delete';
            }
        });
};

/* ==========================================================================
   SECTION 6: MODAL EVENT HANDLERS
   Handles modal closing via escape key and outside clicks
   ========================================================================== */

// Close modal on escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('deleteModal');
        if (modal && modal.style.display === 'flex') {
            closeDeleteModal();
        }
    }
});

// Close modal when clicking outside
document.addEventListener('click', function (e) {
    const modal = document.getElementById('deleteModal');
    if (e.target === modal && modal.style.display === 'flex') {
        closeDeleteModal();
    }
});

/* ==========================================================================
   SECTION 7: UTILITY FUNCTIONS
   Helper functions for the category page
   ========================================================================== */

/**
 * Log current pagination state (for debugging)
 */
function logPaginationState() {
    console.log('Pagination State:', {
        currentPage: paginationState.currentPage,
        itemsPerPage: paginationState.itemsPerPage,
        totalRows: paginationState.allRows.length,
        sortColumn: paginationState.sortColumn,
        sortDirection: paginationState.sortDirection
    });
}

// Make utility functions available globally
window.previousPage = previousPage;
window.nextPage = nextPage;
window.logPaginationState = logPaginationState;

console.log('Category.js loaded successfully');
