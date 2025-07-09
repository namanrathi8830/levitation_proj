"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../../components/Navigation";
import InvoiceGenerator from "../../components/InvoiceGenerator";
import { productsAPI, invoicesAPI } from "../../utils/api";
import styles from "./products.module.css";
import React from "react";
import styled from "styled-components";

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export default function ProductsPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
  });
  const [showInvoice, setShowInvoice] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    customerName: "",
    customerEmail: "",
  });
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setIsLoggedIn(true);
    // Always start with a fresh invoice on login
    setProducts([]);
    setCustomerInfo({ customerName: "", customerEmail: "" });
    setInvoiceGenerated(false);
    fetchProducts();
  }, [router]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (error: any) {
      if (error.message.includes("authorized")) {
        localStorage.clear();
        router.push("/login");
      } else {
        setError("Failed to fetch products");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
      };

      const response = await productsAPI.create(productData);
      setProducts((prev) => [...prev, response.data]);
      setFormData({ name: "", price: "", quantity: "" });
    } catch (error: any) {
      setError(error.message || "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await productsAPI.deleteAll();
    localStorage.clear();
    router.push("/login");
  };

  const calculateSubTotal = () => {
    return products.reduce((sum, product) => sum + product.totalPrice, 0);
  };

  const calculateGST = () => {
    return calculateSubTotal() * 0.18;
  };

  const calculateTotal = () => {
    return calculateSubTotal() + calculateGST();
  };

  const handleGenerateInvoice = async () => {
    try {
      setIsLoading(true);
      setError("");

      if (products.length === 0) {
        setError(
          "No products to generate invoice. Please add some products first.",
        );
        return;
      }

      // Generate PDF and download
      const pdfBlob = await invoicesAPI.generatePDF({
        customerName: customerInfo.customerName,
        customerEmail: customerInfo.customerEmail,
      });

      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Clear products and customer info after invoice generation
      setProducts([]);
      setCustomerInfo({ customerName: "", customerEmail: "" });
      setInvoiceGenerated(true);
      // Also clear products in backend
      await productsAPI.deleteAll();
    } catch (error: any) {
      setError("Failed to generate PDF invoice: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewInvoice = async () => {
    setProducts([]);
    setCustomerInfo({ customerName: "", customerEmail: "" });
    setFormData({ name: "", price: "", quantity: "" });
    setInvoiceGenerated(false);
    setError("");
    // Also clear products in backend
    await productsAPI.deleteAll();
  };

  // Add handler to remove a product by id
  const handleRemoveProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product._id !== id));
  };

  // Animated Button for Add Product and Generate PDF Invoice
  const AnimatedButton = ({ type = "button", disabled, onClick, children }: { type?: "button" | "submit"; disabled?: boolean; onClick?: () => void; children: React.ReactNode }) => (
    <StyledWrapper>
      <button type={type} disabled={disabled} onClick={onClick}>
        {children}
      </button>
    </StyledWrapper>
  );

  const StyledWrapper = styled.div`
    button {
      --green: #1BFD9C;
      font-size: 15px;
      padding: 0.7em 2.7em;
      letter-spacing: 0.06em;
      position: relative;
      font-family: inherit;
      border-radius: 0.6em;
      overflow: hidden;
      transition: all 0.3s;
      line-height: 1.4em;
      border: 2px solid var(--green);
      background: linear-gradient(to right, rgba(27, 253, 156, 0.1) 1%, transparent 40%,transparent 60% , rgba(27, 253, 156, 0.1) 100%);
      color: var(--green);
      box-shadow: inset 0 0 10px rgba(27, 253, 156, 0.4), 0 0 9px 3px rgba(27, 253, 156, 0.1);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      text-align: center;
      cursor: pointer;
    }
    button:hover {
      color: #82ffc9;
      box-shadow: inset 0 0 10px rgba(27, 253, 156, 0.6), 0 0 9px 3px rgba(27, 253, 156, 0.2);
    }
    button:before {
      content: "";
      position: absolute;
      left: -4em;
      width: 4em;
      height: 100%;
      top: 0;
      transition: transform .4s ease-in-out;
      background: linear-gradient(to right, transparent 1%, rgba(27, 253, 156, 0.1) 40%,rgba(27, 253, 156, 0.1) 60% , transparent 100%);
    }
    button:hover:before {
      transform: translateX(15em);
    }
  `;

  if (!isLoggedIn) {
    return <div>Loading...</div>;
  }

  if (showInvoice) {
    return (
      <InvoiceGenerator
        products={products}
        onBack={() => setShowInvoice(false)}
      />
    );
  }

  return (
    <div className={styles.productsContainer}>
      {/* Blur effects */}
      <div className={styles.blurEffect1}></div>

      <Navigation variant="dashboard" onLogout={handleLogout} />

      <div className={styles.content}>
        <div className={styles.header}>
          <h1>Add Products</h1>
          <p>
            This is basic login page which is used for levitation assignment
            purpose.
          </p>
        </div>

        <div className={styles.mainSection}>
          <div className={styles.formSection}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <form onSubmit={handleAddProduct} className={styles.form}>
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="customerName">Customer Name</label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    placeholder="Enter customer name"
                    value={customerInfo.customerName}
                    onChange={handleCustomerInfoChange}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="customerEmail">Customer Email</label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    placeholder="Enter customer email"
                    value={customerInfo.customerEmail}
                    onChange={handleCustomerInfoChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="name">Product Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter the product name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="price">Product Price</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    placeholder="Enter the price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    placeholder="Enter the Qty"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <AnimatedButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Product"}
                  <svg
                    width="21"
                    height="22"
                    viewBox="0 0 21 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.5 19.8916C5.43375 19.8916 1.3125 15.7704 1.3125 10.7041C1.3125 5.63785 5.43375 1.5166 10.5 1.5166C15.5662 1.5166 19.6875 5.63785 19.6875 10.7041C19.6875 15.7704 15.5662 19.8916 10.5 19.8916ZM10.5 2.8291C6.15562 2.8291 2.625 6.35973 2.625 10.7041C2.625 15.0485 6.15562 18.5791 10.5 18.5791C14.8444 18.5791 18.375 15.0485 18.375 10.7041C18.375 6.35973 14.8444 2.8291 10.5 2.8291Z"
                      fill="#CCF575"
                    />
                    <path
                      d="M10.5 15.2979C10.1325 15.2979 9.84375 15.0091 9.84375 14.6416V6.7666C9.84375 6.3991 10.1325 6.11035 10.5 6.11035C10.8675 6.11035 11.1562 6.3991 11.1562 6.7666V14.6416C11.1562 15.0091 10.8675 15.2979 10.5 15.2979Z"
                      fill="#CCF575"
                    />
                    <path
                      d="M14.4375 11.3604H6.5625C6.195 11.3604 5.90625 11.0716 5.90625 10.7041C5.90625 10.3366 6.195 10.0479 6.5625 10.0479H14.4375C14.805 10.0479 15.0938 10.3366 15.0938 10.7041C15.0938 11.0716 14.805 11.3604 14.4375 11.3604Z"
                      fill="#CCF575"
                    />
                  </svg>
                </AnimatedButton>
              </div>
            </form>
          </div>

          <div className={styles.tableSection}>
            <div className={styles.tableContainer}>
              <div className={styles.tableHeader}>
                <div className={styles.headerCell}>
                  <span>Product name</span>
                  <svg
                    width="17"
                    height="18"
                    viewBox="0 0 17 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.526 5.61914L3.65907 9.56914C3.47444 9.75129 3.22715 9.85209 2.97046 9.84981C2.71378 9.84753 2.46824 9.74236 2.28673 9.55695C2.10522 9.37155 2.00227 9.12073 2.00004 8.85854C1.99781 8.59634 2.09648 8.34374 2.27481 8.15514L7.81284 2.49814C7.90355 2.40495 8.01139 2.331 8.13017 2.28054C8.24895 2.23008 8.37633 2.2041 8.50497 2.2041C8.63362 2.2041 8.76099 2.23008 8.87978 2.28054C8.99856 2.331 9.1064 2.40495 9.19711 2.49814L14.7351 8.15514C14.9091 8.34459 15.004 8.59572 14.9999 8.85541C14.9957 9.11509 14.8929 9.36294 14.713 9.54653C14.5332 9.73011 14.2905 9.83502 14.0362 9.83905C13.782 9.84308 13.5362 9.74593 13.3509 9.56814L9.48394 5.61814V15.2041C9.48394 15.4694 9.3808 15.7237 9.19721 15.9112C9.01362 16.0988 8.76461 16.2041 8.50497 16.2041C8.24534 16.2041 7.99633 16.0988 7.81274 15.9112C7.62915 15.7237 7.526 15.4694 7.526 15.2041V5.61914Z"
                      fill="black"
                    />
                  </svg>
                </div>
                <div className={styles.headerCell}>
                  <span>Price</span>
                </div>
                <div className={styles.headerCell}>
                  <span>Quantity</span>
                  <svg
                    width="17"
                    height="18"
                    viewBox="0 0 17 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.474 11.7891L13.3409 7.83907C13.5256 7.65691 13.7729 7.55611 14.0295 7.55839C14.2862 7.56067 14.5318 7.66584 14.7133 7.85125C14.8948 8.03666 14.9977 8.28747 15 8.54967C15.0022 8.81186 14.9035 9.06447 14.7252 9.25307L9.18716 14.9101C9.09645 15.0033 8.98861 15.0772 8.86983 15.1277C8.75105 15.1781 8.62367 15.2041 8.49503 15.2041C8.36638 15.2041 8.23901 15.1781 8.12022 15.1277C8.00144 15.0772 7.8936 15.0033 7.80289 14.9101L2.26486 9.25307C2.09094 9.06362 1.996 8.81248 2.00013 8.5528C2.00426 8.29311 2.10713 8.04526 2.28698 7.86168C2.46683 7.67809 2.70954 7.57319 2.96377 7.56915C3.21799 7.56512 3.46378 7.66228 3.64912 7.84007L7.51606 11.7901L7.51606 2.20407C7.51606 1.93885 7.6192 1.6845 7.80279 1.49696C7.98638 1.30942 8.23539 1.20407 8.49503 1.20407C8.75467 1.20407 9.00367 1.30942 9.18726 1.49696C9.37086 1.6845 9.474 1.93885 9.474 2.20407L9.474 11.7891Z"
                      fill="black"
                    />
                  </svg>
                </div>
                <div className={styles.headerCell}>
                  <span>Total Price</span>
                </div>
              </div>

              {isLoading ? (
                <div className={styles.loadingRow}>
                  <div className={styles.loadingText}>Loading products...</div>
                </div>
              ) : products.length === 0 ? (
                <div className={styles.emptyRow}>
                  <div className={styles.emptyText}>No products added yet</div>
                </div>
              ) : (
                products.map((product) => (
                  <div key={product._id} className={styles.tableRow}>
                    <button
                      className={styles.removeProductBtn}
                      title="Remove product"
                      onClick={() => handleRemoveProduct(product._id)}
                      type="button"
                    >
                      ×
                    </button>
                    <div className={styles.cell}>{product.name}</div>
                    <div className={styles.cell}>{product.price}</div>
                    <div className={styles.cell}>{product.quantity}</div>
                    <div className={styles.cell}>INR {product.totalPrice}</div>
                  </div>
                ))
              )}

              <div className={styles.summaryRow}>
                <div className={styles.summaryCell}>Sub-Total</div>
                <div className={styles.summaryValue}>
                  INR {calculateSubTotal().toFixed(1)}
                </div>
              </div>

              <div className={styles.summaryRow}>
                <div className={styles.summaryCell}>Incl + GST 18%</div>
                <div className={styles.summaryValue}>
                  INR {calculateGST().toFixed(1)}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24 }}>
              <AnimatedButton
                onClick={handleGenerateInvoice}
                disabled={isLoading || products.length === 0}
              >
                {isLoading ? "Generating PDF..." : "Generate PDF Invoice"}
              </AnimatedButton>
              {invoiceGenerated && (
                <AnimatedButton onClick={handleNewInvoice}>
                  New Invoice
                </AnimatedButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
