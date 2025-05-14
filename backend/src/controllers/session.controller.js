import prisma from "../db/prisma.js";

export const addSession = async (req, res) => {
  try {
    const { name, icon, path, description, parentSessionId } = req.body;

    if (!name || !path) {
      return res
        .status(400)
        .json({ error: "Session name and path are required" });
    }

    const session = await prisma.session.create({
      data: {
        name,
        icon: icon || null,
        path,
        description: description || null,
        parentSessionId: parentSessionId || null,
      },
    });

    return res.status(201).json(session);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getSessions = async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      include: { parentSession: true, subSessions: true },
    });
    return res.status(200).json(sessions);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await prisma.session.findUnique({
      where: { id },
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    return res.status(200).json(session);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, path, description, parentSessionId } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    const existingSession = await prisma.session.findUnique({ where: { id } });
    if (!existingSession) {
      return res.status(404).json({ error: "Session not found" });
    }

    const updatedSession = await prisma.session.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(icon !== undefined && { icon }),
        ...(path !== undefined && { path }),
        ...(description !== undefined && { description }),
        ...(parentSessionId !== undefined &&
          parentSessionId !== "null" && { parentSessionId: null }),
      },
    });

    return res.status(200).json(updatedSession);
  } catch (error) {
    console.error("Update session error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await prisma.session.findUnique({
      where: { id },
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    await prisma.session.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
