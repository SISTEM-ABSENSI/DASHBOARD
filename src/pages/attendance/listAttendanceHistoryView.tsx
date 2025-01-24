import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useHttp } from "../../hooks/http";
import { Chip } from "@mui/material";
import BreadCrumberStyle from "../../components/breadcrumb/Index";
import { IconMenus } from "../../components/icon";
import { IAttendanceHistoryModel } from "../../models/attendanceHistoryModel";
import { useParams } from "react-router-dom";
import { convertTime } from "../../utilities/convertTime";

export default function ListAttendanceHistoryView() {
  const [tableData, setTableData] = useState<IAttendanceHistoryModel[]>([]);
  const { handleGetTableDataRequest } = useHttp();
  const { attendanceHistoryUserId } = useParams();

  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const getTableData = async ({ search }: { search: string }) => {
    try {
      setLoading(true);
      const result = await handleGetTableDataRequest({
        path: "/attendances/histories",
        page: paginationModel.page,
        size: paginationModel.pageSize,
        filter: { search, attendanceHistoryUserId },
      });

      if (result && result?.items) {
        setTableData(result?.items);
        setRowCount(result.totalItems);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTableData({ search: "" });
  }, [paginationModel]);

  const columns: GridColDef[] = [
    {
      field: "attendanceHistoryTime",
      flex: 1,
      renderHeader: () => <strong>{"Time"}</strong>,
      valueFormatter: (item) => convertTime(item.value),
      editable: true,
    },
    {
      field: "attendanceHistoryCategory",
      renderHeader: () => <strong>{"STATUS"}</strong>,
      flex: 1,
      editable: true,
      renderCell: (params) => {
        const status = params.value;
        let color: "default" | "primary" | "success" | "warning" | "error" =
          "default";

        switch (status) {
          case "checkin":
            color = "warning";
            break;
          case "checkout":
            color = "primary";
            break;
          case "outside":
            color = "error";
            break;
          default:
            color = "default";
            break;
        }

        return (
          <Chip
            label={status.charAt(0).toUpperCase() + status.slice(1)}
            color={color}
            variant="outlined"
          />
        );
      },
    },
  ];

  // function CustomToolbar() {
  //   const [search, setSearch] = useState<string>("");
  //   return (
  //     <GridToolbarContainer sx={{ justifyContent: "space-between", mb: 2 }}>
  //       <Stack direction="row" spacing={2}>
  //         <GridToolbarExport />
  //       </Stack>
  //       <Stack direction="row" spacing={1} alignItems="center">
  //         <TextField
  //           size="small"
  //           placeholder="search..."
  //           value={search}
  //           onChange={(e) => setSearch(e.target.value)}
  //         />
  //         <Button variant="outlined" onClick={() => getTableData({ search })}>
  //           Cari
  //         </Button>
  //       </Stack>
  //     </GridToolbarContainer>
  //   );
  // }

  return (
    <Box>
      <BreadCrumberStyle
        navigation={[
          {
            label: "Attendance History",
            link: "/attendances/history",
            icon: <IconMenus.attendance fontSize="small" />,
          },
        ]}
      />
      <Box sx={{ width: "100%", "& .actions": { color: "text.secondary" } }}>
        <DataGrid
          rows={tableData}
          columns={columns}
          getRowId={(row: any) => row.attendanceHistoryId}
          editMode="row"
          autoHeight
          sx={{ padding: 2 }}
          pageSizeOptions={[2, 5, 10, 25]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          // slots={{ toolbar: CustomToolbar }}
          rowCount={rowCount}
          paginationMode="server"
          loading={loading}
        />
      </Box>
    </Box>
  );
}
