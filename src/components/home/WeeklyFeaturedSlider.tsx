"use client";

import React, { useState, useEffect, useRef, useMemo, memo } from "react";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/data/products";

interface WeeklyFeaturedSliderProps {
  products: Product[];
}

function WeeklyFeaturedSliderComponent({ products }: WeeklyFeaturedSliderProps) {
  const [weeklyOffset, setWeeklyOffset] = useState(0);
  const [weeklyPerView, setWeeklyPerView] = useState(3);
  const [weeklyStepPercent, setWeeklyStepPercent] = useState(33.333333);
  const [isWeeklyGrabbed, setIsWeeklyGrabbed] = useState(false);

  const weeklyTouchStartX = useRef<number | null>(null);
  const weeklyDragStartX = useRef<number | null>(null);
  const isDraggingWeekly = useRef(false);

  // Update responsive items-per-view
  useEffect(() => {
    const updatePerView = () => {
      const w = window.innerWidth;
      if (w < 768) {
        setWeeklyPerView(1);
        setWeeklyStepPercent(68);
      } else if (w < 992) {
        setWeeklyPerView(2);
        setWeeklyStepPercent(50);
      } else {
        setWeeklyPerView(3);
        setWeeklyStepPercent(33.333333);
      }
    };
    updatePerView();
    window.addEventListener("resize", updatePerView);
    return () => window.removeEventListener("resize", updatePerView);
  }, []);

  const weeklyProducts = useMemo(() => {
    return products.filter((p) => p.isWeeklyFeatured !== false).slice(0, 6);
  }, [products]);

  // Append first 2 products for smooth wrapping peek
  const carouselWeeklyProducts = useMemo<Product[]>(() => {
    if (weeklyProducts.length === 0) return [];
    return [...weeklyProducts, ...weeklyProducts.slice(0, 2)];
  }, [weeklyProducts]);

  const maxWeeklyIndex = Math.max(
    0,
    weeklyStepPercent === 68
      ? weeklyProducts.length - 1
      : weeklyProducts.length - weeklyPerView
  );

  const clampedWeeklyOffset = Math.min(weeklyOffset, maxWeeklyIndex);

  const handleWeeklyPrev = () => {
    setWeeklyOffset((prev) => (prev <= 0 ? maxWeeklyIndex : prev - 1));
  };

  const handleWeeklyNext = () => {
    setWeeklyOffset((prev) => (prev >= maxWeeklyIndex ? 0 : prev + 1));
  };

  const handleWeeklyMouseDown = (e: React.MouseEvent) => {
    isDraggingWeekly.current = true;
    weeklyDragStartX.current = e.clientX;
    setIsWeeklyGrabbed(true);
  };

  const handleWeeklyMouseUp = (e: React.MouseEvent) => {
    if (!isDraggingWeekly.current || weeklyDragStartX.current === null) return;
    const delta = e.clientX - weeklyDragStartX.current;
    if (delta > 35) {
      handleWeeklyPrev();
    } else if (delta < -35) {
      handleWeeklyNext();
    }
    isDraggingWeekly.current = false;
    weeklyDragStartX.current = null;
    setIsWeeklyGrabbed(false);
  };

  const handleWeeklyMouseLeave = () => {
    if (!isDraggingWeekly.current) return;
    isDraggingWeekly.current = false;
    weeklyDragStartX.current = null;
    setIsWeeklyGrabbed(false);
  };

  if (weeklyProducts.length === 0) return null;

  return (
    <div className="stelina-product layout1">
      <div className="container">
        <div className="container-wapper">
          <div className="head">
            <div className="head-text-group">
              <h3 className="title">Weekly Featured</h3>
              <div className="subtitle">
                Explore our most-loved 3Uqab fragrances this week
              </div>
            </div>
            <div className="weekly-nav-arrows">
              <span
                className="fa fa-angle-left slick-arrow"
                onClick={handleWeeklyPrev}
                title="Previous"
              />
              <span
                className="fa fa-angle-right slick-arrow"
                onClick={handleWeeklyNext}
                title="Next"
              />
            </div>
          </div>

          <div
            className="product-list-owl owl-slick equal-container nav-center-left slick-slider"
            style={{
              cursor: isWeeklyGrabbed ? "grabbing" : "grab",
              userSelect: "none",
              WebkitUserSelect: "none",
            }}
            onMouseDown={handleWeeklyMouseDown}
            onMouseUp={handleWeeklyMouseUp}
            onMouseLeave={handleWeeklyMouseLeave}
            onTouchStart={(e) => {
              weeklyTouchStartX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (weeklyTouchStartX.current === null) return;
              const delta =
                e.changedTouches[0].clientX - weeklyTouchStartX.current;
              if (delta > 35) {
                handleWeeklyPrev();
              } else if (delta < -35) {
                handleWeeklyNext();
              }
              weeklyTouchStartX.current = null;
            }}
          >
            <div className="slick-list">
              <div
                className="weekly-slick-track"
                style={{
                  transform: `translate3d(-${
                    clampedWeeklyOffset * weeklyStepPercent
                  }%, 0, 0)`,
                }}
              >
                {carouselWeeklyProducts.map((prod, idx) => (
                  <div
                    key={`${prod.id}-carousel-${idx}`}
                    className="weekly-slide-item"
                  >
                    <ProductCard
                      product={prod}
                      asListItem={false}
                      useBlackImage={true}
                      className="product-item style-1 product-type-variable"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const WeeklyFeaturedSlider = memo(WeeklyFeaturedSliderComponent);
