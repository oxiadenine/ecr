import localFont from "next/font/local";

import "@/app/icons/fa-icons.css";
import "@/app/icons/fa-icons-regular.css";
import "@/app/icons/fa-icons-solid.css";
import "@/app/icons/fa-icons-brand.css";

export const iconsFont = localFont({
  src: [
    { path: "./fa-icons-regular-400.woff2" },
    { path: "./fa-icons-solid-900.woff2" },
    { path: "./fa-icons-brand-400.woff2" }
  ]
});
