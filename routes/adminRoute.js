const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Professional = require("../models/professionalModel");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/get-all-professionals", authMiddleware, async (req, res) => {
  try {
    const professionals = await Professional.find({});
    res.status(200).send({
      message: "Professionals fetched successfully",
      success: true,
      data: professionals,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error applying professional account",
      success: false,
      error,
    });
  }
});

router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      message: "Users fetched successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error applying professional account",
      success: false,
      error,
    });
  }
});

router.post(
  "/change-professional-account-status",
  authMiddleware,
  async (req, res) => {
    try {
      const { professionalId, status } = req.body;
      const professional = await Professional.findByIdAndUpdate(professionalId, {
        status,
      });

      const user = await User.findOne({ _id: professional.userId });
      const unseenNotifications = user.unseenNotifications;
      unseenNotifications.push({
        type: "new-professional-request-changed",
        message: `Your professional account has been ${status}`,
        onClickPath: "/notifications",
      });
      user.isProfessional = status === "approved" ? true : false;
      await user.save();

      res.status(200).send({
        message: "ProfeisProfessional status updated successfully",
        success: true,
        data: professional,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error applying professional account",
        success: false,
        error,
      });
    }
  }
);



module.exports = router;
