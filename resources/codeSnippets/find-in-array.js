// Example array of objects
const devices = [
  { type: "sms", value: "555-1212" },
  { type: "device", value: "mobile" },
  { type: "email", value: "test@test.com" }
];

// Find the first device with type "sms"
const smsDevice = devices.find((device) => device.type === "sms");

// Log the found device to the console
console.log(smsDevice?.value);
