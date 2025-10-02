# Public Assets Folder

This folder contains all static assets for the Journii application.

## Folder Structure

```
public/
├── images/
│   ├── portfolio/          # Portfolio artwork examples
│   │   ├── bust1.jpg       # Character portrait examples
│   │   ├── fullbody1.jpg   # Full body character art
│   │   └── emotes1.jpg     # Emote pack examples
│   └── examples/           # Additional example artwork
├── icons/                  # Custom icons and logos
└── favicon files           # Site favicon and app icons
```

## Asset Guidelines

### Images
- **Format**: JPG/PNG for photos, SVG for icons
- **Size**: Optimize for web (under 500KB recommended)
- **Naming**: Use descriptive, lowercase names with hyphens

### Portfolio Images
- **Dimensions**: 400x400px minimum for square thumbnails
- **Quality**: High quality but web-optimized
- **Categories**: Organize by commission type (bust, fullbody, emotes, etc.)

### Icons
- **Format**: SVG preferred for scalability
- **Size**: 24x24, 32x32, 64x64 common sizes
- **Style**: Consistent with overall design theme

## Usage in Code

```tsx
// Using Next.js Image component
import Image from 'next/image'

<Image 
  src="/images/portfolio/bust1.jpg" 
  alt="Character portrait example"
  width={400}
  height={400}
/>

// Direct path for background images
<div style={{ backgroundImage: 'url(/images/examples/bg1.jpg)' }} />
```

## Adding New Assets

1. Place files in appropriate subfolder
2. Use descriptive filenames
3. Optimize file size for web
4. Update this README if adding new categories
5. Test images display correctly in development

## Commission Page Assets Needed

- [ ] Portfolio examples (bust, fullbody, emotes)
- [ ] Character reference images
- [ ] Logo/branding assets
- [ ] Background textures/patterns
- [ ] Social media icons
- [ ] Process step illustrations
