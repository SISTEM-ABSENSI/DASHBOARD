import Box from "@mui/material/Box";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useHttp } from "../../hooks/http";
import { Button, Stack, TextField } from "@mui/material";
import BreadCrumberStyle from "../../components/breadcrumb/Index";
import { IconMenus } from "../../components/icon";
import { ISpgModel } from "../../models/spgModel";
import { useParams } from "react-router-dom";

export default function ListSupplierSpgView() {
  const [tableData, setTableData] = useState<ISpgModel[]>([]);
  const { handleGetTableDataRequest } = useHttp();
  const { userId } = useParams();

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
        path: "/suppliers/spg",
        page: paginationModel.page,
        size: paginationModel.pageSize,
        filter: { search, userId },
      });

      if (result) {
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
      field: "userName",
      flex: 1,
      renderHeader: () => <strong>{"NAMA"}</strong>,
      editable: true,
    },
    {
      field: "userDeviceId",
      renderHeader: () => <strong>{"DEVICE ID"}</strong>,
      flex: 1,
      editable: true,
    },
    {
      field: "userContact",
      renderHeader: () => <strong>{"CONTACT"}</strong>,
      flex: 1,
      editable: true,
    },
    {
      field: "createdAt",
      renderHeader: () => <strong>{"CREATED AT"}</strong>,
      editable: true,
    },
  ];

  function CustomToolbar() {
    const [search, setSearch] = useState<string>("");
    return (
      <GridToolbarContainer sx={{ justifyContent: "space-between", mb: 2 }}>
        <Stack direction="row" spacing={2}>
          <GridToolbarExport />
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            size="small"
            placeholder="search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="outlined" onClick={() => getTableData({ search })}>
            Cari
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
            label: "SPG",
            link: "/spg",
            icon: <IconMenus.admin fontSize="small" />,
          },
        ]}
      />
      <Box sx={{ width: "100%", "& .actions": { color: "text.secondary" } }}>
        <DataGrid
          rows={tableData}
          columns={columns}
          getRowId={(row: any) => row.userId}
          editMode="row"
          sx={{ padding: 2 }}
          autoHeight
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
