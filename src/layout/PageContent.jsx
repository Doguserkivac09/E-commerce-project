function PageContent({ children }) {
  return (
    <main className="flex-1">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        {children}
      </div>
    </main>
  );
}

export default PageContent;

