"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import Link from "next/link";
import { HeroSlideItem } from "@/data/initialStoreSeed";

interface HeroSliderProps {
  slides: HeroSlideItem[];
}

function HeroSliderComponent({ slides }: HeroSliderProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const dragStartX = useRef<number | null>(null);

  // Auto-advance Hero Slider every 8s
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="home-slider fullwidth rows-space-60">
      <div
        className="slider-owl owl-slick equal-container nav-center slick-slider"
        onTouchStart={(e) => {
          dragStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (dragStartX.current === null) return;
          const delta = e.changedTouches[0].clientX - dragStartX.current;
          if (delta > 50) {
            handlePrev();
          } else if (delta < -50) {
            handleNext();
          }
          dragStartX.current = null;
        }}
      >
        <span
          className="fa fa-angle-left slick-arrow"
          onClick={handlePrev}
          style={{ zIndex: 7 }}
          title="Previous slide"
        />

        <div className="slick-list">
          <div
            className="hero-slick-track"
            style={{
              transform: `translate3d(-${activeSlide * 100}%, 0, 0)`,
            }}
          >
            {slides.map((slide, index) => {
              const isActive = activeSlide === index;
              return (
                <div
                  key={slide.styleClass || index}
                  className={`slider-item ${slide.styleClass} ${
                    isActive ? "slick-active slick-current" : ""
                  }`}
                >
                  <div
                    className="slider-inner equal-element"
                    style={
                      slide.bgImage
                        ? {
                            backgroundImage: `url(${slide.bgImage})`,
                            backgroundSize: "100% 100%",
                            backgroundPosition: "center center",
                            backgroundRepeat: "no-repeat",
                          }
                        : undefined
                    }
                  >
                    <div className="container">
                      <div className="slider-infor">
                        <p className="title-small">{slide.subtitle}</p>
                        <h3 className="title-big">
                          {slide.titleLine1}
                          <br />
                          {slide.titleLine2}
                        </h3>
                        {slide.priceValue ? (
                          <div className="price">
                            {slide.priceLabel}{" "}
                            <span className="number-price">
                              {slide.priceValue}
                            </span>
                          </div>
                        ) : (
                          <div className="when-code">
                            {slide.codeLabel}{" "}
                            <span className="number-code">
                              {slide.codeValue}
                            </span>
                          </div>
                        )}
                        <Link
                          href={slide.link || "/shop"}
                          className={`button ${slide.btnClass} bgroud-style`}
                        >
                          Shop now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <span
          className="fa fa-angle-right slick-arrow"
          onClick={handleNext}
          style={{ zIndex: 7 }}
          title="Next slide"
        />

        {slides.length > 1 && (
          <ul className="slick-dots">
            {slides.map((_, idx) => (
              <li
                key={idx}
                className={activeSlide === idx ? "slick-active" : ""}
                onClick={() => setActiveSlide(idx)}
              >
                <button type="button">{idx + 1}</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export const HeroSlider = memo(HeroSliderComponent);
