import type { LyricalData } from '@/types';
import EChartsBase from './EChartsBase';

interface EmotionCurveProps {
  data: LyricalData;
  title?: string;
}

export default function EmotionCurve({ data, title = '情感曲线' }: EmotionCurveProps) {
  const option = {
    title: {
      text: title,
      left: 'center',
      textStyle: { fontSize: 14, fontWeight: 'normal' },
    },
    tooltip: {
      trigger: 'axis' as const,
      formatter: (params: Array<{ name: string; value: number; seriesName: string; dataIndex: number }>) => {
        if (!params || params.length === 0) return '';
        const p = params[0];
        const curveItem = data.emotionCurve[p.dataIndex];
        return `<strong>${p.name}</strong><br/>${curveItem?.emotion || ''}<br/>情感强度: ${p.value}`;
      },
    },
    grid: { left: '8%', right: '5%', bottom: '20%', top: '15%' },
    xAxis: {
      type: 'category' as const,
      data: data.emotionCurve.map((e) => e.segment),
      axisLabel: {
        rotate: 30,
        fontSize: 11,
        interval: 0,
      },
    },
    yAxis: {
      type: 'value' as const,
      name: '情感强度',
      min: 0,
      max: 10,
    },
    series: [
      {
        type: 'line' as const,
        data: data.emotionCurve.map((e) => e.intensity),
        smooth: true,
        lineStyle: { color: '#8B4513', width: 2 },
        itemStyle: { color: '#8B4513' },
        areaStyle: {
          color: {
            type: 'linear' as const,
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(139,69,19,0.3)' },
              { offset: 1, color: 'rgba(139,69,19,0.05)' },
            ],
          },
        },
        markPoint: {
          data: [{ type: 'max' as const, name: '最强' }, { type: 'min' as const, name: '最弱' }],
        },
      },
    ],
  };

  return <EChartsBase option={option} height="280px" />;
}
