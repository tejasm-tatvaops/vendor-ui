import type { VendorData } from "../../data/vendorMockData";

export type TrustScoreBreakdown = {
  verification: number;
  projects: number;
  experience: number;
  reviews: number;
  rating: number;
  total: number;
};

export const getDisplayExperience = (vendor: VendorData): string | null => {
  if (typeof vendor.yearsOfExperience === "number" && vendor.yearsOfExperience > 0) {
    return `${vendor.yearsOfExperience} Years`;
  }

  if (vendor.projectsCompleted > 0) {
    const inferredYears = Math.max(1, Math.round(vendor.projectsCompleted / 8));
    return `~${inferredYears} Years (estimated)`;
  }

  return null;
};

export const calculateTrustScore = (vendor: VendorData): number => {
  const breakdown = calculateTrustScoreBreakdown(vendor);
  return breakdown.total;
};

export const calculateTrustScoreBreakdown = (vendor: VendorData): TrustScoreBreakdown => {
  let score = 0;

  const verification = vendor.verified ? 20 : 0;
  score += verification;

  const projects = Math.min(vendor.projectsCompleted * 2, 20);
  score += projects;

  const experience = Math.min((vendor.yearsOfExperience ?? 0) * 3, 20);
  score += experience;

  const reviews = Math.min((vendor.ratingsCount || 0) * 2, 20);
  score += reviews;

  const rating = (vendor.ratingsAverage || 0) * 4;
  score += rating;

  return {
    verification,
    projects,
    experience,
    reviews,
    rating: Math.round(rating),
    total: Math.min(100, Math.round(score))
  };
};

export const formatIndianCurrency = (value: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
