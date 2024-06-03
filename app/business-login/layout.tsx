import "../../app/globals.css";

export const metadata: Metadata = {
  title: "Business Login",
  description: "Login page for businesses",
};

type Metadata = {
  title: string;
  description: string;
};

export default function BusinessLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>{children}</body>
    </html>
  );
}
