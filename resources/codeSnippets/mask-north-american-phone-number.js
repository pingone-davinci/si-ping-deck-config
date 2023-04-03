function maskPhoneNumber(phoneNumber) {
  // Strip all non-numeric characters from the phone number
  const numericPhoneNumber = phoneNumber.replace(/\D/g, '');

  // Mask the first six digits of the phone number
  const maskedPhoneNumber = '***-***-' + numericPhoneNumber.slice(-4);

  return maskedPhoneNumber;
}

// Example calls to method
console.log(maskPhoneNumber('555-123-4567')); // ***-***-4567
console.log(maskPhoneNumber('1-555-123-4567')); // ***-***-4567
console.log(maskPhoneNumber('(555) 123-4567')); // ***-***-4567
console.log(maskPhoneNumber('5551234567')); // ***-***-4567
console.log(maskPhoneNumber('555123')); // ***-***-0123
