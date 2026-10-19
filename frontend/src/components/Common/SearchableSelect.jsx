import React, { useState, useRef, useEffect } from "react";
import { IoChevronDownOutline, IoSearchOutline, IoCheckmarkOutline } from "react-icons/io5";

const SearchableSelect = ({
  options = [],
  value,
  onChange,
  placeholder = "Pilih opsi...",
  searchPlaceholder = "Cari opsi...",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 50);
    }
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className="form-select-custom"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: disabled ? "not-allowed" : "pointer",
          textAlign: "left",
          width: "100%",
          paddingRight: "16px",
          background: disabled ? "rgba(241, 245, 249, 0.85)" : isOpen ? "#ffffff" : undefined,
          borderColor: disabled ? "rgba(203, 213, 225, 0.8)" : isOpen ? "#0284c7" : undefined,
          boxShadow: isOpen ? "0 0 0 3px rgba(2, 132, 199, 0.15)" : undefined,
          opacity: disabled ? 0.85 : 1,
        }}
      >
        <span style={{ color: selectedOption ? "var(--text-primary)" : "var(--text-muted)", fontWeight: "500" }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <IoChevronDownOutline
          style={{
            fontSize: "16px",
            color: disabled ? "#94a3b8" : "var(--text-muted)",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            flexShrink: 0,
            marginLeft: "8px",
          }}
        />
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            zIndex: 100,
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px solid rgba(226, 232, 240, 0.9)",
            boxShadow: "0 16px 36px rgba(15, 23, 42, 0.12)",
            overflow: "hidden",
            padding: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 12px",
              background: "rgba(241, 245, 249, 0.6)",
              borderRadius: "12px",
              marginBottom: "6px",
              border: "1px solid rgba(226, 232, 240, 0.8)",
            }}
          >
            <IoSearchOutline style={{ color: "var(--text-muted)", fontSize: "16px" }} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                width: "100%",
                fontSize: "13px",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            {filteredOptions.length === 0 ? (
              <div style={{ padding: "12px", textAlign: "center", fontSize: "12.5px", color: "var(--text-muted)" }}>
                Tidak ada opsi yang cocok
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: isSelected ? "600" : "400",
                      background: isSelected ? "rgba(2, 132, 199, 0.08)" : "transparent",
                      color: isSelected ? "#0284c7" : "var(--text-primary)",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = "rgba(241, 245, 249, 0.8)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <IoCheckmarkOutline style={{ fontSize: "16px", color: "#0284c7" }} />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
