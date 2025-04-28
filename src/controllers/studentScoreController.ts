import { Request, Response, RequestHandler } from "express";
import { StudentScore } from "../models/StudentScore";
import { Student } from "../models/Student";

//registra un estudiante solo si no existe
export const registerStudent = async (studentId: string) => {
  const student = await Student.findByPk(studentId);

  if (!student) {
    await Student.create({
      id: studentId,
      played_rounds: 0,
      average_time: 0,
      average_match_position: 0,
      average_historic_position: 0,
    });
    console.log(`Estudiante ${studentId} registrado exitosamente.`);
  } else {
    console.log(`Estudiante  ${studentId} ya registrado.`);
  }
};

export const getStudentScoresById: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const rawData: StudentScore[] = await StudentScore.findAll({
      where: {
        round_id: id,
      },
      include: [
        {
          model: Student,
        },
      ],
    });

    const data = rawData.map((element) => ({
      studentId: element.student.id,
      position: element.position,
      time: element.time,
      score: element.score,
    }));

    res.status(200).json({
      message: "Score obtenidos exitosamente",
      payload: data,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor",
      payload: null,
      status: "error",
    });
    return;
  }
};

export const updateStudentScore: RequestHandler = async (req, res) => {
  try {
    const { student_id, round_id, score, time, position } = req.body;

    // Crear nuevo StudentScore
    const newScore = await StudentScore.create({
      student_id,
      round_id,
      score,
      time,
      position,
    });
    await registerStudent(student_id);
    const student = await Student.findByPk(student_id);

    if (!student) {
      res.status(404).json({
        message: "Estudiante no encontrado",
        payload: null,
        status: "error",
      });
      return;
    }

    if (!student) {
      throw new Error("Unexpected null value for student.");
    }

    const previousPlayedRounds = student.played_rounds ?? 0;
    const previousAverageTime = student.average_time ?? 0;
    const previousAveragePosition = student.average_match_position ?? 0;

    const newPlayedRounds = previousPlayedRounds + 1;

    const newAverageTime =
      (previousAverageTime * previousPlayedRounds + time) / newPlayedRounds;
    const newAveragePosition = Math.round(
      (previousAveragePosition * previousPlayedRounds + position) /
        newPlayedRounds
    );

    student.played_rounds = newPlayedRounds;
    student.average_time = newAverageTime;
    student.average_match_position = newAveragePosition;

    await student.save();

    res.status(201).json({
      message: "Score creado y estadísticas actualizadas exitosamente",
      payload: newScore,
      status: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error en el servidor",
      payload: null,
      status: "error",
    });
  }
};
