'use client';

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style jsx global>{`
        header { display: none !important; }
      `}</style>
      {children}
    </>
  );
}
