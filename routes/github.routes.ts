import express, { Request, Response } from "express";
import { getFormattedDate } from "../utils/utils";

export const githubRouter = express.Router();

//verifyBody middleware

githubRouter.post("/", (req: Request, res: Response) => {
  const formattedDate = getFormattedDate();
  console.log(`Github-POST: [${formattedDate}]`, req.body);
  res.json({ message: "Received", status: res.statusCode });
});
