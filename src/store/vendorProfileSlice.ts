import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { CertificationDocument, PortfolioItem, PricingTier, ReviewItem, VendorData } from "../data/vendorMockData";
import { vendorMockData } from "../data/vendorMockData";
import { supabase } from "../lib/supabase";

type VendorRow = {
  id: string;
  company_name: string;
  legal_name: string | null;
  owner_name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  category: string | null;
  base_price_per_sqft: number | null;
  projects_completed: number | null;
  projects_ongoing: number | null;
  projects_assigned: number | null;
  years_of_experience: number | null;
  gst_number: string | null;
  pan_number: string | null;
  company_type: string | null;
  status: "active" | "inactive" | null;
  nature_of_business: string | null;
  description: string | null;
  next_available_date: string | null;
  avg_completion_time: string | null;
  trust_by_homeowners: number | null;
  ai_insight: string | null;
  map_address: string | null;
  is_verified: boolean | null;
  created_at: string | null;
  updated_at?: string | null;
  bank_name?: string | null;
  bank_account_number?: string | null;
  ifsc_code?: string | null;
  minimum_project_budget?: number | null;
  alternate_contact_number?: string | null;
  designation?: string | null;
  additional_gst_numbers?: string[] | null;
  gst_certificate_url?: string | null;
  pan_card_url?: string | null;
  cancelled_cheque_url?: string | null;
  work_sample_urls?: string[] | null;
  kyc_status?: "pending" | "verified" | "rejected" | null;
  profile_completion_percent?: number | null;
};

type ReviewRow = {
  id: string;
  reviewer_name: string | null;
  location: string | null;
  project_type: string | null;
  rating: number | null;
  comment: string | null;
  verified_project: boolean | null;
  created_at: string | null;
  /** When column exists: 'google' | 'platform' */
  review_source?: string | null;
};

type ServiceRow = {
  name: string | null;
};

type PortfolioRow = {
  id: string;
  title: string | null;
  category: "Villas" | "Apartments" | "Interiors" | null;
  date: string | null;
  image_url: string | null;
  before_image_url: string | null;
  after_image_url: string | null;
  youtube_url?: string | null;
};

type PricingTierRow = {
  tier_name: "Basic" | "Standard" | "Premium" | null;
  price_per_sqft: number | null;
  materials: string[] | null;
  finishing_level: string | null;
};

type CertificationRow = {
  id: string;
  title: string | null;
  document_url: string | null;
  status: string | null;
  cert_type?: string | null;
  verified_at?: string | null;
};

const fallbackPricingTiers: PricingTier[] = [
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
];

const toDisplayDate = (iso: string | null): string =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "Recent";

const toReviewItem = (row: ReviewRow): ReviewItem => ({
  id: row.id,
  reviewerName: row.reviewer_name ?? "Homeowner",
  location: row.location ?? "Kochi",
  projectType: row.project_type ?? "Residential Project",
  date: toDisplayDate(row.created_at),
  rating: Number(row.rating ?? 0),
  comment: row.comment ?? "Customer shared a positive experience.",
  verifiedProject: Boolean(row.verified_project),
  source: row.review_source === "google" ? "google" : "platform"
});

const buildRatingBreakdown = (reviews: ReviewItem[]): VendorData["ratingBreakdown"] => {
  const buckets = new Map<number, number>([
    [5, 0],
    [4, 0],
    [3, 0],
    [2, 0],
    [1, 0]
  ]);
  reviews.forEach((review) => {
    const normalized = Math.min(5, Math.max(1, Math.round(review.rating)));
    buckets.set(normalized, (buckets.get(normalized) ?? 0) + 1);
  });
  return [5, 4, 3, 2, 1].map((stars) => ({ stars, count: buckets.get(stars) ?? 0 }));
};

const mapPortfolio = (rows: PortfolioRow[]): PortfolioItem[] =>
  rows
    .filter((row) => row.category)
    .map((row, index) => {
      const samplePairs = [
        { before: "/portfolio/before-1.png", after: "/portfolio/after-1.png" },
        { before: "/portfolio/before-2.png", after: "/portfolio/after-2.png" },
        { before: "/portfolio/before-3.png", after: "/portfolio/after-3.png" }
      ];
      const sampleYoutubeLinks = [
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "https://www.youtube.com/watch?v=ysz5S6PUM-U",
        "https://www.youtube.com/watch?v=jNQXAC9IVRw"
      ];
      const pair = samplePairs[index % samplePairs.length];
      const hasProjectImage = Boolean(row.image_url);
      const beforeImage = row.before_image_url ?? (hasProjectImage ? undefined : pair.before);
      const afterImage = row.after_image_url ?? (hasProjectImage ? undefined : pair.after);
      const image = row.image_url ?? afterImage ?? beforeImage ?? pair.after;
      return {
        id: row.id,
        title: row.title ?? "Project",
        category: row.category as "Villas" | "Apartments" | "Interiors",
        date: toDisplayDate(row.date),
        image,
        beforeImage,
        afterImage,
        youtubeUrl: row.youtube_url ?? sampleYoutubeLinks[index % sampleYoutubeLinks.length]
      };
    });

const mapPricingTiers = (rows: PricingTierRow[]): PricingTier[] => {
  const rawTiers = rows
    .filter((row): row is Required<PricingTierRow> => Boolean(row.tier_name))
    .map((row) => ({
      name: row.tier_name as "Basic" | "Standard" | "Premium",
      pricePerSqft: row.price_per_sqft ?? 0,
      materials: row.materials ?? [],
      finishingLevel: row.finishing_level ?? "Standard finishing"
    }));

  if (!rawTiers.length) return fallbackPricingTiers;

  const byTier = new Map(rawTiers.map((tier) => [tier.name, tier]));
  return fallbackPricingTiers.map((defaultTier) => byTier.get(defaultTier.name) ?? defaultTier);
};

const mapCertificationDocuments = (rows: CertificationRow[]): CertificationDocument[] =>
  rows
    .filter((row) => row.document_url)
    .map((row) => ({
      id: row.id,
      title: row.title ?? row.cert_type ?? "Certification Document",
      image: row.document_url as string,
      status: row.status ?? undefined,
      verifiedAt: row.verified_at ?? undefined
    }));

const mapVendorToUiData = (
  vendorRow: VendorRow,
  reviews: ReviewItem[],
  services: string[],
  portfolio: PortfolioItem[],
  pricingTiers: PricingTier[],
  certificationDocuments: CertificationDocument[]
): VendorData => {
  const ratingsCount = reviews.length;
  const ratingsAverage =
    ratingsCount > 0
      ? Number((reviews.reduce((acc, review) => acc + review.rating, 0) / ratingsCount).toFixed(1))
      : 0;

  return {
    id: vendorRow.id,
    companyName: vendorRow.company_name,
    legalName: vendorRow.legal_name ?? vendorRow.company_name,
    verified: Boolean(vendorRow.is_verified),
    ownerName: vendorRow.owner_name ?? "Unknown",
    email: vendorRow.email ?? "Not shared",
    phone: vendorRow.phone ?? "Not shared",
    gstNumber: vendorRow.gst_number ?? "Not shared",
    panNumber: vendorRow.pan_number ?? "Not shared",
    companyType: vendorRow.company_type ?? "Private Limited Company",
    status: vendorRow.status ?? "active",
    category: vendorRow.category ?? "Residential Construction",
    location: vendorRow.location ?? "Kochi",
    natureOfBusiness: vendorRow.nature_of_business ?? "Supplier of Services",
    description: vendorRow.description ?? "Vendor profile information will be updated shortly.",
    services,
    projectsCompleted: vendorRow.projects_completed ?? 0,
    projectsOngoing: vendorRow.projects_ongoing ?? 0,
    projectsAssigned: vendorRow.projects_assigned ?? 0,
    yearsOfExperience: vendorRow.years_of_experience ?? undefined,
    nextAvailableDate: vendorRow.next_available_date ?? new Date().toISOString().slice(0, 10),
    avgCompletionTime: vendorRow.avg_completion_time ?? "Not available",
    trustByHomeowners: vendorRow.trust_by_homeowners ?? 0,
    basePricePerSqft: vendorRow.base_price_per_sqft ?? 0,
    ratingsAverage,
    ratingsCount,
    ratingBreakdown: buildRatingBreakdown(reviews),
    reviews,
    portfolio,
    pricingTiers,
    certificationDocuments,
    aiInsight: vendorRow.ai_insight ?? "AI insight will appear when enough project history is available.",
    mapAddress: vendorRow.map_address ?? vendorRow.location ?? "Kochi",
    lastUpdatedAt: vendorRow.updated_at ?? vendorRow.created_at ?? undefined,
    bankName: vendorRow.bank_name ?? undefined,
    bankAccountNumber: vendorRow.bank_account_number ?? undefined,
    ifscCode: vendorRow.ifsc_code ?? undefined,
    minimumProjectBudget: vendorRow.minimum_project_budget ?? undefined,
    alternateContactNumber: vendorRow.alternate_contact_number ?? undefined,
    designation: vendorRow.designation ?? undefined,
    additionalGstNumbers: vendorRow.additional_gst_numbers ?? [],
    gstCertificateUrl: vendorRow.gst_certificate_url ?? undefined,
    panCardUrl: vendorRow.pan_card_url ?? undefined,
    cancelledChequeUrl: vendorRow.cancelled_cheque_url ?? undefined,
    workSampleUrls: vendorRow.work_sample_urls ?? [],
    kycStatus: vendorRow.kyc_status ?? "pending",
    profileCompletionPercent: vendorRow.profile_completion_percent ?? 0
  };
};

type VendorProfileState = {
  vendor: VendorData | null;
  status: "loading" | "success" | "error";
  source: "remote" | "fallback" | null;
};

const initialState: VendorProfileState = {
  vendor: null,
  status: "loading",
  source: null
};

export const fetchVendorProfile = createAsyncThunk(
  "vendorProfile/fetch",
  async (vendorId?: string): Promise<{ vendor: VendorData; source: "remote" | "fallback" }> => {
    if (!supabase || !vendorId) {
      return { vendor: vendorMockData, source: "fallback" };
    }

    try {
      const [
        { data: vendorRow, error: vendorError },
        { data: reviewRows, error: reviewError },
        { data: serviceRows, error: serviceError },
        { data: portfolioRows, error: portfolioError },
        { data: pricingRows, error: pricingError },
        { data: certificationRows, error: certificationError }
      ] = await Promise.all([
        supabase.from("vendors").select("*").eq("id", vendorId).single<VendorRow>(),
        supabase.from("reviews").select("*").eq("vendor_id", vendorId).order("created_at", { ascending: false }),
        supabase.from("vendor_services").select("name").eq("vendor_id", vendorId),
        supabase.from("vendor_portfolio").select("*").eq("vendor_id", vendorId).order("date", { ascending: false }),
        supabase.from("vendor_pricing_tiers").select("*").eq("vendor_id", vendorId),
        supabase.from("vendor_certifications").select("*").eq("vendor_id", vendorId)
      ]);

      if (vendorError || !vendorRow) {
        throw vendorError ?? new Error("Vendor not found");
      }

      const reviews = ((reviewError ? [] : reviewRows) ?? ([] as ReviewRow[])).map(toReviewItem);
      const services = ((serviceError ? [] : serviceRows) ?? ([] as ServiceRow[]))
        .map((row) => row.name?.trim())
        .filter((name): name is string => Boolean(name));
      const portfolio = mapPortfolio((portfolioError ? [] : portfolioRows) ?? ([] as PortfolioRow[]));
      const pricingTiers = mapPricingTiers((pricingError ? [] : pricingRows) ?? ([] as PricingTierRow[]));
      const certificationDocuments = mapCertificationDocuments(
        (certificationError ? [] : certificationRows) ?? ([] as CertificationRow[])
      );

      return {
        vendor: mapVendorToUiData(vendorRow, reviews, services, portfolio, pricingTiers, certificationDocuments),
        source: "remote"
      };
    } catch {
      return { vendor: vendorMockData, source: "fallback" };
    }
  }
);

const vendorProfileSlice = createSlice({
  name: "vendorProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendorProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchVendorProfile.fulfilled, (state, action) => {
        state.vendor = action.payload.vendor;
        state.source = action.payload.source;
        state.status = "success";
      })
      .addCase(fetchVendorProfile.rejected, (state) => {
        state.vendor = vendorMockData;
        state.source = "fallback";
        state.status = "success";
      });
  }
});

export default vendorProfileSlice.reducer;
