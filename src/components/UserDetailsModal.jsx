import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const UserDetailsModal = ({ open, onClose, user }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          {user?.username}'s Details
        </Typography>
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {/* Subscription Info */}
        <Card
          sx={{
            marginBottom: "1rem",
            boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Subscription
            </Typography>
            <Typography variant="body1">
              {user?.subscription?.status === "active" ? (
                <>
                  <strong>Pro Plan</strong> <br />
                  Ends:{" "}
                  <strong>
                    {new Date(
                      user?.subscription?.currentPeriodEnd
                    ).toLocaleDateString()}
                  </strong>
                </>
              ) : (
                "Free Plan"
              )}
            </Typography>
          </CardContent>
        </Card>

        <Divider sx={{ marginY: "1rem" }} />

        {/* Bankrolls */}
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Bankrolls
        </Typography>
        {user?.bankrolls.length > 0 ? (
          <Grid container spacing={2}>
            {user.bankrolls.map((bankroll) => (
              <Grid item xs={12} sm={6} md={4} key={bankroll._id}>
                <Card
                  sx={{
                    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {bankroll.name}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Starting Capital:</strong>{" "}
                      {bankroll.currency.symbol}
                      {bankroll.startingCapital}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Visibility:</strong> {bankroll.visibility}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No bankrolls available.</Typography>
        )}

        <Divider sx={{ marginY: "1rem" }} />

        {/* Bets */}
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Bets
        </Typography>
        {user?.bettings.filter((bet) => bet.verificationStatus === "Pending")
          .length > 0 ? (
          <Grid container spacing={2}>
            {user?.bettings
              ?.filter((bet) => bet.verificationStatus === "Pending")
              ?.map((bet) => (
                <Grid item xs={12} sm={6} key={bet._id}>
                  <Card
                    sx={{
                      boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {bet.sport}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Status:</strong> {bet.verificationStatus}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Date:</strong>{" "}
                        {new Date(bet.date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Verification Code:</strong>{" "}
                        {bet.verificationCode}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        ) : (
          <Typography>No pending bets available.</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
