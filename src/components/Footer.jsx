import { Sparkles } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer
      className="fixed inset-x-0 bottom-0 z-50 py-4 text-gray-300 bg-gray-900 border-t border-gray-800"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="px-4 mx-auto max-w-7xl">
        <p className="text-sm tracking-wide text-center">Powered by Botivate</p>
      </div>
    </footer>
  );
};

export default Footer;
