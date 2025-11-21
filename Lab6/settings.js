// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Отримання початкового стану ---
    
    // Глобальний стан
    let appState = {
        settings: []
    };

    // Отримання елементів DOM
    const table = document.getElementById('settings-table');
    const tableBody = document.getElementById('settings-table-body');
    const emptyStateContainer = document.getElementById('empty-state-container');
    const createSettingBtn = document.getElementById('create-setting-btn');
    const rowTemplate = document.getElementById('setting-row-template');

    /**
     * Завантажує початковий стан.
     * Спочатку пробує взяти з localStorage, якщо немає — бере з data.js (db)
     */
    function loadInitialState() {
        const DB_KEY = 'formulaAppDB';
        const localData = localStorage.getItem(DB_KEY);

        if (localData) {
            const parsedData = JSON.parse(localData);
            appState.settings = parsedData.settings || [];
        } else {
            // Якщо localStorage порожній, беремо з data.js (змінна db)
            if (typeof db !== 'undefined') {
                appState.settings = [...db.settings];
                
                // Ініціалізуємо localStorage, щоб дані були синхронізовані
                localStorage.setItem(DB_KEY, JSON.stringify(db));
            }
        }
    }

    // --- 2. Керування порожнім станом ---
    
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

    // --- 3. Рендеринг налаштувань ---
    
    function renderSettings() {
        tableBody.innerHTML = '';

        appState.settings.forEach(setting => {
            const templateClone = rowTemplate.content.cloneNode(true);
            
            const link = templateClone.querySelector('.setting-name');
            const status = templateClone.querySelector('.setting-status');
            const deleteBtn = templateClone.querySelector('.delete-btn');

            link.textContent = setting.name;
            
            // === ВАЖЛИВА ЗМІНА ТУТ ===
            // Додаємо ID до URL, щоб settings.html знав, що відкривати
            link.href = `settings.html?id=${setting.id}`; 
            // =========================
            
            status.textContent = setting.status;
            // Додаємо правильні класи для стилізації (draft/active)
            status.className = `status setting-status ${setting.status.toLowerCase()}`;
            
            deleteBtn.dataset.id = setting.id;

            tableBody.appendChild(templateClone);
        });
        
        toggleEmptyState();
    }

    // --- 4. Додавання нового налаштування ---
    
    function handleAddNewSetting() {
        const newId = Date.now(); // Генеруємо унікальний ID
        
        const newSetting = {
            id: newId,
            name: 'New Untitled Setting',
            status: 'Draft'
        };

        appState.settings.push(newSetting);
        
        // Оновлюємо localStorage
        saveToLocalStorage();

        renderSettings();
    }

    // --- 5. Видалення налаштувань ---
    
    function handleDeleteSetting(event) {
        // Шукаємо кнопку видалення (або її іконку всередині)
        const btn = event.target.closest('.delete-btn');
        
        if (btn) {
            const settingId = parseInt(btn.dataset.id, 10);

            if(confirm('Are you sure you want to delete this setting?')) {
                appState.settings = appState.settings.filter(
                    setting => setting.id !== settingId
                );

                // Оновлюємо localStorage
                saveToLocalStorage();

                renderSettings();
            }
        }
    }

    // Допоміжна функція для збереження змін
    function saveToLocalStorage() {
        const DB_KEY = 'formulaAppDB';
        // Отримуємо поточну базу, щоб не стерти формули/продукти
        let currentDB = JSON.parse(localStorage.getItem(DB_KEY)) || {};
        // Оновлюємо тільки settings
        currentDB.settings = appState.settings;
        localStorage.setItem(DB_KEY, JSON.stringify(currentDB));
    }

    // --- 6. Ініціалізація ---
    
    function init() {
        loadInitialState();
        renderSettings();

        createSettingBtn.addEventListener('click', handleAddNewSetting);
        tableBody.addEventListener('click', handleDeleteSetting);
    }

    init();
});