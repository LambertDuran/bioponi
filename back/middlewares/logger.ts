import { Request, Response, NextFunction } from "express";

module.exports = function (req: Request, res: Response, next: NextFunction) {
  console.log(`${req.method} ${req.url}`);
  next();
};
