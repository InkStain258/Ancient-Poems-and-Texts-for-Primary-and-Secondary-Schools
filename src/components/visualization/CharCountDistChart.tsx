import EChartsBase from './EChartsBase';
import { getCharCountDistributionOption } from '@/services/StatsService';

export default function CharCountDistChart() {
  const option = getCharCountDistributionOption();
  return <EChartsBase option={option} height="300px" />;
}
