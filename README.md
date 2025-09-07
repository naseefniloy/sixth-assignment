# Green Earth - Plant a Tree Website

A responsive website for a tree planting campaign built with HTML, Tailwind CSS, and vanilla JavaScript.

## Features

- Responsive design that works on mobile and desktop
- Dynamic loading of tree categories and tree data from API
- Interactive tree cards with modal details view
- Shopping cart functionality with total calculation
- Form for planting trees

## JavaScript Concepts Explained

### 1. What is the difference between var, let, and const?

**var:**
- Function-scoped (or globally-scoped if declared outside a function)
- Can be redeclared and updated
- Hoisted to the top of its scope and initialized with undefined
- Can lead to unexpected behavior due to hoisting and lack of block scope

**let:**
- Block-scoped (available only within the block it's defined)
- Can be updated but not redeclared in the same scope
- Hoisted but not initialized (results in ReferenceError if accessed before declaration)
- Introduced in ES6 to solve problems with var

**const:**
- Block-scoped like let
- Cannot be updated or redeclared
- Must be initialized at declaration
- For objects and arrays, the reference cannot change but properties/elements can be modified
- Best practice for values that shouldn't change

### 2. What is the difference between map(), forEach(), and filter()?

**forEach():**
- Executes a provided function once for each array element
- Does not return anything (returns undefined)
- Cannot be chained with other array methods
- Used for side effects like logging or modifying external variables

```javascript
const numbers = [1, 2, 3];
numbers.forEach(num => console.log(num * 2)); // Logs: 2, 4, 6
// Returns: undefined
```

**map():**
- Creates a new array with the results of calling a function on every element
- Returns a new array of the same length
- Does not modify the original array
- Useful for transforming data

```javascript
const numbers = [1, 2, 3];
const doubled = numbers.map(num => num * 2); // [2, 4, 6]
```

**filter():**
- Creates a new array with elements that pass a test function
- Returns a new array that may be shorter than the original
- Does not modify the original array
- Used for selecting a subset of elements

```javascript
const numbers = [1, 2, 3, 4, 5];
const evenNumbers = numbers.filter(num => num % 2 === 0); // [2, 4]
```

### 3. What are arrow functions in ES6?

Arrow functions are a concise syntax for writing function expressions in JavaScript, introduced in ES6. They have several key characteristics:

- **Shorter syntax:** `(params) => { statements }` or `param => expression` for single parameters and statements
- **Lexical `this` binding:** They don't have their own `this` context; instead, they inherit `this` from the surrounding code
- **No `arguments` object:** Arrow functions don't have their own `arguments` object
- **Cannot be used as constructors:** You cannot use `new` with arrow functions
- **No duplicate named parameters:** Unlike regular functions, arrow functions cannot have duplicate named parameters

```javascript
// Regular function
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;

// Arrow function with lexical this
const counter = {
  count: 0,
  increment: function() {
    // Using arrow function to preserve 'this'
    setInterval(() => {
      this.count++;
      console.log(this.count);
    }, 1000);
  }
};
```

### 4. How does destructuring assignment work in ES6?

Destructuring assignment is a JavaScript expression that allows you to extract values from arrays or properties from objects into distinct variables.

**Array Destructuring:**
```javascript
// Basic array destructuring
const [a, b] = [1, 2]; // a = 1, b = 2

// Skipping elements
const [a, , c] = [1, 2, 3]; // a = 1, c = 3

// Rest pattern
const [a, ...rest] = [1, 2, 3, 4]; // a = 1, rest = [2, 3, 4]

// Default values
const [a = 5, b = 7] = [1]; // a = 1, b = 7

// Swapping variables
let a = 1, b = 2;
[a, b] = [b, a]; // a = 2, b = 1
```

**Object Destructuring:**
```javascript
// Basic object destructuring
const { name, age } = { name: 'John', age: 30 }; // name = 'John', age = 30

// Assigning to new variable names
const { name: userName, age: userAge } = { name: 'John', age: 30 }; // userName = 'John', userAge = 30

// Default values
const { name, age = 25 } = { name: 'John' }; // name = 'John', age = 25

// Nested destructuring
const { address: { city } } = { address: { city: 'New York' } }; // city = 'New York'

// Rest pattern
const { name, ...rest } = { name: 'John', age: 30, job: 'Developer' }; // name = 'John', rest = { age: 30, job: 'Developer' }
```

### 5. Explain template literals in ES6. How are they different from string concatenation?

Template literals (also called template strings) are a way to create strings in JavaScript that allows for embedded expressions and multi-line strings. They were introduced in ES6.

**Features of Template Literals:**

1. **String Interpolation:** Embed expressions directly in the string using `${expression}` syntax
2. **Multi-line Strings:** Create strings that span multiple lines without escape characters
3. **Tagged Templates:** Allow functions to process template literals for custom string formatting

**Differences from String Concatenation:**

1. **Readability:** Template literals are often more readable, especially with multiple variables
2. **Expression Evaluation:** Template literals evaluate expressions directly within the string
3. **Multi-line Support:** Template literals support multi-line strings without special characters
4. **Whitespace Preservation:** Template literals preserve whitespace and indentation

**Examples:**

```javascript
// String concatenation
const name = 'John';
const age = 30;
const message1 = 'My name is ' + name + ' and I am ' + age + ' years old.';

// Template literal
const message2 = `My name is ${name} and I am ${age} years old.`;

// Multi-line string with concatenation
const multiLine1 = 'This is line 1.\n' +
                  'This is line 2.';

// Multi-line string with template literal
const multiLine2 = `This is line 1.
This is line 2.`;

// Expressions in template literals
const a = 5;
const b = 10;
const result = `The sum of ${a} and ${b} is ${a + b}.`; // "The sum of 5 and 10 is 15."
```

Template literals make string creation more intuitive and expressive, especially when working with dynamic content or complex string formatting.