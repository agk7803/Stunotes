const Note = require("../models/Notes");
const mongoose = require("mongoose");

/**
 * GET /
 * Dashboard
 */
exports.dashboard = async (req, res) => {
  let perPage = 12;
  let page = req.query.page || 1;

  const locals = {
    title: "Dashboard",
    description: "Free NodeJS Notes App.",
  };

  try {
    const notes = await Note.aggregate([
      { $sort: { updatedAt: -1 } },
      { $match: { user: mongoose.Types.ObjectId(req.user.id) } },
      {
        $project: {
          title: { $substr: ["$title", 0, 30] },
          body: { $substr: ["$body", 0, 100] },
          attachment: 1,
        },
      },
    ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Note.countDocuments({ user: req.user.id });

    res.render("dashboard/index", {
      userName: req.user.firstName,
      locals,
      notes,
      layout: "../views/layouts/dashboard",
      current: page,
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.log(error);
    res.send("Failed to load dashboard");
  }
};

/**
 * GET /
 * View Specific Note
 */
exports.dashboardViewNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).lean();

    if (!note) {
      return res.send("Note not found");
    }

    res.render("dashboard/view-note", {
      noteID: req.params.id,
      note,
      layout: "../views/layouts/dashboard",
    });
  } catch (error) {
    console.log(error);
    res.send("Failed to load note");
  }
};

/**
 * PUT /
 * Update Specific Note (With Upload)
 */
exports.dashboardUpdateNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!note) {
      return res.send("Note not found");
    }

    // Update text
    note.title = req.body.title;
    note.body = req.body.body;
    note.updatedAt = Date.now();

    // 📎 Replace attachment if new file uploaded
    if (req.file) {
      note.attachment = {
        filePath: "/uploads/" + req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      };
    }

    await note.save();

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.send("Failed to update note");
  }
};

/**
 * DELETE /
 * Delete Note
 */
exports.dashboardDeleteNote = async (req, res) => {
  try {
    await Note.deleteOne({
      _id: req.params.id,
      user: req.user.id,
    });

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.send("Failed to delete note");
  }
};

/**
 * GET /
 * Add Note Page
 */
exports.dashboardAddNote = async (req, res) => {
  res.render("dashboard/add", {
    layout: "../views/layouts/dashboard",
  });
};

/**
 * POST /
 * Add Note (With Upload)
 */
exports.dashboardAddNoteSubmit = async (req, res) => {
  try {
    const newNote = {
      user: req.user.id,
      title: req.body.title,
      body: req.body.body,
    };

    // 📎 Save attachment if uploaded
    if (req.file) {
      newNote.attachment = {
        filePath: "/uploads/" + req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      };
    }

    await Note.create(newNote);

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.send("Failed to create note");
  }
};

/**
 * GET /
 * Search Page
 */
exports.dashboardSearch = async (req, res) => {
  try {
    res.render("dashboard/search", {
      searchResults: "",
      layout: "../views/layouts/dashboard",
    });
  } catch (error) {
    console.log(error);
    res.send("Failed to load search page");
  }
};

/**
 * POST /
 * Search Notes
 */
exports.dashboardSearchSubmit = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const searchResults = await Note.find({
      user: req.user.id,
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChars, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChars, "i") } },
      ],
    });

    res.render("dashboard/search", {
      searchResults,
      layout: "../views/layouts/dashboard",
    });
  } catch (error) {
    console.log(error);
    res.send("Search failed");
  }
};