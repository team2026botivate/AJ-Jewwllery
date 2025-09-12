import { Sparkles } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="fixed bottom-0 inset-x-0 z-50 py-4 bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-sm tracking-wide">
          Powered by Botivate
        </p>
      </div>
    </footer>
  );
};

export default Footer;
