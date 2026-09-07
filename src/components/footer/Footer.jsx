const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-between gap-2 border-t border-gray-100 bg-white px-6 py-4 sm:flex-row">
      <p className="text-xs text-gray-400">
        © {new Date().getFullYear()} Palestinian Forum Malaysia. All Rights Reserved.
      </p>
      <p className="text-xs font-medium text-green">
        Standing with Palestine 🇵🇸
      </p>
    </footer>
  );
};

export default Footer;
