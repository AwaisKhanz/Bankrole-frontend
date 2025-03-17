"use client";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  useTheme,
  Grid,
  Chip,
  Divider,
  IconButton,
  Card,
  CardContent,
  Avatar,
  Button,
  Stack,
  Tabs,
  Tab,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import EmailIcon from "@mui/icons-material/Email";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SettingsIcon from "@mui/icons-material/Settings";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ScheduleIcon from "@mui/icons-material/Schedule";

const UserDetailsModal = ({ open, onClose, user }) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  // We'll use the data directly from the user object

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getRoleChip = (role) => {
    let color, bgColor, icon;

    switch (role) {
      case "admin":
        color = "#000";
        bgColor = "#FFD700";
        icon = <AdminPanelSettingsIcon fontSize="small" />;
        break;
      case "user":
        color = "#fff";
        bgColor = "#4CAF50";
        icon = <PersonIcon fontSize="small" />;
        break;
      default:
        color = "#fff";
        bgColor = "#FF9800";
        icon = <PersonIcon fontSize="small" />;
    }

    return (
      <Chip
        icon={icon}
        label={role}
        sx={{
          backgroundColor: bgColor,
          color: color,
          fontWeight: "bold",
          textTransform: "capitalize",
          borderRadius: "8px",
          "& .MuiChip-icon": {
            color: color,
          },
        }}
      />
    );
  };

  const getSubscriptionChip = (subscription) => {
    const isActive = subscription?.status === "active";
    return (
      <Chip
        icon={<VerifiedUserIcon fontSize="small" />}
        label={isActive ? "Pro" : "Free"}
        sx={{
          backgroundColor: isActive
            ? "rgba(255, 215, 0, 0.15)"
            : theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.08)",
          color: isActive ? "#B8860B" : theme.palette.text.primary,
          fontWeight: 500,
          "& .MuiChip-icon": {
            color: isActive ? "#B8860B" : theme.palette.text.secondary,
          },
        }}
      />
    );
  };

  const getStatusChip = (status) => {
    let color, bgColor, icon;

    switch (status) {
      case "Accepted":
        color = "#fff";
        bgColor = theme.palette.success.main;
        icon = <CheckCircleIcon fontSize="small" />;
        break;
      case "Rejected":
        color = "#fff";
        bgColor = theme.palette.error.main;
        icon = <CancelIcon fontSize="small" />;
        break;
      default: // Pending
        color = "#fff";
        bgColor = theme.palette.warning.main;
        icon = <ScheduleIcon fontSize="small" />;
    }

    return (
      <Chip
        icon={icon}
        label={status}
        size="small"
        sx={{
          backgroundColor: bgColor,
          color: color,
          fontWeight: 500,
          "& .MuiChip-icon": {
            color: color,
          },
        }}
      />
    );
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (!user) return null;

  console.log(user);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 1,
          backgroundColor: theme.palette.background.paper,
          backgroundImage:
            theme.palette.mode === "dark"
              ? "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)"
              : "linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          backgroundPosition: "-1px -1px",
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${theme.palette.divider}`,
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              user.subscription?.status === "active" ? (
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    bgcolor: "gold",
                    borderRadius: "50%",
                    border: `2px solid ${theme.palette.background.paper}`,
                  }}
                />
              ) : null
            }
          >
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                fontWeight: 600,
                mr: 2,
              }}
            >
              {getInitials(user?.username)}
            </Avatar>
          </Badge>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h6" fontWeight={600}>
                {user?.username}
              </Typography>
              {getRoleChip(user?.role)}
            </Box>
            <Typography variant="caption" color="text.secondary">
              User ID: {user?._id}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          aria-label="close"
          size="small"
          sx={{
            color: theme.palette.text.secondary,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.04)",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.08)",
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 3,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              minHeight: 48,
            },
          }}
        >
          <Tab
            icon={<PersonIcon fontSize="small" />}
            iconPosition="start"
            label="Profile"
          />
          <Tab
            icon={<AccountBalanceWalletIcon fontSize="small" />}
            iconPosition="start"
            label="Bankrolls"
          />
          <Tab
            icon={<SportsSoccerIcon fontSize="small" />}
            iconPosition="start"
            label="Bets"
          />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        {
          <>
            {/* Profile Tab */}
            {tabValue === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card
                    elevation={0}
                    variant="outlined"
                    sx={{
                      mb: 3,
                      borderRadius: 1,
                      transition:
                        "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: theme.shadows[2],
                      },
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <PersonIcon
                          sx={{ color: theme.palette.primary.main, mr: 1.5 }}
                        />
                        <Typography variant="subtitle1" fontWeight={600}>
                          Personal Information
                        </Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />

                      <Stack spacing={2}>
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Username
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {user.username}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Email
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <EmailIcon
                              fontSize="small"
                              sx={{ color: theme.palette.primary.main, mr: 1 }}
                            />
                            <Typography variant="body1">
                              {user.email}
                            </Typography>
                          </Box>
                        </Box>

                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Role
                          </Typography>
                          {getRoleChip(user.role)}
                        </Box>

                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Joined Date
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <CalendarTodayIcon
                              fontSize="small"
                              sx={{ color: theme.palette.primary.main, mr: 1 }}
                            />
                            <Typography variant="body1">
                              {new Date(user.createdAt).toLocaleDateString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card
                    elevation={0}
                    variant="outlined"
                    sx={{
                      mb: 3,
                      borderRadius: 1,
                      transition:
                        "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: theme.shadows[2],
                      },
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <VerifiedUserIcon
                          sx={{ color: theme.palette.primary.main, mr: 1.5 }}
                        />
                        <Typography variant="subtitle1" fontWeight={600}>
                          Subscription Details
                        </Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />

                      <Stack spacing={2}>
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Current Plan
                          </Typography>
                          {getSubscriptionChip(user.subscription)}
                        </Box>

                        {user.subscription?.status === "active" && (
                          <>
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                              >
                                Renewal Date
                              </Typography>
                              <Typography variant="body1" fontWeight={500}>
                                {new Date(
                                  user.subscription.currentPeriodEnd
                                ).toLocaleDateString(undefined, {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </Typography>
                            </Box>

                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                              >
                                Subscription ID
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ wordBreak: "break-all" }}
                              >
                                {user.subscription.id}
                              </Typography>
                            </Box>
                          </>
                        )}

                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            {user.subscription?.status === "active"
                              ? "Active subscription until " +
                                new Date(
                                  user.subscription.currentPeriodEnd
                                ).toLocaleDateString()
                              : "No active subscription"}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}

            {/* Bankrolls Tab */}
            {tabValue === 1 && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography variant="h6" fontWeight={600}>
                    User Bankrolls
                  </Typography>
                </Box>

                {user.bankrolls?.length > 0 ? (
                  <Grid container spacing={2}>
                    {user.bankrolls.map((bankroll) => (
                      <Grid item xs={12} sm={6} md={4} key={bankroll._id}>
                        <Card
                          elevation={0}
                          variant="outlined"
                          sx={{
                            borderRadius: 1,
                            transition:
                              "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              boxShadow: theme.shadows[2],
                            },
                          }}
                        >
                          <CardContent sx={{ p: 0 }}>
                            <Box
                              sx={{
                                p: 2,
                                borderBottom: `1px solid ${theme.palette.divider}`,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  mb: 1,
                                }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                >
                                  {bankroll.name}
                                </Typography>
                                <Chip
                                  label={bankroll.visibility}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: "0.7rem",
                                    fontWeight: 500,
                                    backgroundColor:
                                      bankroll.visibility === "Public"
                                        ? theme.palette.success.main
                                        : theme.palette.primary.main,
                                    color: "#fff",
                                  }}
                                />
                              </Box>
                            </Box>

                            <Box sx={{ p: 2 }}>
                              <Grid container spacing={2}>
                                <Grid item xs={6}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom
                                  >
                                    Starting Capital
                                  </Typography>
                                  <Typography variant="body1" fontWeight={500}>
                                    {bankroll.currency?.symbol || "$"}
                                    {bankroll.startingCapital}
                                  </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom
                                  >
                                    ROI
                                  </Typography>
                                  <Typography
                                    variant="body1"
                                    fontWeight={600}
                                    sx={{
                                      color:
                                        Number.parseFloat(
                                          bankroll.stats?.roi || 0
                                        ) >= 0
                                          ? theme.palette.success.main
                                          : theme.palette.error.main,
                                    }}
                                  >
                                    {bankroll.stats?.roi || "0"}%
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box
                    sx={{
                      p: 4,
                      textAlign: "center",
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.05)"
                          : "rgba(0, 0, 0, 0.02)",
                      borderRadius: 1,
                    }}
                  >
                    <AccountBalanceWalletIcon
                      sx={{
                        fontSize: 48,
                        color: theme.palette.text.secondary,
                        mb: 2,
                      }}
                    />
                    <Typography variant="body1" gutterBottom>
                      No bankrolls available
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This user hasn't created any bankrolls yet
                    </Typography>
                  </Box>
                )}
              </>
            )}

            {/* Bets Tab */}
            {tabValue === 2 && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography variant="h6" fontWeight={600}>
                    User Bets
                  </Typography>
                </Box>

                {user?.bettings.length > 0 ? (
                  <List
                    sx={{ width: "100%", bgcolor: "background.paper", p: 0 }}
                  >
                    {user?.bettings?.map((bet) => (
                      <ListItem
                        key={bet._id}
                        alignItems="flex-start"
                        sx={{
                          px: 2,
                          py: 1.5,
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? "rgba(255, 255, 255, 0.05)"
                                : "rgba(0, 0, 0, 0.02)",
                          },
                        }}
                        secondaryAction={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              height: "100%",
                            }}
                          >
                            {bet?.bankrollVisibility === "Public" &&
                              getStatusChip(bet.verificationStatus)}
                          </Box>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                            <SportsSoccerIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={600}>
                                {bet.sport}
                              </Typography>
                              <Chip
                                label={bet.status}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: "0.7rem",
                                  fontWeight: 500,
                                  backgroundColor:
                                    bet.status === "Won"
                                      ? theme.palette.success.main
                                      : bet.status === "Loss"
                                      ? theme.palette.error.main
                                      : theme.palette.grey[500],
                                  color: "#fff",
                                }}
                              />
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                component="span"
                              >
                                Stake: €{bet.stake} • Odds: {bet.odds || "N/A"}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                component="div"
                              >
                                Date: {new Date(bet.date).toLocaleDateString()}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box
                    sx={{
                      p: 4,
                      textAlign: "center",
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.05)"
                          : "rgba(0, 0, 0, 0.02)",
                      borderRadius: 1,
                    }}
                  >
                    <SportsSoccerIcon
                      sx={{
                        fontSize: 48,
                        color: theme.palette.text.secondary,
                        mb: 2,
                      }}
                    />
                    <Typography variant="body1" gutterBottom>
                      No pending bets
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This user doesn't have any pending bets for verification
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </>
        }
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
