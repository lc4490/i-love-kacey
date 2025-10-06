"use client";
import { useEffect, useRef, useState } from "react";
import { Box, IconButton, Stack } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const images = ["/image1.png", "/image2.png", "/image3.png", "/image4.png"];

export default function ImageCarousel({
  width = 350,
  height = 350,
  auto = false, // set to true to auto-rotate
  intervalMs = 4000, // auto-rotate speed
}) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const swipeLocked = useRef(false); // basic debounce for swipe

  const go = (delta) => {
    setIndex((i) => (i + delta + images.length) % images.length);
  };

  // Preload next/prev images for snappy UX
  useEffect(() => {
    const next = new Image();
    next.src = images[(index + 1) % images.length];
    const prev = new Image();
    prev.src = images[(index - 1 + images.length) % images.length];
  }, [index]);

  // Optional auto-advance
  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => go(1), intervalMs);
    return () => clearInterval(t);
  }, [auto, intervalMs]);

  // Keyboard arrows
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Touch handlers (simple swipe detection)
  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
    swipeLocked.current = false;
  };

  const onTouchMove = (e) => {
    if (swipeLocked.current) return;
    if (touchStartX.current == null || touchStartY.current == null) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStartX.current;
    const dy = t.clientY - touchStartY.current;

    // require mostly-horizontal swipe & a threshold
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      swipeLocked.current = true;
      if (dx < 0) go(1); // swipe left -> next
      else go(-1); // swipe right -> prev
    }
  };

  const onTouchEnd = () => {
    touchStartX.current = null;
    touchStartY.current = null;
    swipeLocked.current = false;
  };

  return (
    <Box
      sx={{
        width,
        height,
        borderRadius: "16px",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        backgroundImage: `url(${images[index]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        userSelect: "none",
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-label="Image carousel"
    >
      {/* Prev / Next buttons */}
      <IconButton
        onClick={() => go(-1)}
        sx={{
          position: "absolute",
          left: 6,
          top: "50%",
          transform: "translateY(-50%)",
          bgcolor: "rgba(0,0,0,0.35)",
          color: "#fff",
          "&:hover": { bgcolor: "rgba(0,0,0,0.55)" },
        }}
        aria-label="Previous image"
      >
        <ArrowBackIosNewIcon fontSize="small" />
      </IconButton>

      <IconButton
        onClick={() => go(1)}
        sx={{
          position: "absolute",
          right: 6,
          top: "50%",
          transform: "translateY(-50%)",
          bgcolor: "rgba(0,0,0,0.35)",
          color: "#fff",
          "&:hover": { bgcolor: "rgba(0,0,0,0.55)" },
        }}
        aria-label="Next image"
      >
        <ArrowForwardIosIcon fontSize="small" />
      </IconButton>

      {/* Dots */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          position: "absolute",
          bottom: 8,
          left: "50%",
          transform: "translateX(-50%)",
          bgcolor: "rgba(0,0,0,0.35)",
          px: 1.25,
          py: 0.5,
          borderRadius: 999,
        }}
      >
        {images.map((_, i) => (
          <Box
            key={i}
            onClick={() => setIndex(i)}
            sx={{
              width: i === index ? 10 : 8,
              height: i === index ? 10 : 8,
              borderRadius: "50%",
              bgcolor: i === index ? "#fff" : "rgba(255,255,255,0.6)",
              cursor: "pointer",
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </Stack>
    </Box>
  );
}
