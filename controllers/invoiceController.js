const Invoice = require("../models/Invoice");
const Product = require("../models/Product");
const { generateInvoicePDF } = require("../services/pdfService");
const { validationResult } = require("express-validator");

// @desc    Get all invoices for user
// @route   GET /api/invoices
// @access  Private
const getInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.find({ user: req.user.id })
      .populate("products.product")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: invoices.length,
      data: invoices,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single invoice
// @route   GET /api/invoices/:id
// @access  Private
const getInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate("products.product");

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    res.json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate invoice from user products
// @route   POST /api/invoices/generate
// @access  Private
const generateInvoice = async (req, res, next) => {
  try {
    const { customerName, customerEmail, productIds } = req.body;

    // Get user's products
    let products;
    if (productIds && productIds.length > 0) {
      products = await Product.find({
        _id: { $in: productIds },
        user: req.user.id,
      });
    } else {
      // If no specific products, use all user products
      products = await Product.find({ user: req.user.id });
    }

    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No products found to generate invoice",
      });
    }

    // Prepare invoice products
    const invoiceProducts = products.map((product) => ({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      totalPrice: product.totalPrice,
    }));

    // Create invoice
    const invoice = await Invoice.create({
      user: req.user.id,
      customerName: customerName || "Person_name",
      customerEmail: customerEmail || "example@email.com",
      products: invoiceProducts,
    });

    // Populate the created invoice
    await invoice.populate("products.product");

    res.status(201).json({
      success: true,
      message: "Invoice generated successfully",
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create custom invoice
// @route   POST /api/invoices
// @access  Private
const createInvoice = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const invoice = await Invoice.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update invoice
// @route   PUT /api/invoices/:id
// @access  Private
const updateInvoice = async (req, res, next) => {
  try {
    let invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Invoice updated successfully",
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Private
const deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    await Invoice.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate and download PDF invoice
// @route   POST /api/invoices/generate-pdf
// @access  Private
const generatePDFInvoice = async (req, res, next) => {
  try {
    const { customerName, customerEmail, productIds } = req.body;

    // Get user's products
    let products;
    if (productIds && productIds.length > 0) {
      products = await Product.find({
        _id: { $in: productIds },
        user: req.user.id,
      });
    } else {
      // If no specific products, use all user products
      products = await Product.find({ user: req.user.id });
    }

    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No products found to generate invoice",
      });
    }

    // Prepare invoice products
    const invoiceProducts = products.map((product) => ({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      totalPrice: product.totalPrice,
    }));

    // Calculate totals
    const subtotal = invoiceProducts.reduce((sum, item) => sum + item.totalPrice, 0);
    const gstRate = 18;
    const gstAmount = subtotal * (gstRate / 100);
    const totalAmount = subtotal + gstAmount;
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    const invoiceNumber = `INV-${year}${month}${day}-${random}`;

    // Create invoice in database
    const invoice = await Invoice.create({
      user: req.user.id,
      customerName: customerName || "Person_name",
      customerEmail: customerEmail || "example@email.com",
      products: invoiceProducts,
      subtotal,
      gstRate,
      gstAmount,
      totalAmount,
      invoiceNumber,
    });

    // Generate PDF
    const plainProducts = invoice.products.map(p => ({
      name: p.name,
      quantity: p.quantity,
      price: p.price,
      totalPrice: p.totalPrice,
    }));
    
    const pdfBuffer = await generateInvoicePDF({
      customerName: invoice.customerName,
      customerEmail: invoice.customerEmail,
      products: plainProducts,
      subtotal: invoice.subtotal,
      gstAmount: invoice.gstAmount,
      totalAmount: invoice.totalAmount,
    });

    // Set headers for PDF download
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=\"invoice-${invoice.invoiceNumber}.pdf\"`,
      "Content-Length": pdfBuffer.length,
    });

    // Send PDF
    res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF generation error:", error);
    next(error);
  }
};

module.exports = {
  getInvoices,
  getInvoice,
  generateInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  generatePDFInvoice,
};
