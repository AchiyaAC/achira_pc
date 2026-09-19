import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

function createToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

function publicUser(user) {
  return {
    id: user._id,
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isBlocked: user.isBlocked,
    image: user.image || "",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "customer",
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed.",
    });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = createToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed.",
    });
  }
};

// GOOGLE LOGIN
export const googleLogin = async (req, res) => {
  try {
    const credential = String(req.body.credential || "").trim();

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required.",
      });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({
        success: false,
        message: "Google login is not configured on the server.",
      });
    }

    const googleResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(
        credential
      )}`
    );

    if (!googleResponse.ok) {
      throw new Error("Invalid Google ID token");
    }

    const payload = await googleResponse.json();

    // Check Google Client ID
    if (payload.aud !== process.env.GOOGLE_CLIENT_ID) {
      throw new Error("Google client ID mismatch");
    }

    // Check verified email
    if (
      !payload?.email ||
      String(payload.email_verified) !== "true"
    ) {
      return res.status(401).json({
        success: false,
        message: "Google account email could not be verified.",
      });
    }

    const email = String(payload.email).trim().toLowerCase();

    // Strong name fallback
    const googleName =
      String(
        payload.name ||
          payload.given_name ||
          payload.family_name ||
          email.split("@")[0] ||
          "Google User"
      ).trim() || "Google User";

    let user = await User.findOne({ email }).select("+password");

    // Blocked user check
    if (user?.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked.",
      });
    }

    // CREATE NEW GOOGLE USER
    if (!user) {
      const randomPassword = `${cryptoRandomString()}-${Date.now()}-Google`;

      const hashedPassword = await bcrypt.hash(
        randomPassword,
        12
      );

      user = await User.create({
        name: googleName,
        email,
        password: hashedPassword,
        googleId: payload.sub || "",
        image: payload.picture || "",
        role: "customer",
      });
    } else {
      // EXISTING USER
      let changed = false;

      // Fix missing name
      if (!user.name || !String(user.name).trim()) {
        user.name = googleName;
        changed = true;
      }

      // Save Google ID if missing
      if (!user.googleId && payload.sub) {
        user.googleId = payload.sub;
        changed = true;
      }

      // Save Google profile image if missing
      if (!user.image && payload.picture) {
        user.image = payload.picture;
        changed = true;
      }

      if (changed) {
        await user.save();
      }
    }

    const token = createToken(user);

    return res.status(200).json({
      success: true,
      message: "Google login successful.",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Google login error:", error);

    return res.status(401).json({
      success: false,
      message: "Google login failed. Please try again.",
    });
  }
};

function cryptoRandomString() {
  return Math.random().toString(36).substring(2, 15);
}

// CURRENT USER
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({
      success: true,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get user profile.",
    });
  }
};

// GET ALL USERS - ADMIN
export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.json(users);
  } catch (error) {
    console.error("Get users error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load users.",
    });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const firstName = String(req.body.firstName || "").trim();
    const lastName = String(req.body.lastName || "").trim();

    const combinedName = `${firstName} ${lastName}`.trim();

    if (combinedName) {
      user.name = combinedName;
    }

    await user.save();

    return res.json({
      success: true,
      message: "Profile updated successfully.",
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
};

// BLOCK / UNBLOCK USER - ADMIN
export const updateUserStatus = async (req, res) => {
  try {
    const { userId, email, isBlocked } = req.body;

    const query = userId
      ? { _id: userId }
      : { email };

    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Don't allow admin to block themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot block your own account.",
      });
    }

    user.isBlocked = Boolean(isBlocked);

    await user.save();

    return res.json({
      success: true,
      message: user.isBlocked
        ? "User blocked successfully."
        : "User unblocked successfully.",
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Update user status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update user status.",
    });
  }
};

// CHANGE ROLE - ADMIN
export const updateUserRole = async (req, res) => {
  try {
    const {
      userId,
      email,
      role,
      isAdmin,
    } = req.body;

    const query = userId
      ? { _id: userId }
      : { email };

    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Don't allow admin to change their own role
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own role.",
      });
    }

    let newRole = role;

    if (!newRole && typeof isAdmin === "boolean") {
      newRole = isAdmin ? "admin" : "customer";
    }

    if (!["admin", "customer"].includes(newRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role.",
      });
    }

    user.role = newRole;

    await user.save();

    return res.json({
      success: true,
      message: "User role updated successfully.",
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Update user role error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update user role.",
    });
  }
};