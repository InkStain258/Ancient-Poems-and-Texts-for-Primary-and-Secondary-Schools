import * as echarts from 'echarts/core';
import { BarChart, LineChart, GraphChart, PieChart, RadarChart, HeatmapChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { useEffect, useRef, useCallback } from 'react';
import { useThemeStore } from '@/stores/useThemeStore';

echarts.use([
  BarChart,
  LineChart,
  GraphChart,
  PieChart,
  RadarChart,
  HeatmapChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
  CanvasRenderer,
]);

/* ─── 极光图表主题（与全站玻璃拟态 × 极光视觉统一） ─── */
const AURORA_LIGHT = [
  '#c2410c', '#0e7490', '#7c3aed', '#b45309',
  '#0f766e', '#be185d', '#4d7c0f', '#1d4ed8',
];
const AURORA_DARK = [
  '#fb923c', '#22d3ee', '#a78bfa', '#fbbf24',
  '#2dd4bf', '#f472b6', '#a3e635', '#60a5fa',
];

echarts.registerTheme('bbc-light', {
  color: AURORA_LIGHT,
  backgroundColor: 'transparent',
  textStyle: { fontFamily: '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif' },
  legend: { textStyle: { color: '#57534e' } },
});

echarts.registerTheme('bbc-dark', {
  color: AURORA_DARK,
  backgroundColor: 'transparent',
  textStyle: { fontFamily: '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif' },
  legend: { textStyle: { color: '#a8a29e' } },
  categoryAxis: {
    axisLine: { lineStyle: { color: '#3f3f46' } },
    axisLabel: { color: '#a8a29e' },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
  },
  valueAxis: {
    axisLine: { lineStyle: { color: '#3f3f46' } },
    axisLabel: { color: '#a8a29e' },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
  },
});

interface EChartsBaseProps {
  option: Record<string, unknown>;
  height?: string;
  className?: string;
}

export default function EChartsBase({ option, height = '300px', className }: EChartsBaseProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);
  const { effectiveTheme } = useThemeStore();

  const getEchartsTheme = useCallback(() => {
    return effectiveTheme === 'dark' ? 'bbc-dark' : 'bbc-light';
  }, [effectiveTheme]);

  useEffect(() => {
    if (!chartRef.current) return;

    // Ensure container has non-zero dimensions
    const rect = chartRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      // Container not yet laid out, retry on next frame
      const raf = requestAnimationFrame(() => {
        if (!chartRef.current) return;
        if (!instanceRef.current) {
          const echartsTheme = getEchartsTheme();
          instanceRef.current = echarts.init(chartRef.current, echartsTheme);
        }
        instanceRef.current.setOption(option, true);
      });
      return () => cancelAnimationFrame(raf);
    }

    if (!instanceRef.current) {
      const echartsTheme = getEchartsTheme();
      instanceRef.current = echarts.init(chartRef.current, echartsTheme);
    }

    instanceRef.current.setOption(option, true);

    return () => {
      // Don't dispose on option change, only on unmount
    };
  }, [option, getEchartsTheme]);

  // Handle theme change: dispose and re-create
  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.dispose();
      instanceRef.current = null;
    }
    if (chartRef.current) {
      const echartsTheme = getEchartsTheme();
      const rect = chartRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        instanceRef.current = echarts.init(chartRef.current, echartsTheme);
        instanceRef.current.setOption(option, true);
      }
    }
  }, [effectiveTheme]);

  useEffect(() => {
    const handleResize = () => {
      instanceRef.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      instanceRef.current?.dispose();
      instanceRef.current = null;
    };
  }, []);

  return (
    <div
      ref={chartRef}
      style={{ height, width: '100%', minHeight: height }}
      className={className}
    />
  );
}
