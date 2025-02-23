import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function getEncryptedPassword(password) {
  try {
    const saltRound = parseInt(process.env.SALT_ROUND);
    const encryptedPassword = await bcrypt.hash(
      password,
      saltRound
    );
    return encryptedPassword;
  } catch (error) {
    console.log("error while getting encrypted password " + error.message);
    return null;
  }
}

export async function comparePassword(password, encryptedPassword) {
  try {
    const result = await bcrypt.compare(password, encryptedPassword);
    return result;
  } catch (error) {
    console.log("error while comparing password " + error.message);
    return null;
  }
}

export async function sendToken(id, email) {
  try {
    const token = await jwt.sign({ id, email }, process.env.SECRET_KEY, {
      expiresIn: process.env.EXPIRESIN,
    });
    return token;
  } catch (error) {
    console.log("error while sending token " + error.message);
    return null;
  }
}

export async function verifyToken(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      console.log("token not found");
      return false;
    }
    const decoded = await json.verify(token, process.env.SECRET_KEY);
    console.log(decoded);
    next();
  } catch (error) {
    console.log("user authentication failed");
    return;
  }
}
