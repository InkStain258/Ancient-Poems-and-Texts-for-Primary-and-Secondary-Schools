import type { NarrativeData } from '@/types';
import EChartsBase from './EChartsBase';

interface NarrativeTimelineProps {
  data: NarrativeData;
  title?: string;
}

export default function NarrativeTimeline({ data, title = '叙事时间线' }: NarrativeTimelineProps) {
  const sortedTimeline = [...data.timeline].sort((a, b) => a.order - b.order);

  const option = {
    title: {
      text: title,
      left: 'center',
      textStyle: { fontSize: 14, fontWeight: 'normal' },
    },
    tooltip: {
      trigger: 'axis' as const,
    },
    grid: { left: '8%', right: '5%', bottom: '20%', top: '15%' },
    xAxis: {
      type: 'category' as const,
      data: sortedTimeline.map((t) => t.event),
      axisLabel: {
        rotate: 30,
        fontSize: 11,
        interval: 0,
      },
    },
    yAxis: {
      type: 'value' as const,
      show: false,
    },
    series: [
      {
        type: 'line' as const,
        data: sortedTimeline.map((t) => t.order),
        smooth: true,
        lineStyle: { color: '#D2691E', width: 3 },
        itemStyle: { color: '#D2691E', borderWidth: 2, borderColor: '#fff' },
        symbolSize: 10,
        label: { show: false },
      },
    ],
  };

  return <EChartsBase option={option} height="260px" />;
}
