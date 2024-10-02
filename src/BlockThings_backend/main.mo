function mockGreet(name) {
  return Promise.resolve(`Hello, ${name}!`);
}

// Replace this line
// BlockThings_backend.greet(name).then((greeting) => {
// With this
mockGreet(name).then((greeting) => {
