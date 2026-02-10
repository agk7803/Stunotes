const multer = require("multer");
const path = require("path");

// Storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );
    },
});

// File filter (optional: security)
const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|pdf|mp4/;

    const ext = allowed.test(
        path.extname(file.originalname).toLowerCase()
    );

    if (ext) cb(null, true);
    else cb("Only images, pdf, videos allowed!");
};

module.exports = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    fileFilter,
});