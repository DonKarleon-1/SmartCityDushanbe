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
                
                // плавный переход для фона и текста
                match.element.style.transition = 'background 0.5s, color 0.5s';

                // сохраняем исходные стили
                const originalBg = match.element.style.backgroundColor;
                const originalColor = match.element.style.color;

                // применяем подсветку
                match.element.style.backgroundColor = '#007bff'; // синий фон
                match.element.style.color = '#ffffff';           // белый текст

                // через 1.5 секунды возвращаем исходные стили
                setTimeout(() => {
                    match.element.style.backgroundColor = originalBg;
                    match.element.style.color = originalColor;
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



const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});



const themeBtn = document.getElementById("themeToggleBtn");
const body = document.body;
const moonIcon = document.getElementById("moonIcon");
const sunIcon = document.getElementById("sunIcon");

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        body.classList.add("dark-theme");
        moonIcon.style.display = "none";
        sunIcon.style.display = "block";
    }

    themeBtn.addEventListener("click", () => {
        body.classList.toggle("dark-theme");

        if (body.classList.contains("dark-theme")) {
            localStorage.setItem("theme", "dark");
            moonIcon.style.display = "none";
            sunIcon.style.display = "block";
        } else {
            localStorage.setItem("theme", "light");
            moonIcon.style.display = "block";
            sunIcon.style.display = "none";
        }
    });
});

const toggleMenu = document.getElementById('toggleMenu');
const textSizeDropdown = document.getElementById('textSizeDropdown');
const textSizeSlider = document.getElementById('textSizeSlider');
const sliderValue = document.getElementById('sliderValue');

// Открытие/закрытие выпадающего меню
toggleMenu.addEventListener('click', () => {
    textSizeDropdown.style.display = textSizeDropdown.style.display === 'block' ? 'none' : 'block';
});

// Получаем все текстовые элементы, кроме кнопки и input
function getAllTextElements(root) {
    const elements = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
        acceptNode: (node) => {
            if (node.id === 'toggleMenu' || node.tagName.toLowerCase() === 'input') {
                return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
        }
    });
    let currentNode = walker.nextNode();
    while (currentNode) {
        elements.push(currentNode);
        currentNode = walker.nextNode();
    }
    return elements;
}

const textElements = getAllTextElements(document.body);

// Сохраняем исходный размер текста каждого элемента
textElements.forEach(el => {
    const style = window.getComputedStyle(el).fontSize.replace('px','');
    el.dataset.originalSize = style; // хранится как строка
});

// Функция установки размера текста относительно исходного
function setTextSize(px) {
    sliderValue.textContent = px + 'px';
    textElements.forEach(el => {
        const original = parseFloat(el.dataset.originalSize);
        if (px == 16) {
            el.style.fontSize = original + 'px'; // если 16, оставляем исходный
        } else {
            el.style.fontSize = px + 'px';
        }
    });
    localStorage.setItem('textSize', px);
}

// Загружаем сохраненный размер
const savedSize = localStorage.getItem('textSize');
if (savedSize) {
    textSizeSlider.value = savedSize;
    setTextSize(savedSize);
} else {
    setTextSize(textSizeSlider.value);
}

// Обновление при движении ползунка
textSizeSlider.addEventListener('input', () => {
    setTextSize(textSizeSlider.value);
});