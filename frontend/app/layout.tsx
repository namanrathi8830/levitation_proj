import "../styles/globals.css";
import PageTransitionWrapper from "../components/PageTransitionWrapper";

export const metadata = {
  title: "Levitation InfoTech - Assignment",
  description: "Invoice generator and product management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Pretendard:wght@300;400;500;600;700&family=Mukta:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Rubik:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <PageTransitionWrapper>{children}</PageTransitionWrapper>
      </body>
    </html>
  );
}
