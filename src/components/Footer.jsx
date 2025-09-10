import { Sparkles } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="px-4 py-6 border-t backdrop-blur-md bg-white/70">
      <div className="flex flex-col gap-2 justify-between items-center mx-auto max-w-7xl sm:flex-row">
      
        <div className="inline-flex gap-2 items-center text-sm font-medium text-gray-700 transition hover:text-amber-600 hover-lift">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Powered by Botivate</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
