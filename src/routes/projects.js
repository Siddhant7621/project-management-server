import express from "express";
import { authenticate } from "../middleware/auth.js";
import Project from "../models/Project.js";

const router = express.Router();

// Get all projects
router.get("/", authenticate, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single project
router.get("/:id", authenticate, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create project
router.post("/", authenticate, async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const project = new Project({
      title,
      description,
      status,
      user: req.user._id,
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update project
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, description, status },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete project
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
