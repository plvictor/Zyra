# Zyra Language Specification

## Introduction

Zyra is a modern programming language designed to simplify full-stack web development with native WebSocket communication and an innovative design system that eliminates the need for traditional CSS.

## Advanced Type System

### Basic Types

```zyra
// Primitive types
let text: string = "Hello";
let number: number = 42;
let boolean: boolean = true;
let decimal: float = 3.14;

// Compound types
let list: Array<number> = [1, 2, 3];
let map: Map<string, any> = {
  name: "John",
  age: 30
};

// Optional types
let optional: Optional<string> = null;
```

### Custom Types

```zyra
// Custom type
type Point = {
  x: number;
  y: number;
  z: Optional<number>;
};

// Union type
type Result = Success | Error;

type Success = {
  ok: true;
  data: any;
};

type Error = {
  ok: false;
  error: string;
};

// Generic type
type List<T> = {
  items: Array<T>;
  size: number;
  
  function add(item: T);
  function remove(index: number): Optional<T>;
};
```

### Type Inference

Zyra has a powerful type inference system:

```zyra
// Type is automatically inferred
let name = "John";        // string
let age = 30;             // number
let active = true;        // boolean
let list = [1, 2, 3];     // Array<number>

// Inference in functions
function sum(a, b) {      // Types inferred as number
  return a + b;
}

// Inference in components
component Button {
  prop text = "Click";    // Inferred as string
  prop onClick;           // Inferred as function
}
```

## Concurrent Programming

### Communication Channels

```zyra
// Define a typed channel
channel NotificationChannel<T> {
  // Channel events
  event new(message: T);
  event read(id: UUID);
  event deleted(id: UUID);
}

// Use the channel
component Notifications {
  // Create channel instance
  let channel = new NotificationChannel<{
    id: UUID;
    text: string;
    type: "info" | "error" | "success";
  }>();
  
  onMount() {
    // Listen to events
    channel.on("new", (msg) => {
      // Process new notification
    });
  }
  
  function send() {
    // Emit event
    channel.emit("new", {
      id: UUID.generate(),
      text: "New notification",
      type: "info"
    });
  }
}
```

### Workers and Parallel Processing

```zyra
// Define a worker
worker Processor {
  // Worker state
  state busy = false;
  
  // Function executed in background
  function process(data: Array<number>): Array<number> {
    busy = true;
    
    // Heavy processing
    let result = data.map((n) => {
      return fibonacci(n);
    });
    
    busy = false;
    return result;
  }
}

// Use the worker
component App {
  // Create worker instance
  let worker = new Processor();
  
  async function calculate() {
    // Execute in background
    let result = await worker.process([40, 41, 42]);
    console.log(result);
  }
}
```

## Advanced Design System

### Dynamic Themes

```zyra
// Define theme
theme Main {
  // Colors
  colors {
    primary: "#2a6bcc";
    secondary: "#4dabf5";
    background: "#f5f5f5";
    text: "#333333";
    
    // Variants
    primaryLight: lighten($primary, 20%);
    primaryDark: darken($primary, 20%);
  }
  
  // Typography
  typography {
    family: "Roboto, sans-serif";
    
    // Size scales
    scale {
      small: 12px;
      base: 16px;
      large: 20px;
      xlarge: 24px;
    }
    
    // Weights
    weights {
      light: 300;
      regular: 400;
      bold: 700;
    }
  }
  
  // Spacing
  spacing {
    unit: 8px;
    small: $unit;
    medium: $unit * 2;
    large: $unit * 3;
  }
  
  // Animations
  animations {
    duration: 200ms;
    easing: "ease-in-out";
    
    // Presets
    fadeIn: {
      from: { opacity: 0 };
      to: { opacity: 1 };
    }
  }
}

// Use theme in components
component Button {
  prop variant = "primary";
  
  render {
    <button 
      style={{
        // Use theme variables
        background: $theme.colors[variant],
        padding: [$theme.spacing.small, $theme.spacing.medium],
        font: $theme.typography.base,
        
        // Animations
        animation: $theme.animations.fadeIn,
      }}
      hover={{
        background: $theme.colors[variant + "Light"]
      }}
    >
      {children}
    </button>
  }
}
```

### Responsive Layouts

```zyra
component Card {
  render {
    <container 
      // Responsive layout
      responsive={{
        // Mobile
        base: {
          width: "100%",
          margin: 10
        },
        
        // Tablet
        md: {
          width: "50%",
          margin: 15
        },
        
        // Desktop
        lg: {
          width: "33.33%",
          margin: 20
        }
      }}
    >
      // Auto grid
      <grid 
        columns={[1, 2, 3]} // Responsive: 1 column mobile, 2 tablet, 3 desktop
        gap={20}
      >
        // Grid items
        {items.map(item => (
          <gridItem
            // Span multiple cells
            span={[1, 1, 2]} // Responsive
          >
            <content>
              // ...
            </content>
          </gridItem>
        ))}
      </grid>
    </container>
  }
}
```

## State Management

### Global Store

```zyra
// Define store
store AppStore {
  // State
  state user: Optional<User> = null;
  state theme: "light" | "dark" = "light";
  state notifications: Array<Notification> = [];
  
  // Actions
  action login(credentials: Credentials) {
    // Validate credentials
    let user = await auth.login(credentials);
    
    // Update state
    this.user = user;
    
    // Emit event
    emit("userLoggedIn", user);
  }
  
  action logout() {
    this.user = null;
    emit("userLoggedOut");
  }
  
  // Computed values
  computed isLoggedIn(): boolean {
    return this.user != null;
  }
  
  // Watchers
  watch("user", (newUser, oldUser) => {
    // React to changes
    if (newUser) {
      loadUserPreferences(newUser);
    }
  });
}

// Use store in components
component Header {
  // Inject store
  inject store: AppStore;
  
  render {
    <container>
      {store.isLoggedIn ? (
        <>
          <text>Welcome, {store.user.name}</text>
          <button onClick={store.logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => store.login(credentials)}>Login</button>
      )}
    </container>
  }
}
```

## Native Database

### Models and Relationships

```zyra
// Define model
model User {
  id: UUID primary;
  name: string;
  email: string unique;
  posts: relation<Post> one-to-many;
  roles: relation<Role> many-to-many;
  
  // Indexes
  index email;
  index [name, email];
  
  // Validations
  validate email matches /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  validate name length >= 2;
  
  // Hooks
  beforeCreate() {
    this.email = this.email.toLowerCase();
  }
  
  // Methods
  function getPosts(): Array<Post> {
    return this.posts.orderBy("createdAt", "desc");
  }
}

model Post {
  id: UUID primary;
  title: string;
  content: string;
  author: relation<User> many-to-one;
  tags: relation<Tag> many-to-many;
  createdAt: timestamp default now();
  
  // Full-text search
  index content fulltext;
}

// Queries
let posts = await db.Post
  .where(post => post.author.name like "John%")
  .include("author", "tags")
  .orderBy("createdAt", "desc")
  .limit(10);
```

### Automatic Migrations

```zyra
// Automatic migration based on models
migration "AddUserVerification" {
  // Add fields
  alter User {
    add verified: boolean default false;
    add verificationToken: string optional;
  }
  
  // Initial data
  seed {
    // Create roles
    let adminRole = await db.Role.create({
      name: "admin"
    });
    
    // Create admin user
    let admin = await db.User.create({
      name: "Admin",
      email: "admin@example.com",
      roles: [adminRole]
    });
  }
}
```

## Security

### Authentication and Authorization

```zyra
// Define authorization rules
auth {
  // Rules by model
  model User {
    // CRUD rules
    create: isAdmin;
    read: isAuthenticated;
    update: isOwner || isAdmin;
    delete: isAdmin;
    
    // Specific fields
    fields {
      email: isOwner || isAdmin;
      roles: isAdmin;
    }
  }
  
  // Authorization functions
  function isAuthenticated(): boolean {
    return !!currentUser;
  }
  
  function isOwner(resource): boolean {
    return resource.userId === currentUser?.id;
  }
  
  function isAdmin(): boolean {
    return currentUser?.roles.includes("admin");
  }
}

// Use in components
component UserProfile {
  @requireAuth              // Requires authentication
  @hasRole("admin")        // Requires specific role
  function deleteUser(id: UUID) {
    await db.User.delete(id);
  }
}
```

### Validation and Sanitization

```zyra
// Data validation
validator UserInput {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  email: {
    required: true,
    email: true,
    unique: "User.email"
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  }
}

// Use validator
component RegisterForm {
  async function register(data) {
    // Validate data
    let result = await validate(data, UserInput);
    
    if (result.valid) {
      // Create user
      await db.User.create(data);
    } else {
      // Show errors
      showErrors(result.errors);
    }
  }
}
```

## Advanced UI Components

### Data Visualization

```zyra
component Dashboard {
  // Data for charts
  let salesData = [
    { month: "Jan", value: 1000 },
    { month: "Feb", value: 1500 },
    { month: "Mar", value: 1200 },
    // ...
  ];

  render {
    <container>
      <Chart 
        type="line"
        data={salesData}
        x="month"
        y="value"
        title="Monthly Sales"
        tooltip={{
          format: "$ {value}"
        }}
        animations={{
          duration: 500,
          easing: "ease-out"
        }}
      />
      
      <DataTable
        data={salesData}
        columns={[
          { field: "month", header: "Month" },
          { field: "value", header: "Sales", format: "currency" }
        ]}
        pagination={{
          pageSize: 10,
          pageSizeOptions: [5, 10, 20]
        }}
        sortable={true}
        filterable={true}
      />
    </container>
  }
}
```

### Advanced Interactions

```zyra
component DragAndDrop {
  state items = [
    { id: 1, text: "Item 1" },
    { id: 2, text: "Item 2" },
    { id: 3, text: "Item 3" }
  ];
  
  function handleDrop(result) {
    // Reorder items
    const { source, destination } = result;
    if (!destination) return;
    
    const newItems = [...items];
    const [removed] = newItems.splice(source.index, 1);
    newItems.splice(destination.index, 0, removed);
    
    this.items = newItems;
  }
  
  render {
    <DragDropContext onDrop={handleDrop}>
      <Droppable id="main-list">
        {items.map((item, index) => (
          <Draggable key={item.id} id={item.id} index={index}>
            <card>
              <text>{item.text}</text>
            </card>
          </Draggable>
        ))}
      </Droppable>
    </DragDropContext>
  }
}
```

## Tests

### Unit and Integration Tests

```zyra
// Component test
test "LoginForm" {
  // Render component
  let form = render(LoginForm);
  
  // Simulate interaction
  form.input("email").type("test@example.com");
  form.input("password").type("password123");
  form.button("Login").click();
  
  // Verify result
  expect(form).toHaveText("Welcome");
  expect(store.user).not.toBeNull();
}

// API test
test "UserAPI" {
  // Set up test data
  let user = await db.User.create({
    name: "Test User",
    email: "test@example.com"
  });
  
  // Test endpoint
  let response = await api.get("/users/" + user.id);
  
  expect(response.status).toBe(200);
  expect(response.data.name).toBe("Test User");
}
```

## Performance Optimizations

### Optimized Compilation

```zyra
// Build configurations
build {
  // Optimizations
  optimizations {
    minify: true,
    treeShaking: true,
    splitChunks: true,
    
    // Lazy loading
    lazy {
      components: ["UserProfile", "Settings"],
      routes: ["/admin/*"]
    }
  }
  
  // Cache
  cache {
    enable: true,
    strategy: "network-first"
  }
}
```

### Efficient Rendering

```zyra
component DataGrid {
  // Virtualization for large lists
  @virtualize
  render {
    <list>
      {items.map(item => (
        // Only renders visible items
        <listItem>
          // Memoization of heavy component
          <ComplexItem data={item} @memo />
        </listItem>
      ))}
    </list>
  }
}
```

## Deployment and Infrastructure

### Serverless Functions

```zyra
// Define a serverless function
serverless function processPayment(data) {
  // Process payment logic
  const { amount, cardToken, customerId } = data;
  
  // Call payment gateway
  const result = await paymentGateway.charge({
    amount,
    source: cardToken,
    customer: customerId
  });
  
  return {
    success: result.status === 'succeeded',
    transactionId: result.id
  };
}

// Use serverless function
component Checkout {
  async function pay() {
    const result = await processPayment({
      amount: cart.total,
      cardToken: cardDetails.token,
      customerId: user.id
    });
    
    if (result.success) {
      showSuccessMessage();
      navigateTo('/thank-you');
    } else {
      showErrorMessage();
    }
  }
}
```

### Containers and Scaling

```zyra
// Define deployment configuration
deploy {
  // Container configuration
  container {
    base: "node:18-alpine",
    env: {
      NODE_ENV: "production",
      DATABASE_URL: "$DATABASE_URL"
    },
    healthCheck: "/health",
    memory: "512Mi",
    cpu: "0.5"
  }
  
  // Scaling configuration
  scaling {
    min: 2,
    max: 10,
    targetCPU: 70,
    cooldown: 60
  }
  
  // Database
  database {
    type: "postgres",
    version: "15",
    replicas: 2
  }
  
  // Caching
  cache {
    type: "redis",
    version: "7"
  }
}
```

## AI Features

### AI Assistants

```zyra
// Define an AI assistant
assistant SupportAgent {
  // Configure the AI
  config {
    model: "gpt-4",
    temperature: 0.7,
    maxTokens: 1000
  }
  
  // Define capabilities
  capabilities {
    answerFAQs: true,
    troubleshootErrors: true,
    searchDocs: true
  }
  
  // Knowledge base
  knowledge {
    source: "./docs",
    type: "vector"
  }
  
  // Functions the AI can call
  function createTicket(issue: string, priority: string): string {
    // Create support ticket in system
    return ticketSystem.create({
      issue,
      priority,
      createdBy: "ai-assistant"
    });
  }
}

// Use the assistant
component Support {
  state messages = [];
  
  async function handleUserMessage(text) {
    // Add user message to chat
    messages.push({ role: 'user', content: text });
    
    // Get AI response
    const response = await SupportAgent.respond(text, {
      history: messages,
      user: currentUser
    });
    
    // Add AI response to chat
    messages.push({ role: 'assistant', content: response.text });
    
    // If AI created a ticket, notify user
    if (response.actions.createTicket) {
      notify(`Ticket created: ${response.actions.createTicket}`);
    }
  }
}
```

### AI-Enhanced Development

```zyra
// Generate UI components with AI
@ai.generate("Create a product card component with image, title, price and add to cart button")
component ProductCard {
  // AI will suggest implementation
}

// AI code suggestions
function calculateTotal(items) {
  // @ai.suggest("Calculate the total price with tax")
  
  // AI will suggest implementation based on the comment
}

// Data analysis with AI
model SalesData {
  // Define data fields
  // ...
  
  // AI-powered analytics
  @ai.analyze
  function predictTrends(timeRange: string): Array<Prediction> {
    // AI will analyze sales data and predict trends
  }
}
```

These are just some of the advanced features of Zyra. The language is under active development and new features are added regularly. 