"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";

interface SearchableSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  title?: string;
  required?: boolean;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  searchPlaceholder = "Type to search...",
  title,
  required = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => searchInputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  const handleSelect = (opt: string) => {
    onChange(opt);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div
      ref={containerRef}
      className="searchable-select-wrapper"
      style={{ position: "relative", width: "100%" }}
    >
      {/* Hidden input for native form semantics if needed */}
      {required && (
        <input
          type="text"
          value={value}
          required
          readOnly
          tabIndex={-1}
          style={{
            position: "absolute",
            opacity: 0,
            pointerEvents: "none",
            height: 0,
            width: 0,
          }}
        />
      )}

      {/* Pill Trigger matching .input-text */}
      <button
        type="button"
        title={title}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="searchable-select-trigger"
        style={{
          width: "100%",
          height: "42px",
          borderRadius: "30px",
          border: isOpen
            ? "1px solid var(--color-primary)"
            : "1px solid #eeeeee",
          padding: "7px 20px",
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          textAlign: "left",
          cursor: "pointer",
          fontSize: "14px",
          color: value ? "#333333" : "#888888",
          fontFamily: "var(--font-body)",
          outline: "none",
          transition: "border-color 0.2s ease",
        }}
      >
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value || placeholder}
        </span>
        <i
          className={`fa fa-angle-${isOpen ? "up" : "down"}`}
          aria-hidden="true"
          style={{ fontSize: "14px", color: "#555555", marginLeft: "8px" }}
        />
      </button>

      {/* Searchable Dropdown Menu */}
      {isOpen && (
        <div
          className="searchable-select-dropdown"
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: "#ffffff",
            border: "1px solid #e6e6e6",
            borderRadius: "14px",
            boxShadow: "0 10px 28px rgba(0, 0, 0, 0.08)",
            zIndex: 999,
            overflow: "hidden",
          }}
        >
          {/* Search Input */}
          <div
            style={{
              padding: "10px 12px",
              borderBottom: "1px solid #f2f2f2",
              background: "#fafafa",
            }}
          >
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setIsOpen(false);
                } else if (e.key === "Enter" && filteredOptions.length > 0) {
                  e.preventDefault();
                  handleSelect(filteredOptions[0]);
                }
              }}
              placeholder={searchPlaceholder}
              style={{
                width: "100%",
                height: "36px",
                borderRadius: "20px",
                border: "1px solid #e5e5e5",
                padding: "0 14px",
                fontSize: "13px",
                background: "#ffffff",
                color: "#333333",
                outline: "none",
              }}
            />
          </div>

          {/* Options List */}
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: "6px 0",
              maxHeight: "220px",
              overflowY: "auto",
            }}
          >
            {filteredOptions.length === 0 ? (
              <li
                style={{
                  padding: "10px 16px",
                  fontSize: "13px",
                  color: "#888888",
                  textAlign: "center",
                }}
              >
                No matching results
              </li>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt === value;
                return (
                  <li
                    key={opt}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt)}
                    style={{
                      padding: "9px 18px",
                      fontSize: "14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: isSelected ? "#faf7f2" : "transparent",
                      color: isSelected ? "var(--color-primary)" : "#333333",
                      fontWeight: isSelected ? 600 : 400,
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = "#f5f5f5";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    <span>{opt}</span>
                    {isSelected && (
                      <i
                        className="fa fa-check"
                        aria-hidden="true"
                        style={{
                          fontSize: "12px",
                          color: "var(--color-primary)",
                        }}
                      />
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
