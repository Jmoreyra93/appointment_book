const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authMiddleware = require("../middlewares/authMiddleware");
const Proffesional = require('../models/doctorModel');

router.post("/register", async (req, res) => {
    try {
        const userExists = await User.findOne({ email: req.body.email })
        if (userExists) {
            return res.status(200).send({ message: "User already exists", success: false })

        } else {
            const password = req.body.password;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            req.body.password = hashedPassword
            const newUser = new User(req.body)
            await newUser.save()
            res.status(200).send({ message: "User created successfully", success: true })
        }
    } catch (error) {
        console.los(error)
        res.status(500).send({ message: " Error creating user", success: false, error })
    }
})
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res
                .status(200)
                .send({ message: "User does not exist", success: false })
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if (!isMatch) {
            return res
                .status(200)
                .send({ message: "Password is incorrect", success: false })
        } else {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '1d'
            })
            res.send({ message: "Login successful", success: true, data: token })
        }
    } catch (error) {
        console.los(error)
        res
            .status(500)
            .send({ message: "Error logging in", success: false, error })
    }
})

router.post("/get-user-info-by-id", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId });
        user.password = undefined;
        if (!user) {
            return res
                .status(200)
                .send({ message: "User does not exist", success: false });
        } else {
            res.status(200).send({
                success: true,
                data: user,
            });
        }
    } catch (error) {
        res
            .status(500)
            .send({ message: "Error getting user info", success: false, error });
    }
});

router.post("/apply-professional-account", authMiddleware, async (req, res) => {
    try {
        const newprofessional = new Proffesional({ ...req.body, status: "pending" });
        await newprofessional.save();
        const adminUser = await User.findOne({ isAdmin: true });

        const unseenNotifications = adminUser.unseenNotifications;
        unseenNotifications.push({
            type: "new-professional-request",
            message: `${newprofessional.firstName} ${newprofessional.lastName} has applied for a professional account`,
            data: {
                professionalId: newprofessional._id,
                name: newprofessional.firstName + " " + newprofessional.lastName,
            },
            onClickPath: "/admin/professionals",
        });
        await User.findByIdAndUpdate(adminUser._id, { unseenNotifications });
        res.status(200).send({
            success: true,
            message: "Professional account applied successfully",
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
    "/mark-all-notifications-as-seen",
    authMiddleware,
    async (req, res) => {
        try {
            const user = await User.findOne({ _id: req.body.userId });
            const unseenNotifications = user.unseenNotifications;
            const seenNotifications = user.seenNotifications;
            seenNotifications.push(...unseenNotifications);
            user.unseenNotifications = [];
            user.seenNotifications = seenNotifications;
            const updatedUser = await user.save();
            updatedUser.password = undefined;
            res.status(200).send({
                success: true,
                message: "All notifications marked as seen",
                data: updatedUser,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: "Error applying doctor account",
                success: false,
                error,
            });
        }
    }
);

router.post("/delete-all-notifications", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId });
        user.seenNotifications = [];
        user.unseenNotifications = [];
        const updatedUser = await user.save();
        updatedUser.password = undefined;
        res.status(200).send({
            success: true,
            message: "All notifications cleared",
            data: updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error applying doctor account",
            success: false,
            error,
        });
    }
});

module.exports = router;











