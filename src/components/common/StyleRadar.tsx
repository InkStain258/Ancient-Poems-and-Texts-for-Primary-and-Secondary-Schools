import { useEffect, useRef, useMemo } from 'react';
import * as echarts from 'echarts/core';
import { RadarChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { getStyleScores, STYLE_DIMENSIONS, DIMENSION_LABELS, DIMENSION_COLORS, type StyleScores, type StyleDimension } from '@/lib/styleScorer';
import type { ClassicalWork } from '@/types';

echarts.use([RadarChart, TooltipComponent, LegendComponent, CanvasRenderer]);

interface StyleRadarProps {
  work: ClassicalWork;
  compareWork?: ClassicalWork;
  height?: string;
}

/** 诗词风格雷达图 - ECharts 实现 */
export default function StyleRadar({ work, compareWork, height = '360px' }: StyleRadarProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const scores1 = useMemo(() => getStyleScores(work), [work]);
  const scores2 = useMemo(() => compareWork ? getStyleScores(compareWork) : null, [compareWork]);

  const option = useMemo(() => {
    const indicator = STYLE_DIMENSIONS.map(dim => ({
      name: DIMENSION_LABELS[dim],
      max: 100,
      color: DIMENSION_COLORS[dim],
    }));

    const series: Record<string, unknown>[] = [
      {
        type: 'radar',
        name: work.title,
        data: [{
          value: STYLE_DIMENSIONS.map(dim => scores1[dim]),
          name: `${work.title} · ${work.author}`,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { width: 2, color: DIMENSION_COLORS.豪放 },
          areaStyle: { color: DIMENSION_COLORS.豪放, opacity: 0.2 },
          itemStyle: { color: DIMENSION_COLORS.豪放 },
        }],
      },
    ];

    if (scores2 && compareWork) {
      series[0].data = [
        {
          value: STYLE_DIMENSIONS.map(dim => scores1[dim]),
          name: `${work.title} · ${work.author}`,
          symbol: 'circle',
          symbolSize: 5,
          lineStyle: { width: 2, color: '#f97316' },
          areaStyle: { color: '#f97316', opacity: 0.15 },
          itemStyle: { color: '#f97316' },
        },
        {
          value: STYLE_DIMENSIONS.map(dim => scores2[dim]),
          name: `${compareWork.title} · ${compareWork.author}`,
          symbol: 'diamond',
          symbolSize: 5,
          lineStyle: { width: 2, color: '#60a5fa', type: 'dashed' },
          areaStyle: { color: '#60a5fa', opacity: 0.1 },
          itemStyle: { color: '#60a5fa' },
        },
      ];
    }

    return {
      tooltip: {
        trigger: 'item',
      },
      legend: scores2 ? {
        data: [
          `${work.title} · ${work.author}`,
          `${compareWork!.title} · ${compareWork!.author}`,
        ],
        bottom: 0,
        textStyle: { fontSize: 11 },
      } : undefined,
      radar: {
        indicator,
        shape: 'polygon',
        radius: '65%',
        center: ['50%', '48%'],
        splitNumber: 4,
        axisName: {
          color: '#666',
          fontSize: 12,
          fontWeight: 500,
        },
        splitArea: {
          areaStyle: {
            color: ['rgba(250, 250, 250, 0.3)', 'rgba(240, 240, 240, 0.3)'],
          },
        },
        splitLine: {
          lineStyle: { color: 'rgba(150, 150, 150, 0.2)' },
        },
        axisLine: {
          lineStyle: { color: 'rgba(150, 150, 150, 0.3)' },
        },
      },
      series,
    };
  }, [work, compareWork, scores1, scores2]);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    chartInstance.current.setOption(option, true);

    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [option]);

  // 清理
  useEffect(() => {
    return () => {
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, []);

  return (
    <div ref={chartRef} style={{ width: '100%', height }} />
  );
}

/** 风格标签 — 显示主导风格 */
export function StyleTag({ scores }: { scores: StyleScores }) {
  const dominant = STYLE_DIMENSIONS.reduce((a, b) => scores[a] > scores[b] ? a : b);
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{
        backgroundColor: DIMENSION_COLORS[dominant] + '20',
        color: DIMENSION_COLORS[dominant],
        border: `1px solid ${DIMENSION_COLORS[dominant]}40`,
      }}
    >
      {DIMENSION_LABELS[dominant]}
    </span>
  );
}
