# Zyra Programming Language

Zyra is a modern, expressive programming language designed for web development. It combines the simplicity of Python with the power of JavaScript, making it easy to learn and use while being powerful enough for complex web applications.

## Key Features

- **Simple, Clean Syntax**: Inspired by Python's readability
- **First-class Web Support**: Built-in components and state management
- **Type Safety**: Optional static typing for better development experience
- **Modern Features**: Async/await, decorators, and pattern matching
- **Rich Standard Library**: Built-in support for common web development tasks

## Quick Start

```zyra
// Hello World Component
component HelloWorld {
    state {
        message: "Hello, World!"
    }

    function updateMessage(newMessage) {
        this.message = newMessage
    }

    render {
        <div>
            <h1>{message}</h1>
            <button onClick={updateMessage("Hi!")}>
                Change Message
            </button>
        </div>
    }
}
```

## Installation

```bash
npm install -g zyra-lang
```

## Basic Syntax

### Variables and Types

```zyra
// Type inference
let name = "John"
let age = 25
let isActive = true

// Explicit typing
let score: number = 100
let items: string[] = ["apple", "banana"]
```

### Functions

```zyra
// Basic function
function add(a: number, b: number): number {
    return a + b
}

// Arrow functions
let multiply = (x, y) => x * y

// Async functions
async function fetchData() {
    let response = await fetch("https://api.example.com/data")
    return response.json()
}
```

### Components

```zyra
component Counter {
    state {
        count: 0
    }

    function increment() {
        this.count += 1
    }

    function decrement() {
        this.count -= 1
    }

    render {
        <div>
            <h2>Count: {count}</h2>
            <button onClick={increment}>+</button>
            <button onClick={decrement}>-</button>
        </div>
    }
}
```

### Styling

```zyra
component StyledButton {
    style {
        button {
            background: #42a5f5
            color: white
            padding: 10px 20px
            border-radius: 5px
            border: none
            cursor: pointer
        }

        button:hover {
            background: #1976d2
        }
    }

    render {
        <button>Click me!</button>
    }
}
```

### Server-side Code

```zyra
server {
    route "/api/users" {
        get() {
            return db.query("SELECT * FROM users")
        }

        post(data) {
            return db.insert("users", data)
        }
    }
}
```

### WebSocket Support

```zyra
socket ChatServer {
    on "connection" {
        console.log("New client connected")
    }

    on "message" (data) {
        broadcast("newMessage", data)
    }
}
```

## Advanced Features

### Pattern Matching

```zyra
let result = match value {
    case 0 => "Zero"
    case n if n > 0 => "Positive"
    case _ => "Negative"
}
```

### Decorators

```zyra
@authenticated
@rateLimit(100)
route "/api/admin" {
    get() {
        // Protected admin route
    }
}
```

### Error Handling

```zyra
try {
    let result = dangerousOperation()
} catch (e: Error) {
    console.error("Something went wrong:", e.message)
} finally {
    cleanup()
}
```

## Best Practices

1. Use meaningful variable and function names
2. Keep components small and focused
3. Use type annotations for better code reliability
4. Comment complex logic
5. Follow the standard project structure

## Project Structure

```
myapp/
├── src/
│   ├── components/
│   │   └── Counter.zy
│   │   └── HelloWorld.zy
│   │   └── StyledButton.zy
│   │   └── Counter.zy
│   ├── pages/
│   │   └── Home.zy
│   ├── server/
│   │   └── api.zy
│   └── main.zy
├── public/
│   └── index.html
└── zyra.config.js
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

Zyra is MIT licensed. See [LICENSE](LICENSE) for details. 