function Footer() {
  return (
    <footer className="bg-brand-dark text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold text-brand-primary mb-2">Savora</h3>
          <p className="text-brand-dark-400 text-sm">
            Delicious local and continental meals, delivered fresh to your doorstep.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="text-brand-dark-400 text-sm space-y-1">
            <li>Home</li>
            <li>Menu</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <p className="text-brand-dark-400 text-sm">hello@savora.com</p>
          <p className="text-brand-dark-400 text-sm">+234 813 027 5477</p>
        </div>
      </div>

      <div className="text-center text-brand-dark-300 text-xs py-4 border-t border-brand-dark-100">
        © {new Date().getFullYear()} Savora. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
