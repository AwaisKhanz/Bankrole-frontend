import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Card,
  CardContent,
  Divider,
  IconButton,
  Button,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const BetDetailsModal = ({ open, onClose, bet, onApprove, onReject }) => {
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
          Bet Details
        </Typography>
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Card sx={{ marginBottom: "1rem" }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold">
              Sport: {bet?.sport}
            </Typography>
            <Typography variant="body2">
              <strong>Stake:</strong> {bet?.stake}
            </Typography>
            <Typography variant="body2">
              <strong>Status:</strong> {bet?.status}
            </Typography>
            <Typography variant="body2">
              <strong>Verification Status:</strong> {bet?.verificationStatus}
            </Typography>
            <Typography variant="body2">
              <strong>Date:</strong>{" "}
              {bet?.date ? new Date(bet.date).toLocaleDateString() : ""}
            </Typography>
            <Divider sx={{ marginY: "1rem" }} />
            {bet?.verificationImageUrl && (
              <>
                <Typography variant="body2" fontWeight="bold">
                  Verification Image:
                </Typography>
                <img
                  src={bet.verificationImageUrl}
                  alt="Verification"
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginTop: "0.5rem",
                  }}
                />
              </>
            )}
          </CardContent>
        </Card>

        {/* ✅ Approve and Reject Buttons */}
        <Stack direction="row" spacing={2} justifyContent="end" mt={2}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => onApprove(bet._id)}
          >
            Approve
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => onReject(bet._id)}
          >
            Reject
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default BetDetailsModal;
