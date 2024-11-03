// Import the Worker class from the compiled JavaScript file
const { SnowUUID } = require("./dist/index.js");

// Create a new worker instance
const worker = new SnowUUID();

// Generate some unique IDs
const id1 = worker.nextId();
const id2 = worker.nextId();

console.log(`Generated ID 1: ${id1}`);
console.log(`Generated ID 2: ${id2}`);

// Handle sequence correctly within the same millisecond
const sameMillisecondId1 = worker.nextId();
const sameMillisecondId2 = worker.nextId();

console.log(`ID within the same millisecond 1: ${sameMillisecondId1}`);
console.log(`ID within the same millisecond 2: ${sameMillisecondId2}`);

// Check if IDs are unique
if (id1 !== id2 && sameMillisecondId1 !== sameMillisecondId2) {
  console.log("All generated IDs are unique.");
} else {
  console.log("Some IDs are not unique, check implementation.");
}
