// Stan aplikacji
let selectedGender = '';
let selectedScents = [];
let map = null;

// Funkcja do przełączania ekranów
function showScreen(screenName) {
    // Ukryj wszystkie ekrany
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Pokaż wybrany ekran
    document.getElementById(screenName + '-screen').classList.add('active');
    
    // Jeśli wchodzimy na profil, załaduj dane
    if (screenName === 'profile') {
        loadProfile();
    }
    
    // Jeśli wchodzimy na mapę, zainicjalizuj ją
    if (screenName === 'map' && !map) {
        setTimeout(initMap, 100);
    }
}

// Inicjalizacja mapy
function initMap() {
    // Współrzędne Katowic (KLUB Pomarańcza)
    const katowiceCoords = [50.2649, 19.0238];
    
    // Stwórz mapę wycentrowaną na Polsce
    map = L.map('map').setView([52.0, 19.0], 6);
    
    // Dodaj warstwę mapy
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Stwórz pomarańczową ikonę pinezki
    const orangeIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background-color: #FF8C00; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid #fff; box-shadow: 0 3px 8px rgba(0,0,0,0.3); position: relative;"><div style="width: 14px; height: 14px; background-color: #fff; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(45deg);"></div></div>',
        iconSize: [30, 30],
        iconAnchor: [15, 30]
    });
    
    // Dodaj marker w Katowicach
    const marker = L.marker(katowiceCoords, { icon: orangeIcon }).addTo(map);
    
    // Dodaj popup do markera
    marker.bindPopup('<b>🍊 KLUB Pomarańcza</b><br>Katowice<br><a href="#" onclick="openModal(); return false;">Zobacz perfumy</a>');
    
    // Kliknięcie w marker otwiera modal
    marker.on('click', function() {
        setTimeout(openModal, 200);
    });
}

// Baza perfum z nutami zapachowymi
const perfumes = [
    {
        name: 'Jean Paul Gaultier Elixir',
        notes: ['oriental', 'woody'],
        description: 'Orientalne, Drzewne'
    },
    {
        name: 'Dior Sauvage',
        notes: ['fresh', 'woody'],
        description: 'Świeże, Drzewne'
    },
    {
        name: 'One Million',
        notes: ['sweet', 'oriental'],
        description: 'Słodkie, Orientalne'
    },
    {
        name: 'Emporio Armani Stronger With You Parfum',
        notes: ['sweet', 'woody'],
        description: 'Słodkie, Drzewne'
    },
    {
        name: 'Versace Eros EDP',
        notes: ['fresh', 'sweet'],
        description: 'Świeże, Słodkie'
    }
];

// Otwórz modal z informacjami
function openModal() {
    document.getElementById('location-modal').classList.add('active');
    displayPerfumeRecommendations();
}

// Zamknij modal
function closeModal() {
    document.getElementById('location-modal').classList.remove('active');
}

// Wyświetl perfumy z rekomendacjami
function displayPerfumeRecommendations() {
    const profile = loadProfile();
    const userScents = profile ? profile.scents : [];
    const container = document.getElementById('perfume-recommendations');
    
    // Sortuj perfumy według dopasowania
    const sortedPerfumes = perfumes.map(perfume => {
        const matchCount = perfume.notes.filter(note => userScents.includes(note)).length;
        return { ...perfume, matchCount };
    }).sort((a, b) => b.matchCount - a.matchCount);
    
    // Generuj HTML
    let html = '<ul class="perfume-items">';
    sortedPerfumes.forEach(perfume => {
        const isRecommended = perfume.matchCount > 0;
        const matchClass = isRecommended ? 'recommended' : '';
        const badge = isRecommended ? `<span class="match-badge">Dopasowane ${perfume.matchCount}/2</span>` : '';
        
        html += `
            <li class="perfume-item ${matchClass}">
                <div class="perfume-header">
                    <span class="perfume-name">${perfume.name}</span>
                </div>
                <div class="perfume-notes">${perfume.description}</div>
                ${badge}
            </li>
        `;
    });
    html += '</ul>';
    
    if (userScents.length > 0) {
        html = '<p class="recommendation-info">💡 Perfumy dopasowane do Twoich preferencji są oznaczone gwiazdką</p>' + html;
    }
    
    container.innerHTML = html;
}

// Funkcja do wyboru płci
function selectGender(gender) {
    selectedGender = gender;
    
    // Usuń zaznaczenie ze wszystkich przycisków
    document.querySelectorAll('.gender-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Zaznacz wybrany przycisk
    event.target.classList.add('selected');
}

// Funkcja do przełączania zapachów
function toggleScent(scentId) {
    const button = event.target.closest('.scent-card');
    
    if (selectedScents.includes(scentId)) {
        // Usuń zapach z listy
        selectedScents = selectedScents.filter(id => id !== scentId);
        button.classList.remove('selected');
    } else {
        // Dodaj zapach do listy
        selectedScents.push(scentId);
        button.classList.add('selected');
    }
    
    // Aktualizuj rekomendacje w profilu
    updateProfileRecommendations();
}

// Aktualizuj rekomendacje w profilu
function updateProfileRecommendations() {
    const container = document.getElementById('profile-recommendations');
    const listContainer = document.getElementById('profile-perfume-list');
    
    if (selectedScents.length === 0) {
        container.style.display = 'none';
        return;
    }
    
    container.style.display = 'block';
    
    // Filtruj perfumy według dopasowania
    const matchedPerfumes = perfumes
        .map(perfume => {
            const matchCount = perfume.notes.filter(note => selectedScents.includes(note)).length;
            return { ...perfume, matchCount };
        })
        .filter(p => p.matchCount > 0)
        .sort((a, b) => b.matchCount - a.matchCount);
    
    if (matchedPerfumes.length === 0) {
        listContainer.innerHTML = '<p style="color: #666; font-size: 14px;">Brak dopasowanych perfum dla wybranych nut zapachowych.</p>';
        return;
    }
    
    let html = '<div class="profile-perfume-items">';
    matchedPerfumes.forEach(perfume => {
        const matchPercent = Math.round((perfume.matchCount / 2) * 100);
        html += `
            <div class="profile-perfume-item">
                <div class="perfume-match-bar">
                    <div class="perfume-match-fill" style="width: ${matchPercent}%"></div>
                </div>
                <div class="perfume-info">
                    <span class="perfume-name-small">💧 ${perfume.name}</span>
                    <span class="perfume-match-text">${matchPercent}% dopasowania</span>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    listContainer.innerHTML = html;
}

// Funkcja do zapisywania profilu
function saveProfile() {
    const age = document.getElementById('age').value;
    const city = document.getElementById('city').value;
    
    // Walidacja
    if (!age || !selectedGender || !city || selectedScents.length === 0) {
        alert('Proszę wypełnić wszystkie pola');
        return;
    }
    
    // Zapisz dane do localStorage
    const profileData = {
        age: age,
        gender: selectedGender,
        city: city,
        scents: selectedScents
    };
    
    localStorage.setItem('padibox_profile', JSON.stringify(profileData));
    
    alert('Profil został zapisany!');
    showScreen('home');
}

// Funkcja do ładowania profilu
function loadProfile() {
    const savedData = localStorage.getItem('padibox_profile');
    
    if (savedData) {
        const profile = JSON.parse(savedData);
        
        // Załaduj wiek
        document.getElementById('age').value = profile.age || '';
        
        // Załaduj płeć
        if (profile.gender) {
            selectedGender = profile.gender;
            document.querySelectorAll('.gender-button').forEach(btn => {
                if (btn.textContent === profile.gender) {
                    btn.classList.add('selected');
                }
            });
        }
        
        // Załaduj miasto
        document.getElementById('city').value = profile.city || '';
        
        // Załaduj zapachy
        selectedScents = profile.scents || [];
        document.querySelectorAll('.scent-card').forEach(card => {
            const scentLabel = card.querySelector('.scent-label').textContent;
            const scentMap = {
                'Świeże': 'fresh',
                'Słodkie': 'sweet',
                'Drzewne': 'woody',
                'Orientalne': 'oriental'
            };
            
            if (selectedScents.includes(scentMap[scentLabel])) {
                card.classList.add('selected');
            }
        });
    }
}

// Slider zdjęć
let currentSlideIndex = 0;

// Funkcja do próby alternatywnych formatów
function tryAlternativeFormat(img, baseName, placeholderNum) {
    const currentSrc = img.src;
    
    // Spróbuj różne rozszerzenia
    if (currentSrc.includes('.jpeg')) {
        // Spróbuj .jpg
        img.src = currentSrc.replace('.jpeg', '.jpg');
        img.onerror = function() {
            // Spróbuj .JPG (wielkie litery)
            this.src = currentSrc.replace('.jpeg', '.JPG');
            this.onerror = function() {
                // Spróbuj .JPEG (wielkie litery)
                this.src = currentSrc.replace('.jpeg', '.JPEG');
                this.onerror = function() {
                    // Spróbuj .png
                    this.src = currentSrc.replace('.jpeg', '.png');
                    this.onerror = function() {
                        // Pokaż placeholder
                        this.style.display = 'none';
                        const placeholder = document.querySelector('.placeholder-' + placeholderNum);
                        if (placeholder) {
                            placeholder.style.display = 'flex';
                            placeholder.classList.add('active');
                        }
                    };
                };
            };
        };
    }
}

// Funkcja do próby alternatywnych formatów dla logo
function tryLogoFormat(img) {
    if (img.src.includes('.png')) {
        img.src = img.src.replace('.png', '.jpg');
        img.onerror = function() {
            this.src = this.src.replace('.jpg', '.jpeg');
            this.onerror = function() {
                // Pokaż SVG fallback
                this.style.display = 'none';
                document.querySelector('.logo-fallback').style.display = 'block';
            };
        };
    }
}

function changeSlide(direction) {
    const images = document.querySelectorAll('.slider-image');
    const placeholders = document.querySelectorAll('.automat-placeholder');
    const dots = document.querySelectorAll('.dot');
    
    // Usuń active ze wszystkich
    images.forEach(img => img.classList.remove('active'));
    placeholders.forEach(ph => ph.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Zmień index
    currentSlideIndex += direction;
    if (currentSlideIndex >= 3) currentSlideIndex = 0;
    if (currentSlideIndex < 0) currentSlideIndex = 2;
    
    // Pokaż nowy slide
    if (images[currentSlideIndex].style.display !== 'none') {
        images[currentSlideIndex].classList.add('active');
    } else {
        placeholders[currentSlideIndex].classList.add('active');
    }
    dots[currentSlideIndex].classList.add('active');
}

function currentSlide(index) {
    const images = document.querySelectorAll('.slider-image');
    const placeholders = document.querySelectorAll('.automat-placeholder');
    const dots = document.querySelectorAll('.dot');
    
    // Usuń active ze wszystkich
    images.forEach(img => img.classList.remove('active'));
    placeholders.forEach(ph => ph.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlideIndex = index;
    
    // Pokaż wybrany slide
    if (images[currentSlideIndex].style.display !== 'none') {
        images[currentSlideIndex].classList.add('active');
    } else {
        placeholders[currentSlideIndex].classList.add('active');
    }
    dots[currentSlideIndex].classList.add('active');
}

// Auto-slider (opcjonalnie)
setInterval(() => {
    changeSlide(1);
}, 5000);

// Inicjalizacja - pokaż ekran główny
document.addEventListener('DOMContentLoaded', function() {
    showScreen('home');
});


// Dodaj aktualizację rekomendacji przy ładowaniu profilu
const originalLoadProfileData = loadProfileData;
loadProfileData = function() {
    const savedData = localStorage.getItem('padibox_profile');
    
    if (savedData) {
        const profile = JSON.parse(savedData);
        
        // Załaduj wiek
        document.getElementById('age').value = profile.age || '';
        
        // Załaduj płeć
        if (profile.gender) {
            selectedGender = profile.gender;
            document.querySelectorAll('.gender-button').forEach(btn => {
                if (btn.textContent === profile.gender) {
                    btn.classList.add('selected');
                }
            });
        }
        
        // Załaduj miasto
        document.getElementById('city').value = profile.city || '';
        
        // Załaduj zapachy
        selectedScents = profile.scents || [];
        document.querySelectorAll('.scent-card').forEach(card => {
            const scentLabel = card.querySelector('.scent-label').textContent;
            const scentMap = {
                'Świeże': 'fresh',
                'Słodkie': 'sweet',
                'Drzewne': 'woody',
                'Orientalne': 'oriental'
            };
            
            if (selectedScents.includes(scentMap[scentLabel])) {
                card.classList.add('selected');
            }
        });
        
        // Aktualizuj rekomendacje
        updateProfileRecommendations();
    }
};
