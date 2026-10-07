import EChartsBase from './EChartsBase';
import { getGenreDistributionOption } from '@/services/StatsService';

export default function GenreDistChart() {
  const option = getGenreDistributionOption();
  return <EChartsBase option={option} height="300px" />;
}
