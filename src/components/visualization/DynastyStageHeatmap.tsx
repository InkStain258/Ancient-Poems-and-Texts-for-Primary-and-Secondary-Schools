import EChartsBase from './EChartsBase';
import { getDynastyStageHeatmapOption } from '@/services/StatsService';

export default function DynastyStageHeatmap() {
  const option = getDynastyStageHeatmapOption();
  return <EChartsBase option={option} height="350px" />;
}
