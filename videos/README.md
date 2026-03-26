# Video Assets for Sea Wolf Adventures

Place your video files in this directory. The website supports two video integration points:

## 1. Hero Background Video (Homepage)

The homepage hero section accepts a looping background video. Recommended specs:

- **Format:** MP4 (H.264) and/or WebM (VP9) for broad browser support
- **Resolution:** 1920x1080 minimum; 2560x1440 preferred
- **Duration:** 15 to 45 seconds (looping)
- **File size:** Keep under 15 MB for fast loading; compress with HandBrake or FFmpeg
- **Audio:** Must be muted (the HTML tag enforces this)

To activate, edit `index.html` and uncomment the `<source>` tags inside the `<video>` element:

```html
<source src="/videos/hero-reel.mp4" type="video/mp4" />
<source src="/videos/hero-reel.webm" type="video/webm" />
```

## 2. Video Gallery / Showcase Sections

Video gallery sections are available on any page. Each video card accepts either:

- A self-hosted MP4 file in this `/videos/` directory
- A Cloudflare Stream video ID (for adaptive bitrate streaming)

To activate a gallery video slot, edit the relevant page's HTML and replace the placeholder `src` or `data-stream-id` attributes.

## Cloudflare Stream Integration

For production, consider uploading videos to Cloudflare Stream for adaptive bitrate delivery. Replace `<video>` elements with:

```html
<stream src="YOUR_VIDEO_ID" autoplay loop muted controls
        style="width:100%;height:100%;object-fit:cover;"></stream>
<script data-cfasync="false" src="https://embed.cloudflarestream.com/embed/sdk.latest.js"></script>
```

## Naming Convention

- `hero-reel.mp4` / `hero-reel.webm` for the homepage hero
- `grizzly-fishing.mp4` for wildlife gallery clips
- `lodge-aerial.mp4` for lodge/property footage
- `orca-encounter.mp4` for whale watching footage
