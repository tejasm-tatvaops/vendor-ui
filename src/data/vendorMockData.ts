export type RatingBreakdownItem = {
  stars: number;
  count: number;
};

export type ReviewItem = {
  id: string;
  reviewerName: string;
  location: string;
  projectType: string;
  date: string;
  rating: number;
  comment: string;
  verifiedProject: boolean;
  images?: string[];
};

export type PortfolioItem = {
  id: string;
  title: string;
  category: "Villas" | "Apartments" | "Interiors";
  date: string;
  image: string;
  beforeImage?: string;
  afterImage?: string;
  youtubeUrl?: string;
};

export type PricingTier = {
  name: "Basic" | "Standard" | "Premium";
  pricePerSqft: number;
  materials: string[];
  finishingLevel: string;
};

export type CertificationDocument = {
  id: string;
  title: string;
  image: string;
  status?: string;
  verifiedAt?: string;
};

export type VendorData = {
  id: string;
  companyName: string;
  legalName: string;
  verified: boolean;
  ownerName: string;
  email: string;
  phone: string;
  gstNumber: string;
  panNumber: string;
  companyType: string;
  status: "active" | "inactive";
  category: string;
  location: string;
  natureOfBusiness: string;
  description: string;
  services: string[];
  projectsCompleted: number;
  projectsOngoing: number;
  projectsAssigned: number;
  yearsOfExperience?: number;
  nextAvailableDate: string;
  avgCompletionTime: string;
  trustByHomeowners: number;
  basePricePerSqft: number;
  ratingsAverage: number;
  ratingsCount: number;
  ratingBreakdown: RatingBreakdownItem[];
  reviews: ReviewItem[];
  portfolio: PortfolioItem[];
  pricingTiers: PricingTier[];
  certificationDocuments: CertificationDocument[];
  aiInsight: string;
  mapAddress: string;
  lastUpdatedAt?: string;
};

const sampleImages = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"
];

export const vendorMockData: VendorData = {
  id: "69d10b7cd8c73e8f8d7f3929",
  companyName: "RANDOM NUMBERS PRIVATE LIMITED",
  legalName: "RANDOM NUMBERS PRIVATE LIMITED",
  verified: true,
  ownerName: "Rahul Chandran",
  email: "mahadev.h@tatvaops.com",
  phone: "7483609399",
  gstNumber: "32AAHCR7467A1ZI",
  panNumber: "AAHCR7467A",
  companyType: "Private Limited Company",
  status: "active",
  category: "Residential Construction",
  location: "Kochi",
  natureOfBusiness: "Supplier of Services",
  description:
    "Execution-focused residential contractor with strong delivery consistency in apartment and villa projects.",
  services: [
    "Residential Construction",
    "Interiors",
    "Painting",
    "Plumbing Services",
    "Electrical Services",
    "Solar Services",
    "Event Management",
    "Property Development"
  ],
  projectsCompleted: 21,
  projectsOngoing: 2,
  projectsAssigned: 4,
  yearsOfExperience: 0,
  nextAvailableDate: "2026-05-14",
  avgCompletionTime: "4.8 months",
  trustByHomeowners: 21,
  basePricePerSqft: 1200,
  ratingsAverage: 4.3,
  ratingsCount: 58,
  ratingBreakdown: [
    { stars: 5, count: 34 },
    { stars: 4, count: 14 },
    { stars: 3, count: 6 },
    { stars: 2, count: 2 },
    { stars: 1, count: 2 }
  ],
  reviews: [
    {
      id: "r1",
      reviewerName: "Nithin Mathew",
      location: "Kakkanad, Kochi",
      projectType: "2BHK Apartment Interior",
      date: "Apr 2026",
      rating: 5,
      verifiedProject: true,
      comment:
        "Clear communication and quick execution. Site updates were on time, and snagging was resolved in two days.",
      images: [sampleImages[0]]
    },
    {
      id: "r2",
      reviewerName: "Amina Rahman",
      location: "Thrippunithura",
      projectType: "Villa Renovation",
      date: "Mar 2026",
      rating: 4,
      verifiedProject: true,
      comment:
        "Good value for money and quality finishing for the budget segment. Slight delay during tile procurement.",
      images: [sampleImages[1], sampleImages[2]]
    },
    {
      id: "r3",
      reviewerName: "Rakesh Nair",
      location: "Aluva",
      projectType: "Electrical + Plumbing",
      date: "Jan 2026",
      rating: 4,
      verifiedProject: false,
      comment: "Professional team and transparent BOQ. Recommended for functional, fast-track projects."
    }
  ],
  portfolio: [
    {
      id: "p1",
      title: "Luxury Villa - Plumbing",
      category: "Villas",
      date: "Apr 2026",
      image: sampleImages[0],
      beforeImage: sampleImages[2],
      afterImage: sampleImages[0]
    },
    {
      id: "p2",
      title: "Apartment Electrical Upgrade",
      category: "Apartments",
      date: "Apr 2026",
      image: sampleImages[1],
      beforeImage: sampleImages[2],
      afterImage: sampleImages[1]
    },
    {
      id: "p3",
      title: "Modular Interior Fit-out",
      category: "Interiors",
      date: "Apr 2026",
      image: sampleImages[2],
      beforeImage: sampleImages[1],
      afterImage: sampleImages[2]
    }
  ],
  pricingTiers: [
    {
      name: "Basic",
      pricePerSqft: 1200,
      materials: ["Standard cement", "Economy paint", "Basic fixtures"],
      finishingLevel: "Functional finish for budget homes"
    },
    {
      name: "Standard",
      pricePerSqft: 1550,
      materials: ["Premium cement", "Branded paint", "Mid-range fixtures"],
      finishingLevel: "Balanced aesthetics and durability"
    },
    {
      name: "Premium",
      pricePerSqft: 2100,
      materials: ["High-grade materials", "Designer finishes", "Premium fixtures"],
      finishingLevel: "Luxury-level detailing and finish quality"
    }
  ],
  certificationDocuments: [],
  aiInsight:
    "Best suited for budget residential projects in Kochi. Strong in on-time delivery and transparent execution; less suited for ultra-luxury interior detailing.",
  mapAddress: "Kochi, Kerala",
  lastUpdatedAt: new Date().toISOString()
};
