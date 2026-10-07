import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts/core';
import { MapChart, EffectScatterChart, LinesChart, ScatterChart } from 'echarts/charts';
import {
  GeoComponent,
  TooltipComponent,
  VisualMapComponent,
  TitleComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { useThemeStore } from '@/stores/useThemeStore';
import { AUTHOR_JOURNEYS, getCityCoordinates, type AuthorJourney } from '@/services/GeoService';
import chinaGeoJson from '@/data/chinaGeo.json';

echarts.use([
  MapChart,
  EffectScatterChart,
  LinesChart,
  ScatterChart,
  GeoComponent,
  TooltipComponent,
  VisualMapComponent,
  TitleComponent,
  LegendComponent,
  CanvasRenderer,
]);

// Register map immediately (no async fetch needed)
echarts.registerMap('china', chinaGeoJson as Parameters<typeof echarts.registerMap>[1]);

interface AuthorJourneyMapProps {
  /** Height of the chart */
  height?: string;
  /** Specific author name to show, if omitted shows all */
  author?: string;
}

export default function AuthorJourneyMap({ height = '500px', author }: AuthorJourneyMapProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);
  const { effectiveTheme } = useThemeStore();

  // Build and render chart
  useEffect(() => {
    if (!chartRef.current) return;

    const isDark = effectiveTheme === 'dark';

    // Dispose previous instance
    if (instanceRef.current) {
      instanceRef.current.dispose();
      instanceRef.current = null;
    }

    const chart = echarts.init(chartRef.current, isDark ? 'bbc-dark' : 'bbc-light');
    instanceRef.current = chart;

    // Filter journeys
    const journeys = author
      ? AUTHOR_JOURNEYS.filter(j => j.author === author)
      : AUTHOR_JOURNEYS;

    // Get all unique cities with their coordinates
    const allCities = getCityCoordinates();

    // 城市到访统计 → 节点分级与枢纽识别
    const cityVisitCount: Record<string, number> = {};
    journeys.forEach((j) =>
      j.route.forEach((r) => {
        if (r && r.name) cityVisitCount[r.name] = (cityVisitCount[r.name] || 0) + 1;
      })
    );
    // 枢纽城市：路线端点 或 ≥2 位作者到访
    const hubCities = new Set<string>();
    journeys.forEach((j) => {
      if (j.route[0]?.name) hubCities.add(j.route[0].name);
      const last = j.route[j.route.length - 1];
      if (last?.name) hubCities.add(last.name);
      j.route.forEach((r) => {
        if (r && r.name && (cityVisitCount[r.name] || 0) >= 2) hubCities.add(r.name);
      });
    });

    // Color palette for different authors
    const authorColors = [
      '#e74c3c', '#2ecc71', '#3498db', '#f39c12',
      '#9b59b6', '#1abc9c', '#e67e22', '#e84393',
    ];

    // Build lines series for each author's journey
    const linesSeries: Record<string, unknown>[] = [];
    const scatterSeries: Record<string, unknown>[] = [];

    journeys.forEach((journey, idx) => {
      const color = authorColors[idx % authorColors.length];

      // Build route lines (with safety check for each city)
      const routeData: Record<string, unknown>[] = [];
      for (let i = 0; i < journey.route.length - 1; i++) {
        const from = journey.route[i];
        const to = journey.route[i + 1];
        if (!from || !to || !from.name || !to.name) continue;
        routeData.push({
          fromName: from.name,
          toName: to.name,
          coords: [
            [from.lng, from.lat],
            [to.lng, to.lat],
          ],
        });
      }

      linesSeries.push({
        type: 'lines',
        name: journey.author,
        coordinateSystem: 'geo',
        zlevel: 2,
        effect: {
          show: true,
          period: 4 + idx,
          trailLength: 0.4,
          symbol: 'arrow',
          symbolSize: 6,
          color,
        },
        lineStyle: {
          color,
          width: 1.5,
          opacity: 0.6,
          curveness: 0.2 + idx * 0.05,
        },
        data: routeData,
      });

      // Build route point scatter for this author (with safety check)
      // 节点分级：到访作者越多 / 行迹站位越靠前，圆点越大
      const authorCities = journey.route
        .filter(city => city && city.name)
        .map((city, i) => ({
          name: city.name,
          value: [city.lng, city.lat],
          author: journey.author,
          order: i + 1,
          symbolSize: 8 + (cityVisitCount[city.name] || 1) * 2,
        }));

      scatterSeries.push({
        type: 'scatter',
        name: journey.author,
        coordinateSystem: 'geo',
        zlevel: 3,
        symbol: 'circle',
        symbolSize: 10,
        itemStyle: {
          color,
          borderColor: '#fff',
          borderWidth: 1.5,
          shadowBlur: 6,
          shadowColor: `${color}66`,
        },
        label: {
          show: true,
          formatter: '{b}',
          position: 'right',
          color: isDark ? '#ddd' : '#333',
          fontSize: 11,
        },
        data: authorCities,
      });
    });

    // 枢纽城市（路线端点或 ≥2 位作者到访）→ 涟漪呼吸动画
    const hubPoints = allCities
      .filter(c => hubCities.has(c.name))
      .map(c => ({ name: c.name, value: c.value }));

    // All cities as background markers
    const journeyCityNames = new Set<string>();
    journeys.forEach(j => j.route.forEach(r => { if (r && r.name) journeyCityNames.add(r.name); }));
    const bgCities = allCities.filter(c => !journeyCityNames.has(c.name));

    const option = {
      backgroundColor: 'transparent',
      title: {
        text: author ? `${author}行迹图` : '文学行迹图',
        subtext: author
          ? (AUTHOR_JOURNEYS.find(j => j.author === author)?.description ?? '')
          : '古人行迹 · 诗词地理',
        left: 'center',
        top: 10,
        textStyle: {
          fontSize: 16,
          color: isDark ? '#ddd' : '#333',
        },
        subtextStyle: {
          fontSize: 12,
          color: isDark ? '#999' : '#666',
          width: '60%',
          overflow: 'break',
        },
      },
      // 作者图例：点击可显隐对应行迹
      legend: {
        data: journeys.map(j => j.author),
        bottom: 8,
        type: 'scroll',
        textStyle: { color: isDark ? '#ccc' : '#555', fontSize: 12 },
        itemWidth: 14,
        itemHeight: 10,
        icon: 'roundRect',
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: isDark ? 'rgba(20,20,30,0.9)' : 'rgba(255,255,255,0.95)',
        borderColor: isDark ? '#333' : '#eee',
        textStyle: { color: isDark ? '#ddd' : '#333' },
        formatter: (params: Record<string, unknown>) => {
          const d = params.data as
            | { fromName?: string; toName?: string; author?: string; order?: number }
            | undefined;
          if (!d) return '';
          if (params.seriesType === 'lines') {
            return `<b>${d.fromName} → ${d.toName}</b><br/><span style="color:${isDark ? '#aaa' : '#888'}">${params.seriesName ?? ''} 行迹</span>`;
          }
          const cityInfo = allCities.find(c => c.name === params.name);
          const station = d.author
            ? `<br/><span style="color:${isDark ? '#aaa' : '#888'}">${d.author} 行迹第 ${d.order} 站</span>`
            : '';
          return cityInfo
            ? `<b>${cityInfo.name}</b>${cityInfo.desc ? '<br/>' + cityInfo.desc : ''}${station}`
            : params.name;
        },
      },
      geo: {
        map: 'china',
        roam: true,
        zoom: 1.2,
        center: [107, 34],
        label: { show: false },
        itemStyle: {
          areaColor: isDark ? '#101625' : '#f2ecdd',
          borderColor: isDark ? 'rgba(148,163,184,0.22)' : '#c9b99a',
          borderWidth: 0.8,
          shadowColor: isDark ? 'rgba(0,0,0,0.45)' : 'rgba(180,160,120,0.35)',
          shadowBlur: 8,
        },
        emphasis: {
          itemStyle: {
            areaColor: isDark ? '#1c2740' : '#ede5d5',
          },
          label: {
            show: true,
            color: isDark ? '#ccc' : '#666',
            fontSize: 10,
          },
        },
        regions: [
          {
            name: '南海诸岛',
            itemStyle: { opacity: 0.3 },
          },
        ],
      },
      series: [
        // Background cities (not on current routes)
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          zlevel: 1,
          symbol: 'diamond',
          symbolSize: 5,
          itemStyle: {
            color: isDark ? '#555' : '#bbb',
          },
          label: { show: false },
          data: bgCities.map(c => ({
            name: c.name,
            value: c.value,
          })),
        },
        // 枢纽城市涟漪层
        {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          zlevel: 4,
          symbolSize: 12,
          rippleEffect: { brushType: 'stroke' as const, scale: 2.6, period: 4 },
          itemStyle: {
            color: isDark ? '#fbbf24' : '#d97706',
            shadowBlur: 10,
            shadowColor: 'rgba(251,191,36,0.5)',
          },
          label: {
            show: true,
            formatter: '{b}',
            position: 'top',
            fontSize: 11,
            fontWeight: 'bold' as const,
            color: isDark ? '#fde68a' : '#92400e',
          },
          data: hubPoints,
        },
        ...linesSeries,
        ...scatterSeries,
      ],
    };

    chart.setOption(option, true);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
      instanceRef.current = null;
    };
  }, [effectiveTheme, author]);

  return <div ref={chartRef} style={{ height, width: '100%', minHeight: height }} />;
}
