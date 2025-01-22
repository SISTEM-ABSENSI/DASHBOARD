import { 
  Box, 
  Stack, 
  Typography, 
  Card, 
  Avatar, 
  Divider,
  Button,
  alpha
} from "@mui/material";
import { 
  Person as PersonIcon,
  Edit as EditIcon,
  Badge as BadgeIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import BreadCrumberStyle from "../../components/breadcrumb/Index";
import { IconMenus } from "../../components/icon";
import { useHttp } from "../../hooks/http";
import { useEffect, useState } from "react";
import { IUserModel } from "../../models/userModel";
import { convertTime } from "../../utilities/convertTime";
import { blue } from "@mui/material/colors";

const ProfileItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <Stack 
    direction="row" 
    spacing={2} 
    alignItems="center"
    sx={{ py: 2 }}
  >
    <Box
      sx={{
        p: 1,
        borderRadius: 1,
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
        color: blue[600],
      }}
    >
      {icon}
    </Box>
    <Stack spacing={0.5} flex={1}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="subtitle1">
        {value}
      </Typography>
    </Stack>
  </Stack>
);

const ProfileView = () => {
  const { handleGetRequest } = useHttp();
  const [detailProfile, setDetailProfile] = useState<IUserModel>();

  const getMyProfile = async () => {
    const result = await handleGetRequest({
      path: "/my-profile",
    });

    if (result) {
      setDetailProfile(result);
    }
  };

  useEffect(() => {
    getMyProfile();
  }, []);

  return (
    <Box>
      <BreadCrumberStyle
        navigation={[
          {
            label: "My Profile",
            link: "/my-profile",
            icon: <IconMenus.profile fontSize="small" />,
          },
        ]}
      />

      <Card 
        elevation={0}
        sx={{ 
          borderRadius: 2,
          border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Box
          sx={{
            p: 3,
            background: `linear-gradient(135deg, ${alpha(blue[600], 0.1)} 0%, ${alpha(blue[100], 0.1)} 100%)`,
          }}
        >
          <Stack 
            direction="row" 
            alignItems="center" 
            justifyContent="space-between"
            spacing={2}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: blue[600],
                  fontSize: 32,
                }}
              >
                {detailProfile?.userName?.charAt(0).toUpperCase()}
              </Avatar>
              <Stack spacing={0.5}>
                <Typography variant="h5" fontWeight="600">
                  {detailProfile?.userName}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                    borderRadius: 1,
                    color: 'primary.main',
                    display: 'inline-flex',
                    width: 'fit-content'
                  }}
                >
                  {detailProfile?.userRole}
                </Typography>
              </Stack>
            </Stack>

            <Button
              variant="contained"
              startIcon={<EditIcon />}
              sx={{ 
                px: 3,
                py: 1,
                boxShadow: 'none',
                '&:hover': { boxShadow: 'none' }
              }}
              // onClick={() => navigation("/my-profile/edit/" + detailProfile?.userId)}
            >
              Edit Profile
            </Button>
          </Stack>
        </Box>

        <Divider />

        <Box sx={{ p: 3 }}>
          <Stack spacing={1}>
            <ProfileItem
              icon={<PersonIcon />}
              label="Username"
              value={detailProfile?.userName || '-'}
            />
            <ProfileItem
              icon={<BadgeIcon />}
              label="Role"
              value={detailProfile?.userRole || '-'}
            />
            <ProfileItem
              icon={<CalendarIcon />}
              label="Created At"
              value={convertTime(detailProfile?.createdAt + "") || '-'}
            />
          </Stack>
        </Box>
      </Card>
    </Box>
  );
};

export default ProfileView;
