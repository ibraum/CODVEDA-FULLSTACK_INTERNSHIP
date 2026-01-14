import { Request, Response, NextFunction } from "express";

export const requestLogger = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  console.log("");
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  if (Object.keys(req.params).length > 0) {
    console.log("params:", req.params);
  }

  if (Object.keys(req.query).length > 0) {
    console.log("query:", req.query);
  }

  if (req.body && Object.keys(req.body).length > 0) {
    // Sanitize body for logs (hide passwords)
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) sanitizedBody.password = "***";
    if (sanitizedBody.confirmPassword) sanitizedBody.confirmPassword = "***";
    console.log("body:", sanitizedBody);
  }

  next();
};
