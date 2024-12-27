import { IRootModel } from "./rootModel";

export interface IAttendanceHistoryModel extends IRootModel {
  attendanceHistoryId: number;
  attendanceHistoryUserId: number;
  attendanceHistoryTime: string;
  attendanceHistoryCategory: "checkin" | "checkout" | "outside";
}
