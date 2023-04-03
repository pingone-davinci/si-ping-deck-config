function maskEmail(email) {
    const [username, domain] = email.split("@");
    const maskedUsername =
        username.charAt(0) + "*".repeat(username.length - 2) + username.slice(-1);
    return maskedUsername + "@" + domain;
}

// Example Usage
const maskedEmail = maskEmail("johndoe@gmail.com");
console.log(maskedEmail); // Output: j********e@gmail.com
