"use client";

import React, { useState, memo } from "react";
import toast from "react-hot-toast";
import { TestimonialItem } from "@/data/initialStoreSeed";
import { siteConfig } from "@/data/siteConfig";

interface TestimonialsNewsletterProps {
  testimonials: TestimonialItem[];
  onSubscribe: (email: string, source: string) => Promise<unknown>;
}

function TestimonialsNewsletterComponent({
  testimonials,
  onSubscribe,
}: TestimonialsNewsletterProps) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = newsletterEmail.trim();
    if (!cleanEmail) {
      toast.error("Please enter your email address.");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubscribe(cleanEmail, "Homepage Newsletter");
      toast.success(`Subscribed to ${siteConfig.name} special deals!`);
      setNewsletterEmail("");
    } catch {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="stelina-testimonials-newsletter-wrapp">
      <div className="container">
        <div className="row">
          {/* Testimonials */}
          <div className="col-lg-9">
            <div className="stelina-testimonials-wrapp">
              <div className="stelina-testimonials default">
                <div className="owl-slick equal-container slick-slider">
                  <div className="slick-list">
                    <div
                      className="testimonial-slick-track"
                      style={{
                        transform: `translate3d(-${activeTestimonial * 100}%, 0, 0)`,
                      }}
                    >
                      {testimonials.map((item, idx) => (
                        <div
                          key={item.id}
                          className={`testimonial-item ${
                            activeTestimonial === idx ? "slick-active" : ""
                          }`}
                        >
                          <div className="image">
                            <img src={item.avatar} alt={item.name} />
                          </div>
                          <div className="info">
                            <h5 className="name">
                              {item.name} <span>{item.role}</span>
                            </h5>
                            <div className="text">
                              <p>{item.text}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {testimonials.length > 1 && (
                    <ul className="slick-dots">
                      {testimonials.map((t, idx) => (
                        <li
                          key={t.id}
                          className={
                            activeTestimonial === idx ? "slick-active" : ""
                          }
                          onClick={() => setActiveTestimonial(idx)}
                        >
                          <button type="button">{idx + 1}</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="col-lg-3">
            <div className="stelina-newsletter default">
              <div className="newsletter-head">
                <h3 className="title">Newsletter</h3>
                <div className="subtitle">
                  Get more special Deals, Events & Promotions
                </div>
              </div>
              <form
                onSubmit={handleNewsletterSubmit}
                className="newsletter-form-wrap"
              >
                <input
                  className="input-text email email-newsletter"
                  type="email"
                  name="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email here..."
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="button btn-submit submit-newsletter"
                >
                  {isSubmitting ? "..." : "Submit"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const TestimonialsNewsletter = memo(TestimonialsNewsletterComponent);
