import React, { useState, useEffect } from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Box,
  IconButton,
  Badge,
  Paper,
  Typography,
  Divider,
} from "@mui/material";

const NotificationDropdown = ({ userId = "user123" }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/notifications/${userId}`
      );
      if (res.ok) {
        const data = await res.json();
        const unread = data.filter((n) => !n.read);
        setUnreadCount(unread.length);
        if (open) setNotifications(unread);
      }
    } catch (err) {
      console.error("Failed to fetch unread count", err);
    }
  };

  useEffect(() => {
    fetchUnreadCount(); // Initial load
    const interval = setInterval(fetchUnreadCount, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleBellClick = async () => {
    const newOpen = !open;
    setOpen(newOpen);

    if (newOpen) {
      // Fetch only when opening
      const res = await fetch(
        `http://localhost:8080/api/notifications/${userId}`
      );
      if (res.ok) {
        const data = await res.json();
        const unread = data.filter((n) => !n.read);
        setNotifications(unread);
        setUnreadCount(0);

        // Mark all as read once shown
        if (unread.length > 0) {
          await fetch(
            `http://localhost:8080/api/notifications/mark-all-read/${userId}`,
            { method: "PATCH" }
          );
        }
      }
    } else {
      // When closing, clear UI
      setNotifications([]);
    }
  };

  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      <IconButton onClick={handleBellClick}>
        <Badge badgeContent={unreadCount || 0} color="error">
          {open ? <NotificationsIcon /> : <NotificationsNoneIcon />}
        </Badge>
      </IconButton>

      {open && (
        <Paper
          elevation={5}
          sx={{
            position: "absolute",
            top: 40,
            right: 0,
            width: 300,
            maxHeight: 400,
            overflowY: "auto",
            zIndex: 1000,
            borderRadius: 2,
            boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
            p: 2,
          }}
        >
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="subtitle1" fontWeight="bold">
              Notifications
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#1976d2",
                cursor: "pointer",
              }}
              onClick={() => setNotifications([])}
            >
              Clear
            </Typography>
          </Box>
          <Divider />

          {notifications.length === 0 ? (
            <Typography variant="body2" sx={{ mt: 2 }}>
              No notifications found
            </Typography>
          ) : (
            notifications.map((note) => (
              <Box
                key={note.id}
                sx={{
                  py: 1,
                  borderBottom: "1px solid #eee",
                }}
              >
                <Typography fontSize={14}>{note.message}</Typography>
                <Typography fontSize={12} color="gray">
                  {new Date(note.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </Typography>
              </Box>
            ))
          )}
        </Paper>
      )}
    </Box>
  );
};

export default NotificationDropdown;
