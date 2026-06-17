import { useState } from 'react';
import { FiX, FiMenu } from 'react-icons/fi';
import Logo from '../ui/Logo';

export default function DashboardLayout({
  portalLabel,
  portalAccent = 'text-blue-400',
  navItems,
  activeTab,
  onTabChange,
  title,
  subtitle,
  headerActions,
  banner,
  sidebarCollapsed,
  onToggleSidebar,
  children,
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const SidebarContent = ({ mobile = false }) => (
    <>
      {/* Logo / portal header */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800 shrink-0">
        {mobile ? (
          <div className="flex items-center justify-between w-full">
            <div>
              <Logo to="/" size="sm" variant="light" />
              <p className={`text-[10px] font-semibold uppercase tracking-widest mt-1.5 ${portalAccent}`}>{portalLabel}</p>
            </div>
            <button onClick={() => setMobileSidebarOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
              <FiX size={18} />
            </button>
          </div>
        ) : sidebarCollapsed ? (
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center mx-auto">
            <span className="text-white text-xs font-bold">R</span>
          </div>
        ) : (
          <div className="min-w-0">
            <Logo to="/" size="sm" variant="light" />
            <p className={`text-[10px] font-semibold uppercase tracking-widest mt-1.5 ${portalAccent}`}>{portalLabel}</p>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => { onTabChange(item.id); setMobileSidebarOpen(false); }}
              title={!mobile && sidebarCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon size={16} className="shrink-0" />
              {(mobile || !sidebarCollapsed) && (
                <>
                  <span className="truncate flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-semibold shrink-0">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle — desktop only */}
      {!mobile && (
        <div className="px-2 pb-4 shrink-0">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800 transition-colors text-xs font-medium"
          >
            {sidebarCollapsed ? '→' : '← Collapse'}
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* ── Mobile sidebar overlay ── */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="relative w-64 bg-slate-900 flex flex-col h-full z-10 animate-slide-in-left">
            <SidebarContent mobile />
          </aside>
        </div>
      )}

      {/* ── Desktop sidebar ── */}
      <aside
        className={`hidden lg:flex ${sidebarCollapsed ? 'w-[68px]' : 'w-56'} shrink-0 bg-slate-900 flex-col transition-all duration-200 sticky top-0 h-screen z-20`}
      >
        <SidebarContent />
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-3.5 flex items-center justify-between gap-3 sticky top-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 -ml-1 rounded-lg text-gray-500 hover:bg-gray-50 shrink-0"
              aria-label="Open menu"
            >
              <FiMenu size={20} />
            </button>
            <div className="min-w-0">
              <h1 className="text-base md:text-lg font-semibold text-gray-900 capitalize tracking-tight truncate">{title}</h1>
              {subtitle && <p className="text-xs text-gray-500 mt-0.5 hidden sm:block truncate">{subtitle}</p>}
            </div>
          </div>
          {headerActions && (
            <div className="flex items-center gap-2 flex-wrap shrink-0">{headerActions}</div>
          )}
        </header>

        {banner}

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
