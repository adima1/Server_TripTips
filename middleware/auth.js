import jwt from "jsonwebtoken";
export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    console.log("Received token:", token);
    if (!token) {
      return res.status(403).send("Access Denied");
    }
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }
    console.log("Cleaned token:", token);
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Verified token:", verified);
    req.user = verified;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ error: "Invalid token", details: err.message });
  }

};