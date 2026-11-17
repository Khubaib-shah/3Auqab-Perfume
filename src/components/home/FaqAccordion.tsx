"use client";

import React, { useState, memo } from "react";
import Image from "next/image";
import Link from "next/link";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    question: "How long do 3Uqab perfumes last?",
    answer:
      "Our perfumes last 12 hours or more on both skin and clothes. We use strong, pure perfume oils made here in Karachi.",
  },
  {
    id: "faq-2",
    question: "Do you deliver all over Pakistan or only in Karachi?",
    answer:
      "Right now, we only deliver in Karachi. Orders arrive in 1 to 2 days with Cash on Delivery (COD). Delivery is free on orders above Rs 3,000.",
  },
  {
    id: "faq-3",
    question: "Are your attars alcohol-free?",
    answer:
      "Yes. All our attars and concentrated perfume oils are 100% alcohol-free, skin-safe, and suitable for daily prayers.",
  },
  {
    id: "faq-4",
    question: "Where is your shop in Karachi?",
    answer:
      "You can visit us at Shop # 70, Ground Floor, City Residency & Shopping Galleria, Garden East, Saddar, Karachi. You can test all our scents in person.",
  },
  {
    id: "faq-5",
    question: "Can I order or get advice on WhatsApp?",
    answer:
      "Yes. Message us on WhatsApp at +92 300 1234567. Tell us what kind of smell you like, and we will help you choose.",
  },
];

function FaqAccordionComponent() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  // Structured Data (JSON-LD) for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
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
          <span className="faq-section-subtitle">Common Questions</span>
          <h2 id="faq-section-heading" className="faq-section-title">
            Frequently Asked Questions
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
                  src="/assets/images/banner-home-13.png"
                  alt="3Uqab Perfumes Karachi"
                  width={600}
                  height={750}
                  className="faq-showcase-img"
                  priority={false}
                />
                <div className="faq-image-overlay">
                  <span className="faq-badge">Made in Karachi</span>
                  <h3 className="faq-image-title">Pure Perfumes & Oud</h3>
                  <p className="faq-image-desc">
                    Long-lasting scents crafted for everyday wear.
                  </p>
                  <Link href="/shop" className="faq-image-btn">
                    View Collection
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Accordion */}
          <div className="faq-accordion-col">
            <div className="faq-accordion-list" role="region" aria-label="FAQ Accordion">
              {FAQ_ITEMS.map((item, index) => {
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
