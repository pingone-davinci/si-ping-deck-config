function maskEmail(email) {
    const [name, domain] = email.split("@");
    const maskedEmail = `${name[0]}${new Array(name.length).join("*")}@${domain}`;
    return maskedEmail
}