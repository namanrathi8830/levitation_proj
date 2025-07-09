const express = require("express");
const {
  getInvoices,
  getInvoice,
  generateInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  generatePDFInvoice,
} = require("../controllers/invoiceController");
const { protect } = require("../middleware/auth");
const { validateInvoice } = require("../middleware/validation");

const router = express.Router();

// Protect all invoice routes
router.use(protect);

// @route   GET /api/invoices
// @route   POST /api/invoices
router.route("/").get(getInvoices).post(validateInvoice, createInvoice);

// @route   POST /api/invoices/generate
router.post("/generate", generateInvoice);

// @route   POST /api/invoices/generate-pdf
router.post("/generate-pdf", generatePDFInvoice);

// @route   GET /api/invoices/:id
// @route   PUT /api/invoices/:id
// @route   DELETE /api/invoices/:id
router.route("/:id").get(getInvoice).put(updateInvoice).delete(deleteInvoice);

module.exports = router;
