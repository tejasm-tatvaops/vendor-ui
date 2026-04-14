import { useCallback, useEffect } from "react";
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
import { ErrorState, SkeletonBlock, SkeletonCard } from "../components/vendor-profile/ui";
import { calculateTrustScore, calculateTrustScoreBreakdown, getDisplayExperience } from "../components/vendor-profile/utils";
import { supabase } from "../lib/supabase";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchVendorProfile } from "../store/vendorProfileSlice";

export default function VendorProfilePage() {
  const dispatch = useAppDispatch();
  const vendor = useAppSelector((state) => state.vendorProfile.vendor);
  const status = useAppSelector((state) => state.vendorProfile.status);
  const vendorId = resolveVendorId();

  const loadVendor = useCallback(async () => {
    await dispatch(fetchVendorProfile(vendorId));
  }, [dispatch, vendorId]);

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
      void loadVendor();
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
            <VendorHeaderSkeleton />
            <SkeletonCard>
              <SkeletonBlock className="h-6 w-32" />
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonBlock key={i} className="h-36 rounded-xl" />
                ))}
              </div>
            </SkeletonCard>
            <PortfolioSkeleton />
            <ReviewsSkeleton />
          </div>
        </div>
      </main>
    );
  }

  const experience = getDisplayExperience(vendor);
  const totalProjects = vendor.projectsCompleted + vendor.projectsOngoing;
  const trustScore = calculateTrustScore(vendor);
  const trustBreakdown = calculateTrustScoreBreakdown(vendor);
  const lastUpdatedLabel = vendor.lastUpdatedAt
    ? new Date(vendor.lastUpdatedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : null;

  return (
    <main className="min-h-screen bg-slate-50 py-6 sm:py-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="space-y-6">
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

          <ServicesOffered services={vendor.services} />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <TrustScore score={trustScore} homeowners={vendor.trustByHomeowners} breakdown={trustBreakdown} />
            <RatingSection vendor={vendor} />
            <AIInsight insight={vendor.aiInsight} />
          </div>

          <CertificationsAndStats
            gst={vendor.gstNumber}
            pan={vendor.panNumber}
            companyType={vendor.companyType}
            certificationDocuments={vendor.certificationDocuments}
            profileCompletionPercent={vendor.profileCompletionPercent}
            kycStatus={vendor.kycStatus}
          />

          <AvailabilitySection
            totalProjects={totalProjects}
            projectsCompleted={vendor.projectsCompleted}
            projectsAssigned={vendor.projectsAssigned}
            projectsOngoing={vendor.projectsOngoing}
            avgCompletionTime={vendor.avgCompletionTime}
          />

          <PortfolioGallery items={vendor.portfolio} testimonials={vendor.reviews} />

          <PricingSection basePricePerSqft={vendor.basePricePerSqft} pricingTiers={vendor.pricingTiers} />

          <ReviewsList reviews={vendor.reviews} />
          <LocationMap location={vendor.location} address={vendor.mapAddress} />
        </div>
      </div>
    </main>
  );
}
