import Head from "next/head";
import VendorProfilePage from "../src/pages/VendorProfilePage";

const siteUrl = "https://vendor-profilepage.vercel.app";
const pageTitle = "TatvaOps Verified Vendor Profile | Ratings, Reviews, Pricing & Portfolio";
const pageDescription =
  "Explore TatvaOps verified vendor profile with homeowner ratings, recent reviews, project portfolio, pricing tiers, certifications, and availability details.";
const ogImageUrl = `${siteUrl}/favicon.svg`;

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "TatvaOps Vendor Profile",
  description: pageDescription,
  url: siteUrl,
  logo: ogImageUrl,
  image: ogImageUrl,
  areaServed: "Kerala, India",
  serviceType: [
    "Residential Construction",
    "Interiors",
    "Plumbing Services",
    "Electrical Services",
    "Property Development"
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.3",
    ratingCount: "58",
    bestRating: "5",
    worstRating: "1"
  }
};

export default function HomePage() {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="vendor profile, construction vendor, interiors vendor, TatvaOps, verified contractors, vendor ratings, vendor reviews, pricing per sqft, project portfolio"
        />
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
        <meta name="author" content="TatvaOps" />
        <link rel="canonical" href={siteUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="TatvaOps" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImageUrl} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImageUrl} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <VendorProfilePage />
    </>
  );
}
