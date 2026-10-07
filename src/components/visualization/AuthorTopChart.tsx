import EChartsBase from './EChartsBase';
import { getAuthorTopOption } from '@/services/StatsService';

export default function AuthorTopChart() {
  const option = getAuthorTopOption(10);
  return <EChartsBase option={option} height="350px" />;
}
