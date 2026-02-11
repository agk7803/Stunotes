const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middleware/checkAuth");
const dashboardController = require("../controllers/dashboardController");

// 📎 Upload middleware
const upload = require("../routes/upload.js");


/**
 * Dashboard Routes
 */

// Dashboard home
router.get(
    "/dashboard",
    isLoggedIn,
    dashboardController.dashboard
);

// View note
router.get(
    "/dashboard/item/:id",
    isLoggedIn,
    dashboardController.dashboardViewNote
);

// Update note (with file)
router.put(
    "/dashboard/item/:id",
    isLoggedIn,
    upload.single("media"), // 👈 IMPORTANT
    dashboardController.dashboardUpdateNote
);

// Delete note
router.delete(
    "/dashboard/item-delete/:id",
    isLoggedIn,
    dashboardController.dashboardDeleteNote
);

// Add note page
router.get(
    "/dashboard/add",
    isLoggedIn,
    dashboardController.dashboardAddNote
);

// Create note (with file)
router.post(
    "/dashboard/add",
    isLoggedIn,
    upload.single("media"), // 👈 IMPORTANT
    dashboardController.dashboardAddNoteSubmit
);

// Search
router.get(
    "/dashboard/search",
    isLoggedIn,
    dashboardController.dashboardSearch
);

router.post(
    "/dashboard/search",
    isLoggedIn,
    dashboardController.dashboardSearchSubmit
);

module.exports = router;