import Box from "@mui/material/Box";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useHttp } from "../../hooks/http";
import { Button, Chip, Stack, TextField } from "@mui/material";
import BreadCrumberStyle from "../../components/breadcrumb/Index";
import { IconMenus } from "../../components/icon";
import { ISpgModel } from "../../models/spgModel";
import { convertTime } from "../../utilities/convertTime";
import { useNavigate } from "react-router-dom";

export default function ListAttendanceView() {
  const [tableData, setTableData] = useState<ISpgModel[]>([]);
  const { handleGetTableDataRequest } = useHttp();
  const navigation = useNavigate();

  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const getTableData = async ({
    search,
    startDate,
    endDate,
  }: {
    search: string;
    startDate?: string;
    endDate?: string;
  }) => {
    try {
      setLoading(true);
      const result = await handleGetTableDataRequest({
        path: "/attendances",
        page: paginationModel.page,
        size: paginationModel.pageSize,
        filter: { search, startDate, endDate },
      });

      if (result && result?.items) {
        setTableData(result?.items);
        setRowCount(result.totalItems);
      }
    } catch (error: unknown) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTableData({ search: "", startDate: "", endDate: "" });
  }, [paginationModel]);

  const columns: GridColDef[] = [
    {
      field: "userName",
      flex: 1,
      renderHeader: () => <strong>{"Employee"}</strong>,
      valueGetter: (params) => params.row.user?.userName || "",
      editable: true,
    },
    {
      field: "storeName",
      flex: 1,
      renderHeader: () => <strong>{"Store"}</strong>,
      valueGetter: (params) => params.row.store?.storeName || "",
      editable: true,
    },
    {
      field: "storeAddress",
      flex: 1,
      renderHeader: () => <strong>{"Address"}</strong>,
      valueGetter: (params) => params.row.store?.storeAddress || "",
    },
    {
      field: "scheduleStatus",
      renderHeader: () => <strong>{"Status"}</strong>,
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
          case "done":
            color = "success";
            break;
          case "cancel":
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
          />
        );
      },
    },
    {
      field: "scheduleStartDate",
      renderHeader: () => <strong>{"Start"}</strong>,
      flex: 1,
      editable: true,
      valueFormatter: (item) => convertTime(item.value),
    },
    {
      field: "scheduleEndDate",
      renderHeader: () => <strong>{"End"}</strong>,
      flex: 1,
      editable: true,
      valueFormatter: (item) => convertTime(item.value),
    },
    {
      field: "actions",
      type: "actions",
      renderHeader: () => <strong>{"History"}</strong>,
      flex: 1,
      cellClassName: "actions",
      getActions: ({ row }) => {
        return [
          <Chip
            label={"Detail"}
            color={"success"}
            variant="outlined"
            onClick={() => navigation("/attendances/detail/" + row.scheduleId)}
          />,
        ];
      },
    },
  ];

  function CustomToolbar() {
    const [search, setSearch] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    return (
      <GridToolbarContainer sx={{ justifyContent: "space-between", mb: 2 }}>
        <Stack direction="row" spacing={2}>
          <GridToolbarExport />
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            size="small"
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            size="small"
            type="date"
            label="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            size="small"
            placeholder="search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            variant="outlined"
            onClick={() => getTableData({ search, startDate, endDate })}
          >
            Search
          </Button>
        </Stack>
      </GridToolbarContainer>
    );
  }

  return (
    <Box>
      <BreadCrumberStyle
        navigation={[
          {
            label: "Attendance",
            link: "/attendances",
            icon: <IconMenus.attendance fontSize="small" />,
          },
        ]}
      />
      <Box sx={{ width: "100%", "& .actions": { color: "text.secondary" } }}>
        <DataGrid
          rows={tableData}
          columns={columns}
          getRowId={(row: any) => row?.scheduleId}
          editMode="row"
          autoHeight
          sx={{ padding: 2 }}
          pageSizeOptions={[2, 5, 10, 25]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          slots={{ toolbar: CustomToolbar }}
          rowCount={rowCount}
          paginationMode="server"
          loading={loading}
        />
      </Box>
    </Box>
  );
}
