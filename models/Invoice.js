const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      default: "Person_name",
    },
    customerEmail: {
      type: String,
      required: [true, "Customer email is required"],
      default: "example@email.com",
    },
    products: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        price: Number,
        quantity: Number,
        totalPrice: Number,
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    gstRate: {
      type: Number,
      default: 18, // 18% GST
    },
    gstAmount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "sent", "paid"],
      default: "draft",
    },
    generatedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Generate invoice number before saving
invoiceSchema.pre("save", function (next) {
  if (!this.invoiceNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    this.invoiceNumber = `INV-${year}${month}${day}-${random}`;
  }
  next();
});

// Calculate amounts before saving
invoiceSchema.pre("save", function (next) {
  this.subtotal = this.products.reduce((sum, item) => sum + item.totalPrice, 0);
  this.gstAmount = this.subtotal * (this.gstRate / 100);
  this.totalAmount = this.subtotal + this.gstAmount;
  next();
});

module.exports = mongoose.model("Invoice", invoiceSchema);
