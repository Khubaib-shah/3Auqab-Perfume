"use client";

import React, { useMemo } from "react";
import { useAdminStore } from "@/store/useAdminStore";
import { HeroSlider } from "./HeroSlider";
import { TopPromoBanners } from "./TopPromoBanners";
import { NewArrivals } from "./NewArrivals";
import { FullwidthPromoBanner } from "./FullwidthPromoBanner";
import { TestimonialsNewsletter } from "./TestimonialsNewsletter";
import { DualPromoBanners } from "./DualPromoBanners";
import { WeeklyFeaturedSlider } from "./WeeklyFeaturedSlider";
import { LatestNewsSlider } from "./LatestNewsSlider";
import { InstagramFeed } from "./InstagramFeed";

export default function HomeClient() {
  const settings = useAdminStore((s) => s.settings);
  const allHeroSlides = useAdminStore((s) => s.heroSlides);
  const allTestimonials = useAdminStore((s) => s.testimonials);
  const products = useAdminStore((s) => s.products);
  const allBlogs = useAdminStore((s) => s.blogs);
  const promoBanners = useAdminStore((s) => s.promoBanners);
  const subscribeNewsletterOnServer = useAdminStore(
    (s) => s.subscribeNewsletterOnServer
  );

  // Memoize filtered store slices
  const heroSlides = useMemo(
    () => allHeroSlides.filter((h) => h.isActive),
    [allHeroSlides]
  );
  const testimonials = useMemo(
    () => allTestimonials.filter((t) => t.isActive),
    [allTestimonials]
  );
  const blogPosts = useMemo(
    () => allBlogs.filter((b) => b.isPublished),
    [allBlogs]
  );
  const featuredProducts = useMemo(
    () => products.slice(0, 8),
    [products]
  );

  const card1 = useMemo(
    () =>
      promoBanners?.homeCard1 || {
        subtitle: "Limited Edition",
        title: "Oud & Attar\n30% Off",
        code: settings.promoCode || "3AUQAB",
        link: "/shop",
      },
    [promoBanners?.homeCard1, settings.promoCode]
  );

  const card2 = useMemo(
    () =>
      promoBanners?.homeCard2 || {
        subtitle: "Luxury Gift Bundles",
        title: "Signature\nScents",
        code: settings.promoCode || "3AUQAB",
        link: "/shop",
      },
    [promoBanners?.homeCard2, settings.promoCode]
  );

  const fullBanner = useMemo(
    () =>
      promoBanners?.homeFullwidth || {
        subtitle: "3Auqab Exclusive",
        title: "Royal Collection",
        highlightText: "20%",
        tagline: "Handcrafted 100ml Eau de Parfum",
        link: "/shop",
      },
    [promoBanners?.homeFullwidth]
  );

  return (
    <div className="fullwidth-template">
      {/* 1. Hero Carousel */}
      <HeroSlider slides={heroSlides} />

      {/* 2. Top Promotional Cards */}
      <TopPromoBanners card1={card1} card2={card2} />

      {/* 3. New Arrivals Grid */}
      <NewArrivals products={featuredProducts} />

      {/* 4. Fullwidth Collection Banner */}
      <FullwidthPromoBanner banner={fullBanner} />

      {/* 5. Testimonials & Newsletter */}
      <TestimonialsNewsletter
        testimonials={testimonials}
        onSubscribe={subscribeNewsletterOnServer}
      />

      {/* 6. Mid Dual Promotional Banners */}
      <DualPromoBanners />

      {/* 7. Weekly Featured Carousel */}
      <WeeklyFeaturedSlider products={products} />

      {/* 8. Latest News & Blog Carousel */}
      <LatestNewsSlider posts={blogPosts} />

      {/* 9. Instagram Social Feed */}
      <InstagramFeed facebookUrl={settings.socials.facebook} />
    </div>
  );
}
