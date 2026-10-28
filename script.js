// Прелоадер
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.style.display = 'none', 500);
    }
});

// Анимации при скролле
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show-scroll');
        }
    });
});
document.querySelectorAll('.hidden-scroll').forEach(el => observer.observe(el));

// Кнопка наверх
const btnUp = document.getElementById('btn-up');
if (btnUp) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) btnUp.classList.add('visible');
        else btnUp.classList.remove('visible');
    });
    btnUp.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Мультиязычность
const translations = {
    ru: {
        navHome: "Главная", navEvents: "Проекты", navFav: "Избранное", navGallery: "Галерея", navContact: "Связь",
        slide1Title: "Спасём природу вместе", slide1Desc: "Присоединяйтесь к нашим волонтерским инициативам.",
        slide2Title: "Зеленое будущее", slide2Desc: "Сажаем деревья и очищаем территории.",
        btnMore: "Подробнее", btnFav: "❤ В избранное", btnFavAdded: "Убрать",
        filterAll: "Все", filterEco: "Экология", filterAnimals: "Животные", filterCity: "Город",
        ev1Title: "Посадка саксаула", ev1Desc: "Озеленение высохшего дна Аральского моря.",
        ev2Title: "Озеленение Ташкента", ev2Desc: "Высадка чинар и дубов в городских парках.",
        ev3Title: "Защита питомцев", ev3Desc: "Постройка теплых будок для собак.",
        contactTitle: "Оставьте заявку", nameLabel: "Ваше имя", msgLabel: "Ваше сообщение", sendBtn: "Отправить"
    },
    uz: {
        navHome: "Asosiy", navEvents: "Loyihalar", navFav: "Saqlanganlar", navGallery: "Galereya", navContact: "Aloqa",
        slide1Title: "Tabiatni birga asraymiz", slide1Desc: "Ko'ngillilar tashabbuslarimizga qo'shiling.",
        slide2Title: "Yashil kelajak", slide2Desc: "Daraxtlar ekamiz va hududlarni tozalaymiz.",
        btnMore: "Batafsil", btnFav: "❤ Saqlash", btnFavAdded: "O'chirish",
        filterAll: "Barchasi", filterEco: "Ekologiya", filterAnimals: "Hayvonlar", filterCity: "Shahar",
        ev1Title: "Saksovul ekish", ev1Desc: "Orol dengizining qurigan tubini ko'kalamzorlashtirish.",
        ev2Title: "Toshkentni ko'kalamzorlashtirish", ev2Desc: "Shahar parklarida chinor va eman ekish.",
        ev3Title: "Uy hayvonlarini himoya qilish", ev3Desc: "Itlar uchun issiq uyachalar qurish.",
        contactTitle: "Ariza qoldiring", nameLabel: "Ismingiz", msgLabel: "Xabaringiz", sendBtn: "Yuborish"
    },
    en: {
        navHome: "Home", navEvents: "Projects", navFav: "Favorites", navGallery: "Gallery", navContact: "Contact",
        slide1Title: "Save nature together", slide1Desc: "Join our volunteer initiatives.",
        slide2Title: "Green future", slide2Desc: "Planting trees and cleaning areas.",
        btnMore: "Details", btnFav: "❤ Favorite", btnFavAdded: "Remove",
        filterAll: "All", filterEco: "Ecology", filterAnimals: "Animals", filterCity: "City",
        ev1Title: "Planting Saxaul", ev1Desc: "Greening the dried bed of the Aral Sea.",
        ev2Title: "Greening Tashkent", ev2Desc: "Planting plane trees and oaks in city parks.",
        ev3Title: "Protecting pets", ev3Desc: "Building warm booths for dogs.",
        contactTitle: "Leave a request", nameLabel: "Your Name", msgLabel: "Your Message", sendBtn: "Send"
    }
};

let currentLang = localStorage.getItem('lang') || 'ru';
function applyLanguage() {
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        if (translations[currentLang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = translations[currentLang][key];
            else el.innerText = translations[currentLang][key];
        }
    });
}
document.getElementById('lang-toggle').addEventListener('click', () => {
    const langs = ['ru', 'uz', 'en'];
    currentLang = langs[(langs.indexOf(currentLang) + 1) % langs.length];
    localStorage.setItem('lang', currentLang);
    document.getElementById('lang-toggle').innerText = currentLang.toUpperCase();
    applyLanguage();
});
document.getElementById('lang-toggle').innerText = currentLang.toUpperCase();
applyLanguage();

// Тема
let currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
document.getElementById('theme-toggle').addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
});

// Слайдер (Главная страница)
const slides = document.querySelectorAll('.slide');
if (slides.length > 0) {
    let currentSlide = 0;
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 4000);
}

// Избранное
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
window.toggleFavorite = function(id, titleKey, descKey, btnElement) {
    const index = favorites.findIndex(fav => fav.id === id);
    if (index === -1) {
        favorites.push({ id, titleKey, descKey });
        btnElement.innerText = translations[currentLang].btnFavAdded;
        btnElement.style.background = 'var(--accent)';
    } else {
        favorites.splice(index, 1);
        btnElement.innerText = translations[currentLang].btnFav;
        btnElement.style.background = 'var(--btn-bg)';
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    if (window.location.pathname.includes('favorites.html')) renderFavorites();
};

function renderFavorites() {
    const container = document.getElementById('favorites-container');
    if (!container) return;
    container.innerHTML = '';
    favorites.forEach(fav => {
        container.innerHTML += `
            <div class="card hidden-scroll">
                <h3 data-lang="${fav.titleKey}">${translations[currentLang][fav.titleKey]}</h3>
                <p data-lang="${fav.descKey}">${translations[currentLang][fav.descKey]}</p>
                <button onclick="toggleFavorite('${fav.id}', '${fav.titleKey}', '${fav.descKey}', this)" style="background: var(--accent); margin-top:15px;">❌ Удалить</button>
            </div>
        `;
    });
    applyLanguage();
    document.querySelectorAll('.hidden-scroll').forEach(el => observer.observe(el));
}
if (window.location.pathname.includes('favorites.html')) renderFavorites();

// Фильтры (Страница Проектов)
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                setTimeout(() => card.style.opacity = '1', 50);
            } else {
                card.style.opacity = '0';
                setTimeout(() => card.style.display = 'none', 400);
            }
        });
    });
});

// Отправка в Telegram
const tgForm = document.getElementById('tg-form');
if (tgForm) {
    tgForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = document.getElementById('submit-btn');
        btn.innerText = '⏳...';
        const name = document.getElementById('name').value;
        const msg = document.getElementById('message').value;
        
        const token = '9073283611:AAE-kDEznK3JRNrFVb2oRQnNKVGC1Zu1xhE';
        const chatId = '7876053445';
        const text = `🌟 Новая крутая заявка!\n👤 Имя: ${name}\n💬 Сообщение: ${msg}`;

        fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(text)}`)
        .then(response => {
            if (response.ok) {
                alert('Успешно отправлено!');
                tgForm.reset();
            }
        })
        .finally(() => btn.innerText = translations[currentLang].sendBtn);
    });
}