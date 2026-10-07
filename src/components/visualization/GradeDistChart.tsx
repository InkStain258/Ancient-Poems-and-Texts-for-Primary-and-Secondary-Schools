import EChartsBase from './EChartsBase';
import { getGradeDistributionOption } from '@/services/StatsService';

export default function GradeDistChart() {
  const option = getGradeDistributionOption();
  return <EChartsBase option={option} height="300px" />;
}
