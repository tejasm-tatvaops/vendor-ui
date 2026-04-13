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
import { ErrorState, SkeletonBlock, SkeletonCard, VendorBrandApiPanel } from "../components/vendor-profile/ui";
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
