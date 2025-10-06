"use client";

import {
  Box,
  Button,
  Divider,
  Fade,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CakeIcon from "@mui/icons-material/Cake";
import StraightenIcon from "@mui/icons-material/Straighten";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { useRef, useState } from "react";

export default function Home() {
  const age = Math.floor(
    (new Date() - new Date("2002-12-26")) / (1000 * 60 * 60 * 24 * 365)
  );
  const images = ["image1.png", "image2.png", "image3.png", "image4.png"];
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
  const like = () => setIndex(index + 1);
  const superLike = () => setModalOpen(true);

  const handleClick = () => {
    console.log(message);
    setModalOpen(false);
    setIndex(index + 1);
    setMessage("");
  };
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
                  backgroundImage: `url(/${images[index % images.length]})`,
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
          <Typography color="#111" fontSize="2rem" fontWeight="600">
            {"Kacey"}
          </Typography>
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
            backgroundImage: `url(/${images[index % images.length]})`,
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
    </Box>
  );
}
