import { Request, Response, RequestHandler } from "express";
import { Student } from "../models/Student";
import { StudentScore } from "../models/StudentScore";

export const getAllStudents: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const data: Student[] = await Student.findAll();
    res.status(200).json({
      message: "Estadisticas de los estudiantes obtenidas correctamente",
      payload: data,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: "Hubo problemas en el servidor",
      payload: null,
      status: "error",
    });
  }
};

export const updateStudent: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { average_time, average_match_position, average_historic_position } =
      req.body;

    const student = await Student.findByPk(id);

    if (!student) {
      res.status(404).json({
        message: "Estudiante no encontrado",
        payload: null,
        status: "error",
      });
      return;
    }

    student.average_time = average_time ?? student.average_time;
    student.average_match_position =
      average_match_position ?? student.average_match_position;
    student.average_historic_position =
      average_historic_position ?? student.average_historic_position;

    await student.save();

    res.status(200).json({
      message: "Datos del estudiante actualizados correctamente",
      payload: student,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: "Hubo problemas en el servidor",
      payload: null,
      status: "error",
    });
  }
};
