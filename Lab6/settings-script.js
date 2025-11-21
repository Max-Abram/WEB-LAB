document.addEventListener('DOMContentLoaded', () => {
    // Імітація формул (зберігаються локально лише для прикладу, не в localStorage)
    const mockFormulas = [
        { id: 101, settingId: 1, name: 'BTC increase each 2 sec for T-Shirts' },
        { id: 102, settingId: 1, name: 'ETH decrease logic' },
        { id: 103, settingId: 2, name: 'USDT Logic for Hoodies' }
    ];

    let currentSettingId = null;
    let originalState = {}; 
    let currentState = {};  

    // DOM Елементи
    const titleInput = document.getElementById('setting-title');
    const breadcrumbName = document.getElementById('breadcrumb-name');
    const formulasList = document.getElementById('formulas-list');
    const formulasContainer = document.getElementById('formulas-container');
    const emptyState = document.getElementById('empty-state-container');
    const template = document.getElementById('formula-item-template');
    
    const saveBtn = document.getElementById('save-btn');
    const discardBtn = document.getElementById('discard-btn');
    const createBtn = document.getElementById('create-formula-btn');
    const addEmptyBtn = document.getElementById('add-formula-empty-btn');

    function getUrlId() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        return id ? parseInt(id) : null; 
    }

    /**
     * Отримує всі налаштування зі сховища (або з data.js, якщо пусто)
     */
    function getAllSettings() {
        const storedData = localStorage.getItem('appSettings');
        if (storedData) {
            return JSON.parse(storedData);
        }
        return db.settings;
    }

    /**
     * Зберігає весь масив налаштувань назад у сховище
     */
    function saveAllSettings(settings) {
        localStorage.setItem('appSettings', JSON.stringify(settings));
    }

    function loadData() {
        currentSettingId = getUrlId();
        const allSettings = getAllSettings();
        
        // Шукаємо потрібне налаштування серед завантажених
        const foundSetting = allSettings.find(s => s.id === currentSettingId);
        
        if (foundSetting) {
            // Фільтруємо формули (поки що з мок-даних)
            const formulas = mockFormulas.filter(f => f.settingId === currentSettingId);

            originalState = {
                name: foundSetting.name,
                formulas: JSON.parse(JSON.stringify(formulas))
            };
            currentState = JSON.parse(JSON.stringify(originalState));

            renderUI();
        } else {
            // Якщо налаштування не знайдено (наприклад, ID неправильний)
            alert('Setting not found! Redirecting to home...');
            window.location.href = 'index.html';
        }
    }

    function renderUI() {
        titleInput.value = currentState.name;
        breadcrumbName.textContent = currentState.name;
        renderFormulas();
        updateActionButtons();
    }

    function renderFormulas() {
        formulasList.innerHTML = ''; 

        if (currentState.formulas.length === 0) {
            formulasContainer.style.display = 'none';
            emptyState.style.display = 'block';
        } else {
            formulasContainer.style.display = 'block';
            emptyState.style.display = 'none';

            currentState.formulas.forEach(formula => {
                const clone = template.content.cloneNode(true);
                clone.querySelector('.formula-name').textContent = formula.name;
                
                clone.querySelector('.edit-btn').addEventListener('click', () => {
                    window.location.href = `formula.html?id=${formula.id}&settingId=${currentSettingId}`;
                });

                clone.querySelector('.delete-btn').addEventListener('click', () => {
                    handleDeleteFormula(formula.id);
                });

                formulasList.appendChild(clone);
            });
        }
    }

    function updateActionButtons() {
        const isNameChanged = currentState.name !== originalState.name;
        const isFormulasChanged = JSON.stringify(currentState.formulas) !== JSON.stringify(originalState.formulas);
        
        if (isNameChanged || isFormulasChanged) {
            saveBtn.disabled = false;
            saveBtn.classList.add('btn-primary');
            discardBtn.disabled = false;
        } else {
            saveBtn.disabled = true;
            saveBtn.classList.remove('btn-primary');
            discardBtn.disabled = true;
        }
    }

    // --- ОБРОБНИКИ ПОДІЙ ---

    titleInput.addEventListener('input', (e) => {
        currentState.name = e.target.value;
        updateActionButtons();
    });

    function handleDeleteFormula(id) {
        if(confirm('Delete this formula?')) {
            currentState.formulas = currentState.formulas.filter(f => f.id !== id);
            renderFormulas();
            updateActionButtons();
        }
    }

    // ЗБЕРЕЖЕННЯ (SAVE)
    saveBtn.addEventListener('click', () => {
        // 1. Оновлюємо локальний originalState
        originalState = JSON.parse(JSON.stringify(currentState));

        // 2. Зберігаємо зміни назви в localStorage для головної сторінки
        const allSettings = getAllSettings();
        const index = allSettings.findIndex(s => s.id === currentSettingId);
        
        if (index !== -1) {
            allSettings[index].name = currentState.name;
            saveAllSettings(allSettings);
        }

        alert('Changes saved!');
        renderUI();
    });

    discardBtn.addEventListener('click', () => {
        if(confirm('Discard changes?')) {
            currentState = JSON.parse(JSON.stringify(originalState));
            renderUI();
        }
    });

    const goToCreate = () => {
        window.location.href = `formula.html?settingId=${currentSettingId}&mode=create`;
    };

    createBtn.addEventListener('click', goToCreate);
    addEmptyBtn.addEventListener('click', goToCreate);

    // Старт
    loadData();
});