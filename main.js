document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("localSearchInput");
    const resultsContainer = document.getElementById("localSearchResults");
    let searchTimeout;
    const searchSelectors = 'p, h1, h2, h3, h4, h5, li, span, article, .text-content';

    const debounce = (func, delay) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(func, delay);
    };

    function getSnippet(text, query) {
        const index = text.toLowerCase().indexOf(query.toLowerCase());
        if (index === -1) return text.substring(0, 50);

        const start = Math.max(0, index - 20);
        const end = Math.min(text.length, index + query.length + 30);
        
        let snippet = text.substring(start, end);
        if (start > 0) snippet = "..." + snippet;
        if (end < text.length) snippet = snippet + "...";
        
        return snippet;
    }

    function highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="search-match">$1</span>');
    }

    
    function performSearch() {
        const query = input.value.trim();
        resultsContainer.innerHTML = '';

        if (query.length < 2) {
            resultsContainer.style.display = 'none';
            return;
        }
        const elements = document.querySelectorAll(searchSelectors);
        const matches = [];

        elements.forEach(el => {
            if (el.closest('.header-input-wrapper') || el.offsetParent === null) return;

            const text = el.innerText || el.textContent;
            if (text.toLowerCase().includes(query.toLowerCase())) {
                matches.push({
                    element: el,
                    text: text
                });
            }
        });

        if (matches.length > 0) {
            matches.slice(0, 10).forEach(match => {
                const div = document.createElement('div');
                div.className = 'search-item';
                
                const snippet = getSnippet(match.text, query);
                const highlightedSnippet = highlightMatch(snippet, query);
                
                div.innerHTML = `
                    <div class="search-item-context">${highlightedSnippet}</div>
                `;

                div.addEventListener('click', () => {
                    match.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    match.element.style.transition = 'background 0.5s';
                    const originalBg = match.element.style.backgroundColor;
                    match.element.style.backgroundColor = '#fff3cd';
                    
                    setTimeout(() => {
                        match.element.style.backgroundColor = originalBg;
                    }, 1500);

                    resultsContainer.style.display = 'none';
                    input.value = '';
                });

                resultsContainer.appendChild(div);
            });
            resultsContainer.style.display = 'block';
        } else {
            resultsContainer.innerHTML = '<div class="no-results">Ничего не найдено</div>';
            resultsContainer.style.display = 'block';
        }
    }

    input.addEventListener('input', () => debounce(performSearch, 300));

    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !resultsContainer.contains(e.target)) {
            resultsContainer.style.display = 'none';
        }
    });
    
    input.addEventListener('focus', () => {
        if (input.value.length >= 2) resultsContainer.style.display = 'block';
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const sizeBtn = document.querySelector('.text-size');
    const dropdown = document.getElementById('sizeDropdown');
    const slider = document.getElementById('fontSlider');
    const sizeValue = document.getElementById('sizeValue');

    // Функция смены размера
    function updateFontSize(size) {
        // Устанавливаем переменную для всего сайта
        document.documentElement.style.setProperty('--main-size', size + 'px');
        
        // Обновляем визуальные данные в меню
        sizeValue.innerText = size + 'px';
        slider.value = size;

        // Сохраняем в локальное хранилище
        localStorage.setItem('userFontSize', size);
    }

    // 1. При загрузке страницы проверяем, есть ли сохраненный размер
    const savedSize = localStorage.getItem('userFontSize');
    if (savedSize) {
        updateFontSize(savedSize);
    }

    // 2. Логика открытия/закрытия меню
    sizeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
    });

    // 3. Изменение размера при движении ползунка
    slider.addEventListener('input', (e) => {
        updateFontSize(e.target.value);
    });

    // Закрытие меню при клике в пустом месте
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== sizeBtn) {
            dropdown.classList.remove('active');
        }
    });
});