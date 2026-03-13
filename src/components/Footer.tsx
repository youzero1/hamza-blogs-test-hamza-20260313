export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">NextBlog</h3>
            <p className="text-sm">
              A modern blog built with Next.js 14, TypeScript, and SQLite.
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/categories/technology"
                  className="hover:text-white transition-colors"
                >
                  Technology
                </a>
              </li>
              <li>
                <a
                  href="/categories/lifestyle"
                  className="hover:text-white transition-colors"
                >
                  Lifestyle
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Admin</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/admin" className="hover:text-white transition-colors">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} NextBlog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
