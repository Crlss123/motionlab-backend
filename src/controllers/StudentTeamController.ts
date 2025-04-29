import { Request, Response, RequestHandler } from "express";
import { StudentTeam } from "../models/StudentTeam";
import { Student } from "../models/Student";
import { Team } from "../models/Team";

export const getStudentTeamById: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const rawData: StudentTeam[] = await StudentTeam.findAll({
      where: {
        id_team: id,
      },
      include: [
        {
          model: Student,
        },
        {
          model: Team,
        },
      ],
    });

    const data = rawData.map((element) => ({
      studentId: element.student.id,
      teamId: element.team.id,
    }));

    res.status(200).json({
      message: "Estudiantes del equipo obtenidos exitosamente",
      payload: data,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor",
      payload: null,
      status: "error",
    });
  }
};

export const registerStudents: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { student_ids, team_id } = req.body;
  try {
    student_ids.forEach(async (id: string) => {
      const newStudentTeam = await StudentTeam.create({
        id_student: id,
        id_team: team_id,
      });
    });

    res.status(200).json({
      message: "Alumnos asignados correctamente a un equipo",
      status: "Success",
      payload: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor" + error,
      status: "Error",
      payload: null,
    });
  }
};

export const getStudentsByTeamId: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const rawData: StudentTeam[] = await StudentTeam.findAll({
      where: {
        id_team: id,
      },
      include: [
        {
          model: StudentTeam,
        },
      ],
    });
    const data = rawData.map((element) => ({
      studentId: element.student.id,
      teamId: element.team.id,
    }));
    res.status(200).json({
      message: "Estudiantes del equipo obtenidos exitosamente",
      payload: data,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor",
      payload: null,
      status: "error",
    });
  }
};
