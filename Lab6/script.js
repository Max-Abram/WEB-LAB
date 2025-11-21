document.addEventListener('DOMContentLoaded', () => {

    // Глобальний стан
    let appState = {
        settings: []
    };

    // Елементи DOM
    const table = document.getElementById('settings-table');
    const tableBody = document.getElementById('settings-table-body');
    const emptyStateContainer = document.getElementById('empty-state-container');
    const createSettingBtn = document.getElementById('create-setting-btn');
    const rowTemplate = document.getElementById('setting-row-template');

    /**
     * Завантажує стан з localStorage або з db (якщо вперше)
     */
    function loadInitialState() {
        const storedData = localStorage.getItem('appSettings');
        
        if (storedData) {
            // Якщо є збережені дані - беремо їх
            appState.settings = JSON.parse(storedData);
        } else {
            // Якщо немає - беремо початкові з data.js
            appState.settings = [...db.settings];
        }
    }

    /**
     * Зберігає поточний стан у localStorage
     */
    function saveState() {
        localStorage.setItem('appSettings', JSON.stringify(appState.settings));
    }

    function toggleEmptyState() {
        const hasSettings = appState.settings.length > 0;
        if (hasSettings) {
            table.style.display = '';
            emptyStateContainer.style.display = 'none';
        } else {
            table.style.display = 'none';
            emptyStateContainer.style.display = 'block';
        }
    }

    function renderSettings() {
        tableBody.innerHTML = '';

        appState.settings.forEach(setting => {
            const templateClone = rowTemplate.content.cloneNode(true);
            
            const link = templateClone.querySelector('.setting-name');
            const status = templateClone.querySelector('.setting-status');
            const deleteBtn = templateClone.querySelector('.delete-btn');

            link.textContent = setting.name;
            // ВАЖЛИВО: передаємо ID у посиланні
            link.href = `settings.html?id=${setting.id}`;
            
            status.textContent = setting.status;
            status.className = `status setting-status ${setting.status.toLowerCase()}`;
            
            deleteBtn.dataset.id = setting.id;

            tableBody.appendChild(templateClone);
        });
        
        toggleEmptyState();
    }

    function handleAddNewSetting() {
        const newSetting = {
            id: Date.now(),
            name: 'New Untitled Setting',
            status: 'Draft',
            link: 'settings.html'
        };

        appState.settings.push(newSetting);
        saveState(); // Зберігаємо зміни
        renderSettings();
    }

    function handleDeleteSetting(event) {
        // Шукаємо найближчу кнопку (на випадок кліку по іконці всередині кнопки)
        const btn = event.target.closest('.delete-btn');
        
        if (btn) {
            const settingId = parseInt(btn.dataset.id, 10);

            appState.settings = appState.settings.filter(
                setting => setting.id !== settingId
            );

            saveState(); // Зберігаємо зміни після видалення
            renderSettings();
        }
    }

    function init() {
        loadInitialState();
        renderSettings();

        createSettingBtn.addEventListener('click', handleAddNewSetting);
        tableBody.addEventListener('click', handleDeleteSetting);
    }

    init();
});