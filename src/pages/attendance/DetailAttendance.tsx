import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Divider,
} from "@mui/material";
import { CheckCircle, Cancel, DirectionsWalk } from "@mui/icons-material";

import BreadCrumberStyle from "../../components/breadcrumb/Index";
import { IconMenus } from "../../components/icon";
import { useHttp } from "../../hooks/http";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IScheduleModel } from "../../models/scheduleModel";
import { IAttendanceHistoryModel } from "../../models/attendanceHistoryModel";
import { convertTime } from "../../utilities/convertTime";

function compareAttendanceWithSchedule({
  schedule,
  attendanceHistories,
}: {
  schedule: IScheduleModel;
  attendanceHistories: IAttendanceHistoryModel[];
}) {
  const findAttendance = attendanceHistories?.find(
    (value) => value.attendanceHistoryCategory === "checkin"
  );

  const attendanceHistoryTime = new Date(
    findAttendance?.attendanceHistoryTime! ?? ""
  );
  const scheduleStartDate = new Date(schedule?.scheduleStartDate);
  return attendanceHistoryTime < scheduleStartDate;
}

const DetailAttendance: React.FC = () => {
  const { handleGetRequest } = useHttp();
  const { attendanceId } = useParams();

  const [detailAttendance, setDetailAttendance] = useState<IScheduleModel>();
  const [detailAttendanceHistory, setDetailAttendanceHistory] = useState<
    IAttendanceHistoryModel[]
  >([]);
  const [loading, setLoading] = useState(true);

  const getDetailAttendance = async () => {
    const result = await handleGetRequest({
      path: "/attendances/detail/" + attendanceId,
    });
    console.log(result);
    if (result) {
      setDetailAttendance(result);
    }
  };

  const getDetailAttendanceHistory = async () => {
    const result = await handleGetRequest({
      path:
        "/attendances/histories/detail?attendanceHistoryScheduleId=" +
        attendanceId,
    });

    console.log(attendanceId);
    console.log(result);
    if (result?.items && Array.isArray(result.items)) {
      setDetailAttendanceHistory(result.items);
    }
  };

  const getDetail = async () => {
    await getDetailAttendance();
    await getDetailAttendanceHistory();
    setLoading(false);
  };

  useEffect(() => {
    getDetail();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;

  const isScheduleOnTime = compareAttendanceWithSchedule({
    schedule: detailAttendance!,
    attendanceHistories: detailAttendanceHistory,
  });

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <BreadCrumberStyle
        navigation={[
          {
            label: "Detail Attendance",
            link: "/attendances/detail/" + detailAttendance?.scheduleUserId,
            icon: <IconMenus.profile fontSize="small" />,
          },
        ]}
      />
      {detailAttendance && (
        <Card sx={{ marginTop: 4, boxShadow: 3 }}>
          <CardContent>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#333" }}
            >
              Attendance Details
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  <strong>Name:</strong> {detailAttendance.scheduleName}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    marginBottom: 1,
                  }}
                >
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      color: isScheduleOnTime === true ? "green" : "red",
                    }}
                  >
                    {isScheduleOnTime === true ? "On Time" : "Late"}
                  </span>
                  {/* {detailAttendance.scheduleStatus === "checkin" && (
                    <span
                      style={{
                        color: isScheduleOnTime === true ? "green" : "red",
                      }}
                    >
                      {isScheduleOnTime === true ? "On Time" : "Late"}
                    </span>
                  )} */}
                  {/* {detailAttendance.scheduleStatus !== "checkout" && (
                    <span>{detailAttendance.scheduleStatus}</span>
                  )} */}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  <strong>Start Date:</strong>{" "}
                  {convertTime(detailAttendance.scheduleStartDate)}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  <strong>End Date:</strong>{" "}
                  {convertTime(detailAttendance.scheduleEndDate)}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  <strong>Description:</strong>{" "}
                  {detailAttendance.scheduleDescription}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: "bold", color: "#333" }}
                >
                  Clinic
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  <strong>Name:</strong> {detailAttendance.store.storeName}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  <strong>Address:</strong>{" "}
                  {detailAttendance.store.storeAddress}
                </Typography>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: "bold", color: "#333", marginTop: 2 }}
                >
                  Employee
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  <strong>Name:</strong> {detailAttendance.user.userName}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  <strong>Role:</strong> {detailAttendance.user.userRole}
                </Typography>
              </Grid>
            </Grid>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#333", marginTop: 3 }}
            >
              Attendance History
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />
            <Grid container spacing={2}>
              {detailAttendanceHistory.map((history) => (
                <Grid item xs={12} sm={6} key={history.attendanceHistoryId}>
                  <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="body1" sx={{ marginBottom: 1 }}>
                      <strong>History Time:</strong>{" "}
                      {convertTime(history.attendanceHistoryTime)}
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: 1 }}>
                      <strong>Category:</strong>{" "}
                      {history.attendanceHistoryCategory === "checkin" && (
                        <CheckCircle
                          sx={{ color: "green", verticalAlign: "middle" }}
                        />
                      )}
                      {history.attendanceHistoryCategory === "checkout" && (
                        <Cancel
                          sx={{ color: "red", verticalAlign: "middle" }}
                        />
                      )}
                      {history.attendanceHistoryCategory === "outside" && (
                        <DirectionsWalk
                          sx={{ color: "orange", verticalAlign: "middle" }}
                        />
                      )}
                      {history.attendanceHistoryCategory}
                    </Typography>
                    <img
                      src={history.attendanceHistoryPhoto}
                      alt="Attendance"
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        marginTop: 10,
                        borderRadius: 8,
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default DetailAttendance;
