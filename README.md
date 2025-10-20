# Modern Portfolio Template

A minimal, dark-themed personal portfolio template built with Next.js, TypeScript, and Tailwind CSS. Inspired by Brittany Chiang's design philosophy, this template emphasizes performance, accessibility, and maintainability.

## ✨ Features

- **Modern Tech Stack**: Next.js 15 with App Router, TypeScript, Tailwind CSS v4
- **Dark Mode**: System-aware theme with manual toggle (dark mode by default)
- **Smooth Animations**: Framer Motion with respect for `prefers-reduced-motion`
- **Fully Accessible**: WCAG AA compliant with semantic HTML, keyboard navigation, and ARIA labels
- **Performance Optimized**: Static generation, image optimization, and minimal bundle size
- **SEO Ready**: Comprehensive meta tags, OpenGraph, and Twitter cards
- **Responsive Design**: Mobile-first approach with clean, centered layout (max 880px)
- **Type-Safe**: Full TypeScript coverage with strict mode enabled
- **Zero-Config Deploy**: Ready for Vercel, Netlify, or any static host

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

```bash
# Clone or download this repository
git clone <your-repo-url>
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📦 Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript compiler check
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

## 🎨 Customization

### Personal Information

1. **Profile Data**: Edit `app/lib/projects.ts` to update your projects
2. **About Section**: Modify `app/components/About.tsx` for your bio and tech stack
3. **Contact Info**: Update social links in `app/components/Footer.tsx`
4. **Metadata**: Edit SEO information in `app/layout.tsx`

### Design Tokens

All design tokens are defined in `app/globals.css`:

```css
--color-background-dark: #0b1220;
--color-foreground-dark: #e2e8f0;
--color-accent: #38bdf8;
/* ... more tokens */
```

### Project Images

Replace placeholder SVGs in `/public` with your project screenshots:
- `project-1.svg` → your-project-1.png/jpg/svg
- Update paths in `app/lib/projects.ts`

## 📁 Project Structure

```
portfolio/
├── app/
│   ├── components/
│   │   ├── About.tsx          # About section with bio
│   │   ├── Contact.tsx        # Contact CTA section
│   │   ├── Footer.tsx         # Footer with social links
│   │   ├── Header.tsx         # Sticky navigation
│   │   ├── Hero.tsx           # Hero/landing section
│   │   ├── ProjectCard.tsx    # Individual project card
│   │   ├── ProjectsGrid.tsx   # Projects grid layout
│   │   ├── SkipLink.tsx       # Accessibility skip link
│   │   ├── ThemeProvider.tsx  # Theme context provider
│   │   └── ThemeToggle.tsx    # Dark/light mode toggle
│   ├── lib/
│   │   └── projects.ts        # Project data
│   ├── globals.css            # Global styles & design tokens
│   ├── layout.tsx             # Root layout with metadata
│   └── page.tsx               # Home page
├── public/
│   └── project-*.svg          # Placeholder project images
├── .eslintrc.config.mjs       # ESLint configuration
├── .prettierrc                # Prettier configuration
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies & scripts
├── postcss.config.mjs         # PostCSS configuration
└── tsconfig.json              # TypeScript configuration
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js settings
   - Click "Deploy"

3. **Custom Domain** (Optional):
   - Navigate to your project → Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions
   - HTTPS is automatically enabled

### Deploy to Other Platforms

This project uses static generation and can deploy to:

- **Netlify**: Connect GitHub repo, set build command to `npm run build`
- **Cloudflare Pages**: Auto-detects Next.js, zero configuration
- **GitHub Pages**: Requires `next.config.ts` modification for static export

### Environment Variables

No environment variables are required for the basic setup. If you add features requiring secrets (e.g., contact form API), add them to:
- `.env.local` (local development, git-ignored)
- Vercel Dashboard → Project → Settings → Environment Variables

## ♿ Accessibility

This template follows WCAG 2.1 AA standards:

- ✅ Semantic HTML5 elements
- ✅ Keyboard navigation support
- ✅ Skip to main content link
- ✅ Sufficient color contrast (checked)
- ✅ Focus visible indicators
- ✅ Alt text for all images
- ✅ ARIA labels for icon-only buttons
- ✅ Respects `prefers-reduced-motion`

## 🔧 Technical Details

### Dependencies

**Core**:
- `next` (v15.5+): React framework with App Router
- `react` (v19): UI library
- `typescript` (v5): Type safety

**Styling**:
- `tailwindcss` (v4): Utility-first CSS framework
- `framer-motion` (v12): Animation library

**Theming**:
- `next-themes` (v0.4): Dark/light mode management

**Development**:
- `eslint` + `eslint-config-next`: Linting
- `prettier`: Code formatting

### Performance Optimizations

- Static site generation (SSG) for instant page loads
- Image optimization via `next/image`
- Minimal JavaScript bundle (~80KB gzipped)
- CSS purging via Tailwind
- Font optimization with `next/font`
- Lazy loading for off-screen content

### Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari 14+
- iOS Safari 14+

## 📝 Content Guidelines

### Writing Effective Project Descriptions

- **Title**: Clear, concise project name (3-5 words)
- **Description**: 1-2 sentences explaining what it does and key features
- **Tech Stack**: 3-6 relevant technologies
- **Links**: Include live demo and/or GitHub repo

### SEO Best Practices

1. Update `metadata` in `app/layout.tsx` with your name and description
2. Add an `og:image` for social sharing (recommended: 1200x630px)
3. Ensure all images have descriptive alt text
4. Use descriptive anchor text for links

## 🐛 Troubleshooting

**Build errors with Tailwind**:
- Ensure `@tailwindcss/postcss` is installed
- Check `postcss.config.mjs` exists

**Hydration errors**:
- `ThemeProvider` uses `suppressHydrationWarning` on `<html>` tag
- Ensure client components are marked with `"use client"`

**Images not loading**:
- Verify image paths in `public/` directory
- Check `next.config.ts` for remote image domains (if using external images)

**TypeScript errors**:
- Run `npm run typecheck` to see detailed errors
- Ensure all `@types/*` packages are installed

## 📄 License

This template is open source and available under the MIT License. Feel free to use it for personal or commercial projects.

## 🙏 Credits

Design inspiration from [Brittany Chiang](https://brittanychiang.com)'s iconic portfolio aesthetic.

## 📬 Questions or Issues?

Open an issue on GitHub or reach out via the contact form on the live site.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
