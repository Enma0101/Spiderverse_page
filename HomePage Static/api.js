// API REST para obtener datos e imágenes de los juegos de Spider-Man
class SpiderManAPI {
  constructor() {
    // Base URL para las imágenes locales
    this.imageBaseURL = "./public"

    // Mock database de juegos
    this.gamesData = [
      {
        id: 1,
        title: "Marvel's Spider-Man",
        platform: "PS4",
        year: 2018,
        description:
          "Sumérgete en el universo de Spider-Man con una historia original. Balancea por Manhattan, combate el crimen y enfrenta villanos icónicos en esta aventura épica de mundo abierto.",
        features: ["Ray Tracing", "60 FPS", "4K HDR", "Mundo Abierto"],
        image: "./public/spider-man-ps4-game-swinging-through-city.webp",
        video: "./video/Marvel's-Spider-Man-1.mp4", 
        rating: 4.9,
        color: "#e50914",
      },
      {
        id: 2,
        title: "Spider-Man: Miles Morales",
        platform: "PS5",
        year: 2020,
        description:
          "Experimenta el poder eléctrico de Miles Morales en su primera aventura como Spider-Man. Nuevas habilidades de Venom y camuflaje te esperan en un Nueva York nevado.",
        features: ["Ray Tracing", "120 FPS", "4K Native", "Haptic Feedback"],
        image: "./public/miles-morales-spider-man-game-electric-powers.webp",
        video: "./video/Spiderma-Miles-morales.mp4",
        rating: 4.8,
        color: "#ffd700",
      },
      {
        id: 3,
        title: "Marvel's Spider-Man 2",
        platform: "PS5",
        year: 2023,
        description:
          "Peter Parker y Miles Morales se unen en la aventura más grande. Enfrenta a Venom, explora Queens y Brooklyn, y domina el simbionte en esta secuela revolucionaria.",
        features: ["Ray Tracing", "60 FPS", "4K Ultra", "Dual Protagonists"],
        image: "./public/spider-man-2-ps5-peter-and-miles-dual-heroes.webp",
        video: "./video/Marvel's-Spider-Man-2.mp4",
        rating: 5.0,
        color: "#0066cc",
      },
    ]

    // Mock database de imágenes para la galería
    this.galleryData = [
      {
        id: 1,
        title: "Spider-Man Swinging",
        description: "Balanceándose por Nueva York",
        image: "./public/spider-man-swinging-between-buildings-manhattan-sk.webp",
        category: "gameplay",
      },
      {
        id: 2,
        title: "Miles Morales Powers",
        description: "Poderes eléctricos de Venom",
        image: "./public/miles-morales-electric-venom-powers-glowing.webp",
        category: "powers",
      },
      {
        id: 3,
        title: "Combat System",
        description: "Sistema de combate dinámico",
        image: "./public/spider-man-combat-fighting-enemies-acrobatic.webp",
        category: "combat",
      },
      {
        id: 4,
        title: "New York City",
        description: "Ciudad abierta detallada",
        image: "./public/new-york-city-skyline-sunset-spider-man-game.webp",
        category: "world",
      },
      {
        id: 5,
        title: "Symbiote Suit",
        description: "Traje simbionte de Venom",
        image: "./public/spider-man-black-symbiote-suit-venom-dark.webp",
        category: "suits",
      },
      {
        id: 6,
        title: "Villains",
        description: "Villanos icónicos",
        image: "./public/spider-man-villains-confrontation-epic-battle.webp",
        category: "villains",
      },
    ]

    // Imagen para el hero
    this.heroImage = "./public/Spiderman.webp"
  }

  // Simular delay de red para hacer la API más realista
  async simulateNetworkDelay(minMs = 500, maxMs = 1500) {
    const delay = Math.random() * (maxMs - minMs) + minMs
    return new Promise((resolve) => setTimeout(resolve, delay))
  }

  // GET: Obtener todos los juegos
  async getGames() {
    console.log("[v0] API: Fetching games...")
    await this.simulateNetworkDelay()

    return {
      success: true,
      data: this.gamesData,
      timestamp: new Date().toISOString(),
    }
  }

  // GET: Obtener un juego por ID
  async getGameById(id) {
    console.log(`[v0] API: Fetching game with ID ${id}...`)
    await this.simulateNetworkDelay(300, 800)

    const game = this.gamesData.find((g) => g.id === Number.parseInt(id))

    if (game) {
      return {
        success: true,
        data: game,
        timestamp: new Date().toISOString(),
      }
    } else {
      return {
        success: false,
        error: "Game not found",
        timestamp: new Date().toISOString(),
      }
    }
  }

  // GET: Obtener imagen del hero
  async getHeroImage() {
    console.log("[v0] API: Fetching hero image...")
    await this.simulateNetworkDelay(200, 500)

    return {
      success: true,
      data: { url: this.heroImage },
      timestamp: new Date().toISOString(),
    }
  }

  // GET: Obtener imágenes de la galería
  async getGalleryImages() {
    console.log("[v0] API: Fetching gallery images...")
    await this.simulateNetworkDelay()

    return {
      success: true,
      data: this.galleryData,
      timestamp: new Date().toISOString(),
    }
  }

  // GET: Obtener imágenes por categoría
  async getImagesByCategory(category) {
    console.log(`[v0] API: Fetching images for category ${category}...`)
    await this.simulateNetworkDelay(300, 800)

    const images = this.galleryData.filter((img) => img.category === category)

    return {
      success: true,
      data: images,
      timestamp: new Date().toISOString(),
    }
  }

  // GET: Búsqueda de juegos por plataforma
  async getGamesByPlatform(platform) {
    console.log(`[v0] API: Fetching games for platform ${platform}...`)
    await this.simulateNetworkDelay(400, 1000)

    const games = this.gamesData.filter((game) => game.platform.toLowerCase() === platform.toLowerCase())

    return {
      success: true,
      data: games,
      count: games.length,
      timestamp: new Date().toISOString(),
    }
  }

  // GET: Obtener estadísticas
  async getStats() {
    console.log("[v0] API: Fetching statistics...")
    await this.simulateNetworkDelay(200, 500)

    return {
      success: true,
      data: {
        totalGames: this.gamesData.length,
        totalImages: this.galleryData.length,
        platforms: ["PS4", "PS5"],
        averageRating: (this.gamesData.reduce((acc, game) => acc + game.rating, 0) / this.gamesData.length).toFixed(1),
      },
      timestamp: new Date().toISOString(),
    }
  }
}

// Crear instancia global de la API
const spiderManAPI = new SpiderManAPI()

// Exportar para uso global en el navegador
if (typeof window !== "undefined") {
  window.spiderManAPI = spiderManAPI
}

// Exportar para uso en Node.js (si se necesita)
if (typeof module !== "undefined" && module.exports) {
  module.exports = SpiderManAPI
}