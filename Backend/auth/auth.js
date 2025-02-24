import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function getEncryptedPassword(password) {
  try {
    const saltRound = parseInt(process.env.SALT_ROUND);
    const encryptedPassword = await bcrypt.hash(password, saltRound);
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

export function sendToken(id, email) {
  try {
    const token = jwt.sign({ id, email }, process.env.SECRET_KEY, {
      expiresIn: process.env.EXPIRES_IN,
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
      return res.status(401).send({ message: "Token not found please Login" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.id = decoded.id;
    req.email = decoded.email;
    next();
  } catch (error) {
    return res.status(401).send({ error: "Invalid token. Please log in again." });
  }
}
