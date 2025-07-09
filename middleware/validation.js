const { body } = require("express-validator");

const validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
];

const validateLogin = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),
];

const validateProduct = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Product name must be between 1 and 100 characters"),

  body("price")
    .isNumeric()
    .withMessage("Price must be a number")
    .custom((value) => {
      if (value < 0) {
        throw new Error("Price cannot be negative");
      }
      return true;
    }),

  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
];

const validateInvoice = [
  body("customerName")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Customer name must be between 1 and 100 characters"),

  body("customerEmail")
    .optional()
    .isEmail()
    .withMessage("Please enter a valid customer email")
    .normalizeEmail(),

  body("products")
    .isArray({ min: 1 })
    .withMessage("At least one product is required"),

  body("products.*.name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required"),

  body("products.*.price")
    .isNumeric()
    .withMessage("Product price must be a number"),

  body("products.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Product quantity must be a positive integer"),
];

module.exports = {
  validateRegister,
  validateLogin,
  validateProduct,
  validateInvoice,
};
