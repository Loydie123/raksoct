import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import { ROUTES, APP_CONFIG } from '../constants';

const NAV_ITEMS = [
  { path: ROUTES.STUDENTS, label: 'Students', adminOnly: false },
  { path: ROUTES.SERVICE_REQUESTS, label: 'Service Requests', adminOnly: false },
  { path: ROUTES.IMPORT, label: 'Import', adminOnly: true },
];

export default function MainLayout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const isActiveRoute = (path: string) => location.pathname === path;

  const visibleNavItems = NAV_ITEMS.filter(
    (item) => !item.adminOnly || (item.adminOnly && isAdmin)
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-blue-600">
                  {APP_CONFIG.APP_NAME}
                </h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {visibleNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActiveRoute(item.path)
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <div className="mr-4 text-right">
                <span className="text-sm font-medium text-gray-700">
                  {user?.name}
                </span>
                <span className="block text-xs text-gray-500 capitalize">
                  {user?.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
