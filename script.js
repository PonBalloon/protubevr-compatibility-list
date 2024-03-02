let tableData = [];
let filteredData = [];

window.onload = function() {
    fetch('list.csv')
        .then(response => response.text())
        .then(csvString => {
            Papa.parse(csvString, {
                complete: function(results) {
                    tableData = results.data;
                    filteredData = tableData;
                    fillTable(filteredData);
                },
                header: true
            });
        });

        document.querySelectorAll('.enable-filter').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                let relatedRadios = document.querySelectorAll(`input[name='${this.name}_filter']`);
                relatedRadios.forEach(radio => radio.disabled = !this.checked);
                applyFilters();
            });
        });
        
        document.querySelectorAll('.filter').forEach(radio => {
            radio.addEventListener('change', applyFilters);
        });
        
        applyFilters();
};

function fillTable(data) {
    var table = document.getElementById('gameTable').getElementsByTagName('tbody')[0];
    table.innerHTML = "";

    data.forEach(function(row) {
        var newRow = table.insertRow();
        var previousCell = null;

        Object.entries(row).forEach(([key, cellData]) => {
            // Check if the column is a 'Link' column
            if (key.startsWith('Link') && previousCell) {
                // If the cell data is not blank, make the previous cell a hyperlink
                if (cellData.trim() !== '') {
                    previousCell.innerHTML = `<a href="${cellData}" target="_blank">${previousCell.textContent}</a>`;
                }
            } else {
                // For non-link columns, insert the cell data
                var cell = newRow.insertCell();
                cell.textContent = cellData;
                previousCell = cell; // Update previous cell

                // Apply strikethrough if NW contains a value
                if (key === "NW" && cellData) { 
                    newRow.cells[0].classList.add("strikethrough");
                }
            }
        });
    });
}




function applyFilters() {
    const filterSettings = {};

    // Gather the settings of each enabled filter
    document.querySelectorAll('.enable-filter:checked').forEach(checkbox => {
        const columnName = checkbox.name;
        const selectedRadio = document.querySelector(`input[name='${columnName}_filter']:checked`);
        if (selectedRadio) {
            filterSettings[columnName] = selectedRadio.value;
        }
    });

    filteredData = tableData.filter(row => {
        return Object.entries(filterSettings).every(([column, action]) => {
            const cellValue = row[column];
            // Check if we should include or exclude rows based on the filter action
            if (action === 'include') {
                return cellValue && cellValue !== "";
            } else { // action === 'exclude'
                return !cellValue || cellValue === "";
            }
        });
    });

    fillTable(filteredData);
}



function sortTable(column) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("gameTable");
    switching = true;
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[column];
            y = rows[i + 1].getElementsByTagName("TD")[column];
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}
