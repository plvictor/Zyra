# Zyra Programming Language

<div align="center">
  <img src="docs/assets/zyra-logo.png" alt="Zyra Logo" width="180" />
  <h3>Modern Web Development Simplified</h3>
  <p>A powerful, expressive programming language designed for professional web applications</p>
  
  [![npm version](https://img.shields.io/npm/v/zyra-lang.svg?style=flat-square)](https://www.npmjs.org/package/zyra-lang)
  [![build status](https://img.shields.io/github/workflow/status/zyra-lang/zyra/CI/main?style=flat-square)](https://github.com/zyra-lang/zyra/actions?query=workflow%3ACI)
  [![license](https://img.shields.io/github/license/zyra-lang/zyra?style=flat-square)](LICENSE)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/zyra-lang/zyra/pulls)
</div>

---

## Overview

Zyra is a modern programming language created specifically for web development, designed to help developers build professional, scalable, and maintainable web applications. It combines the best features of JavaScript, TypeScript, and React with a powerful, intuitive syntax and built-in features for common web development tasks.

### Key Features

- **Expressive Syntax**: Clean, concise syntax that's easy to read and write
- **Type Safety**: Built-in static type system for catching errors early
- **Component-Based Architecture**: First-class support for reusable UI components
- **State Management**: Built-in reactive state management
- **Server Integration**: Seamless integration with backend services
- **Modern CSS**: Revolutionary approach to styling with dynamic themes
- **Performance Optimized**: Built with performance in mind from the beginning

## Getting Started

### Installation

```bash
# Install globally
npm install -g zyra-lang

# Verify installation
zyra --version
```

### Create a New Project

```bash
# Create a new project
zyra new my-app

# Navigate to the project directory
cd my-app

# Run the development server
zyra serve
```

### Project Structure

A typical Zyra project structure looks like this:

```
my-app/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components
│   ├── themes/          # Theme definitions
│   ├── store/           # State management
│   ├── models/          # Data models
│   ├── api/             # API endpoints
│   ├── utils/           # Utility functions
│   └── main.zy          # Entry point
├── public/              # Static assets
├── dist/                # Build output
├── tests/               # Test files
├── zyra.config.js       # Project configuration
└── package.json         # Dependencies and scripts
```

## Developing Professional Web Applications

### Component-Based Architecture

Zyra encourages a component-based architecture, allowing you to build reusable, self-contained UI components:

```zyra
// Button.zy
component Button {
  props {
    text: string;
    onClick: () => void;
    variant: "primary" | "secondary" | "danger" = "primary";
    size: "small" | "medium" | "large" = "medium";
  }
  
  render {
    <button 
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
    >
      {text}
    </button>
  }
}

// Usage
<Button 
  text="Click Me" 
  variant="primary"
  onClick={() => console.log('Button clicked')}
/>
```

### Theme System

Create dynamic, customizable themes for your application:

```zyra
// themes/main.zy
theme Main {
  colors {
    primary: "#2a6bcc";
    secondary: "#4dabf5";
    accent: "#ff6b6b";
    background: "#f5f5f5";
    text: "#333333";
    
    // Dark mode variants
    dark: {
      background: "#1a1a1a";
      text: "#f5f5f5";
    }
  }
  
  typography {
    fontFamily: "Roboto, sans-serif";
    fontSize: "16px";
    
    headings {
      h1: "2.5rem";
      h2: "2rem";
      h3: "1.5rem";
    }
  }
  
  spacing {
    unit: "8px";
    small: "$unit";
    medium: "$unit * 2";
    large: "$unit * 3";
  }
}

// Usage
component Card {
  inject theme = useTheme();
  
  render {
    <div style={{
      backgroundColor: theme.colors.background,
      color: theme.colors.text,
      padding: theme.spacing.medium,
      borderRadius: "8px"
    }}>
      <h2 style={{ fontSize: theme.typography.headings.h2 }}>
        Card Title
      </h2>
      <p>{children}</p>
    </div>
  }
}
```

### State Management

Manage application state with built-in stores:

```zyra
// store/cart.zy
store CartStore {
  // State
  state items: Array<CartItem> = [];
  state total: number = 0;
  
  // Actions
  action addItem(product: Product, quantity: number = 1) {
    const existingItem = this.items.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
    
    this.updateTotal();
  }
  
  action removeItem(productId: string) {
    this.items = this.items.filter(item => item.product.id !== productId);
    this.updateTotal();
  }
  
  // Private methods
  private function updateTotal() {
    this.total = this.items.reduce(
      (sum, item) => sum + (item.product.price * item.quantity), 
      0
    );
  }
}

// Usage in components
component Cart {
  inject cart = useCart();
  
  render {
    <div>
      <h2>Shopping Cart ({cart.items.length} items)</h2>
      <ul>
        {cart.items.map(item => (
          <li key={item.product.id}>
            {item.product.name} x {item.quantity}
            <button onClick={() => cart.removeItem(item.product.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div>Total: ${cart.total.toFixed(2)}</div>
    </div>
  }
}
```

### API Integration

Define and use API endpoints directly in your code:

```zyra
// api/products.zy
api {
  route "/api/products" {
    get() {
      const products = await db.Product.findAll();
      return products;
    }
    
    get("/:id") {
      const { id } = request.params;
      const product = await db.Product.findById(id);
      
      if (!product) {
        throw new NotFoundError("Product not found");
      }
      
      return product;
    }
    
    @authorize("admin")
    post() {
      const data = request.body;
      const product = await db.Product.create(data);
      return product;
    }
  }
}

// Usage in components
component ProductsList {
  state products = [];
  state isLoading = true;
  state error = null;
  
  async function fetchProducts() {
    try {
      this.isLoading = true;
      const response = await fetch('/api/products');
      const data = await response.json();
      this.products = data;
    } catch (err) {
      this.error = err.message;
    } finally {
      this.isLoading = false;
    }
  }
  
  onMount() {
    this.fetchProducts();
  }
  
  render {
    if (isLoading) return <Loading />;
    if (error) return <Error message={error} />;
    
    return (
      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  }
}
```

### Internationalization

Support multiple languages easily:

```zyra
// i18n/index.zy
i18n {
  defaultLocale: "en",
  supportedLocales: ["en", "es", "fr", "de"],
  
  translations: {
    en: {
      greeting: "Hello, {name}!",
      products: {
        addToCart: "Add to Cart",
        outOfStock: "Out of Stock"
      }
    },
    es: {
      greeting: "¡Hola, {name}!",
      products: {
        addToCart: "Añadir al Carrito",
        outOfStock: "Agotado"
      }
    }
  }
}

// Usage
component Greeting {
  inject t = useTranslation();
  
  render {
    <h1>{t("greeting", { name: "World" })}</h1>
  }
}
```

### Form Handling

Build and validate forms easily:

```zyra
// components/ContactForm.zy
component ContactForm {
  state formData = {
    name: "",
    email: "",
    message: ""
  };
  
  state errors = {};
  state isSubmitting = false;
  state isSubmitted = false;
  
  validator formValidator = {
    name: {
      required: true,
      minLength: 2
    },
    email: {
      required: true,
      email: true
    },
    message: {
      required: true,
      minLength: 10
    }
  };
  
  function handleChange(e) {
    this.formData[e.target.name] = e.target.value;
    
    // Clear the error when user types
    if (this.errors[e.target.name]) {
      this.errors = {
        ...this.errors,
        [e.target.name]: null
      };
    }
  }
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    // Validate form
    const validation = await validate(formData, formValidator);
    
    if (!validation.valid) {
      this.errors = validation.errors;
      return;
    }
    
    try {
      this.isSubmitting = true;
      await api.sendContact(formData);
      this.isSubmitted = true;
    } catch (error) {
      this.errors.form = error.message;
    } finally {
      this.isSubmitting = false;
    }
  }
  
  render {
    if (isSubmitted) {
      return (
        <div className="success-message">
          Thank you for your message! We'll get back to you soon.
        </div>
      );
    }
    
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "error" : ""}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "error" : ""}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={errors.message ? "error" : ""}
          />
          {errors.message && <span className="error-message">{errors.message}</span>}
        </div>
        
        {errors.form && <div className="form-error">{errors.form}</div>}
        
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    );
  }
}
```

### Animations and Transitions

Add fluid animations to your UI:

```zyra
// components/FadeIn.zy
import { motion } from "@zyra/animation";

component FadeIn {
  props {
    duration: number = 0.5;
    delay: number = 0;
    children: any;
  }
  
  render {
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration,
        delay,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  }
}

// Usage
<FadeIn delay={0.2}>
  <h1>Welcome to my website</h1>
</FadeIn>
```

## Advanced Topics

### Code Splitting

Optimize your application's loading performance:

```zyra
// Lazy load components
const AdminPanel = lazy(() => import('./components/AdminPanel'));

// Route-based code splitting
routes {
  '/': HomePage,
  '/about': AboutPage,
  '/products': ProductsPage,
  '/admin': {
    component: lazy(() => import('./pages/Admin')),
    auth: true
  }
}
```

### Server-Side Rendering

Enable server-side rendering for better SEO and performance:

```zyra
// zyra.config.js
export default {
  // Enable SSR
  ssr: true,
  
  // Configure SSR caching
  ssrCache: {
    enable: true,
    ttl: 3600, // 1 hour
    strategy: "stale-while-revalidate"
  },
  
  // Pre-render specific routes
  prerender: [
    '/',
    '/about',
    '/products'
  ]
}
```

### Progressive Web Apps

Turn your web app into a PWA:

```zyra
// zyra.config.js
export default {
  // Enable PWA features
  pwa: {
    enable: true,
    manifest: {
      name: "My Zyra App",
      short_name: "ZyraApp",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#2a6bcc",
      icons: [
        {
          src: "/icons/icon-192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/icons/icon-512.png",
          sizes: "512x512",
          type: "image/png"
        }
      ]
    },
    workbox: {
      runtimeCaching: [
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
          handler: "CacheFirst",
          options: {
            cacheName: "images",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
            }
          }
        }
      ]
    }
  }
}
```

### Testing

Write robust tests for your components and utilities:

```zyra
// tests/components/Button.test.zy
test("Button component", () => {
  // Render component
  const button = render(Button, {
    text: "Click me",
    onClick: jest.fn()
  });
  
  // Test rendering
  expect(button).toHaveText("Click me");
  
  // Test click event
  button.click();
  expect(button.props.onClick).toHaveBeenCalled();
  
  // Test variants
  const primaryButton = render(Button, {
    text: "Primary",
    variant: "primary"
  });
  
  expect(primaryButton).toHaveClass("btn-primary");
});
```

## Learn More

- [Official Documentation](https://zyra.dev/docs)
- [API Reference](https://zyra.dev/api)
- [Examples](https://zyra.dev/examples)
- [Tutorial: Building a Complete Web Application](https://zyra.dev/tutorial)
- [Design Patterns in Zyra](https://zyra.dev/patterns)
- [Community and Support](https://zyra.dev/community)

## Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

Zyra is [MIT licensed](LICENSE). 