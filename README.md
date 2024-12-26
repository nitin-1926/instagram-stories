# Instagram Stories Clone

A performant React implementation of Instagram Stories featuring smooth animations, touch interactions, and progressive image loading.
Deployment Link: https://instagram-stories-one.vercel.app/

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository

    ```bash
    git clone <repository-url>
    cd instagram-stories
    ```

2. Install dependencies

    ```bash
    npm install
    # or
    yarn
    ```

3. Start the development server
    ```bash
    npm run dev
    # or
    yarn dev
    ```

The application will be available at `http://localhost:5173`

## 🧪 Testing

The project uses Cypress for end-to-end testing. To run the tests:

### Interactive Mode

```bash
npm run test:e2e
# or
yarn test:e2e
```

### Headless Mode

```bash
npm run test:e2e:headless
# or
yarn test:e2e:headless
```

## 🎨 Design Choices & Optimizations

### Performance Optimizations

1. **Memoization**

    - Heavy use of `React.memo()` for components that don't need frequent re-renders
    - `useMemo` and `useCallback` hooks for expensive computations and callback stability
    - Reference: Stories.tsx and StoryViewer.tsx components

2. **Image Loading**

    - Custom `useImagePreloader` hook for progressive image loading
    - Blur-to-sharp transition for better perceived performance
    - Preloading of next story image for seamless transitions

3. **Animation Performance**
    - Framer Motion for hardware-accelerated animations
    - CSS transforms instead of layout properties
    - `will-change` hints for smoother animations

### Architecture & Scalability

1. **Modular Structure**

    - Components are organized by feature (Stories module)
    - Clear separation of concerns (views, components, hooks)
    - TypeScript for type safety and better maintainability

2. **Reusable Components**

    - Atomic design approach with shared components
    - Styled-components for maintainable and scoped CSS
    - Component composition for flexibility

3. **Touch Interactions**
    - Efficient touch handling for mobile devices
    - Gesture support for story navigation
    - Responsive design with mobile-first approach

### Testing Strategy

1. **End-to-End Testing**

    - Comprehensive Cypress tests for critical user flows
    - Custom commands for common testing patterns
    - Test coverage for both desktop and mobile interactions

2. **Performance Testing**
    - Image loading optimization tests
    - Animation smoothness verification
    - Touch interaction responsiveness

## 📦 Tech Stack

- React 18
- TypeScript
- Vite
- Framer Motion
- Styled Components
- Cypress
- ESLint & Prettier

## 📝 License

MIT
