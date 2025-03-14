"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Button,
  Stack,
  Box,
  useTheme,
  Chip,
  Grid,
  Avatar,
  useMediaQuery,
  Card,
  CardContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import VerifiedIcon from "@mui/icons-material/Verified";
import ImageIcon from "@mui/icons-material/Image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonIcon from "@mui/icons-material/Person";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

const BetDetailsModal = ({ open, onClose, bet, onApprove, onReject }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!bet) return null;

  const getStatusChip = (status) => {
    let color, bgColor, icon;

    switch (status) {
      case "Won":
        color = "#fff";
        bgColor = theme.palette.success.main;
        icon = <TrendingUpIcon fontSize="small" />;
        break;
      case "Loss":
        color = "#fff";
        bgColor = theme.palette.error.main;
        icon = <TrendingDownIcon fontSize="small" />;
        break;
      default:
        color = theme.palette.text.primary;
        bgColor =
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.08)";
        icon = null;
    }

    return (
      <Chip
        icon={icon}
        label={status}
        sx={{
          backgroundColor: bgColor,
          color: color,
          fontWeight: 500,
          fontSize: "0.75rem",
          "& .MuiChip-icon": {
            color: color,
          },
        }}
      />
    );
  };

  const getVerificationStatusChip = (status) => {
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
        icon = <VerifiedIcon fontSize="small" />;
    }

    return (
      <Chip
        icon={icon}
        label={status}
        sx={{
          backgroundColor: bgColor,
          color: color,
          fontWeight: 500,
          fontSize: "0.75rem",
          "& .MuiChip-icon": {
            color: color,
          },
        }}
      />
    );
  };

  const getSportIcon = (sport) => {
    // You could expand this with more sport-specific icons
    return <SportsSoccerIcon />;
  };

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
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              mr: 2,
            }}
          >
            {getSportIcon(bet?.sport)}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Bet Details
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {bet._id}
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

      <DialogContent sx={{ p: 3, mt: 2 }}>
        <Grid container spacing={3}>
          {/* Left column - User and Bet Info */}
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              variant="outlined"
              sx={{
                mb: 3,
                borderRadius: 1,
                height: "100%",
                transition:
                  "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: theme.shadows[2],
                },
              }}
            >
              <CardContent sx={{ p: 0 }}>
                {/* User Info Section */}
                <Box
                  sx={{
                    p: 2,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <PersonIcon
                      sx={{ color: theme.palette.primary.main, mr: 1.5 }}
                    />
                    <Typography variant="subtitle1" fontWeight={600}>
                      User Information
                    </Typography>
                  </Box>

                  <Box sx={{ pl: 4 }}>
                    <Typography variant="body2" gutterBottom>
                      <Box component="span" fontWeight={500}>
                        Username:
                      </Box>{" "}
                      {bet.userId?.username || "N/A"}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <Box component="span" fontWeight={500}>
                        Email:
                      </Box>{" "}
                      {bet.userId?.email || "N/A"}
                    </Typography>
                    <Typography variant="body2">
                      <Box component="span" fontWeight={500}>
                        User ID:
                      </Box>{" "}
                      {bet.userId?._id || "N/A"}
                    </Typography>
                  </Box>
                </Box>

                {/* Bet Details Section */}
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <SportsSoccerIcon
                      sx={{ color: theme.palette.primary.main, mr: 1.5 }}
                    />
                    <Typography variant="subtitle1" fontWeight={600}>
                      Bet Information
                    </Typography>
                  </Box>

                  <Stack spacing={2} sx={{ pl: 4 }}>
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Sport
                      </Typography>
                      <Chip
                        icon={getSportIcon(bet?.sport)}
                        label={bet?.sport}
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                          "& .MuiChip-icon": {
                            color: theme.palette.primary.contrastText,
                          },
                        }}
                      />
                    </Box>

                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Stake
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        €{bet?.stake}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Date
                      </Typography>
                      <Typography variant="body1">
                        {bet?.date
                          ? new Date(bet.date).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "N/A"}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Odds
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {bet?.odds || "N/A"}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right column - Status and Images */}
          <Grid item xs={12} md={8}>
            {/* Status Section */}
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
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <VerifiedIcon
                    sx={{ color: theme.palette.primary.main, mr: 1.5 }}
                  />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Status Information
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Bet Status
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {bet?.previousStatus && (
                          <>
                            {getStatusChip(bet.previousStatus)}
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mx: 0.5 }}
                            >
                              to
                            </Typography>
                          </>
                        )}
                        {getStatusChip(bet?.status)}
                      </Box>
                    </Box>

                    {bet?.potentialWin && (
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Potential Win
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight={600}
                          color={theme.palette.success.main}
                        >
                          €{bet.potentialWin}
                        </Typography>
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Verification Status
                      </Typography>
                      <Box>
                        {getVerificationStatusChip(bet?.verificationStatus)}
                      </Box>
                    </Box>

                    {bet?.verificationDate && (
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Verification Date
                        </Typography>
                        <Typography variant="body1">
                          {new Date(bet.verificationDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Images Section */}
            {(bet?.verificationImageUrl || bet?.cashoutImageUrl) && (
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
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <ImageIcon
                      sx={{ color: theme.palette.primary.main, mr: 1.5 }}
                    />
                    <Typography variant="subtitle1" fontWeight={600}>
                      Verification Images
                    </Typography>
                  </Box>

                  <Grid container spacing={3}>
                    {bet?.verificationImageUrl && (
                      <Grid item xs={12} md={bet?.cashoutImageUrl ? 6 : 12}>
                        <Box>
                          <Typography
                            variant="body2"
                            fontWeight={500}
                            gutterBottom
                          >
                            Verification Image:
                          </Typography>
                          <Box
                            sx={{
                              position: "relative",
                              width: "100%",
                              borderRadius: 1,
                              overflow: "hidden",
                              boxShadow: theme.shadows[1],
                              border: `1px solid ${theme.palette.divider}`,
                            }}
                          >
                            <img
                              src={
                                bet.verificationImageUrl || "/placeholder.svg"
                              }
                              alt="Verification"
                              style={{
                                width: "100%",
                                maxHeight: "300px",
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                          </Box>
                        </Box>
                      </Grid>
                    )}

                    {bet?.cashoutImageUrl && (
                      <Grid
                        item
                        xs={12}
                        md={bet?.verificationImageUrl ? 6 : 12}
                      >
                        <Box>
                          <Typography
                            variant="body2"
                            fontWeight={500}
                            gutterBottom
                          >
                            Cashout Image:
                          </Typography>
                          <Box
                            sx={{
                              position: "relative",
                              width: "100%",
                              borderRadius: 1,
                              overflow: "hidden",
                              boxShadow: theme.shadows[1],
                              border: `1px solid ${theme.palette.divider}`,
                            }}
                          >
                            <img
                              src={bet.cashoutImageUrl || "/placeholder.svg"}
                              alt="Cashout"
                              style={{
                                width: "100%",
                                maxHeight: "300px",
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                          </Box>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Additional Information */}
            {bet?.description && (
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
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <InfoOutlinedIcon
                      sx={{ color: theme.palette.primary.main, mr: 1.5 }}
                    />
                    <Typography variant="subtitle1" fontWeight={600}>
                      Additional Information
                    </Typography>
                  </Box>

                  <Typography variant="body2" sx={{ pl: 4 }}>
                    {bet.description}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            mt: 3,
            pt: 2,
            pb: isMobile ? 2 : 0,
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            zIndex: 10,
          }}
        >
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              color="inherit"
              onClick={onClose}
              sx={{
                fontWeight: 500,
                textTransform: "none",
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={() => onApprove(bet._id)}
              sx={{
                fontWeight: 500,
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "none",
                },
              }}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => onReject(bet._id)}
              sx={{
                fontWeight: 500,
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "none",
                },
              }}
            >
              Reject
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default BetDetailsModal;
