import EChartsBase from './EChartsBase';
import { getDynastyDistributionOption } from '@/services/StatsService';

export default function DynastyDistChart() {
  const option = getDynastyDistributionOption();
  return <EChartsBase option={option} height="300px" />;
}
