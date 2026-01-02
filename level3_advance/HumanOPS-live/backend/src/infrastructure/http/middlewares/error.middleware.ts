import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  // Handle specific error types
  if (error.message.includes('Invalid credentials')) {
    res.status(401).json({ error: error.message });
    return;
  }

  if (error.message.includes('already exists') || error.message.includes('already in use')) {
    res.status(409).json({ error: error.message });
    return;
  }

  if (error.message.includes('not found')) {
    res.status(404).json({ error: error.message });
    return;
  }

  if (error.message.includes('Insufficient permissions')) {
    res.status(403).json({ error: error.message });
    return;
  }

  // Default error
  res.status(500).json({ error: 'Internal server error' });
};
