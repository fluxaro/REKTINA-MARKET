import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import Logo from '../ui/Logo';

const FOOTER_LINKS = [
  {
    title: 'Shop',
    links: [['Products', '/products'], ['Sellers', '/sellers'], ['Cart', '/cart']],
  },
  {
    title: 'Account',
    links: [['Sign in', '/login'], ['Register', '/register'], ['Orders', '/orders'], ['Profile', '/profile']],
  },
  {
    title: 'Company',
    links: [['About', '/about'], ['Subscription', '/subscription'], ['Referrals', '/referrals']],
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Logo to="/" variant="light" size="sm" className="mb-4" />
            <p className="text-sm text-slate-400 leading-relaxed">
              Nigeria's trusted campus marketplace with UVEA escrow protection.
            </p>
          </div>
          {FOOTER_LINKS.map(({ title, links }) => (
            <div key={title}>
              <h4 className="font-semibold text-sm text-white mb-3">{title}</h4>
              <ul className="space-y-2">
                {links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="text-sm text-slate-400 hover:text-blue-400 transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">© 2026 REKTINA Market. All rights reserved.</p>
          <Link to="/about" className="text-xs text-slate-400 hover:text-blue-400 flex items-center gap-1 transition-colors">
            Learn about UVEA <FiArrowRight size={12} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
