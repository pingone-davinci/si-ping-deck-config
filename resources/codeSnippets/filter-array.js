// Example array of objects
const objectArray = [
  { type: "sms", value: "555-1212" },
  { type: "email", value: "test@test.com" },
  { type: "sms", value: "777-1212" }
];

// Filter the array to include only objects with type "sms"
const filteredArray = objectArray.filter(
  (object) => object.type === "sms"
);

// Log the filtered array to the console
console.log(filteredArray);
