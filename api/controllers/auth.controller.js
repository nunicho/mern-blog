import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // 🔴 VALIDACIÓN
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    // 🟢 VALIDACIÓN PREVIA (mejor UX)
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return next(errorHandler(400, "Email already in use"));
      }
      if (existingUser.username === username) {
        return next(errorHandler(400, "Username already taken"));
      }
    }

    // 🔐 HASH
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // ✅ RESPUESTA CONSISTENTE
    res.status(201).json({
      success: true,
      message: "Signup successful",
    });
  } catch (error) {
    // 🔥 MANEJO DE DUPLICADOS (fallback)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];

      return next(
        errorHandler(
          400,
          field === "email" ? "Email already in use" : "Username already taken",
        ),
      );
    }

    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    const { password: pass, ...rest } = validUser._doc;


    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// COMO LO TENÍA SAHAND ANTES DE LOS CAMBIOS: mensaje feo en el frontend cuando se quería registrar un usuario ya existente, el error se mostraba en la consola del navegador pero no se mostraba en la interfaz de usuario. Ahora con el manejo de errores centralizado, el mensaje de error se muestra correctamente en la interfaz de usuario.

/*
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10)

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json("Signup successful");
  } catch (error) {
    next(error);
  }
};
*/
