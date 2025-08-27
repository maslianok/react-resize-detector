# Handle element resizes like it's 2025!

<img src="https://img.shields.io/npm/v/react-resize-detector?style=flat-square" /> <img src="https://img.shields.io/npm/l/react-resize-detector?style=flat-square" /> <img src="https://img.shields.io/npm/dm/react-resize-detector?style=flat-square" /> <img src="https://img.shields.io/bundlejs/size/react-resize-detector?style=flat-square" />

#### [Live demo](https://react-resize-detector.vercel.app/)

Modern browsers now have native support for detecting element size changes through [ResizeObservers](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver). This library utilizes ResizeObservers to facilitate managing element size changes in React applications.

🐥 Tiny <a href="https://bundlephobia.com/result?p=react-resize-detector" target="__blank">~2kb</a>

🐼 Written in TypeScript

🐠 Used by <a href="https://github.com/maslianok/react-resize-detector/network/dependents" target="__blank">170k repositories</a>

🦄 Produces <a href="https://npmtrends.com/react-resize-detector" target="__blank">100 million downloads annually</a>

No `window.resize` listeners! No timeouts!

## Should you use this library?

**Consider CSS Container Queries first!** They now work in [all major browsers](https://caniuse.com/css-container-queries) and might solve your use case with pure CSS.

<details><summary>CSS Container Queries Example</summary>

```html
<div class="post">
  <div class="card">
    <h2>Card title</h2>
    <p>Card content</p>
  </div>
</div>
```

```css
.post {
  container-type: inline-size;
}

/* Default heading styles for the card title */
.card h2 {
  font-size: 1em;
}

/* If the container is larger than 700px */
@container (min-width: 700px) {
  .card h2 {
    font-size: 2em;
  }
}
```

</details>

**Use this library when you need:**

- JavaScript-based resize logic with full TypeScript support
- Complex calculations based on dimensions
- Integration with React state/effects
- Programmatic control over resize behavior

## Installation

```bash
npm install react-resize-detector
# OR
yarn add react-resize-detector
# OR
pnpm add react-resize-detector
```

## Quick Start

### Basic Usage

```tsx
import { useResizeDetector } from 'react-resize-detector';

const CustomComponent = () => {
  const { width, height, ref } = useResizeDetector<HTMLDivElement>();
  return <div ref={ref}>{`${width}x${height}`}</div>;
};
```

### With Resize Callback

```tsx
import { useCallback } from 'react';
import { useResizeDetector, OnResizeCallback } from 'react-resize-detector';

const CustomComponent = () => {
  const onResize: OnResizeCallback = useCallback((payload) => {
    if (payload.width !== null && payload.height !== null) {
      console.log('Dimensions:', payload.width, payload.height);
    } else {
      console.log('Element unmounted');
    }
  }, []);

  const { width, height, ref } = useResizeDetector<HTMLDivElement>({
    onResize,
  });

  return <div ref={ref}>{`${width}x${height}`}</div>;
};
```

### With External Ref (Advanced)

_It's not advised to use this approach, as dynamically mounting and unmounting the observed element could lead to unexpected behavior._

```tsx
import { useRef } from 'react';
import { useResizeDetector } from 'react-resize-detector';

const CustomComponent = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { width, height } = useResizeDetector({ targetRef });
  return <div ref={targetRef}>{`${width}x${height}`}</div>;
};
```

## API Reference

### Hook Signature

```typescript
useResizeDetector<T extends HTMLElement = HTMLElement>(
  props?: useResizeDetectorProps<T>
): UseResizeDetectorReturn<T>
```

### Props

| Prop              | Type                                        | Description                                                                                                           | Default     |
| ----------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------- |
| `onResize`        | `(payload: ResizePayload) => void`          | Callback invoked with resize information                                                                              | `undefined` |
| `handleWidth`     | `boolean`                                   | Trigger updates on width changes                                                                                      | `true`      |
| `handleHeight`    | `boolean`                                   | Trigger updates on height changes                                                                                     | `true`      |
| `skipOnMount`     | `boolean`                                   | Skip the first resize event when component mounts                                                                     | `false`     |
| `disableRerender` | `boolean`                                   | Disable re-renders triggered by the hook. Only the onResize callback will be called                                   | `false`     |
| `refreshMode`     | `'throttle' \| 'debounce'`                  | Rate limiting strategy. See [es-toolkit docs](https://es-toolkit.dev)                                                 | `undefined` |
| `refreshRate`     | `number`                                    | Delay in milliseconds for rate limiting                                                                               | `1000`      |
| `refreshOptions`  | `{ leading?: boolean; trailing?: boolean }` | Additional options for throttle/debounce                                                                              | `undefined` |
| `observerOptions` | `ResizeObserverOptions`                     | Options passed to [`resizeObserver.observe`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/observe) | `undefined` |
| `targetRef`       | `MutableRefObject<T \| null>`               | External ref to observe (use with caution)                                                                            | `undefined` |

## Advanced Examples

### Responsive Component

```jsx
import { useResizeDetector } from 'react-resize-detector';

const ResponsiveCard = () => {
  const { width, ref } = useResizeDetector();

  const cardStyle = {
    padding: width > 600 ? '2rem' : '1rem',
    fontSize: width > 400 ? '1.2em' : '1em',
    flexDirection: width > 500 ? 'row' : 'column',
  };

  return (
    <div ref={ref} style={cardStyle}>
      <h2>Responsive Card</h2>
      <p>Width: {width}px</p>
    </div>
  );
};
```

### Chart Resizing

```jsx
import { useResizeDetector } from 'react-resize-detector';
import { useEffect, useRef } from 'react';

const Chart = () => {
  const chartRef = useRef(null);
  const { width, height, ref } = useResizeDetector({
    refreshMode: 'debounce',
    refreshRate: 100,
  });

  useEffect(() => {
    if (width && height && chartRef.current) {
      // Redraw chart with new dimensions
      redrawChart(chartRef.current, width, height);
    }
  }, [width, height]);

  return <canvas ref={ref} />;
};
```

### Performance Optimization

```jsx
import { useResizeDetector } from 'react-resize-detector';

const OptimizedComponent = () => {
  const { width, height, ref } = useResizeDetector({
    // Only track width changes
    handleHeight: false,
    // Debounce rapid changes
    refreshMode: 'debounce',
    refreshRate: 150,
    // Skip initial mount calculation
    skipOnMount: true,
    // Use border-box for more accurate measurements
    observerOptions: { box: 'border-box' },
  });

  return <div ref={ref}>Optimized: {width}px wide</div>;
};
```

### Disable Re-renders

```jsx
import { useResizeDetector } from 'react-resize-detector';

const NonRerenderingComponent = () => {
  const { ref } = useResizeDetector({
    // Disable re-renders triggered by the hook
    disableRerender: true,
    // Handle resize events through callback only
    onResize: ({ width, height }) => {
      // Update external state or perform side effects
      // without causing component re-renders
      console.log('Resized to:', width, height);
    },
  });

  return <div ref={ref}>This component won't re-render on resize</div>;
};
```

## Browser Support

- ✅ Chrome 64+
- ✅ Firefox 69+
- ✅ Safari 13.1+
- ✅ Edge 79+

For older browsers, consider using a [ResizeObserver polyfill](https://github.com/que-etc/resize-observer-polyfill).

## Testing

```jsx
const { ResizeObserver } = window;

beforeEach(() => {
  delete window.ResizeObserver;
  // Mock ResizeObserver for tests
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});

afterEach(() => {
  window.ResizeObserver = ResizeObserver;
  jest.restoreAllMocks();
});
```

## Performance Tips

1. **Use `handleWidth`/`handleHeight: false`** if you only need one dimension
2. **Enable `skipOnMount: true`** if you don't need initial measurements
3. **Use `debounce` or `throttle`** for expensive resize handlers
4. **Specify `observerOptions.box`** for consistent measurements

## License

MIT

## ❤️ Support

Show us some love and STAR ⭐ the project if you find it useful
