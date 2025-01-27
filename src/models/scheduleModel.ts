import { IRootModel } from "./rootModel";
import { IStoreModel } from "./storeModel";
import { IUserModel } from "./userModel";

export interface IScheduleModel extends IRootModel {
  scheduleId: number;
  scheduleName: string;
  scheduleDescription: string;
  scheduleStoreId: number;
  scheduleUserId: number;
  scheduleStartDate: string;
  scheduleEndDate: string;
  scheduleStatus: "waiting" | "checkin" | "checkout";
  user: IUserModel;
  store: IStoreModel;
}
