# 10th Avenue Bible Chapel Website

A modern, responsive website for 10th Avenue Bible Chapel built with React and TypeScript.

## 🚀 Features

- **TypeScript**: Full TypeScript implementation for better type safety and developer experience
- **Modular Architecture**: Clean, organized code structure with reusable components
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Scroll Animations**: Smooth scroll reveal animations throughout the site
- **Modern React**: Built with React 19 and latest best practices
- **Custom Hooks**: Reusable logic with custom hooks for scroll detection and animations

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx      # Button component with multiple variants
│   ├── Card.tsx        # Service card component
│   ├── Header.tsx      # Navigation header
│   ├── Footer.tsx      # Site footer
│   ├── ScrollReveal.tsx # Scroll animation wrapper
│   └── ...
├── pages/              # Page components
│   ├── Home.tsx        # Homepage with modular sections
│   ├── About.tsx       # About page with beliefs
│   ├── Contact.tsx     # Contact form and information
│   ├── Sermon.tsx      # Sermon listings
│   ├── Prayers.tsx     # Prayer requests
│   └── Bulletin.tsx    # Church announcements
├── hooks/              # Custom React hooks
│   ├── useScrollReveal.ts # Scroll animation hook
│   └── useScrollPosition.ts # Scroll position tracking
├── types/              # TypeScript type definitions
│   └── index.ts        # Common interfaces and types
├── constants/          # Application constants
│   └── index.ts        # Static data and configuration
└── assets/             # Images and static assets
```

## 🛠️ Key Improvements

### TypeScript Conversion

- Converted all JavaScript files to TypeScript
- Added comprehensive type definitions
- Improved type safety and IntelliSense support
- Better error catching at compile time

### Modularization

- **Component Separation**: Broke down large components into smaller, focused ones
- **Custom Hooks**: Extracted reusable logic into custom hooks
- **Constants**: Centralized static data and configuration
- **Type Definitions**: Organized interfaces and types

### Code Quality

- **Consistent Naming**: Standardized component and file naming
- **Props Interfaces**: Clear type definitions for all component props
- **Error Handling**: Better error boundaries and validation
- **Performance**: Optimized re-renders and animations

### New Features

- **Scroll Animations**: Smooth reveal animations using Intersection Observer
- **Form Handling**: Proper form state management with TypeScript
- **Filtering**: Interactive filtering for bulletin and prayer requests
- **Responsive Design**: Improved mobile experience

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Development

```bash
# Run tests
npm test

# Type checking
npx tsc --noEmit
```

## 📦 Dependencies

### Core Dependencies

- React 19
- React Router DOM 7
- TypeScript 5

### Development Dependencies

- @types/react
- @types/react-dom
- @types/node
- TypeScript ESLint

## 🎨 Styling

The project uses CSS modules and custom CSS with:

- Modern CSS Grid and Flexbox
- Responsive design patterns
- Smooth animations and transitions
- Consistent color scheme and typography

## 🔧 Configuration

### TypeScript Configuration

- Strict type checking enabled
- React JSX support
- Modern ES6+ features
- Path mapping for clean imports

### Build Configuration

- Optimized for production builds
- Asset optimization
- Code splitting support

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- 10th Avenue Bible Chapel community
- React and TypeScript communities
- All contributors and supporters
