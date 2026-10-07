import EChartsBase from './EChartsBase';
import { getThemeDistributionOption } from '@/services/StatsService';

export default function ThemeDistChart() {
  const option = getThemeDistributionOption();
  return <EChartsBase option={option} height="350px" />;
}
