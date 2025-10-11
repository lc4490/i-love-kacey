"use client";

import CakeIcon from "@mui/icons-material/Cake";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import StraightenIcon from "@mui/icons-material/Straighten";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import {
  Box,
  Divider,
  Fade,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { keyframes } from "@mui/system";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const age = Math.floor(
    (new Date() - new Date("2002-12-26")) / (1000 * 60 * 60 * 24 * 365)
  );
  const [images, setImages] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      setImages(data.images || []);
    })();
  }, []);
  const [index, setIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const timerRef = useRef(null);
  const longRef = useRef(false);
  const LONG_MS = 500;

  const clear = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  };
  useEffect(() => {
    setIndex(Math.floor(Math.random() * images.length));
  }, [images.length]);

  const LIKE_MS = 800;

  const like = () => {
    if (likeFX) return; // optional: ignore taps during FX
    setLikeFX(true);
    setIndex((prev) => {
      if (images.length < 2) return prev; // nothing to randomize
      let next = prev;
      while (next === prev) next = Math.floor(Math.random() * images.length);
      return next;
    });
    setTimeout(() => {
      setLikeFX(false);
    }, LIKE_MS);
  };

  const superLike = () => setModalOpen(true);

  const handleClick = async () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const rel = images.length ? `/${images[index % images.length]}` : "";
    const currentUrl = rel ? `${origin}${rel}` : "";

    const fd = new FormData();
    fd.append("access_key", "c9c4362b-9084-4f01-b7df-0bb3ed0a0cca");
    fd.append("subject", message || "New like from Kacey App");
    fd.append("message", message || "");
    if (currentUrl) fd.append("image_url", currentUrl); // shows as a field too

    // Attach the image file (works for same-origin /public images)
    // try {
    //   if (currentUrl) {
    //     const res = await fetch(currentUrl);
    //     const blob = await res.blob(); // must be ≤ 5MB on free plan
    //     const ext = (blob.type?.split("/")[1] || "jpg").replace("jpeg", "jpg");
    //     const file = new File([blob], `photo.${ext}`, {
    //       type: blob.type || "image/jpeg",
    //     });
    //     fd.append("attachment", file, file.name); // <-- Web3Forms file field
    //   }
    // } catch (e) {
    //   console.warn("Could not attach image, sending link only:", e);
    // }

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: fd,
    });
    const data = await res.json();

    if (data.success) {
      setMessage("");
      setModalOpen(false);
      setIndex((i) => (images.length ? (i + 1) % images.length : 0));
    } else {
      console.error("Web3Forms error:", data);
    }
  };

  const currentUrl = images.length ? images[index % images.length] : "";

  const flash = keyframes`
  0% { opacity: 0; }
  10% { opacity: 0.9; }
  70% { opacity: 0.9; }
  100% { opacity: 0; }
`;

  const pop = keyframes`
  0% { transform: scale(0.4); opacity: 0; }
  30% { transform: scale(1); opacity: 1; }
  70% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
`;

  const [likeFX, setLikeFX] = useState(false);

  return (
    <Box
      width="100vw"
      height="90vh"
      backgroundColor="#eee"
      display="flex"
      justifyContent={"center"}
    >
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        closeAfterTransition
        slotProps={{
          backdrop: {
            timeout: 200,
            sx: { bgcolor: "rgba(255,255,255,0.9)" }, // white tint
          },
        }}
      >
        <Fade in={modalOpen}>
          <Box
            sx={{
              position: "fixed",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
            }}
          >
            <Stack display="flex" flexDirection={"column"}>
              {/* Image */}
              <Typography
                color="#111"
                fontSize="2rem"
                fontWeight="600"
                padding={1}
              >
                {"Kacey"}
              </Typography>
              <Box
                width="300px"
                height="300px"
                borderRadius="16px"
                sx={{
                  backgroundImage: currentUrl ? `url(${currentUrl})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
                display="flex"
                justifyContent={"flex-end"}
                alignItems={"flex-end"}
              />

              {/* Text field */}
              <Box sx={{ padding: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Add a comment"
                  variant="outlined"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fff", // solid white
                      borderRadius: 1.5, // optional: rounder
                      // optional border colors:
                      "& fieldset": { borderColor: "divider" },
                      "&:hover fieldset": { borderColor: "text.secondary" },
                      "&.Mui-focused fieldset": { borderColor: "text.primary" },
                    },
                  }}
                />
              </Box>
              <Stack display="flex" flexDirection={"row"} width="100%" gap={2}>
                <Box
                  backgroundColor="#bbaabe"
                  padding={2}
                  borderRadius={16}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  sx={{ cursor: "pointer" }}
                  onClick={() => setModalOpen(false)}
                >
                  <CloseIcon />
                </Box>
                <Box
                  backgroundColor="#e4dad7"
                  padding={2}
                  borderRadius={16}
                  display="flex"
                  justifyContent={"center"}
                  width="100%"
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleClick()}
                >
                  <Typography fontWeight={"600"}>Send Like</Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Fade>
      </Modal>
      {/* Name Header */}
      <Stack mt="50px">
        <Stack flexDirection={"row"} justifyContent="space-between" padding={1}>
          <Stack display="flex" flexDirection={"row"} gap={1}>
            <Typography color="#111" fontSize="2rem" fontWeight="600">
              {"Kacey <3"}
            </Typography>
          </Stack>
          <Box display="flex" justifyContent={"cente"} alignItems={"center"}>
            <MoreHorizIcon />
          </Box>
        </Stack>
        {/* Picture */}
        <Box
          width="350px"
          height="350px"
          borderRadius="16px"
          sx={{
            backgroundImage: currentUrl ? `url(${currentUrl})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          display="flex"
          justifyContent={"flex-end"}
          alignItems={"flex-end"}
        >
          <IconButton
            onPointerDown={() => {
              longRef.current = false;
              timerRef.current = setTimeout(() => {
                longRef.current = true;
                superLike();
                if (navigator.vibrate) navigator.vibrate(10);
              }, LONG_MS);
            }}
            onPointerUp={() => {
              if (!longRef.current) like();
              clear();
            }}
            onPointerLeave={clear}
            onPointerCancel={clear}
            onClick={(e) => {
              // prevent extra click after long-press
              if (longRef.current) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            onContextMenu={(e) => e.preventDefault()} // stop iOS long-press menu
            disableRipple
            sx={{
              // position: "absolute",
              // right: 12,
              // bottom: 12,
              width: 50,
              height: 50,
              margin: 1,
              borderRadius: "9999px",
              bgcolor: "#fff",
              boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
              touchAction: "manipulation",
              WebkitTouchCallout: "none",
            }}
            aria-label="Like"
          >
            <FavoriteBorderIcon sx={{ fontSize: "1.5rem" }} />
          </IconButton>
        </Box>

        {/* Info stuff */}
        <Box
          width="350px"
          backgroundColor="#fff"
          borderRadius="16px"
          marginTop={2.5}
          padding={2}
          display={"flex"}
          flexDirection={"column"}
          gap={2}
        >
          <Stack display="flex" flexDirection={"row"} gap={2}>
            {" "}
            <Stack flexDirection={"row"} gap={2}>
              <CakeIcon />
              <Typography>{age}</Typography>
            </Stack>
            <Divider orientation="vertical" />
            <Stack flexDirection={"row"} gap={1}>
              <StraightenIcon sx={{ transform: "rotate(90deg)" }} />
              <Typography>{`4'11`}</Typography>
            </Stack>
            <Divider orientation="vertical" />
            <Stack flexDirection={"row"} gap={1}>
              <LocationOnIcon />
              <Typography>New York</Typography>
            </Stack>
          </Stack>
          <Divider />
          <Stack flexDirection={"row"} gap={2}>
            <WorkOutlineIcon />
            <Typography>Best Cat Mom and Girlfriend Ever</Typography>
          </Stack>
        </Box>
      </Stack>
      {likeFX && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 1300, // above page content
            bgcolor: "#fff",
            animation: `${flash} ${LIKE_MS}ms ease`,
            display: "grid",
            placeItems: "center",
            pointerEvents: "none", // visual only; doesn’t block taps
            "@media (prefers-reduced-motion: reduce)": {
              animation: "none",
              opacity: 0.95,
            },
          }}
        >
          <FavoriteBorderIcon
            sx={{
              fontSize: 96,
              color: "#e91e63",
              animation: `${pop} ${LIKE_MS}ms ease`,
              "@media (prefers-reduced-motion: reduce)": { animation: "none" },
            }}
          />
        </Box>
      )}
    </Box>
  );
}
