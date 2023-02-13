// Example array of objects
const __myArrayOfObjects__ = [{ type: "sms", value: "555-1212" }, { type: "email", value: "test@test.com" }, { type: "sms", value: "777-1212" }];

const filteredArray = __myArrayOfObjects__.filter(element => element.type === "sms");
console.log(filteredArray); 