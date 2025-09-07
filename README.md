## 1) Difference between var, let, and const

- **var**  
  The old way of declaring variables. It’s function-scoped, meaning it doesn’t care about block boundaries like `{ }`. You can also redeclare the same variable which sometimes creates bugs. It gets hoisted to the top but starts as `undefined`.

- **let**  
  A better option introduced in ES6. It’s block-scoped (respects `{ }`), and you can reassign values but not redeclare the same variable in the same scope. It’s also hoisted, but you can’t use it before declaring.

- **const**  
  Very similar to `let` in terms of block-scope, but the value can’t be reassigned. You must give it an initial value when declaring. For arrays and objects, the reference can’t change, but the contents can still be modified.