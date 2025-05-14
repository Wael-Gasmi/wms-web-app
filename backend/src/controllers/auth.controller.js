import prisma from "../db/prisma.js";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (user) return res.status(400).json({ error: "email already exists" });

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        roleId: "cm9x5jusl0000tnqgiejy4mvh",
      },
    });
    if (newUser) {
      generateToken(newUser.id, res);

      res.status(201).json({
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
        menu: {
          include: {
            sessions: {
              include: {
                subSessions: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
        type: "error",
        statusCode: 401,
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isActive: true,
      },
    });

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid password",
        type: "error",
        statusCode: 401,
      });
    }

    generateToken(user.id, res);

    res.status(200).json({
      message: "Login successful",
      type: "success",
      statusCode: 200,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      type: "error",
      statusCode: 500,
    });
  }
};
export const logout = async (req, res) => {
  const { userId } = req.body;
  console.log("Received userId:", userId);
  const user = await prisma.user.findUnique({ where: { id: userId } });

  try {
    res.cookie("jwt", "", {
      maxAge: 0,
      expires: new Date(Date.now()),
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isActive: false,
        lastLogin: new Date(Date.now()),
      },
    });

    res.status(200).json({
      message: "Logout successful",
      type: "success",
      statusCode: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      type: "error",
      statusCode: 500,
    });
  }
};
export const isAuthenticated = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.id },
      include: {
        role: true,
        menu: {
          include: {
            sessions: {
              include: {
                subSessions: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        type: "error",
        statusCode: 404,
      });
    }

    res.status(200).json({
      message: "User is authenticated",
      type: "success",
      statusCode: 200,
      data: user,
    });
  } catch (error) {
    console.error("Error in isAuthenticated:", error);
    return res.status(500).json({
      message: "Internal server error",
      type: "error",
      statusCode: 500,
    });
  }
};
