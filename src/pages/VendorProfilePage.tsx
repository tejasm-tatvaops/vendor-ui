import { useCallback, useEffect, useState } from "react";
import { AIInsight } from "../components/vendor-profile/AIInsight";
import { AvailabilitySection } from "../components/vendor-profile/AvailabilitySection";
import { CertificationsAndStats } from "../components/vendor-profile/CertificationsAndStats";
import { LocationMap } from "../components/vendor-profile/LocationMap";
import { PortfolioGallery } from "../components/vendor-profile/PortfolioGallery";
import { PricingSection } from "../components/vendor-profile/PricingSection";
import { RatingSection } from "../components/vendor-profile/RatingSection";
import { ReviewsList } from "../components/vendor-profile/ReviewsList";
import { ServicesOffered } from "../components/vendor-profile/ServicesOffered";
import { TrustScore } from "../components/vendor-profile/TrustScore";
import { VendorHeader } from "../components/vendor-profile/VendorHeader";
import { runtimeConfig, resolveVendorId } from "../config/runtime";
import { PortfolioSkeleton, ReviewsSkeleton, VendorHeaderSkeleton } from "../components/vendor-profile/Skeletons";
import { ErrorState, SkeletonBlock, SkeletonCard, VendorBrandApiPanel } from "../components/vendor-profile/ui";
import { calculateTrustScore, calculateTrustScoreBreakdown, getDisplayExperience } from "../components/vendor-profile/utils";
import type { CertificationDocument, PortfolioItem, PricingTier, ReviewItem, VendorData } from "../data/vendorMockData";
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
  verifiedProject: Boolean(row.verified_project)
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
      const beforeImage = row.before_image_url ?? pair.before;
      const afterImage = row.after_image_url ?? pair.after;
      return {
        id: row.id,
        title: row.title ?? "Project",
        category: row.category as "Villas" | "Apartments" | "Interiors",
        date: toDisplayDate(row.date),
        image: row.image_url ?? afterImage,
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

  if (!rawTiers.length) {
    return fallbackPricingTiers;
  }

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
    lastUpdatedAt: vendorRow.updated_at ?? vendorRow.created_at ?? undefined
  };
};

export default function VendorProfilePage() {
  const [vendor, setVendor] = useState<VendorData | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  const vendorId = resolveVendorId();

  const loadVendor = useCallback(async () => {
    if (!supabase || !vendorId) {
      setStatus("error");
      return;
    }

    try {
      setStatus("loading");
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
      if (reviewError) {
        throw reviewError;
      }
      if (serviceError) {
        throw serviceError;
      }
      if (portfolioError) {
        throw portfolioError;
      }
      if (pricingError) {
        throw pricingError;
      }
      if (certificationError) {
        throw certificationError;
      }

      const reviews = ((reviewRows ?? []) as ReviewRow[]).map(toReviewItem);
      const services = ((serviceRows ?? []) as ServiceRow[])
        .map((row) => row.name?.trim())
        .filter((name): name is string => Boolean(name));
      const portfolio = mapPortfolio((portfolioRows ?? []) as PortfolioRow[]);
      const pricingTiers = mapPricingTiers((pricingRows ?? []) as PricingTierRow[]);
      const certificationDocuments = mapCertificationDocuments((certificationRows ?? []) as CertificationRow[]);

      setVendor(mapVendorToUiData(vendorRow, reviews, services, portfolio, pricingTiers, certificationDocuments));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }, [vendorId]);

  const trackVendorEvent = useCallback(
    async (eventType: "site_visit_click" | "contact_click") => {
      if (!supabase || !vendorId) {
        return;
      }
      try {
        await supabase.from("vendor_events").insert({
          vendor_id: vendorId,
          event_type: eventType
        });
      } catch {
        // keep CTA non-blocking even if analytics table isn't configured yet
      }
    },
    [vendorId]
  );

  const navigateTo = useCallback((url?: string) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  useEffect(() => {
    if (!supabase || !vendorId) {
      setStatus("error");
      return;
    }
    const client = supabase;

    void loadVendor();

    const vendorChannel = client
      .channel(`vendor-updates-${vendorId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "vendors", filter: `id=eq.${vendorId}` },
        () => {
          void loadVendor();
        }
      )
      .subscribe();

    const reviewsChannel = client
      .channel(`vendor-reviews-${vendorId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reviews", filter: `vendor_id=eq.${vendorId}` },
        () => {
          void loadVendor();
        }
      )
      .subscribe();

    const servicesChannel = client
      .channel(`vendor-services-${vendorId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "vendor_services", filter: `vendor_id=eq.${vendorId}` },
        () => {
          void loadVendor();
        }
      )
      .subscribe();

    const portfolioChannel = client
      .channel(`vendor-portfolio-${vendorId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "vendor_portfolio", filter: `vendor_id=eq.${vendorId}` },
        () => {
          void loadVendor();
        }
      )
      .subscribe();

    const pricingChannel = client
      .channel(`vendor-pricing-${vendorId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "vendor_pricing_tiers", filter: `vendor_id=eq.${vendorId}` },
        () => {
          void loadVendor();
        }
      )
      .subscribe();

    const certificationsChannel = client
      .channel(`vendor-certifications-${vendorId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "vendor_certifications", filter: `vendor_id=eq.${vendorId}` },
        () => {
          void loadVendor();
        }
      )
      .subscribe();

    return () => {
      void client.removeChannel(vendorChannel);
      void client.removeChannel(reviewsChannel);
      void client.removeChannel(servicesChannel);
      void client.removeChannel(portfolioChannel);
      void client.removeChannel(pricingChannel);
      void client.removeChannel(certificationsChannel);
    };
  }, [loadVendor, vendorId]);

  if (status === "error") {
    return (
      <main className="min-h-screen bg-slate-50 py-8">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <ErrorState onRetry={loadVendor} />
        </div>
      </main>
    );
  }

  if (status === "loading" || !vendor) {
    return (
      <main className="min-h-screen bg-slate-50 py-8">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="space-y-6">
            <VendorBrandApiPanel />
            <VendorHeaderSkeleton />
            <PortfolioSkeleton />
            <ReviewsSkeleton />
            <SkeletonCard>
              <SkeletonBlock className="h-6 w-2/3" />
              <SkeletonBlock className="mt-3 h-10 w-full" />
              <SkeletonBlock className="mt-2 h-10 w-full" />
              <SkeletonBlock className="mt-2 h-10 w-full" />
            </SkeletonCard>
          </div>
        </div>
      </main>
    );
  }

  const trustScore = calculateTrustScore(vendor);
  const trustBreakdown = calculateTrustScoreBreakdown(vendor);
  const experience = getDisplayExperience(vendor);
  const totalProjects = vendor.projectsCompleted + vendor.projectsOngoing;
  const lastUpdatedLabel = vendor.lastUpdatedAt
    ? new Date(vendor.lastUpdatedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : null;

  return (
    <main className="min-h-screen bg-slate-50 py-6 sm:py-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="space-y-6">
          <VendorBrandApiPanel />
          <VendorHeader
            vendor={vendor}
            experience={experience}
            lastUpdatedLabel={lastUpdatedLabel}
            onBookVisit={() => {
              void trackVendorEvent("site_visit_click");
              navigateTo(runtimeConfig.bookSiteVisitUrl);
            }}
            onContactTatvaops={() => {
              void trackVendorEvent("contact_click");
              navigateTo(runtimeConfig.contactTatvaopsUrl);
            }}
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <TrustScore score={trustScore} homeowners={vendor.trustByHomeowners} breakdown={trustBreakdown} />
            <RatingSection vendor={vendor} />
            <AIInsight insight={vendor.aiInsight} />
          </div>

          <CertificationsAndStats
            gst={vendor.gstNumber}
            pan={vendor.panNumber}
            companyType={vendor.companyType}
            projectsCompleted={vendor.projectsCompleted}
            projectsOngoing={vendor.projectsOngoing}
            projectsAssigned={vendor.projectsAssigned}
            totalProjects={totalProjects}
            certificationDocuments={vendor.certificationDocuments}
          />

          <ServicesOffered services={vendor.services} />
          <PortfolioGallery items={vendor.portfolio} testimonials={vendor.reviews} />
          <PricingSection basePricePerSqft={vendor.basePricePerSqft} pricingTiers={vendor.pricingTiers} />
          <AvailabilitySection
            nextAvailableDate={vendor.nextAvailableDate}
            projectsOngoing={vendor.projectsOngoing}
            avgCompletionTime={vendor.avgCompletionTime}
          />
          <LocationMap location={vendor.location} address={vendor.mapAddress} />
          <ReviewsList reviews={vendor.reviews} />
        </div>
      </div>
    </main>
  );
}
