/**
 * Author Journey / Literary Geography data service
 *
 * Provides geographic coordinates for ancient Chinese cities
 * and author journey routes for visualization.
 *
 * Coordinates are approximate modern equivalents of ancient city locations.
 */

export interface GeoCity {
  name: string;
  /** Ancient name if different */
  ancientName?: string;
  /** Latitude */
  lat: number;
  /** Longitude */
  lng: number;
  /** Brief description */
  desc?: string;
}

export interface AuthorJourney {
  author: string;
  dynasty: string;
  /** Ordered list of cities the author visited/lived in */
  route: GeoCity[];
  /** Brief description of the journey */
  description: string;
  /** Related work IDs */
  relatedWorks: string[];
}

/**
 * Key ancient Chinese cities with verified modern coordinates.
 * These correspond to major literary centers in Chinese history.
 */
export const ANCIENT_CITIES: Record<string, GeoCity> = {
  长安: { name: '长安', ancientName: '西安', lat: 34.26, lng: 108.94, desc: '唐都，万国来朝的大都会' },
  洛阳: { name: '洛阳', lat: 34.62, lng: 112.45, desc: '十三朝古都，东汉/魏晋政治中心' },
  开封: { name: '开封', ancientName: '汴京/东京', lat: 34.80, lng: 114.35, desc: '北宋都城，《清明上河图》原型' },
  临安: { name: '临安', ancientName: '杭州', lat: 30.27, lng: 120.15, desc: '南宋都城，西湖诗词胜地' },
  建康: { name: '建康', ancientName: '南京', lat: 32.06, lng: 118.80, desc: '六朝古都，南唐/明初政治中心' },
  成都: { name: '成都', lat: 30.57, lng: 104.07, desc: '蜀地中心，天府之国' },
  江陵: { name: '江陵', ancientName: '荆州', lat: 30.35, lng: 112.24, desc: '楚文化中心，长江重镇' },
  黄州: { name: '黄州', ancientName: '黄冈', lat: 30.45, lng: 114.87, desc: '苏轼贬谪之地' },
  苏州: { name: '苏州', lat: 31.30, lng: 120.62, desc: '江南水乡，文人荟萃' },
  扬州: { name: '扬州', lat: 32.39, lng: 119.42, desc: '隋唐繁华之地，烟花三月' },
  浔阳: { name: '浔阳', ancientName: '九江', lat: 29.71, lng: 116.00, desc: '白居易《琵琶行》诞生地' },
  奉节: { name: '奉节', ancientName: '白帝城', lat: 31.02, lng: 109.47, desc: '李白朝辞白帝城所在地' },
  岳阳: { name: '岳阳', lat: 29.36, lng: 113.13, desc: '洞庭湖畔，范仲淹《岳阳楼记》' },
  宣城: { name: '宣城', lat: 30.95, lng: 118.76, desc: '李白多次游历之地' },
  彭泽: { name: '彭泽', lat: 29.90, lng: 116.55, desc: '陶渊明彭泽县令所在地' },
  九原: { name: '九原', ancientName: '包头', lat: 40.66, lng: 109.84, desc: '北方边塞要地' },
  武威: { name: '武威', ancientName: '凉州', lat: 37.93, lng: 102.64, desc: '河西走廊重镇，凉州词故乡' },
  敦煌: { name: '敦煌', lat: 40.14, lng: 94.66, desc: '丝绸之路要冲，大漠孤烟' },
  阳关: { name: '阳关', lat: 40.10, lng: 94.16, desc: '西出阳关无故人' },
  稽山: { name: '会稽', ancientName: '绍兴', lat: 30.00, lng: 120.58, desc: '会稽山，兰亭集序所在' },
  滁州: { name: '滁州', lat: 32.30, lng: 118.32, desc: '欧阳修《醉翁亭记》所在' },
  潮州: { name: '潮州', lat: 23.66, lng: 116.62, desc: '韩愈贬谪之地' },
  密州: { name: '密州', ancientName: '诸城', lat: 35.60, lng: 119.41, desc: '苏轼《江城子》作于此' },
  徐州: { name: '徐州', ancientName: '彭城', lat: 34.26, lng: 117.18, desc: '项羽故都，苏轼曾任知州' },
  黄鹤楼: { name: '黄鹤楼', ancientName: '武汉', lat: 30.54, lng: 114.30, desc: '崔颢题诗、李白搁笔之地' },
  永州: { name: '永州', lat: 26.42, lng: 111.61, desc: '柳宗元贬谪之地，《永州八记》' },
  柳州: { name: '柳州', lat: 24.33, lng: 109.41, desc: '柳宗元终老之地' },
  夔州: { name: '夔州', ancientName: '奉节', lat: 31.02, lng: 109.47, desc: '杜甫寓居之地，秋兴八首' },
  长沙: { name: '长沙', lat: 28.23, lng: 112.94, desc: '屈原、贾谊流放之地' },
  曲阜: { name: '曲阜', lat: 35.58, lng: 117.02, desc: '孔子故里，儒学圣地' },
  殷墟: { name: '殷墟', ancientName: '安阳', lat: 36.10, lng: 114.35, desc: '商代晚期都城遗址' },
  邺城: { name: '邺城', ancientName: '临漳', lat: 36.23, lng: 114.35, desc: '建安文学发源地' },
};

/**
 * Author journey data with verified geographic routes.
 * These are the most well-known literary figures in the textbook
 * with historically documented travel routes.
 */
export const AUTHOR_JOURNEYS: AuthorJourney[] = [
  {
    author: '李白',
    dynasty: '唐',
    route: [
      ANCIENT_CITIES.奉节,
      ANCIENT_CITIES.江陵,
      ANCIENT_CITIES.长安,
      ANCIENT_CITIES.洛阳,
      ANCIENT_CITIES.宣城,
      ANCIENT_CITIES.扬州,
      ANCIENT_CITIES.建康,
    ],
    description: '李白一生漫游天下，从蜀地出川，沿长江东下，北上长安，又遍游江南。其诗歌处处留下足迹，"朝辞白帝彩云间""烟花三月下扬州"皆为行旅所赋。',
    relatedWorks: ['m_001', 'm_009', 'h_005'],
  },
  {
    author: '杜甫',
    dynasty: '唐',
    route: [
      ANCIENT_CITIES.洛阳,
      ANCIENT_CITIES.长安,
      ANCIENT_CITIES.成都,
      ANCIENT_CITIES.夔州,
      ANCIENT_CITIES.长沙,
    ],
    description: '杜甫一生颠沛流离，从长安到成都草堂，再到夔州，最终病逝于湘江舟中。其诗被称为"诗史"，记录了大唐由盛转衰的时代变迁。',
    relatedWorks: ['m_003', 'h_006'],
  },
  {
    author: '苏轼',
    dynasty: '宋',
    route: [
      ANCIENT_CITIES.开封,
      ANCIENT_CITIES.密州,
      ANCIENT_CITIES.徐州,
      ANCIENT_CITIES.黄州,
      ANCIENT_CITIES.临安,
    ],
    description: '苏轼仕途坎坷，从汴京到密州、徐州，乌台诗案后贬黄州，晚年流放岭南。每到一处皆有名篇传世，《念奴娇·赤壁怀古》即作于黄州。',
    relatedWorks: ['h_001', 'h_002'],
  },
  {
    author: '白居易',
    dynasty: '唐',
    route: [
      ANCIENT_CITIES.长安,
      ANCIENT_CITIES.浔阳,
      ANCIENT_CITIES.长安,
      ANCIENT_CITIES.苏州,
      ANCIENT_CITIES.洛阳,
    ],
    description: '白居易被贬江州司马，在此写下《琵琶行》。后历任杭州、苏州刺史，兴修水利造福一方。晚年寓居洛阳香山。',
    relatedWorks: ['h_003'],
  },
  {
    author: '柳宗元',
    dynasty: '唐',
    route: [
      ANCIENT_CITIES.长安,
      ANCIENT_CITIES.永州,
      ANCIENT_CITIES.柳州,
    ],
    description: '柳宗元参与永贞革新失败后，被贬永州十年，写下《永州八记》。后改贬柳州，在任上兴办教育、释放奴婢，最终病逝柳州。',
    relatedWorks: ['h_008'],
  },
  {
    author: '韩愈',
    dynasty: '唐',
    route: [
      ANCIENT_CITIES.长安,
      ANCIENT_CITIES.潮州,
      ANCIENT_CITIES.长安,
    ],
    description: '韩愈因谏迎佛骨被贬潮州，途中有"云横秦岭家何在，雪拥蓝关马不前"之句。后召回长安，继续推动古文运动。',
    relatedWorks: ['h_010'],
  },
  {
    author: '欧阳修',
    dynasty: '宋',
    route: [
      ANCIENT_CITIES.开封,
      ANCIENT_CITIES.滁州,
      ANCIENT_CITIES.开封,
    ],
    description: '欧阳修被贬滁州期间写下千古名篇《醉翁亭记》，以"醉翁之意不在酒"自况。后回朝任枢密副使、参知政事，主持科举选拔人才。',
    relatedWorks: ['h_012'],
  },
  {
    author: '屈原',
    dynasty: '先秦',
    route: [
      ANCIENT_CITIES.江陵,
      ANCIENT_CITIES.长沙,
    ],
    description: '屈原被楚王放逐，沿沅湘南下至长沙一带，行吟泽畔，写下《离骚》《九歌》等不朽篇章，最终投汨罗江殉国。',
    relatedWorks: ['h_016'],
  },
];

/**
 * Get all unique cities from all journeys
 */
export function getAllJourneyCities(): GeoCity[] {
  const seen = new Set<string>();
  const cities: GeoCity[] = [];
  for (const journey of AUTHOR_JOURNEYS) {
    for (const city of journey.route) {
      if (!seen.has(city.name)) {
        seen.add(city.name);
        cities.push(city);
      }
    }
  }
  return cities;
}

/**
 * Get journey for a specific author
 */
export function getAuthorJourney(authorName: string): AuthorJourney | undefined {
  return AUTHOR_JOURNEYS.find(j => j.author === authorName);
}

/**
 * Get all city coordinates as [lng, lat] pairs for map markers
 */
export function getCityCoordinates(): Array<{ name: string; value: [number, number]; desc?: string }> {
  return Object.values(ANCIENT_CITIES).map(city => ({
    name: city.name,
    value: [city.lng, city.lat],
    desc: city.desc,
  }));
}
