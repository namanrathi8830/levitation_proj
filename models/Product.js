const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot be more than 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    totalPrice: {
      type: Number
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Calculate total price before saving
productSchema.pre("save", function (next) {
  this.totalPrice = this.price * this.quantity;
  next();
});

// Calculate total price before update
productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.price || update.quantity) {
    const price = update.price || this.price;
    const quantity = update.quantity || this.quantity;
    update.totalPrice = price * quantity;
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
