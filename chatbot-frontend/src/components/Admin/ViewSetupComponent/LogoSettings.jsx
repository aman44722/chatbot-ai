import React, { useState, useRef, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import picImg from "../../../assets/images/picture.svg";
import avt1 from "../../../assets/images/avatar/avatar-v101.svg";
import avt2 from "../../../assets/images/avatar/avatar-v102.svg";
import avt3 from "../../../assets/images/avatar/avatar-v103.svg";
import avt4 from "../../../assets/images/avatar/avatar-v104.svg";
import avt5 from "../../../assets/images/avatar/avatar-v105.svg";
import avt6 from "../../../assets/images/avatar/avatar-v107.svg";
import avt7 from "../../../assets/images/avatar/avatar-v108.svg";
import avt8 from "../../../assets/images/avatar/avatar-v109.svg";
import avt9 from "../../../assets/images/avatar/avatar-v110.svg";
import avt10 from "../../../assets/images/avatar/avatar-v111.svg";

const LogoSettings = ({ companyLogo, setCompanyLogo, avatar, setAvatar }) => {
  const fileInputRef = useRef(null);
  const scrollRef = useRef(null);

  const defaultAvatars = [
    avt1,
    avt2,
    avt3,
    avt4,
    avt5,
    avt6,
    avt7,
    avt8,
    avt9,
    avt10,
  ];
  const [avatarOptions, setAvatarOptions] = useState(defaultAvatars);
  const [showLeftArrow, setShowLeftArrow] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      setShowLeftArrow(scrollContainer.scrollLeft > 5);
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -scrollRef.current.offsetWidth * 0.1,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: scrollRef.current.offsetWidth * 0.1,
        behavior: "smooth",
      });
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarOptions((prev) => [reader.result, ...prev]);
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("File size must be under 5MB");
    }
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <label style={{ fontWeight: 600, fontSize: "14px", color: "#555" }}>
        Company Logo <span title="Upload your company logo">ⓘ</span>
      </label>

      {companyLogo ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            margin: "15px 0",
          }}
        >
          <div style={{ position: "relative" }}>
            <img
              src={companyLogo}
              alt="logo"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <span
              onClick={() => setCompanyLogo("")}
              style={{
                position: "absolute",
                top: "-5px",
                right: "-5px",
                background: "#fff",
                color: "#333",
                fontSize: "12px",
                border: "1px solid #ccc",
                borderRadius: "50%",
                padding: "0 5px",
                cursor: "pointer",
              }}
            >
              ✕
            </span>
          </div>
        </div>
      ) : (
        <label
          htmlFor="upload-logo"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "2px dashed #d1d5db",
            borderRadius: "10px",
            padding: "20px",
            cursor: "pointer",
            marginTop: "15px",
          }}
        >
          <img
            src={picImg}
            alt="placeholder"
            style={{ width: "40px", height: "40px", marginBottom: "10px" }}
          />
          <span style={{ fontWeight: 600, fontSize: "14px", color: "#555" }}>
            File Size should be less than 5 MB
          </span>
          <input
            id="upload-logo"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file && file.size < 5 * 1024 * 1024) {
                const reader = new FileReader();
                reader.onloadend = () => setCompanyLogo(reader.result);
                reader.readAsDataURL(file);
              } else {
                alert("File size exceeds 5MB");
              }
            }}
          />
        </label>
      )}

      <label
        style={{
          marginTop: "20px",
          fontWeight: 600,
          fontSize: "14px",
          color: "#555",
          display: "block",
        }}
      >
        Avatar{" "}
        <span style={{ fontWeight: 600, fontSize: "14px", color: "#555" }}>
          ⓘ
        </span>
      </label>

      <div style={{ position: "relative", marginTop: "10px" }}>
        {showLeftArrow && (
          <button
            onClick={scrollLeft}
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1,
              background: "#4F46E5",
              color: "white",
              border: "none",
              cursor: "pointer",
              height: "100%",
              width: "20px",

              borderTopRightRadius: "10px",
              borderBottomRightRadius: "10px",
            }}
          >
            ◀
          </button>
        )}

        <div
          ref={scrollRef}
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "12px",
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            scrollBehavior: "smooth",
          }}
        >
          <label
            htmlFor="upload-avatar"
            style={{
              minWidth: "60px",
              minHeight: "60px",
              borderRadius: "50%",
              backgroundColor: "#f3f4f6",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              border: "2px solid #ccc",
            }}
          >
            <AddIcon style={{ width: "54px", height: "54px" }} />
            <input
              id="upload-avatar"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarUpload}
            />
          </label>

          {avatarOptions.map((avt, index) => (
            <div
              key={index}
              onClick={() => setAvatar(avt)}
              style={{
                minWidth: "60px",
                minHeight: "60px",
                borderRadius: "50%",
                overflow: "hidden",
                border:
                  avt === avatar
                    ? "3px solid #00C896"
                    : "2px solid transparent",
                cursor: "pointer",
              }}
            >
              <img
                src={avt}
                alt="avatar"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            </div>
          ))}
        </div>

        <button
          onClick={scrollRight}
          style={{
            position: "absolute",
            right: "-10px",
            height: "100%",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            background: "#4F46E5",
            border: "none",
            cursor: "pointer",
            width: "20px",
            color: "white",
            borderTopLeftRadius: "10px",
            borderBottomLeftRadius: "10px",
          }}
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default LogoSettings;
