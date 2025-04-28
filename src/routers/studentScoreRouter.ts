import { Router } from "express";
import {
  getStudentScoresById,
  updateStudentScore,
} from "../controllers/studentScoreController";

const studentScoreRouter: Router = Router();

studentScoreRouter.get("/:id", getStudentScoresById);
studentScoreRouter.post("/", updateStudentScore);

export default studentScoreRouter;
