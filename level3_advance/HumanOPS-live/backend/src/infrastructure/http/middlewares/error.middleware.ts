import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("");
  console.error("❌ ERROR caught in errorHandler:");
  console.error(`Request: ${_req.method} ${_req.url}`);
  console.error("Message:", error.message);
  if (process.env.NODE_ENV !== "production") {
    console.error("Stack:", error.stack);
  }

  // Handle specific error types
  if (error.message.includes("Invalid credentials")) {
    res.status(401).json({ error: error.message });
    return;
  }

  if (
    error.message.includes("already exists") ||
    error.message.includes("already in use")
  ) {
    res.status(409).json({ error: error.message });
    return;
  }

  if (error.message.includes("not found")) {
    res.status(404).json({ error: error.message });
    return;
  }

  if (error.message.includes("Insufficient permissions")) {
    res.status(403).json({ error: error.message });
    return;
  }

  // Default error
  res.status(500).json({ error: "Internal server error" });
};
