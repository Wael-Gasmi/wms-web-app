import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign({ id: userId }, secret, {
    expiresIn: "5h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 3600000 * 5,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return token;
};

export default generateToken;
