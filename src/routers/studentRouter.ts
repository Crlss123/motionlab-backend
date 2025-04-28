import { Router } from "express";
import {
  getAllStudents,
  updateStudent,
} from "../controllers/studentController";

const studentRouter: Router = Router();

studentRouter.get("/", getAllStudents);
studentRouter.put("/:id", updateStudent);

export default studentRouter;
