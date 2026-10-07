import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop — 路由切换时自动将页面滚动到顶部
 *
 * 由于本项目使用 createHashRouter，无法使用 React Router 内置的 ScrollRestoration。
 * 此组件监听 location 变化，每次路由跳转后自动 window.scrollTo(0, 0)。
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
