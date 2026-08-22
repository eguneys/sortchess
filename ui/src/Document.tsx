import type { ParentProps } from 'solid-js';
import { HydrationScript } from '@solidjs/web';

// The document shell — the new index.html: picked up by the src/Document.*
// convention, it wraps the app in the plugin's generated entries and must
// render the full <html>. Head tags go here. It is compiled only into the
// prerendered static shell and ships zero client-side JS: in client mode
// <HydrationScript /> is stripped from the shell, and it activates when the
// app flips to SSR (`ssr: true` in vite.config.ts) — no document changes
// needed. Delete this file to fall back to the plugin's built-in shell.
export default function Document(props: ParentProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <link rel="icon" type="image/png" href="/logo-big.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>sortchess.com · Play Sort Chess</title>

        <meta name="description" content="Sort 3 Chess Positions with Risk, Story, and Time Mode or Daily puzzles Local-First No-Backend No-Tracking" />
        <meta property="og:title" content="Play Sort Chess in Sort Chess with Modes or Daily puzzles" />
        <meta property="og:description" content="Sort 3 Chess Positions with Risk, Story, and Time Mode or Daily puzzles Local-First No-Backend No-Tracking" />
        <meta property="og:url" content="https://sortchess.com" />
        <meta property="og:logo" content="https://sortchess.com/favicon.png" />
        <meta property="og:image" content="https://sortchess.com/logo-big.png" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="sortchess.com" />
        <meta property="og:image:width" content="1254" />
        <meta property="og:image:height" content="1254" />
        <meta property="og:image:url" content="https://sortchess.com/logo-big.png" />
        <meta property="og:image:secure_url" content="https://sortchess.com/logo-big.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:image" content="https://sortchess.com/logo-big.png" />

        <style>
          @import url('https://fonts.googleapis.com/css2?family=Aldrich&family=Google+Sans+Flex:opsz,wght@6..144,1..1000&family=Tilt+Neon&display=swap');
        </style>
        <HydrationScript />
      </head>
      <body>{props.children}</body>
    </html>
  );
}
