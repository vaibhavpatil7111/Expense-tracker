/* ==========================================================================
   TRANSACTION PAGE JAVASCRIPT
   ========================================================================== */

const paginationState = {
    currentPage: 1,
    itemsPerPage: 10,
    allRows: [],
    sortColumn: null,
    sortDirection: 'asc'
};

document.addEventListener('DOMContentLoaded', function () {
    initializePagination();
    setupSortingHandlers();
    setupDeleteHandlers();
});

function initializePagination() {
    const tableBody = document.getElementById('tableBody');
    if (!tableBody) return;

    paginationState.allRows = Array.from(tableBody.querySelectorAll('tr'));
    const totalPages = Math.ceil(paginationState.allRows.length / paginationState.itemsPerPage);

    displayPage(paginationState.currentPage);
    updatePaginationControls(totalPages);
}

function displayPage(pageNum) {
    const start = (pageNum - 1) * paginationState.itemsPerPage;
    const end = start + paginationState.itemsPerPage;
    const visibleRows = paginationState.allRows.slice(start, end);

    paginationState.allRows.forEach(row => {
        row.style.display = 'none';
        row.classList.remove('fade-in');
    });

    visibleRows.forEach((row, index) => {
        row.style.display = '';
        setTimeout(() => row.classList.add('fade-in'), index * 30);
    });

    const itemsShown = Math.min(end, paginationState.allRows.length);
    document.getElementById('itemsShown').textContent = itemsShown;
    document.getElementById('currentPage').textContent = pageNum;
}

function updatePaginationControls(totalPages) {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const totalPagesSpan = document.getElementById('totalPages');

    if (!prevBtn || !nextBtn || !totalPagesSpan) return;

    totalPagesSpan.textContent = totalPages;
    prevBtn.disabled = paginationState.currentPage === 1;
    nextBtn.disabled = paginationState.currentPage === totalPages;
    prevBtn.classList.toggle('disabled', paginationState.currentPage === 1);
    nextBtn.classList.toggle('disabled', paginationState.currentPage === totalPages);
}

function previousPage() {
    const totalPages = Math.ceil(paginationState.allRows.length / paginationState.itemsPerPage);
    if (paginationState.currentPage > 1) {
        paginationState.currentPage--;
        displayPage(paginationState.currentPage);
        updatePaginationControls(totalPages);
    }
}

function nextPage() {
    const totalPages = Math.ceil(paginationState.allRows.length / paginationState.itemsPerPage);
    if (paginationState.currentPage < totalPages) {
        paginationState.currentPage++;
        displayPage(paginationState.currentPage);
        updatePaginationControls(totalPages);
    }
}

function setupSortingHandlers() {
    document.querySelectorAll('th.sortable').forEach(header => {
        header.addEventListener('click', function () {
            const columnIndex = parseInt(this.dataset.column);
            sortTable(columnIndex, this);
        });
    });
}

function sortTable(columnIndex, headerElement) {
    const isCurrentSort = paginationState.sortColumn === columnIndex;
    paginationState.sortDirection = isCurrentSort && paginationState.sortDirection === 'asc' ? 'desc' : 'asc';
    paginationState.sortColumn = columnIndex;

    document.querySelectorAll('.sort-arrow').forEach(arrow => arrow.textContent = '');
    const arrow = headerElement.querySelector('.sort-arrow');
    arrow.textContent = paginationState.sortDirection === 'asc' ? '▲' : '▼';

    paginationState.allRows.sort((rowA, rowB) => {
        const textA = rowA.cells[columnIndex].textContent.trim();
        const textB = rowB.cells[columnIndex].textContent.trim();
        const comparison = textA.localeCompare(textB);
        return paginationState.sortDirection === 'asc' ? comparison : -comparison;
    });

    paginationState.currentPage = 1;
    displayPage(paginationState.currentPage);
    const totalPages = Math.ceil(paginationState.allRows.length / paginationState.itemsPerPage);
    updatePaginationControls(totalPages);
}

let deleteUrl = '';
let currentTransactionId = null;

function setupDeleteHandlers() {
    const tableBody = document.getElementById('tableBody');
    if (!tableBody) return;

    tableBody.addEventListener('click', function (e) {
        const deleteBtn = e.target.closest('.delete-btn');
        if (deleteBtn) {
            e.preventDefault();
            e.stopPropagation();

            const transactionId = deleteBtn.getAttribute('data-id');
            const categoryName = deleteBtn.getAttribute('data-name');

            if (transactionId) {
                showDeleteModal(transactionId, categoryName);
            }
        }
    });
}

window.showDeleteModal = function (transactionId, categoryName) {
    const modal = document.getElementById('deleteModal');
    if (!modal) return;

    currentTransactionId = transactionId;
    deleteUrl = '/Transaction/Delete/' + transactionId;

    modal.style.display = 'flex';
    modal.style.opacity = '1';
    document.body.style.overflow = 'hidden';
};

window.closeDeleteModal = function () {
    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
    currentTransactionId = null;
    deleteUrl = '';
};

window.confirmDelete = function () {
    if (!deleteUrl || !currentTransactionId) {
        alert('Error: Invalid transaction');
        closeDeleteModal();
        return;
    }

    const token = document.querySelector('input[name="__RequestVerificationToken"]')?.value;
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Deleting...';
    }

    fetch(deleteUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: token ? `__RequestVerificationToken=${encodeURIComponent(token)}` : ''
    })
    .then(response => {
        if (response.ok || response.status === 200 || response.status === 204) {
            closeDeleteModal();
            location.reload();
        } else {
            return response.text().then(text => {
                throw new Error('Delete failed: ' + response.status);
            });
        }
    })
    .catch(error => {
        alert('Error deleting transaction: ' + error.message);
        if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.textContent = 'Delete';
        }
    });
};

document.addEventListener('click', function (e) {
    const modal = document.getElementById('deleteModal');
    if (e.target === modal) {
        closeDeleteModal();
    }
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeDeleteModal();
    }
});
