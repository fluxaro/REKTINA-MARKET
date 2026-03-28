import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiMail, FiPhone, FiMapPin, FiTrendingUp, FiArrowRight } from 'react-icons/fi';

const FOOTER_LINKS = [
  {
    title: 'Shop',
    links: [
      ['All Products', '/products'],
      ['Electronics', '/products?category=Electronics'],
      ['Fashion', '/products?category=Fashion'],
      ['Home & Garden', '/products?category=Home+%26+Garden'],
      ['Sports', '/products?category=Sports'],
    ],
  },
  {
    title: 'Sellers',
    links: [
      ['Browse Sellers', '/sellers'],
      ['Become a Seller', '/register'],
      ['Seller Dashboard', '/seller'],
      ['Seller Guidelines', '#'],
    ],
  },
  {
    title: 'Account',
    links: [
      ['Sign In', '/login'],
      ['Register', '/register'],
      ['My Orders', '/orders'],
      ['Profile', '/profile'],
      ['Messages', '/messages'],
    ],
  },
  {
    title: 'Support',
    links: [
      ['Help Center', '#'],
      ['Contact Us', '#'],
      ['Returns Policy', '#'],
      ['Track Order', '/orders'],
      ['Privacy Policy', '#'],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      {/* Newsletter strip */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-bold text-lg text-white">Stay in the loop</p>
            <p className="text-gray-400 text-sm mt-0.5">Get deals, new arrivals and exclusive offers.</p>
          </div>
          <form className="flex gap-2 w-full md:w-auto" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 md:w-64 px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-colors"
            />
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold flex items-center gap-2 transition-colors shrink-0">
              Subscribe <FiArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          {/* Brand col */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                <FiTrendingUp size={18} className="text-white" />
              </div>
              <div>
                <span className="font-black text-white text-lg tracking-tight">REKTINA</span>
                <span className="font-black text-blue-400 text-lg tracking-tight"> MARKET</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
              Nigeria's most trusted multi-vendor marketplace. Shop from thousands of verified sellers with confidence and speed.
            </p>
            <div className="flex gap-2.5">
              {[
                [FiInstagram, 'https://instagram.com'],
                [FiTwitter, 'https://twitter.com'],
                [FiFacebook, 'https://facebook.com'],
              ].map(([Icon, href], i) => (
                <a key={i} href={href} target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map(({ title, links }) => (
            <div key={title}>
              <h4 className="font-semibold text-sm text-white mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="text-sm text-gray-400 hover:text-blue-400 transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
            <span className="flex items-center gap-2"><FiMail size={13} /> support@rektinamarket.com</span>
            <span className="flex items-center gap-2"><FiPhone size={13} /> +234 800 000 0000</span>
            <span className="flex items-center gap-2"><FiMapPin size={13} /> Lagos, Nigeria</span>
          </div>
          <p className="text-xs text-gray-600">© 2026 Rektina Market. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
