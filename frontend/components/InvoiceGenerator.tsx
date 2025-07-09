import styles from "./InvoiceGenerator.module.css";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

interface InvoiceGeneratorProps {
  products: Product[];
  onBack: () => void;
}

export default function InvoiceGenerator({
  products,
  onBack,
}: InvoiceGeneratorProps) {
  const calculateSubTotal = () => {
    return products.reduce((sum, product) => sum + product.totalPrice, 0);
  };

  const calculateGST = () => {
    return calculateSubTotal() * 0.18;
  };

  const calculateTotal = () => {
    return calculateSubTotal() + calculateGST();
  };

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  return (
    <div className={styles.invoiceContainer}>
      <button onClick={onBack} className={styles.backButton}>
        ← Back to Products
      </button>

      <div className={styles.invoice}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logo}>
            <svg
              width="36"
              height="37"
              viewBox="0 0 36 37"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M35.3116 18.459L26.7101 36.1148H22.6357H8.87666L5.00735 28.4187L0 18.459L8.60155 0.803223H12.676H26.7101L30.4595 8.49934L35.3116 18.459Z"
                fill="black"
              />
              <path
                d="M22.6353 28.4165L27.6152 18.4568L22.6353 8.49713L30.7842 18.4568L22.6353 28.4165Z"
                fill="white"
              />
              <path
                d="M11.3175 10.3094L12.6756 8.49854L7.69577 18.4582L12.6756 28.4179L4.97949 18.4582L11.3175 10.3094Z"
                fill="white"
              />
            </svg>
            <div className={styles.logoText}>
              <div className={styles.companyName}>Levitation</div>
              <div className={styles.companySubtitle}>Infotech</div>
            </div>
          </div>

          <div className={styles.invoiceTitle}>
            <h1>INVOICE GENERATOR</h1>
            <p>Sample Output should be this</p>
          </div>
        </div>

        {/* Divider */}
        <div className={styles.divider}></div>

        {/* Customer Info Section */}
        <div className={styles.customerSection}>
          <div className={styles.customerInfo}>
            <div className={styles.customerLabel}>Name</div>
            <div className={styles.customerName}>Person_name</div>
          </div>
          <div className={styles.customerDate}>Date : {getCurrentDate()}</div>
          <div className={styles.customerEmail}>example@email.com</div>
        </div>

        {/* Products Table */}
        <div className={styles.productsTable}>
          <div className={styles.tableHeader}>
            <div className={styles.tableHeaderCell}>Product</div>
            <div className={styles.tableHeaderCell}>Qty</div>
            <div className={styles.tableHeaderCell}>Rate</div>
            <div className={styles.tableHeaderCell}>Total Amount</div>
          </div>

          {products.map((product, index) => (
            <div
              key={product.id}
              className={
                index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
              }
            >
              <div className={styles.tableCell}>{product.name}</div>
              <div className={styles.tableCell}>{product.quantity}</div>
              <div className={styles.tableCell}>{product.price}</div>
              <div className={styles.tableCell}>USD {product.totalPrice}</div>
            </div>
          ))}
        </div>

        {/* Date */}
        <div className={styles.invoiceDate}>
          <span>Date: {getCurrentDate()}</span>
        </div>

        {/* Total Section */}
        <div className={styles.totalSection}>
          <div className={styles.totalRow}>
            <span>Total Charges</span>
            <span>${calculateSubTotal()}</span>
          </div>
          <div className={styles.totalRow}>
            <span>GST (18%)</span>
            <span>${calculateGST().toFixed(2)}</span>
          </div>
          <div className={styles.totalRowFinal}>
            <span>Total Amount</span>
            <span>₹ {calculateTotal().toFixed(0)}</span>
          </div>
        </div>

        {/* Footer Message */}
        <div className={styles.footer}>
          <p>
            We are pleased to provide any further information you may require
            and look forward to assisting with your next order. Rest assured, it
            will receive our prompt and dedicated attention.
          </p>
        </div>
      </div>
    </div>
  );
}
