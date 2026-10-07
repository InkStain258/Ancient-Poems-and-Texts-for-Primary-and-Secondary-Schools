import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import MobileNav from './MobileNav';
import AIFloatingBall from '../common/AIFloatingBall';
import AuroraBackground from '../common/AuroraBackground';
import ScrollToTop from './ScrollToTop';

export default function Layout() {
  const location = useLocation();
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <AuroraBackground />
      <Header />
      <main key={location.pathname} className="page-shell flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
      <AIFloatingBall />
    </div>
  );
}
