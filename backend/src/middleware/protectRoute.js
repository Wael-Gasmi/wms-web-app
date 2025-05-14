import jwt from "jsonwebtoken";
import prisma from "../db/prisma.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No token provided",
        type: "error",
        statusCode: 401,
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        message: "Unauthorized - Invalid or expired token",
        type: "error",
        statusCode: 401,
      });
    }

    if (!decoded) {
      return res.status(401).json({
        message: "Unauthorized - Token decoding failed",
        type: "error",
        statusCode: 401,
      });
    }

    // Fetch user details from DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        type: "error",
        statusCode: 404,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute:", error);
    return res.status(500).json({
      message: "Internal server error",
      type: "error",
      statusCode: 500,
    });
  }
};

export default protectRoute;
