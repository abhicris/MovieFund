import { Movie, PlatformStats } from "@/types";

// Mock platform statistics
export const platformStats: PlatformStats = {
  totalAmountRaised: 1500000, // $1.5M
  totalInvestors: 450,
  totalReturnsEarned: 1750000, // $1.75M
  assetsUnderManagement: 1800000, // $1.8M
  moviesFunded: 18,
  moviesReleased: 12,
};

// Helper function to format currency
export function formatCurrency(amount: number): string {
  // Force USD formatting regardless of browser locale
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "symbol",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
}

// Helper function to format large numbers
export function formatLargeNumber(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  }
  return formatCurrency(amount);
}

// Genre display names
export const genreNames: Record<string, string> = {
  action: "Action",
  drama: "Drama",
  comedy: "Comedy",
  thriller: "Thriller",
  romance: "Romance",
  horror: "Horror",
  "sci-fi": "Sci-Fi",
  documentary: "Documentary",
  animation: "Animation",
  fantasy: "Fantasy",
};

// Language display names
export const languageNames: Record<string, string> = {
  hindi: "Hindi",
  english: "English",
  spanish: "Spanish",
  tamil: "Tamil",
  telugu: "Telugu",
  malayalam: "Malayalam",
  kannada: "Kannada",
  bengali: "Bengali",
  marathi: "Marathi",
};

// Status display names
export const statusNames: Record<string, string> = {
  "pre-production": "Pre-Production",
  "production": "In Production",
  "post-production": "Post-Production",
  "completed": "Completed",
  "released": "Released",
  "fully_funded": "Fully Funded",
};

// Helper function to calculate lot price (0.1% of budget)
function calculateLotPrice(budget: number): number {
  return budget / 1000; // 0.1% = budget / 1000
}

// Real movies data - Bollywood, Spanish, and Hollywood
export const mockMovies: Movie[] = [
  // BOLLYWOOD MOVIES
  {
    id: "1",
    title: "War 2",
    tagline: "The ultimate battle begins",
    director: "Ayan Mukerji",
    producer: "Aditya Chopra",
    productionCompany: "Yash Raj Films",
    genre: ["action", "thriller"],
    language: "hindi",
    budget: 50000000, // $50M
    totalLots: 1000,
    availableLots: 350,
    pricePerLot: calculateLotPrice(50000000), // $50,000 per lot
    projectedROI: 38.5,
    images: [
      "https://image.tmdb.org/t/p/w1280/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
      "https://image.tmdb.org/t/p/w1280/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
    ],
    poster: "https://image.tmdb.org/t/p/w500/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
    description: "A sequel to the 2019 blockbuster 'War', featuring Hrithik Roshan reprising his role as Major Kabir Dhaliwal, alongside Jr. NTR making his Bollywood debut. An action-packed spy thriller with high-octane sequences.",
    cast: ["Hrithik Roshan", "Jr. NTR", "Kiara Advani", "Ashutosh Rana"],
    releaseDate: new Date("2026-08-14"),
    status: "production",
    revenueProjection: {
      boxOffice: 95000000,
      streaming: 38000000,
      distribution: 25000000,
      total: 158000000,
    },
    returnsProjection: {
      year1: 38,
      year2: 77,
      year3: 115,
      year4: 154,
      year5: 192,
    },
    minimumInvestment: calculateLotPrice(50000000),
    maximumInvestment: 5000000,
    createdAt: new Date("2024-07-01"),
    updatedAt: new Date("2024-11-20"),
  },
  {
    id: "2",
    title: "Sikandar",
    tagline: "One man, two destinies",
    director: "A.R. Murugadoss",
    producer: "Sajid Nadiadwala",
    productionCompany: "Nadiadwala Grandson Entertainment",
    genre: ["action", "thriller"],
    language: "hindi",
    budget: 35000000, // $35M
    totalLots: 1000,
    availableLots: 420,
    pricePerLot: calculateLotPrice(35000000), // $35,000 per lot
    projectedROI: 42.2,
    images: [
      "https://image.tmdb.org/t/p/w1280/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
      "https://image.tmdb.org/t/p/w1280/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
    ],
    poster: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    description: "An action-packed entertainer featuring Salman Khan in a dual role, marking his collaboration with director A.R. Murugadoss. A high-stakes thriller with intense action sequences.",
    cast: ["Salman Khan", "Rashmika Mandanna", "Suniel Shetty", "Pooja Hegde"],
    releaseDate: new Date("2026-04-15"),
    status: "post-production",
    revenueProjection: {
      boxOffice: 65000000,
      streaming: 26000000,
      distribution: 17000000,
      total: 108000000,
    },
    returnsProjection: {
      year1: 42,
      year2: 84,
      year3: 126,
      year4: 168,
      year5: 210,
    },
    minimumInvestment: calculateLotPrice(35000000),
    maximumInvestment: 3500000,
    createdAt: new Date("2024-08-15"),
    updatedAt: new Date("2024-11-18"),
  },
  {
    id: "3",
    title: "Housefull 5",
    tagline: "The comedy returns",
    director: "Tarun Mansukhani",
    producer: "Sajid Nadiadwala",
    productionCompany: "Nadiadwala Grandson Entertainment",
    genre: ["comedy"],
    language: "hindi",
    budget: 25000000, // $25M
    totalLots: 1000,
    availableLots: 280,
    pricePerLot: calculateLotPrice(25000000), // $25,000 per lot
    projectedROI: 36.8,
    images: [
      "https://image.tmdb.org/t/p/w1280/2CAL2433ZeIihfX1Hb2139CX0pW.jpg",
      "https://image.tmdb.org/t/p/w1280/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    ],
    poster: "https://image.tmdb.org/t/p/w500/2CAL2433ZeIihfX1Hb2139CX0pW.jpg",
    description: "The fifth installment in the popular comedy franchise, bringing together actors from all previous 'Housefull' films for a grand ensemble cast. A hilarious comedy of errors.",
    cast: ["Akshay Kumar", "Riteish Deshmukh", "Abhishek Bachchan", "Sanjay Dutt", "Jacqueline Fernandez", "Kriti Sanon"],
    releaseDate: new Date("2026-06-06"),
    status: "production",
    revenueProjection: {
      boxOffice: 48000000,
      streaming: 19000000,
      distribution: 12000000,
      total: 79000000,
    },
    returnsProjection: {
      year1: 36,
      year2: 73,
      year3: 110,
      year4: 147,
      year5: 184,
    },
    minimumInvestment: calculateLotPrice(25000000),
    maximumInvestment: 2500000,
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-11-15"),
  },
  {
    id: "4",
    title: "Ramayana – The Legend Begins",
    tagline: "The epic tale of righteousness",
    director: "Nitesh Tiwari",
    producer: "Madhu Mantena",
    productionCompany: "Allu Aravind",
    genre: ["fantasy", "drama"],
    language: "hindi",
    budget: 75000000, // $75M
    totalLots: 1000,
    availableLots: 150,
    pricePerLot: calculateLotPrice(75000000), // $75,000 per lot
    projectedROI: 35.2,
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1280&q=80",
    ],
    poster: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    description: "A cinematic retelling of the epic 'Ramayana', featuring a star-studded cast portraying iconic characters. A grand visual spectacle with cutting-edge VFX.",
    cast: ["Ranbir Kapoor", "Sai Pallavi", "Yash", "Vijay Sethupathi"],
    releaseDate: new Date("2027-03-21"),
    status: "post-production",
    revenueProjection: {
      boxOffice: 140000000,
      streaming: 56000000,
      distribution: 37000000,
      total: 233000000,
    },
    returnsProjection: {
      year1: 35,
      year2: 70,
      year3: 105,
      year4: 140,
      year5: 175,
    },
    minimumInvestment: calculateLotPrice(75000000),
    maximumInvestment: 7500000,
    createdAt: new Date("2024-06-01"),
    updatedAt: new Date("2024-11-22"),
  },
  // SPANISH MOVIES
  {
    id: "5",
    title: "Romería",
    tagline: "A journey to find the truth",
    director: "Carla Simón",
    producer: "María Zamora",
    productionCompany: "Elastica Films",
    genre: ["drama"],
    language: "spanish",
    budget: 3500000, // $3.5M
    totalLots: 1000,
    availableLots: 380,
    pricePerLot: calculateLotPrice(3500000), // $3,500 per lot
    projectedROI: 44.5,
    images: [
      "https://image.tmdb.org/t/p/w1280/3KvQIMhE38L4HHf5aTUA2vT3n9R.jpg",
      "https://image.tmdb.org/t/p/w1280/4LmN5pQrT8vN9sW2xY6zB7cD8eF.jpg",
    ],
    poster: "https://image.tmdb.org/t/p/w500/3KvQIMhE38L4HHf5aTUA2vT3n9R.jpg",
    description: "A poignant drama following Marina, a young woman seeking the truth about her deceased biological father. Premiered at the 78th Cannes Film Festival.",
    cast: ["Llúcia Garcia", "Aina Clotet", "Jordi Pujol Dolcet"],
    releaseDate: new Date("2026-05-15"),
    status: "post-production",
    revenueProjection: {
      boxOffice: 6500000,
      streaming: 2600000,
      distribution: 1700000,
      total: 10800000,
    },
    returnsProjection: {
      year1: 44,
      year2: 89,
      year3: 133,
      year4: 178,
      year5: 222,
    },
    minimumInvestment: calculateLotPrice(3500000),
    maximumInvestment: 350000,
    createdAt: new Date("2024-08-20"),
    updatedAt: new Date("2024-11-18"),
  },
  {
    id: "6",
    title: "Calle Málaga",
    tagline: "Home is where the heart is",
    director: "Maryam Touzani",
    producer: "Nabil Ayouch",
    productionCompany: "Ali n' Productions",
    genre: ["drama"],
    language: "spanish",
    budget: 2800000, // $2.8M
    totalLots: 1000,
    availableLots: 450,
    pricePerLot: calculateLotPrice(2800000), // $2,800 per lot
    projectedROI: 41.8,
    images: [
      "https://image.tmdb.org/t/p/w1280/5MpN9qR2vT6wX8yZ3bC4dE5fG6h.jpg",
      "https://image.tmdb.org/t/p/w1280/6NqO4sE7fU9xY2aD5gH8iJ0kL1m.jpg",
    ],
    poster: "https://image.tmdb.org/t/p/w500/5MpN9qR2vT6wX8yZ3bC4dE5fG6h.jpg",
    description: "A moving drama about Maria Angeles, who fights to keep her childhood home in Morocco after her daughter decides to sell it. Premiered at the 82nd Venice International Film Festival.",
    cast: ["Carmen Maura", "Lubna Azabal", "Ayoub El Hilali"],
    releaseDate: new Date("2026-04-20"),
    status: "post-production",
    revenueProjection: {
      boxOffice: 5200000,
      streaming: 2100000,
      distribution: 1400000,
      total: 8700000,
    },
    returnsProjection: {
      year1: 41,
      year2: 83,
      year3: 124,
      year4: 166,
      year5: 207,
    },
    minimumInvestment: calculateLotPrice(2800000),
    maximumInvestment: 280000,
    createdAt: new Date("2024-09-10"),
    updatedAt: new Date("2024-11-12"),
  },
  {
    id: "7",
    title: "Nina",
    tagline: "Revenge is a dish best served cold",
    director: "Andrea Jaurrieta",
    producer: "Ibon Cormenzana",
    productionCompany: "Iris Productions",
    genre: ["thriller", "drama"],
    language: "spanish",
    budget: 4200000, // $4.2M
    totalLots: 1000,
    availableLots: 320,
    pricePerLot: calculateLotPrice(4200000), // $4,200 per lot
    projectedROI: 39.5,
    images: [
      "https://image.tmdb.org/t/p/w1280/7OrP5qS8tU0xY3bE6gI9jK1lM2n.jpg",
      "https://image.tmdb.org/t/p/w1280/8PsQ6rT9vV1yZ4cF7hJ0kL2mN3o.jpg",
    ],
    poster: "https://image.tmdb.org/t/p/w500/7OrP5qS8tU0xY3bE6gI9jK1lM2n.jpg",
    description: "A gripping thriller about 45-year-old Nina returning to her seaside hometown to seek revenge on the man who ruined her life thirty years prior.",
    cast: ["Patricia López Arnaiz", "Darío Grandinetti", "Elena Irureta"],
    releaseDate: new Date("2026-06-10"),
    status: "production",
    revenueProjection: {
      boxOffice: 7800000,
      streaming: 3100000,
      distribution: 2100000,
      total: 13000000,
    },
    returnsProjection: {
      year1: 39,
      year2: 79,
      year3: 118,
      year4: 158,
      year5: 197,
    },
    minimumInvestment: calculateLotPrice(4200000),
    maximumInvestment: 420000,
    createdAt: new Date("2024-07-15"),
    updatedAt: new Date("2024-11-25"),
  },
  {
    id: "8",
    title: "Me has robado el corazón",
    tagline: "Love on the run",
    director: "Chus Gutiérrez",
    producer: "Álvaro Longoria",
    productionCompany: "Morena Films",
    genre: ["romance", "comedy"],
    language: "spanish",
    budget: 2200000, // $2.2M
    totalLots: 1000,
    availableLots: 0,
    pricePerLot: calculateLotPrice(2200000), // $2,200 per lot
    projectedROI: 43.2,
    images: [
      "https://image.tmdb.org/t/p/w1280/9QtR7sU1wX2yZ5dG8iJ1lM3nO4p.jpg",
      "https://image.tmdb.org/t/p/w1280/0RuS8tV2xY3aE9hK2lM4nO5pQ6r.jpg",
    ],
    poster: "https://image.tmdb.org/t/p/w500/9QtR7sU1wX2yZ5dG8iJ1lM3nO4p.jpg",
    description: "A romantic comedy following Eric, who after robbing a bank, tricks his dating app match Vera into becoming his driver during his escape from Madrid to Galicia.",
    cast: ["Óscar Casas", "Ana Jara", "María Botto"],
    releaseDate: new Date("2026-03-15"),
    status: "fully_funded",
    revenueProjection: {
      boxOffice: 4100000,
      streaming: 1650000,
      distribution: 1100000,
      total: 6850000,
    },
    returnsProjection: {
      year1: 43,
      year2: 86,
      year3: 129,
      year4: 172,
      year5: 215,
    },
    minimumInvestment: calculateLotPrice(2200000),
    maximumInvestment: 220000,
    createdAt: new Date("2024-05-01"),
    updatedAt: new Date("2024-10-30"),
  },
  // HOLLYWOOD MOVIES
  {
    id: "9",
    title: "Superman",
    tagline: "Truth, justice, and a better tomorrow",
    director: "James Gunn",
    producer: "Peter Safran",
    productionCompany: "DC Studios",
    genre: ["action", "sci-fi"],
    language: "english",
    budget: 200000000, // $200M
    totalLots: 1000,
    availableLots: 180,
    pricePerLot: calculateLotPrice(200000000), // $200,000 per lot
    projectedROI: 32.5,
    images: [
      "https://image.tmdb.org/t/p/w1280/1SuP3rV4xY4bF0hK3lM5nO6pQ7s.jpg",
      "https://image.tmdb.org/t/p/w1280/2TvQ4sW5yZ5dG9iJ2lM6nO7pR8t.jpg",
    ],
    poster: "https://image.tmdb.org/t/p/w500/1SuP3rV4xY4bF0hK3lM5nO6pQ7s.jpg",
    description: "A fresh take on the iconic superhero, exploring Superman's journey to reconcile his alien heritage with his human upbringing. Directed by James Gunn.",
    cast: ["David Corenswet", "Rachel Brosnahan", "Nicholas Hoult", "Isabela Merced"],
    releaseDate: new Date("2026-07-11"),
    status: "production",
    revenueProjection: {
      boxOffice: 380000000,
      streaming: 150000000,
      distribution: 100000000,
      total: 630000000,
    },
    returnsProjection: {
      year1: 32,
      year2: 65,
      year3: 97,
      year4: 130,
      year5: 162,
    },
    minimumInvestment: calculateLotPrice(200000000),
    maximumInvestment: 20000000,
    createdAt: new Date("2024-06-01"),
    updatedAt: new Date("2024-11-25"),
  },
  {
    id: "10",
    title: "Mission: Impossible – The Final Reckoning",
    tagline: "The end begins",
    director: "Christopher McQuarrie",
    producer: "Tom Cruise",
    productionCompany: "Paramount Pictures",
    genre: ["action", "thriller"],
    language: "english",
    budget: 290000000, // $290M
    totalLots: 1000,
    availableLots: 120,
    pricePerLot: calculateLotPrice(290000000), // $290,000 per lot
    projectedROI: 34.8,
    images: [
      "https://image.tmdb.org/t/p/w1280/3UvR5tW6yZ6dG0hK4lM7nO8pS9u.jpg",
      "https://image.tmdb.org/t/p/w1280/4VwS6tX7yZ7dG1hK5lM8nO9pT0v.jpg",
    ],
    poster: "https://image.tmdb.org/t/p/w500/3UvR5tW6yZ6dG0hK4lM7nO8pS9u.jpg",
    description: "Ethan Hunt returns for another high-stakes mission in the final chapter of the Mission: Impossible franchise. Death-defying stunts and intense action sequences.",
    cast: ["Tom Cruise", "Hayley Atwell", "Ving Rhames", "Simon Pegg", "Rebecca Ferguson"],
    releaseDate: new Date("2026-05-23"),
    status: "production",
    revenueProjection: {
      boxOffice: 550000000,
      streaming: 220000000,
      distribution: 145000000,
      total: 915000000,
    },
    returnsProjection: {
      year1: 34,
      year2: 69,
      year3: 104,
      year4: 139,
      year5: 174,
    },
    minimumInvestment: calculateLotPrice(290000000),
    maximumInvestment: 29000000,
    createdAt: new Date("2024-07-15"),
    updatedAt: new Date("2024-11-20"),
  },
  {
    id: "11",
    title: "Avatar: Fire and Ash",
    tagline: "The saga continues",
    director: "James Cameron",
    producer: "Jon Landau",
    productionCompany: "Lightstorm Entertainment",
    genre: ["sci-fi", "fantasy"],
    language: "english",
    budget: 350000000, // $350M
    totalLots: 1000,
    availableLots: 90,
    pricePerLot: calculateLotPrice(350000000), // $350,000 per lot
    projectedROI: 31.2,
    images: [
      "https://image.tmdb.org/t/p/w1280/5WxS7tY8yZ8dG2hK6lM9nO0pU1w.jpg",
      "https://image.tmdb.org/t/p/w1280/6XyS8tZ9yZ9dG3hK7lM0nO1pV2x.jpg",
    ],
    poster: "https://image.tmdb.org/t/p/w500/5WxS7tY8yZ8dG2hK6lM9nO0pU1w.jpg",
    description: "Continues the epic saga on Pandora with groundbreaking visual effects and immersive storytelling. The next chapter in James Cameron's visionary franchise.",
    cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver", "Stephen Lang"],
    releaseDate: new Date("2027-12-19"),
    status: "post-production",
    revenueProjection: {
      boxOffice: 650000000,
      streaming: 260000000,
      distribution: 170000000,
      total: 1080000000,
    },
    returnsProjection: {
      year1: 31,
      year2: 62,
      year3: 93,
      year4: 124,
      year5: 155,
    },
    minimumInvestment: calculateLotPrice(350000000),
    maximumInvestment: 35000000,
    createdAt: new Date("2024-05-01"),
    updatedAt: new Date("2024-11-22"),
  },
  {
    id: "12",
    title: "Wake Up Dead Man: A Knives Out Mystery",
    tagline: "The game is afoot",
    director: "Rian Johnson",
    producer: "Ram Bergman",
    productionCompany: "T-Street Productions",
    genre: ["thriller", "comedy"],
    language: "english",
    budget: 45000000, // $45M
    totalLots: 1000,
    availableLots: 250,
    pricePerLot: calculateLotPrice(45000000), // $45,000 per lot
    projectedROI: 37.5,
    images: [
      "https://image.tmdb.org/t/p/w1280/7YzS9tZ0yZ0dG4hK8lM1nO2pW3y.jpg",
      "https://image.tmdb.org/t/p/w1280/8ZzS0tZ1yZ1dG5hK9lM2nO3pX4z.jpg",
    ],
    poster: "https://image.tmdb.org/t/p/w500/7YzS9tZ0yZ0dG4hK8lM1nO2pW3y.jpg",
    description: "Detective Benoit Blanc tackles a new mystery in this third installment of the Knives Out series. A clever whodunit with sharp wit and unexpected twists.",
    cast: ["Daniel Craig", "Josh O'Connor", "Cailee Spaeny", "Andrew Scott", "Kerry Washington"],
    releaseDate: new Date("2026-09-15"),
    status: "pre-production",
    revenueProjection: {
      boxOffice: 85000000,
      streaming: 34000000,
      distribution: 22000000,
      total: 141000000,
    },
    returnsProjection: {
      year1: 37,
      year2: 75,
      year3: 112,
      year4: 150,
      year5: 187,
    },
    minimumInvestment: calculateLotPrice(45000000),
    maximumInvestment: 4500000,
    createdAt: new Date("2024-10-01"),
    updatedAt: new Date("2024-11-10"),
  },
];
