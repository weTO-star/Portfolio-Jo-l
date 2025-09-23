document.addEventListener('DOMContentLoaded', function() {
    // === Logic for the Price Calculator ===
    const optionCards = document.querySelectorAll('.option-item-card');
    const summaryList = document.getElementById('summary-list');
    const summaryTotalElement = document.getElementById('summary-total-price');
    const resetButton = document.getElementById('reset-calculator');

    let selectedItems = new Map();

    function updateSummary() {
        summaryList.innerHTML = '';
        let total = 0;

        selectedItems.forEach((price, label) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${label}</span><span class="summary-item-price">${price.toLocaleString('fr-FR')} AR</span>`;
            summaryList.appendChild(li);
            total += price;
        });

        summaryTotalElement.textContent = total.toLocaleString('fr-FR') + ' AR';
    }

    optionCards.forEach(card => {
        card.addEventListener('click', function() {
            const price = parseInt(this.dataset.price);
            const type = this.dataset.type;
            const label = this.querySelector('.option-label').textContent;

            // Gère l'exclusivité mutuelle pour le type de site
            if (type === 'vitrine' || type === 'ecommerce') {
                document.querySelectorAll('.option-item-card[data-type="vitrine"], .option-item-card[data-type="ecommerce"]').forEach(otherCard => {
                    otherCard.classList.remove('selected');
                    selectedItems.delete(otherCard.querySelector('.option-label').textContent);
                });
            }
            
            // Gère l'exclusivité mutuelle pour les types de réservation
            if (type === 'reservation-table') {
                const otherCard = document.querySelector('.option-item-card[data-type="reservation-chambre"]');
                if (otherCard.classList.contains('selected')) {
                    otherCard.classList.remove('selected');
                    selectedItems.delete(otherCard.querySelector('.option-label').textContent);
                }
            } else if (type === 'reservation-chambre') {
                const otherCard = document.querySelector('.option-item-card[data-type="reservation-table"]');
                if (otherCard.classList.contains('selected')) {
                    otherCard.classList.remove('selected');
                    selectedItems.delete(otherCard.querySelector('.option-label').textContent);
                }
            }

            // Bascule la sélection et met à jour la map
            if (this.classList.contains('selected')) {
                this.classList.remove('selected');
                selectedItems.delete(label);
            } else {
                this.classList.add('selected');
                selectedItems.set(label, price);
            }

            updateSummary();
        });
    });

    // Fonctionnalité du bouton Réinitialiser
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            optionCards.forEach(card => card.classList.remove('selected'));
            selectedItems.clear();
            updateSummary();
        });
    }

    // Définit la sélection par défaut au chargement de la page
    const defaultSiteType = document.querySelector('.option-item-card[data-type="vitrine"]');
    if (defaultSiteType) {
        defaultSiteType.classList.add('selected');
        const defaultLabel = defaultSiteType.querySelector('.option-label').textContent;
        const defaultPrice = parseInt(defaultSiteType.dataset.price);
        selectedItems.set(defaultLabel, defaultPrice);
        updateSummary();
    }

    // === Logic for the Cookie Banner ===
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept-btn');
    const cookieDeclineBtn = document.getElementById('cookie-decline-btn');
    const cookieSettingsBtn = document.getElementById('cookie-settings-btn');
    const cookieModal = document.getElementById('cookie-modal');
    const modalCloseBtn = document.querySelector('.modal-close');
    const saveSettingsBtn = document.querySelector('.cookie-btn-save');

    if (!localStorage.getItem('cookie_consent_status')) {
        setTimeout(() => {
            cookieBanner.style.display = 'block';
        }, 1000);
    }

    function acceptCookies() {
        localStorage.setItem('cookie_consent_status', 'accepted');
        cookieBanner.style.display = 'none';
        cookieModal.style.display = 'none';
        console.log('Cookies accepted');
    }

    function declineCookies() {
        localStorage.setItem('cookie_consent_status', 'declined');
        cookieBanner.style.display = 'none';
        cookieModal.style.display = 'none';
        console.log('Cookies declined');
    }

    window.openSettings = function() {
        cookieModal.style.display = 'block';
    }

    window.closeSettings = function() {
        cookieModal.style.display = 'none';
    }

    window.saveSettings = function() {
        const performanceToggle = document.getElementById('performance-toggle').checked;
        localStorage.setItem('performance_cookies', performanceToggle);
        localStorage.setItem('cookie_consent_status', 'customized');
        cookieBanner.style.display = 'none';
        cookieModal.style.display = 'none';
        console.log('Cookie preferences saved');
    }

    if (cookieAcceptBtn) {
        cookieAcceptBtn.addEventListener('click', acceptCookies);
    }
    if (cookieDeclineBtn) {
        cookieDeclineBtn.addEventListener('click', declineCookies);
    }
    if (cookieSettingsBtn) {
        cookieSettingsBtn.addEventListener('click', openSettings);
    }
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeSettings);
    }
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', saveSettings);
    }

    // === Logic for Scroll Animations ===
    const sections = document.querySelectorAll('.animated-section');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
    });
    
    // === Logic for particles.js ===
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#9cecfb"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#4FC3F7",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 6,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
    }

});