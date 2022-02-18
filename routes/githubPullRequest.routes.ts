import { NextFunction, Request, Response, Router } from "express";
import { webhookPullRequestGeneralMiddleware, codeReviewMiddleware } from "../middlewares/webhookMiddlewares";

export const githubRouter = Router();

//  Route Middlewares
githubRouter.use((req: Request, res: Response, next: NextFunction) => {
  console.log("Next Middleware");
  next();
});

const codeReviewFinal = (req: Request, res: Response) => {
  res.json({ message: "Received", status: res.statusCode });
};
//  Route Endpoints
githubRouter.post("/code-review", webhookPullRequestGeneralMiddleware, codeReviewMiddleware, codeReviewFinal);
