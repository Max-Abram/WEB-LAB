// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Отримання початкового стану ---
    
    // Глобальний стан (змінюється під час роботи)
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
     * Завантажує початковий стан з об'єкта `db`.
     */
    function loadInitialState() {
        // Копіюємо дані, щоб не змінювати оригінальний `db`
        appState.settings = [...db.settings];
    }

    // --- 3. Керування порожнім станом ---
    
    /**
     * Показує або ховає "Empty State" та таблицю.
     */
    function toggleEmptyState() {
        const hasSettings = appState.settings.length > 0;
        
        if (hasSettings) {
            table.style.display = ''; // Показати таблицю (поведінка за замовчуванням)
            emptyStateContainer.style.display = 'none'; // Сховати Empty State
        } else {
            table.style.display = 'none'; // Сховати таблицю
            emptyStateContainer.style.display = 'block'; // Показати Empty State
        }
    }

    // --- 2. Рендеринг налаштувань ---
    
    /**
     * Очищує таблицю та рендерить всі налаштування зі стану.
     */
    function renderSettings() {
        // Очистити таблицю
        tableBody.innerHTML = '';

        // Згенерувати нові рядки
        appState.settings.forEach(setting => {
            // Клонувати шаблон
            const templateClone = rowTemplate.content.cloneNode(true);
            
            // Отримати елементи з клону
            const link = templateClone.querySelector('.setting-name');
            const status = templateClone.querySelector('.setting-status');
            const deleteBtn = templateClone.querySelector('.delete-btn');

            // Заповнити дані
            link.textContent = setting.name;
            link.href = setting.link || 'settings.html';
            
            status.textContent = setting.status;
            status.className = `status setting-status ${setting.status.toLowerCase()}`;
            
            // Додати ID для кнопки видалення
            deleteBtn.dataset.id = setting.id;

            // Додати клон до таблиці
            tableBody.appendChild(templateClone);
        });
        
        // Після рендерингу завжди перевіряти стан
        toggleEmptyState();
    }

    // --- 5. Додавання нового налаштування ---
    
    /**
     * Обробник для кнопки "Create Setting".
     */
    function handleAddNewSetting() {
        // Створити нове налаштування
        const newSetting = {
            id: Date.now(), // Унікальний ID
            name: 'New Untitled Setting',
            status: 'Draft',
            link: 'settings.html'
        };

        // Додати до стану
        appState.settings.push(newSetting);

        // Оновити UI
        renderSettings();
    }

    // --- 4. Видалення налаштувань ---
    
    /**
     * Обробник для кліку по кнопці "Видалити" (через делегування).
     */
    function handleDeleteSetting(event) {
        // Перевіряємо, чи клікнули саме на кнопку видалення
        if (event.target.classList.contains('delete-btn')) {
            const settingId = parseInt(event.target.dataset.id, 10);

            // Оновити стан (фільтруємо, залишаючи всі, крім видаленого)
            appState.settings = appState.settings.filter(
                setting => setting.id !== settingId
            );

            // Оновити UI
            renderSettings();
        }
    }

    // --- 6. Остаточний виклик функцій (Ініціалізація) ---
    
    function init() {
        // 1. Завантажити дані
        loadInitialState();

        // 2. Відрендерити початковий стан
        renderSettings();

        // 3. Встановити слухачів
        createSettingBtn.addEventListener('click', handleAddNewSetting);
        tableBody.addEventListener('click', handleDeleteSetting); // Делегування подій
    }

    // Запускаємо!
    init();
});