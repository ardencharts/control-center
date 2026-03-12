"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme as useCustomTheme } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ClientOnly } from "@/components/ClientOnly";
import { useTheme } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Menu,
  MenuItem,
  Container,
  AppBar,
  Toolbar,
  Stack,
  TextField,
  Chip,
  IconButton,
  Select,
  FormControl,
  Collapse,
  InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export const dynamic = "force-dynamic";

type TickerSubscription = {
  id: number;
  key: string;
  symbol: string;
  enabled: boolean;
  marketSymbol: string;
  exchange: string;
  type: string;
  description: string;
  name: string;
  base: string;
  quote: string;
  tradable: boolean;
  createdAt: string;
  updatedAt: string | null;
  deleted: boolean;
  subType: string;
  change: number | null;
  changePercent: number | null;
  last: number | null;
  volume: number | null;
};

export default function Dashboard() {
  const router = useRouter();
  const [items, setItems] = useState<TickerSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tablePage, setTablePage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [authenticated, setAuthenticated] = useState(true);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordChangeMessage, setPasswordChangeMessage] = useState("");
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [passwordChangeFormData, setPasswordChangeFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"enable" | "disable">("enable");
  const [actionLoading, setActionLoading] = useState(false);

  // Per-field filters
  const [filterEnabled, setFilterEnabled] = useState("");
  const [filterSymbol, setFilterSymbol] = useState("");
  const [filterMarketSymbol, setFilterMarketSymbol] = useState("");
  const [filterExchange, setFilterExchange] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterSubType, setFilterSubType] = useState("");
  const [filterDescription, setFilterDescription] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterBase, setFilterBase] = useState("");
  const [filterQuote, setFilterQuote] = useState("");
  const [filterTradable, setFilterTradable] = useState("");

  // Sorting
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Column visibility
  const allColumns = [
    "enabled",
    "symbol",
    "marketSymbol",
    "exchange",
    "type",
    "subType",
    "description",
    "name",
    "base",
    "quote",
    "tradable",
  ] as const;

  const columnLabels: Record<typeof allColumns[number], string> = {
    enabled: "Enabled",
    symbol: "Symbol",
    marketSymbol: "Market Symbol",
    exchange: "Exchange",
    type: "Type",
    subType: "Sub Type",
    description: "Description",
    name: "Name",
    base: "Base",
    quote: "Quote",
    tradable: "Tradable",
  };

  const defaultVisibleColumns = [
    "enabled",
    "symbol",
    "name",
    "description",
    "marketSymbol",
    "exchange",
    "type",
    "subType",
  ] as const;

  const [visibleColumns, setVisibleColumns] = useState<Set<typeof allColumns[number]>>(() => {
    if (typeof window === "undefined") return new Set(defaultVisibleColumns);
    const saved = localStorage.getItem("visibleColumns");
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch {
        return new Set(defaultVisibleColumns);
      }
    }
    return new Set(defaultVisibleColumns);
  });

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TickerSubscription | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<TickerSubscription>>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editMessage, setEditMessage] = useState("");

  // Distinct exchanges for filter dropdown
  const [exchanges, setExchanges] = useState<string[]>([]);

  // Distinct subTypes for filter dropdown
  const [subTypes, setSubTypes] = useState<string[]>([]);

  // Filter panel expand/collapse state
  const [filtersExpanded, setFiltersExpanded] = useState(true);

  // Get MUI theme
  const muiTheme = useTheme();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (!response.ok) {
          router.push("/");
          setAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/");
        setAuthenticated(false);
      }
    };

    const fetchExchanges = async () => {
      try {
        const response = await fetch("/api/ticker-subscriptions/distinct-exchanges");
        if (response.ok) {
          const data = await response.json();
          setExchanges(data.exchanges);
        }
      } catch (error) {
        console.error("Error fetching exchanges:", error);
      }
    };

    const fetchSubTypes = async () => {
      try {
        const response = await fetch("/api/ticker-subscriptions/distinct-subtypes");
        if (response.ok) {
          const data = await response.json();
          setSubTypes(data.subTypes);
        }
      } catch (error) {
        console.error("Error fetching subTypes:", error);
      }
    };

    checkAuth();
    fetchExchanges();
    fetchSubTypes();
  }, [router]);

  const fetchData = useCallback(async () => {
    if (!authenticated) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: (tablePage + 1).toString(),
        limit: rowsPerPage.toString(),
        filterEnabled,
        filterSymbol,
        filterMarketSymbol,
        filterExchange,
        filterType,
        filterSubType,
        filterDescription,
        filterName,
        filterBase,
        filterQuote,
        filterTradable,
      });

      if (sortBy) {
        params.append("sortBy", sortBy);
        params.append("sortOrder", sortOrder);
      }

      const response = await fetch(
        `/api/ticker-subscriptions?${params.toString()}`
      );
      if (response.status === 401) {
        router.push("/");
        return;
      }
      const data = await response.json();
      setItems(data.items);
      setTotal(data.total);
      setSelectedIds(new Set());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [
    tablePage,
    rowsPerPage,

    filterEnabled,
    filterSymbol,
    filterMarketSymbol,
    filterExchange,
    filterType,
    filterSubType,
    filterDescription,
    filterName,
    filterBase,
    filterQuote,
    filterTradable,
    sortBy,
    sortOrder,
    router,
    authenticated,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(items.map((item) => item.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleOpenEditDialog = (item: TickerSubscription) => {
    setEditingItem(item);
    setEditFormData({
      name: item.name,
      description: item.description,
      tradable: item.tradable,
    });
    setEditDialogOpen(true);
    setEditMessage("");
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingItem(null);
    setEditFormData({});
    setEditMessage("");
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    setEditLoading(true);
    try {
      const response = await fetch(`/api/ticker-subscriptions/${editingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        setEditMessage("Error updating item");
        return;
      }

      setEditMessage("Changes saved successfully!");
      setTimeout(() => handleCloseEditDialog(), 1500);
      fetchData();
    } catch (error) {
      console.error("Error saving edit:", error);
      setEditMessage("Error updating item");
    } finally {
      setEditLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordChangeLoading(true);
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordChangeFormData),
      });

      if (!response.ok) {
        const data = await response.json();
        setPasswordChangeMessage(data.error || "Error changing password");
        return;
      }

      setPasswordChangeMessage("Password changed successfully!");
      setPasswordChangeFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        setIsPasswordDialogOpen(false);
        setPasswordChangeMessage("");
      }, 1500);
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordChangeMessage("Error changing password");
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      if (sortOrder === "asc") {
        setSortOrder("desc");
      } else {
        setSortBy(null);
        setSortOrder("asc");
      }
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setTablePage(0);
  };

  const getSortIndicator = (field: string) => {
    if (sortBy !== field) return " ↕";
    return sortOrder === "asc" ? " ↑" : " ↓";
  };

  const handleHeaderContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu(
      contextMenu === null
        ? { mouseX: e.clientX - 2, mouseY: e.clientY - 4 }
        : null
    );
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleToggleColumn = (column: typeof allColumns[number]) => {
    const newVisibleColumns = new Set(visibleColumns);
    if (newVisibleColumns.has(column)) {
      newVisibleColumns.delete(column);
    } else {
      newVisibleColumns.add(column);
    }
    setVisibleColumns(newVisibleColumns);
    localStorage.setItem("visibleColumns", JSON.stringify(Array.from(newVisibleColumns)));
  };

  const handleSelectRow = (id: number) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  const handleBulkAction = async (action: "enable" | "disable") => {
    setConfirmAction(action);
    setConfirmDialogOpen(true);
  };

  const executeAction = async () => {
    setConfirmDialogOpen(false);
    setActionLoading(true);

    try {
      const ids = Array.from(selectedIds);
      await Promise.all(
        ids.map((id) =>
          fetch(`/api/ticker-subscriptions/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              enabled: confirmAction === "enable",
            }),
          })
        )
      );

      setSelectedIds(new Set());
      fetchData();
    } catch (error) {
      console.error("Error updating items:", error);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ fontSize: "1.5rem", fontWeight: 700 }}>
            Ticker Subscriptions Dashboard
          </Box>
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <ClientOnly>
              <ThemeToggle />
            </ClientOnly>
            <Button
              onClick={() => setIsPasswordDialogOpen(true)}
              variant="outlined"
              color="inherit"
            >
              Change Password
            </Button>
            <Button onClick={handleLogout} variant="outlined" color="inherit">
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Dialog open={isPasswordDialogOpen} onClose={() => {
        setIsPasswordDialogOpen(false);
        setPasswordChangeMessage("");
        setPasswordChangeFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pt: 3 }}>Change Password</DialogTitle>
        <DialogContent sx={{ pt: 4 }}>
          {passwordChangeMessage && (
            <Box
              sx={{
                mb: 2,
                p: 1,
                bgcolor: passwordChangeMessage.includes("successfully") ? "success.light" : "error.light",
                color: passwordChangeMessage.includes("successfully") ? "success.dark" : "error.dark",
                borderRadius: 1,
              }}
            >
              {passwordChangeMessage}
            </Box>
          )}
          <Stack spacing={2} sx={{ mt: 3 }}>
            <TextField
              label="Current Password"
              type={showCurrentPassword ? "text" : "password"}
              size="small"
              fullWidth
              value={passwordChangeFormData.currentPassword}
              onChange={(e) =>
                setPasswordChangeFormData((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      edge="end"
                      size="small"
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="New Password"
              type={showNewPassword ? "text" : "password"}
              size="small"
              fullWidth
              value={passwordChangeFormData.newPassword}
              onChange={(e) =>
                setPasswordChangeFormData((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                      size="small"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              size="small"
              fullWidth
              value={passwordChangeFormData.confirmPassword}
              onChange={(e) =>
                setPasswordChangeFormData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      size="small"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setIsPasswordDialogOpen(false);
            setPasswordChangeMessage("");
            setPasswordChangeFormData({
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
          }}>Cancel</Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            color="primary"
            disabled={passwordChangeLoading}
          >
            {passwordChangeLoading ? "Changing..." : "Change Password"}
          </Button>
        </DialogActions>
      </Dialog>

      <Box component="main" sx={{ flex: 1, py: 2, px: 2 }}>
        <Container maxWidth={false} sx={{ px: 1 }}>
          {/* Message */}
          {passwordChangeMessage && (
            <Box
              sx={{
                mb: 2,
                p: 2,
                bgcolor: "success.light",
                color: "success.dark",
                borderRadius: 1,
              }}
            >
              {passwordChangeMessage}
            </Box>
          )}

          {/* Search and Filters */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: filtersExpanded ? 2 : 0,
                cursor: "pointer",
                userSelect: "none",
              }}
              onClick={() => setFiltersExpanded(!filtersExpanded)}
            >
              <Box sx={{ fontSize: "0.875rem", fontWeight: 600 }}>Filters</Box>
              <IconButton
                size="small"
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                sx={{
                  transform: filtersExpanded ? "rotate(0deg)" : "rotate(-90deg)",
                  transition: "transform 0.3s ease",
                }}
              >
                <ExpandMoreIcon />
              </IconButton>
            </Box>
            <Collapse in={filtersExpanded} timeout="auto" unmountOnExit>
            {/* Per-Field Filters */}
            <Box sx={{ pt: 1, mb: 2 }}>
              <Box sx={{ mb: 1, fontSize: "0.875rem", fontWeight: 600 }}>
                Filter by Field
              </Box>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 1, mb: 2 }}>
                <TextField
                  size="small"
                  placeholder="Filter by Enabled..."
                  value={filterEnabled}
                  onChange={(e) => {
                    setFilterEnabled(e.target.value);
                    setTablePage(0);
                  }}
                />
                <TextField
                  size="small"
                  placeholder="Filter by Symbol..."
                  value={filterSymbol}
                  onChange={(e) => {
                    setFilterSymbol(e.target.value);
                    setTablePage(0);
                  }}
                />
                <TextField
                  size="small"
                  placeholder="Filter by Market Symbol..."
                  value={filterMarketSymbol}
                  onChange={(e) => {
                    setFilterMarketSymbol(e.target.value);
                    setTablePage(0);
                  }}
                />
                <TextField
                  size="small"
                  placeholder="Filter by Exchange..."
                  value={filterExchange}
                  onChange={(e) => {
                    setFilterExchange(e.target.value);
                    setTablePage(0);
                  }}
                />
                <FormControl size="small" fullWidth>
                  <Select
                    value={filterType}
                    onChange={(e) => {
                      setFilterType(e.target.value);
                      setTablePage(0);
                    }}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>All Types</em>
                    </MenuItem>
                    <MenuItem value="EQUITY">EQUITY</MenuItem>
                    <MenuItem value="CRYPTO">CRYPTO</MenuItem>
                    <MenuItem value="FOREX">FOREX</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" fullWidth>
                  <Select
                    value={filterSubType}
                    onChange={(e) => {
                      setFilterSubType(e.target.value);
                      setTablePage(0);
                    }}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>All Sub Types</em>
                    </MenuItem>
                    {subTypes.map((subType) => (
                      <MenuItem key={subType} value={subType}>
                        {subType}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 1, mb: 2 }}>
                <TextField
                  size="small"
                  placeholder="Filter by Description..."
                  value={filterDescription}
                  onChange={(e) => {
                    setFilterDescription(e.target.value);
                    setTablePage(0);
                  }}
                />
                <FormControl size="small" fullWidth>
                  <Select
                    value={filterExchange}
                    onChange={(e) => {
                      setFilterExchange(e.target.value);
                      setTablePage(0);
                    }}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>All Exchanges</em>
                    </MenuItem>
                    {exchanges.map((exchange) => (
                      <MenuItem key={exchange} value={exchange}>
                        {exchange}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  placeholder="Filter by Base..."
                  value={filterBase}
                  onChange={(e) => {
                    setFilterBase(e.target.value);
                    setTablePage(0);
                  }}
                />
                <TextField
                  size="small"
                  placeholder="Filter by Quote..."
                  value={filterQuote}
                  onChange={(e) => {
                    setFilterQuote(e.target.value);
                    setTablePage(0);
                  }}
                />
                <TextField
                  size="small"
                  placeholder="Filter by Tradable..."
                  value={filterTradable}
                  onChange={(e) => {
                    setFilterTradable(e.target.value);
                    setTablePage(0);
                  }}
                />
              </Box>
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  setFilterEnabled("");
                  setFilterSymbol("");
                  setFilterMarketSymbol("");
                  setFilterExchange("");
                  setFilterType("");
                  setFilterSubType("");
                  setFilterDescription("");
                  setFilterName("");
                  setFilterBase("");
                  setFilterQuote("");
                  setFilterTradable("");
                  setTablePage(0);
                }}
              >
                Reset Filters
              </Button>
            </Box>
            </Collapse>
          </Paper>

          {/* Bulk Actions */}
          {selectedIds.size > 0 && (
            <Box sx={{ mb: 1, display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleBulkAction("enable")}
                disabled={actionLoading}
              >
                Enable ({selectedIds.size})
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleBulkAction("disable")}
                disabled={actionLoading}
              >
                Disable ({selectedIds.size})
              </Button>
            </Box>
          )}

          {/* MUI Table */}
          <TableContainer component={Paper} sx={{ mb: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow onContextMenu={handleHeaderContextMenu}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedIds.size > 0 && selectedIds.size < items.length
                      }
                      checked={selectedIds.size === items.length && items.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </TableCell>
                  {visibleColumns.has("enabled") && (
                    <TableCell
                      onClick={() => handleSort("enabled")}
                      sx={{
                        cursor: "pointer",
                        userSelect: "none",
                        "&:hover": { backgroundColor: muiTheme.palette.action.hover },
                      }}
                    >
                      Enabled{getSortIndicator("enabled")}
                    </TableCell>
                  )}
                  {visibleColumns.has("symbol") && (
                    <TableCell
                      onClick={() => handleSort("symbol")}
                      sx={{
                        cursor: "pointer",
                        userSelect: "none",
                        "&:hover": { backgroundColor: muiTheme.palette.action.hover },
                      }}
                    >
                      Symbol{getSortIndicator("symbol")}
                    </TableCell>
                  )}
                  {visibleColumns.has("name") && (
                    <TableCell
                      onClick={() => handleSort("name")}
                      sx={{
                        cursor: "pointer",
                        userSelect: "none",
                        "&:hover": { backgroundColor: muiTheme.palette.action.hover },
                      }}
                    >
                      Name{getSortIndicator("name")}
                    </TableCell>
                  )}
                  {visibleColumns.has("description") && (
                    <TableCell
                      onClick={() => handleSort("description")}
                      sx={{
                        cursor: "pointer",
                        userSelect: "none",
                        "&:hover": { backgroundColor: muiTheme.palette.action.hover },
                      }}
                    >
                      Description{getSortIndicator("description")}
                    </TableCell>
                  )}
                  {visibleColumns.has("marketSymbol") && (
                    <TableCell
                      onClick={() => handleSort("marketSymbol")}
                      sx={{
                        cursor: "pointer",
                        userSelect: "none",
                        "&:hover": { backgroundColor: muiTheme.palette.action.hover },
                      }}
                    >
                      Market Symbol{getSortIndicator("marketSymbol")}
                    </TableCell>
                  )}
                  {visibleColumns.has("exchange") && (
                    <TableCell
                      onClick={() => handleSort("exchange")}
                      sx={{
                        cursor: "pointer",
                        userSelect: "none",
                        "&:hover": { backgroundColor: muiTheme.palette.action.hover },
                      }}
                    >
                      Exchange{getSortIndicator("exchange")}
                    </TableCell>
                  )}
                  {visibleColumns.has("type") && (
                    <TableCell
                      onClick={() => handleSort("type")}
                      sx={{
                        cursor: "pointer",
                        userSelect: "none",
                        "&:hover": { backgroundColor: muiTheme.palette.action.hover },
                      }}
                    >
                      Type{getSortIndicator("type")}
                    </TableCell>
                  )}
                  {visibleColumns.has("subType") && (
                    <TableCell
                      onClick={() => handleSort("subType")}
                      sx={{
                        cursor: "pointer",
                        userSelect: "none",
                        "&:hover": { backgroundColor: muiTheme.palette.action.hover },
                      }}
                    >
                      Sub Type{getSortIndicator("subType")}
                    </TableCell>
                  )}
                  {visibleColumns.has("base") && (
                    <TableCell
                      onClick={() => handleSort("base")}
                      sx={{
                        cursor: "pointer",
                        userSelect: "none",
                        "&:hover": { backgroundColor: muiTheme.palette.action.hover },
                      }}
                    >
                      Base{getSortIndicator("base")}
                    </TableCell>
                  )}
                  {visibleColumns.has("quote") && (
                    <TableCell
                      onClick={() => handleSort("quote")}
                      sx={{
                        cursor: "pointer",
                        userSelect: "none",
                        "&:hover": { backgroundColor: muiTheme.palette.action.hover },
                      }}
                    >
                      Quote{getSortIndicator("quote")}
                    </TableCell>
                  )}
                  {visibleColumns.has("tradable") && (
                    <TableCell
                      onClick={() => handleSort("tradable")}
                      sx={{
                        cursor: "pointer",
                        userSelect: "none",
                        "&:hover": { backgroundColor: muiTheme.palette.action.hover },
                      }}
                    >
                      Tradable{getSortIndicator("tradable")}
                    </TableCell>
                  )}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={visibleColumns.size + 2} align="center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={visibleColumns.size + 2} align="center">
                      No items found
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow
                      key={item.id}
                      selected={selectedIds.has(item.id)}
                      hover
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedIds.has(item.id)}
                          onChange={() => handleSelectRow(item.id)}
                        />
                      </TableCell>
                      {visibleColumns.has("enabled") && (
                        <TableCell>
                          <Chip
                            label={item.enabled ? "Yes" : "No"}
                            color={item.enabled ? "success" : "error"}
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                      )}
                      {visibleColumns.has("symbol") && <TableCell>{item.symbol}</TableCell>}
                      {visibleColumns.has("name") && <TableCell>{item.name}</TableCell>}
                      {visibleColumns.has("description") && (
                        <TableCell sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>
                          {item.description || "-"}
                        </TableCell>
                      )}
                      {visibleColumns.has("marketSymbol") && <TableCell>{item.marketSymbol}</TableCell>}
                      {visibleColumns.has("exchange") && <TableCell>{item.exchange}</TableCell>}
                      {visibleColumns.has("type") && <TableCell>{item.type}</TableCell>}
                      {visibleColumns.has("subType") && <TableCell>{item.subType}</TableCell>}
                      {visibleColumns.has("base") && <TableCell>{item.base}</TableCell>}
                      {visibleColumns.has("quote") && <TableCell>{item.quote}</TableCell>}
                      {visibleColumns.has("tradable") && (
                        <TableCell>
                          {item.tradable ? "Yes" : "No"}
                        </TableCell>
                      )}
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEditDialog(item)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={total}
              rowsPerPage={rowsPerPage}
              page={tablePage}
              onPageChange={(e, newPage) => setTablePage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setTablePage(0);
              }}
            />
          </TableContainer>

          {/* Confirmation Dialog */}
          <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogContent>
              Are you sure you want to{" "}
              <strong>{confirmAction === "enable" ? "enable" : "disable"}</strong> the
              selected {selectedIds.size} item
              {selectedIds.size !== 1 ? "s" : ""}?
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={executeAction}
                variant="contained"
                color={confirmAction === "enable" ? "success" : "error"}
                disabled={actionLoading}
              >
                {actionLoading ? "Processing..." : "Confirm"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ pt: 3 }}>
              Edit: {editingItem?.symbol} ({editingItem?.marketSymbol})
            </DialogTitle>
            <DialogContent sx={{ pt: 4 }}>
              {editMessage && (
                <Box
                  sx={{
                    mb: 2,
                    p: 1,
                    bgcolor: editMessage.includes("successfully") ? "success.light" : "error.light",
                    color: editMessage.includes("successfully") ? "success.dark" : "error.dark",
                    borderRadius: 1,
                  }}
                >
                  {editMessage}
                </Box>
              )}
              <Stack spacing={2} sx={{ mt: 3 }}>
                <TextField
                  label="Name"
                  size="small"
                  fullWidth
                  value={editFormData.name ?? ""}
                  onChange={(e) =>
                    setEditFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                <TextField
                  label="Description"
                  size="small"
                  fullWidth
                  multiline
                  rows={3}
                  value={editFormData.description ?? ""}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Checkbox
                    checked={editFormData.tradable ?? false}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        tradable: e.target.checked,
                      }))
                    }
                  />
                  <Box sx={{ fontSize: "0.875rem", fontWeight: 600 }}>Tradable</Box>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEditDialog}>Cancel</Button>
              <Button
                onClick={handleSaveEdit}
                variant="contained"
                color="primary"
                disabled={editLoading}
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Column Visibility Context Menu */}
          <Menu
            open={contextMenu !== null}
            onClose={handleCloseContextMenu}
            anchorReference="anchorPosition"
            anchorPosition={
              contextMenu !== null
                ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                : undefined
            }
          >
            {allColumns.map((column) => (
              <MenuItem
                key={column}
                onClick={() => handleToggleColumn(column)}
                sx={{
                  backgroundColor: visibleColumns.has(column)
                    ? muiTheme.palette.action.selected
                    : "transparent",
                }}
              >
                <Checkbox
                  checked={visibleColumns.has(column)}
                  size="small"
                  sx={{ mr: 1 }}
                />
                {columnLabels[column]}
              </MenuItem>
            ))}
          </Menu>
        </Container>
      </Box>
    </Box>
  );
}
