import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import ErrorPage from "../pages/error-page";
import DashboardView from "../pages/dashboard/dashboardView";
import LoginView from "../pages/auth/Login";
import ProfileView from "../pages/myProfile/Index";
import AuthLayout from "../layouts/AuthLayout";
import { useToken } from "../hooks/token";
import ListAdminView from "../pages/admins/listAdminView";
import CreateAdminView from "../pages/admins/createAdminView";
import EditAdminView from "../pages/admins/editAdminView";
import EditProfileView from "../pages/myProfile/EditProfileView";
import ListStoreView from "../pages/stores/listStoreView";
import CreateStoreView from "../pages/stores/createStoreView";
import EditStoreView from "../pages/stores/editStoreView";
import ListUserView from "../pages/user/ListUserView";
import ListAttendanceView from "../pages/attendance/listAttendanceView";
import LocationView from "../pages/location/locationView";
import ListAttendanceHistoryView from "../pages/attendance/listAttendanceHistoryView";

const getProtectedRouters = (role: string) => {
  const mainRouters: { path: string; element: JSX.Element }[] = [];

  const adminRouter = [
    ...[
      {
        path: "/",
        element: <DashboardView />,
      },
      // spg router
      {
        path: "/users",
        element: <ListUserView />,
      },

      // attendance router
      {
        path: "/attendances",
        element: <ListAttendanceView />,
      },

      // attendance router
      {
        path: "/location",
        element: <LocationView />,
      },

      // store router
      {
        path: "/stores",
        element: <ListStoreView />,
      },
      {
        path: "/stores/create",
        element: <CreateStoreView />,
      },
      {
        path: "/stores/edit/:storeId",
        element: <EditStoreView />,
      },
      //my profile routers
      {
        path: "/my-profile",
        element: <ProfileView />,
      },
      {
        path: "/my-profile/edit/:userId",
        element: <EditProfileView />,
      },
    ],
  ];

  const superAdminRouter = [
    {
      path: "/",
      element: <DashboardView />,
    },
    //my profile routers
    {
      path: "/my-profile",
      element: <ProfileView />,
    },
    {
      path: "/my-profile/edit/:userId",
      element: <EditProfileView />,
    },

    // user router
    {
      path: "/users",
      element: <ListUserView />,
    },

    // attendance router
    {
      path: "/attendances",
      element: <ListAttendanceView />,
    },

    {
      path: "/attendances/histories/:attendanceHistoryUserId",
      element: <ListAttendanceHistoryView />,
    },

    // attendance router
    {
      path: "/location",
      element: <LocationView />,
    },

    // store router
    {
      path: "/stores",
      element: <ListStoreView />,
    },
    {
      path: "/stores/create",
      element: <CreateStoreView />,
    },
    {
      path: "/stores/edit/:storeId",
      element: <EditStoreView />,
    },

    // admin router
    {
      path: "/admins",
      element: <ListAdminView />,
    },
    {
      path: "/admins/create",
      element: <CreateAdminView />,
    },
    {
      path: "/admins/edit/:adminId",
      element: <EditAdminView />,
    },
  ];

  switch (role) {
    case "ADMIN":
      mainRouters.push(...adminRouter);
      break;
    case "SUPERADMIN":
      mainRouters.push(...superAdminRouter);
      break;
    default:
      break;
  }

  return mainRouters;
};

const authRouters: { path: string; element: JSX.Element }[] = [
  {
    path: "/",
    element: <LoginView />,
  },
  {
    path: "/login",
    element: <LoginView />,
  },
];

export default function AppRouters() {
  const { getDecodeUserToken } = useToken();
  const user = getDecodeUserToken();

  const routers: { path: string; element: JSX.Element }[] = [];

  if (user) {
    const protectedRouters = getProtectedRouters(
      user.userRole?.toLocaleUpperCase()
    );
    routers.push(...protectedRouters);
  } else {
    routers.push(...authRouters);
  }

  const appRouters = createBrowserRouter([
    {
      path: "/",
      element: user ? <AppLayout /> : <AuthLayout />,
      errorElement: <ErrorPage />,
      children: routers,
    },
  ]);

  return <RouterProvider router={appRouters} />;
}
