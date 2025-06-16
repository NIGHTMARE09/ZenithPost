// frontend/src/components/Footer.tsx
const Footer = () => {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-slate-600 text-sm">
        <p>&copy; {new Date().getFullYear()} ZenithPost. All rights reserved.</p> 
        <p className="mt-1">
          Built with React, TypeScript, Tailwind CSS, and lots of ☕.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
