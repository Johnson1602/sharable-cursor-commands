// AIGC START
import { type MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sharable Cursor Commands",
    short_name: "Cursor Commands",
    description: "Create and share Cursor slash commands instantly",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
  };
}
// AIGC END
