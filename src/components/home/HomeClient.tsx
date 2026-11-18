"use client";

import React, { useMemo } from "react";
import { siteConfig } from "@/data/siteConfig";
import { useAdminStore } from "@/store/useAdminStore";
import { HeroSlider } from "./HeroSlider";
import { TopPromoBanners } from "./TopPromoBanners";
import { NewArrivals } from "./NewArrivals";
import { FullwidthPromoBanner } from "./FullwidthPromoBanner";
import { TestimonialsNewsletter } from "./TestimonialsNewsletter";
import { DualPromoBanners } from "./DualPromoBanners";
import { WeeklyFeaturedSlider } from "./WeeklyFeaturedSlider";
import { LatestNewsSlider } from "./LatestNewsSlider";
import { FaqAccordion } from "./FaqAccordion";
import { InstagramFeed } from "./InstagramFeed";

export default function HomeClient() {
  const settings = useAdminStore((s) => s.settings);
  const allTestimonials = useAdminStore((s) => s.testimonials);
  const products = useAdminStore((s) => s.products);
  const allBlogs = useAdminStore((s) => s.blogs);
  const subscribeNewsletterOnServer = useAdminStore(
    (s) => s.subscribeNewsletterOnServer
  );

  // Static Banners: instantly rendered from siteConfig without waiting for backend response
  const heroSlides = siteConfig.heroSlides;
  const card1 = siteConfig.promoBanners.homeCard1;
  const card2 = siteConfig.promoBanners.homeCard2;
  const fullBanner = siteConfig.promoBanners.homeFullwidth;

  // Memoize filtered store slices
  const testimonials = useMemo(
    () => allTestimonials.filter((t) => t.isActive),
    [allTestimonials]
  );
  const blogPosts = useMemo(
    () => allBlogs.filter((b) => b.isPublished),
    [allBlogs]
  );
  const featuredProducts = useMemo(() => {
    const newItems = products.filter((p) => p.isNew);
    return newItems.length > 0 ? newItems.slice(0, 8) : products.slice(0, 8);
  }, [products]);

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

      {/* 9. SEO-Friendly FAQ Accordion Section */}
      <FaqAccordion />

      {/* 10. Instagram Social Feed */}
      <InstagramFeed facebookUrl={settings.socials.facebook} />
    </div>
  );
}
