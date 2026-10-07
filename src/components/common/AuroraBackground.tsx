/**
 * AuroraBackground — 全局极光氛围层
 *
 * 固定于视口底层（z-index: -1），由 3 个缓慢漂移的模糊光球 +
 * 细噪点构成。深色模式下呈现"冷墨夜空"氛围，亮色下为极淡晕染。
 * 纯 CSS 驱动，尊重 prefers-reduced-motion。
 */
export default function AuroraBackground() {
  return (
    <div aria-hidden="true" className="aurora-layer">
      <div className="aurora-orb aurora-orb-1" />
      <div className="aurora-orb aurora-orb-2" />
      <div className="aurora-orb aurora-orb-3" />
      <div className="aurora-ribbon aurora-ribbon-1" />
      <div className="aurora-ribbon aurora-ribbon-2" />
      <div className="aurora-noise" />
    </div>
  );
}
