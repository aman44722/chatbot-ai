import React, { useEffect, useState } from "react";
import {
    Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, TextField, InputAdornment, CircularProgress,
    Avatar, Select, MenuItem, FormControl, IconButton, Tooltip, Snackbar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import axios from "axios";

const API = process.env.REACT_APP_AUTH_API || "http://localhost:5000/api/auth";
const USERS_API = API.replace("/api/auth", "/api/users");

const ROLE_COLORS = {
    admin: "#ef4444",
    supervisor: "#f59e0b",
    analyst: "#6366f1",
    agent: "#10b981",
    user: "#6b7280",
};

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [saving, setSaving] = useState(null);
    const [snack, setSnack] = useState({ open: false, message: "" });

    const getToken = () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        return user?.token || "";
    };

    useEffect(() => {
        axios.get(USERS_API, { headers: { Authorization: `Bearer ${getToken()}` } })
            .then((res) => setUsers(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        setSaving(userId);
        try {
            await axios.put(`${USERS_API}/${userId}/role`, { role: newRole }, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
            setSnack({ open: true, message: "Role updated successfully" });
        } catch {
            setSnack({ open: true, message: "Failed to update role" });
        } finally {
            setSaving(null);
        }
    };

    const filtered = users.filter((u) =>
        u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{
            p: 3, minHeight: "100%",
            background: "linear-gradient(135deg, #f0f4ff 0%, #fdf2f8 50%, #f0f4ff 100%)",
        }}>
            <Paper sx={{ borderRadius: 3, overflow: "hidden", border: "1px solid rgba(255,255,255,0.7)", boxShadow: "0 8px 32px rgba(0,0,0,0.06)", backdropFilter: "blur(12px)", background: "rgba(255,255,255,0.85)" }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2.5, borderBottom: "1px solid #f1f5f9" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <AdminPanelSettingsIcon sx={{ color: "#6366f1", fontSize: 24 }} />
                        <Box>
                            <Typography fontWeight={700} fontSize={16}>User Management</Typography>
                            <Typography variant="caption" color="#6b7280">{users.length} total users</Typography>
                        </Box>
                    </Box>
                    <TextField
                        size="small" placeholder="Search users..."
                        value={search} onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: "#94a3b8" }} /></InputAdornment>,
                            sx: { borderRadius: 2, fontSize: 13, bgcolor: "#f8f9fc", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e5e7eb" } },
                        }}
                        sx={{ width: 260 }}
                    />
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, fontSize: 12, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 }}>User</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: 12, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 }}>Email</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: 12, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 }}>Role</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: 12, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 }}>Joined</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.map((user) => {
                                const initials = (user.fullName || "U").charAt(0).toUpperCase();
                                const gradient = user.role === "admin"
                                    ? "linear-gradient(135deg, #ef4444, #dc2626)"
                                    : "linear-gradient(135deg, #6366f1, #8b5cf6)";
                                return (
                                    <TableRow key={user._id} hover sx={{ "&:last-child td": { border: 0 } }}>
                                        <TableCell>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                <Avatar sx={{ width: 34, height: 34, background: gradient, fontSize: 14, fontWeight: 700 }}>{initials}</Avatar>
                                                <Typography fontWeight={600} fontSize={14}>{user.fullName || "Unknown"}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="#6b7280">{user.email}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <FormControl size="small" sx={{ minWidth: 140 }}>
                                                <Select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                    disabled={saving === user._id}
                                                    sx={{
                                                        borderRadius: 2, fontSize: 13, fontWeight: 600,
                                                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e5e7eb" },
                                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: ROLE_COLORS[user.role] || "#6366f1" },
                                                    }}
                                                >
                                                    {["user", "agent", "analyst", "supervisor", "admin"].map((r) => (
                                                        <MenuItem key={r} value={r} sx={{ fontSize: 13, fontWeight: 600 }}>
                                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: ROLE_COLORS[r] || "#6b7280" }} />
                                                                {r.charAt(0).toUpperCase() + r.slice(1)}
                                                            </Box>
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="#9ca3af">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Snackbar
                open={snack.open}
                autoHideDuration={3000}
                onClose={() => setSnack({ ...snack, open: false })}
                message={snack.message}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                ContentProps={{ sx: { borderRadius: 2 } }}
            />
        </Box>
    );
};

export default UserManagement;
