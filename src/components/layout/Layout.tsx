import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import MobileNav from './MobileNav';
import AIFloatingBall from '../common/AIFloatingBall';
import ScrollToTop from './ScrollToTop';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
      <AIFloatingBall />
    </div>
  );
}
