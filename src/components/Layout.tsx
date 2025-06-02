
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, User, Menu } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { state } = useCart();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/shop', label: 'Shop', icon: Search },
    { path: '/cart', label: 'Cart', icon: ShoppingCart },
    { path: '/contact', label: 'Contact', icon: User },
  ];

  const MobileNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-3 text-xs transition-colors ${
                isActive 
                  ? 'text-orange-500' 
                  : 'text-gray-600 hover:text-orange-500'
              }`}
            >
              <div className="relative">
                <Icon size={20} />
                {item.path === '/cart' && state.items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {state.items.length}
                  </span>
                )}
              </div>
              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );

  const DesktopNav = () => (
    <header className="hidden md:block bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-orange-500">
            Yvette Luxe.
          </Link>
          <nav className="flex space-x-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors relative ${
                    isActive 
                      ? 'text-orange-500' 
                      : 'text-gray-700 hover:text-orange-500'
                  }`}
                >
                  {item.label}
                  {item.path === '/cart' && state.items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {state.items.length}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );

  const MobileHeader = () => (
    <header className="md:hidden bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-orange-500">
          Yvette Luxe.
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col space-y-4 mt-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center space-x-3 text-lg font-medium text-gray-700 hover:text-orange-500"
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <DesktopNav />
      <MobileHeader />
      <main className="pb-20 md:pb-0">
        {children}
      </main>
      <MobileNav />
    </div>
  );
};

export default Layout;
