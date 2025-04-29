import { match } from "assert";
import { Router } from "express";
import {
  getAllMatches,
  getMatchParameters,
  getMatchByCode,
} from "../controllers/MatchController";
import { createMatch } from "../controllers/MatchController";

const matchRouter: Router = Router();

matchRouter.post("/", createMatch);

matchRouter.get("/", getAllMatches);
matchRouter.get("/:id", getMatchParameters);
matchRouter.get("/:code", getMatchByCode);

export default matchRouter;
