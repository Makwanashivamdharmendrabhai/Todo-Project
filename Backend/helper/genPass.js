function getRandomNumber(upperLimit) {
    return Math.floor(Math.random() * upperLimit);
}

export default function generatePassword() {
    const specialChar = "@$!%*?&";
    const lowerChar = "abcdefghijklmnopqrstuvwxyz";
    const upperChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digits = "0123456789";
    let password = "";

    // Ensure at least 2 special characters
    for (let i = 0; i < 2; i++) {
        let index = getRandomNumber(specialChar.length);
        password += specialChar[index];
    }

    // Ensure at least 2 lowercase characters
    for (let i = 0; i < 2; i++) {
        let index = getRandomNumber(lowerChar.length);
        password += lowerChar[index];
    }

    // Ensure at least 2 uppercase characters
    for (let i = 0; i < 2; i++) {
        let index = getRandomNumber(upperChar.length);
        password += upperChar[index];
    }

    // Ensure at least 2 digits
    for (let i = 0; i < 2; i++) {
        let index = getRandomNumber(digits.length);
        password += digits[index];
    }

    // Shuffle the password to make it more random
    password = password.split("").sort(() => Math.random() - 0.5).join("");

    return password;
}

