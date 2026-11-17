"use client";

import React, { useState, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { contentConfig } from "@/config";

function FaqAccordionComponent() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqItems = contentConfig.faqs;
  const faqSection = contentConfig.faqSection;

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  // Structured Data (JSON-LD) for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="faq-section-wrapper" aria-labelledby="faq-section-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container">
        {/* Section Header */}
        <div className="faq-section-header">
          <span className="faq-section-subtitle">{faqSection.subtitle}</span>
          <h2 id="faq-section-heading" className="faq-section-title">
            {faqSection.title}
          </h2>
          <div className="faq-section-divider" />
        </div>

        {/* 2-Column on Desktop / 1-Column on Mobile */}
        <div className="faq-layout-row">
          {/* Left Column: Image Card (Desktop Only) */}
          <div className="faq-image-col">
            <div className="faq-image-card">
              <div className="faq-image-container">
                <Image
                  src={faqSection.image}
                  alt={faqSection.imageAlt}
                  width={600}
                  height={750}
                  className="faq-showcase-img"
                  priority={false}
                />
                <div className="faq-image-overlay">
                  <span className="faq-badge">{faqSection.imageBadge}</span>
                  <h3 className="faq-image-title">{faqSection.imageTitle}</h3>
                  <p className="faq-image-desc">{faqSection.imageDescription}</p>
                  <Link href="/shop" className="faq-image-btn">
                    {faqSection.imageCta}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Accordion */}
          <div className="faq-accordion-col">
            <div className="faq-accordion-list" role="region" aria-label="FAQ Accordion">
              {faqItems.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={item.id}
                    className={`faq-accordion-item ${isOpen ? "active" : ""}`}
                  >
                    <button
                      type="button"
                      className="faq-accordion-header"
                      onClick={() => toggleAccordion(index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${item.id}`}
                      id={`faq-header-${item.id}`}
                    >
                      <span className="faq-item-title">{item.question}</span>
                      <span className={`faq-icon-indicator ${isOpen ? "open" : ""}`}>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M2.5 5L7 9.5L11.5 5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>

                    <div
                      id={`faq-answer-${item.id}`}
                      role="region"
                      aria-labelledby={`faq-header-${item.id}`}
                      className={`faq-accordion-body ${isOpen ? "open" : ""}`}
                    >
                      <div className="faq-accordion-content">
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const FaqAccordion = memo(FaqAccordionComponent);
