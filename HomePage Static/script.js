// ================================
// BUTTON FOCUS HANDLER
// ================================
class ButtonFocusHandler {
  constructor() {
    this.init();
  }

  init() {
    // Quitar focus inmediatamente de botones y enlaces después de hacer click
    document.addEventListener('mousedown', (e) => {
      const target = e.target.closest('button, a, .btn');
      if (target) {
        // Prevenir que el botón reciba focus
        e.preventDefault();
        // Ejecutar el click manualmente
        target.click();
      }
    });

    // También manejar con click directo
    document.addEventListener('click', (e) => {
      const target = e.target.closest('button, a, .btn');
      if (target) {
        // Quitar focus inmediatamente
        target.blur();
      }
    });
  }
}


// ================================
// THEME SYSTEM
// ================================
class ThemeManager {
  constructor() {
    this.theme = this.getStoredTheme();
    this.themeToggle = document.getElementById("themeToggle");
    this.init();
  }

  getStoredTheme() {
    // No usar localStorage en artifacts, usar valor por defecto
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  }

  init() {
    this.applyTheme(this.theme);
    if (this.themeToggle) {
      this.themeToggle.addEventListener("click", () => this.toggleTheme());
    }
  }

  toggleTheme() {
    this.theme = this.theme === "dark" ? "light" : "dark";
    this.applyTheme(this.theme);
  }

  applyTheme(theme) {
    document.body.setAttribute("data-theme", theme);
    const icon = this.themeToggle?.querySelector("i");

    if (icon) {
      if (theme === "dark") {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
        this.themeToggle.setAttribute("aria-label", "Cambiar a modo claro");
      } else {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
        this.themeToggle.setAttribute("aria-label", "Cambiar a modo oscuro");
      }
    }
  }
}

// ================================
// API DATA LOADER
// ================================
class DataLoader {
  constructor() {
    this.api = window.spiderManAPI;
    this.gamesContainer = document.getElementById("gamesContainer");
    this.galleryContainer = document.getElementById("galleryContainer");
  }

  async init() {
    console.log("[Optimized] Initializing data loader...");
    await Promise.all([
      this.loadGames(),
      this.loadGallery()
    ]);
    this.initializeAOS();
  }

  async loadGames() {
    try {
      console.log("[Optimized] Loading games from API...");
      const response = await this.api.getGames();

      if (response.success) {
        console.log("[Optimized] Games loaded:", response.data.length);
        this.renderGames(response.data);
      } else {
        throw new Error("Failed to load games");
      }
    } catch (error) {
      console.error("[Optimized] Error loading games:", error);
      this.showError(this.gamesContainer, "Error al cargar los juegos");
    }
  }

  renderGames(games) {
    this.gamesContainer.innerHTML = games
      .map((game, index) => `
        <div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="${index * 100}">
          <article class="game-card neomorph">
            <div class="game-media-wrapper">
              <img src="${game.image}" 
                   alt="${game.title} - Juego de Spider-Man para ${game.platform}"
                   class="game-image"
                   loading="${index < 3 ? 'eager' : 'lazy'}">
              
              <video class="game-video" 
                     muted 
                     loop 
                     preload="none"
                     playsinline
                     poster="${game.image}">
                <source src="${game.video}" type="video/mp4">
                Tu navegador no soporta el elemento de video.
              </video>
              
              <div class="game-platform">
                <span class="badge neomorph">
                  <i class="fab fa-playstation" aria-hidden="true"></i> ${game.platform}
                </span>
              </div>
              
              <div class="video-indicator">
                <i class="fas fa-play-circle" aria-hidden="true"></i>
                <span>Hover para ver video</span>
              </div>
            </div>
            
            <div class="game-content">
              <h3>${game.title}</h3>
              <p>${game.description}</p>
              
              <div class="game-features" role="list">
                ${game.features.map(feature => `
                  <span class="feature-badge" role="listitem">${feature}</span>
                `).join("")}
              </div>
              
              <div class="d-flex align-items-center justify-content-between mb-3">
                <div class="rating">
                  <i class="fas fa-star text-warning" aria-hidden="true"></i>
                  <span class="ms-1 fw-bold">${game.rating}</span>
                  <span class="text-muted">/5.0</span>
                </div>
                <div class="text-muted">
                  <i class="far fa-calendar" aria-hidden="true"></i>
                  <span class="ms-1">${game.year}</span>
                </div>
              </div>
              
              <button class="btn btn-primary btn-game" 
                      onclick="alert('Redirigiendo a PlayStation Store...')">
                <i class="fab fa-playstation me-2" aria-hidden="true"></i>
                Comprar Ahora
              </button>
            </div>
          </article>
        </div>
      `).join("");
    
    // Inicializar controles de video
    this.initializeVideoControls();
  }

  initializeVideoControls() {
    const gameCards = document.querySelectorAll('.game-card');
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    gameCards.forEach(card => {
      const video = card.querySelector('.game-video');
      const image = card.querySelector('.game-image');
      const indicator = card.querySelector('.video-indicator');
      
      if (!video || !image) return;

      // ConfiguraciÃ³n para dispositivos tÃ¡ctiles
      if (isTouchDevice) {
        this.setupTouchControls(card, video, image, indicator);
      } else {
        // ConfiguraciÃ³n para escritorio (hover)
        this.setupHoverControls(card, video, image);
      }
    });
  }

  setupHoverControls(card, video, image) {
    let isVideoLoaded = false;

    card.addEventListener('mouseenter', () => {
      if (!isVideoLoaded) {
        video.load();
        isVideoLoaded = true;
      }
      
      image.style.opacity = '0';
      video.style.opacity = '1';
      
      video.play().catch(e => {
        console.log("Autoplay prevented:", e);
      });
    });
    
    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
      video.style.opacity = '0';
      image.style.opacity = '1';
    });
  }

  setupTouchControls(card, video, image, indicator) {
    let isActive = false;

    card.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Si ya estÃ¡ activo, cerrar
      if (isActive) {
        this.closeVideo(card, video, image, indicator);
        isActive = false;
        return;
      }

      // Cerrar otros videos activos
      document.querySelectorAll('.game-card.mobile-active').forEach(activeCard => {
        if (activeCard !== card) {
          const activeVideo = activeCard.querySelector('.game-video');
          const activeImage = activeCard.querySelector('.game-image');
          const activeIndicator = activeCard.querySelector('.video-indicator');
          this.closeVideo(activeCard, activeVideo, activeImage, activeIndicator);
        }
      });

      // Activar este video
      card.classList.add('mobile-active');
      isActive = true;
      
      video.style.opacity = '1';
      image.style.opacity = '0';
      video.controls = true;
      
      video.play().then(() => {
        if (indicator) indicator.style.display = 'none';
      }).catch(() => {
        if (indicator) {
          indicator.innerHTML = '<i class="fas fa-exclamation-circle"></i><span>Toca el botÃ³n play</span>';
        }
      });
    });

    // Cuando el video termina
    video.addEventListener('ended', () => {
      this.closeVideo(card, video, image, indicator);
      isActive = false;
    });
  }

  closeVideo(card, video, image, indicator) {
    card.classList.remove('mobile-active');
    video.pause();
    video.currentTime = 0;
    video.style.opacity = '0';
    image.style.opacity = '1';
    video.controls = false;
    
    if (indicator) {
      indicator.style.display = 'flex';
      indicator.innerHTML = '<i class="fas fa-play-circle"></i><span>Toca para ver video</span>';
    }
  }

  async loadGallery() {
    try {
      console.log("[Optimized] Loading gallery from API...");
      const response = await this.api.getGalleryImages();

      if (response.success) {
        console.log("[Optimized] Gallery loaded:", response.data.length);
        this.renderGallery(response.data);
      } else {
        throw new Error("Failed to load gallery");
      }
    } catch (error) {
      console.error("[Optimized] Error loading gallery:", error);
      this.showError(this.galleryContainer, "Error al cargar la galerÃ­a");
    }
  }

  renderGallery(images) {
    this.galleryContainer.innerHTML = images
      .map((image, index) => `
        <div class="col-lg-4 col-md-6 mb-4" data-aos="zoom-in" data-aos-delay="${index * 100}">
          <article class="gallery-item neomorph">
            <img src="${image.image}" 
                 alt="${image.description}"
                 loading="${index < 6 ? 'eager' : 'lazy'}">
            <div class="gallery-overlay">
              <h4>${image.title}</h4>
            </div>
          </article>
        </div>
      `).join("");
  }

  showError(container, message) {
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger neomorph" role="alert">
          <i class="fas fa-exclamation-triangle me-2" aria-hidden="true"></i>
          ${message}
        </div>
      </div>
    `;
  }

  initializeAOS() {
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 800,
        easing: "ease-out-cubic",
        once: true,
        offset: 100,
        disable: window.innerWidth < 768 ? true : false
      });
    }
  }
}

// ================================
// SMOOTH SCROLL
// ================================
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const href = anchor.getAttribute("href");

        if (href === "#" || href === "#home") {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerOffset = 80;
          const targetPosition = target.offsetTop - headerOffset;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });

          // Close mobile menu if open
          const navbarCollapse = document.querySelector(".navbar-collapse");
          if (navbarCollapse && navbarCollapse.classList.contains("show")) {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
            if (bsCollapse) {
              bsCollapse.hide();
            }
          }
        }
      });
    });
  }
}

// ================================
// NAVBAR BACKGROUND ON SCROLL
// ================================
class NavbarScroll {
  constructor() {
    this.header = document.querySelector(".header-nav");
    this.init();
  }

  init() {
    let lastScroll = 0;
    let ticking = false;

    window.addEventListener("scroll", () => {
      lastScroll = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (lastScroll > 100) {
            this.header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.3)";
          } else {
            this.header.style.boxShadow = "none";
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }
}

// ================================
// KEYBOARD NAVIGATION
// ================================
class KeyboardNavigation {
  constructor() {
    this.init();
  }

  init() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        // Cerrar videos en mÃ³viles
        document.querySelectorAll('.game-card.mobile-active').forEach(card => {
          const video = card.querySelector('.game-video');
          const image = card.querySelector('.game-image');
          if (video) {
            video.pause();
            video.currentTime = 0;
            video.style.opacity = '0';
            video.controls = false;
          }
          if (image) image.style.opacity = '1';
          card.classList.remove('mobile-active');
        });
        
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }
}

// ================================
// IMAGE OPTIMIZER
// ================================
class ImageOptimizer {
  constructor() {
    this.init();
  }

  init() {
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            this.loadImage(img);
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: "50px"
      });

      document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
        imageObserver.observe(img);
      });
    }
  }

  loadImage(img) {
    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.classList.add("loaded");
    }
  }
}

// ================================
// 3D CAROUSEL
// ================================
class Carousel3D {
  constructor() {
    this.inner = document.querySelector('.three-d-suits-section .inner');
    this.isAutoRotating = true;
    this.animationSpeed = 40;
    this.init();
  }

  init() {
    // Auto-rotation is handled by CSS animation
  }

  pause() {
    if (this.inner) {
      this.inner.style.animationPlayState = 'paused';
    }
  }

  resume() {
    if (this.inner) {
      this.inner.style.animationPlayState = 'running';
    }
  }

  toggleAutoRotation() {
    this.isAutoRotating = !this.isAutoRotating;
    if (this.isAutoRotating) {
      this.resume();
    } else {
      this.pause();
    }
    return this.isAutoRotating;
  }

  setSpeed(speed) {
    this.animationSpeed = speed;
    if (this.inner) {
      this.inner.style.animationDuration = `${speed}s`;
    }
  }
}

// ================================
// PERFORMANCE OPTIMIZER
// ================================
class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    // Pausar videos cuando no estÃ¡n visibles
    if ("IntersectionObserver" in window) {
      const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (!entry.isIntersecting && !video.paused) {
            video.pause();
          }
        });
      }, {
        threshold: 0.25
      });

      // Observar despuÃ©s de que los videos se carguen
      setTimeout(() => {
        document.querySelectorAll('.game-video').forEach((video) => {
          videoObserver.observe(video);
        });
      }, 2000);
    }
  }

  // Optimizar rendimiento en dispositivos de baja potencia
  detectLowPowerMode() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return connection?.saveData || false;
  }
}

// ================================
// INITIALIZATION
// ================================
document.addEventListener("DOMContentLoaded", () => {
  console.log("[Optimized] Initializing Spider-Man Website...");

  // Initialize all modules
  new ThemeManager();
  new DataLoader().init();
  new SmoothScroll();
  new NavbarScroll();
  new KeyboardNavigation();
  new ImageOptimizer();
  new Carousel3D();
  new PerformanceOptimizer();

  console.log("[Optimized] Website initialized successfully!");
});

// Funciones globales para controles del carrusel (si se necesitan)
let carousel3D;

window.pauseRotation = function() {
  if (!carousel3D) carousel3D = new Carousel3D();
  carousel3D.pause();
}

window.resumeRotation = function() {
  if (!carousel3D) carousel3D = new Carousel3D();
  carousel3D.resume();
}

window.toggleAutoRotation = function() {
  if (!carousel3D) carousel3D = new Carousel3D();
  carousel3D.toggleAutoRotation();
}