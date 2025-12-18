
import { Question, TypeDetail } from './types';

export const QUESTIONS_PER_DIMENSION = 6;
export const MAX_SKIP_PER_DIMENSION = 1;
export const MODEL_VERSION = 'v1.05';

// 预置美学图片池 (使用符合暗黑/工业/重型美学的抽象图)
const IMAGE_POOLS: Record<string, string[]> = {
  // 工业/秩序/冷峻
  EBOG: ['/HMBTI/images/industrial.png', '/HMBTI/images/industrial_2.png', '/HMBTI/images/industrial_3.png', '/HMBTI/images/industrial.png'],
  ICOG: ['/HMBTI/images/industrial.png', '/HMBTI/images/industrial_2.png', '/HMBTI/images/industrial_3.png', '/HMBTI/images/industrial.png'],
  IBOG: ['/HMBTI/images/industrial.png', '/HMBTI/images/industrial_2.png', '/HMBTI/images/industrial_3.png', '/HMBTI/images/industrial.png'],
  IBXG: ['/HMBTI/images/industrial.png', '/HMBTI/images/industrial_2.png', '/HMBTI/images/industrial_3.png', '/HMBTI/images/industrial.png'],

  // 混沌/失真/爆发
  ECXG: ['/HMBTI/images/chaos.png', '/HMBTI/images/chaos.png', '/HMBTI/images/chaos.png', '/HMBTI/images/chaos.png'],
  ECXF: ['/HMBTI/images/chaos.png', '/HMBTI/images/chaos.png', '/HMBTI/images/chaos.png', '/HMBTI/images/chaos.png'],
  ICXG: ['/HMBTI/images/chaos.png', '/HMBTI/images/chaos.png', '/HMBTI/images/chaos.png', '/HMBTI/images/chaos.png'],
  ICXF: ['/HMBTI/images/chaos.png', '/HMBTI/images/chaos.png', '/HMBTI/images/chaos.png', '/HMBTI/images/chaos.png'],

  // 氛围/虚无/内省
  IBOF: ['/HMBTI/images/ethereal.png', '/HMBTI/images/ethereal.png', '/HMBTI/images/ethereal.png', '/HMBTI/images/ethereal.png'],
  ICOF: ['/HMBTI/images/ethereal.png', '/HMBTI/images/ethereal.png', '/HMBTI/images/ethereal.png', '/HMBTI/images/ethereal.png'],
  IBXF: ['/HMBTI/images/ethereal.png', '/HMBTI/images/ethereal.png', '/HMBTI/images/ethereal.png', '/HMBTI/images/ethereal.png'],

  // 重型/力量/推进
  ECOG: ['/HMBTI/images/heavy.png', '/HMBTI/images/heavy.png', '/HMBTI/images/heavy.png', '/HMBTI/images/heavy.png'],
  ECOF: ['/HMBTI/images/heavy.png', '/HMBTI/images/heavy.png', '/HMBTI/images/heavy.png', '/HMBTI/images/heavy.png'],
  EBOF: ['/HMBTI/images/heavy.png', '/HMBTI/images/heavy.png', '/HMBTI/images/heavy.png', '/HMBTI/images/heavy.png'],
  EBXF: ['/HMBTI/images/heavy.png', '/HMBTI/images/heavy.png', '/HMBTI/images/heavy.png', '/HMBTI/images/heavy.png'],
  EBXG: ['/HMBTI/images/heavy.png', '/HMBTI/images/heavy.png', '/HMBTI/images/heavy.png', '/HMBTI/images/heavy.png'],
};

const DEFAULT_POOL = [
  '/HMBTI/images/industrial.png',
  '/HMBTI/images/chaos.png',
  '/HMBTI/images/ethereal.png',
  '/HMBTI/images/heavy.png'
];

export const GET_RANDOM_IMAGE = (type: string) => {
  const pool = IMAGE_POOLS[type] || DEFAULT_POOL;
  return pool[Math.floor(Math.random() * pool.length)];
};

export const DIMENSION_DESCRIPTIONS = {
  I_E: {
    label: '交互方位 (Interaction)',
    left: { char: 'I', name: '内向探索', desc: '将音乐视为私密的精神庇护所，关注个人听觉深度的挖掘。' },
    right: { char: 'E', name: '外向连接', desc: '关注音乐的场域能量与共振，将音乐视为与外部世界连接的介质。' }
  },
  C_B: {
    label: '体验逻辑 (Logic)',
    left: { char: 'C', name: '瞬间宣泄', desc: '寻求情感的即时出口，通过重型音乐释放压力或极端情绪。' },
    right: { char: 'B', name: '长期存在', desc: '将音乐融入身份构建，寻求价值观的长期认同与精神支撑。' }
  },
  O_X: {
    label: '秩序倾向 (Order)',
    left: { char: 'O', name: '秩序追随', desc: '偏好清晰的结构、严谨的编曲以及可预见的力度控制美学。' },
    right: { char: 'X', name: '边界挑战', desc: '享受混沌、不确定性以及对听觉/结构边界的激进解构。' }
  },
  G_F: {
    label: '时间维度 (Time)',
    left: { char: 'G', name: '溯源重构', desc: '重视风格的传承、历史地位以及流派谱系的严谨性。' },
    right: { char: 'F', name: '当下叙事', desc: '重视即时的创新、风格融合以及对传统范式的现代性反叛。' }
  }
};

export const SCORING_MAP: Record<string, { dimension: string; weight: number }> = {
  // I_E
  '1e000001-0000-4000-8000-000000000001': { dimension: 'I_E', weight: 1 },
  '1e000002-0000-4000-8000-000000000002': { dimension: 'I_E', weight: -1 },
  '1e000003-0000-4000-8000-000000000003': { dimension: 'I_E', weight: 1 },
  '1e000004-0000-4000-8000-000000000004': { dimension: 'I_E', weight: -1 },
  '1e000005-0000-4000-8000-000000000005': { dimension: 'I_E', weight: 1 },
  '1e000006-0000-4000-8000-000000000006': { dimension: 'I_E', weight: -1 },
  '1e000007-0000-4000-8000-000000000007': { dimension: 'I_E', weight: 1 },
  '1e000008-0000-4000-8000-000000000008': { dimension: 'I_E', weight: -1 },
  '1e000009-0000-4000-8000-000000000009': { dimension: 'I_E', weight: 1 },
  '1e00000a-0000-4000-8000-00000000000a': { dimension: 'I_E', weight: -1 },

  // C_B
  'c0000001-0000-4000-8000-000000000001': { dimension: 'C_B', weight: -1 },
  'c0000002-0000-4000-8000-000000000002': { dimension: 'C_B', weight: 1 },
  'c0000003-0000-4000-8000-000000000003': { dimension: 'C_B', weight: -1 },
  'c0000004-0000-4000-8000-000000000004': { dimension: 'C_B', weight: 1 },
  'c0000005-0000-4000-8000-000000000005': { dimension: 'C_B', weight: -1 },
  'c0000006-0000-4000-8000-000000000006': { dimension: 'C_B', weight: 1 },
  'c0000007-0000-4000-8000-000000000007': { dimension: 'C_B', weight: -1 },
  'c0000008-0000-4000-8000-000000000008': { dimension: 'C_B', weight: 1 },
  'c0000009-0000-4000-8000-000000000009': { dimension: 'C_B', weight: -1 },
  'c000000a-0000-4000-8000-00000000000a': { dimension: 'C_B', weight: 1 },

  // O_X
  '0a000001-0000-4000-8000-000000000001': { dimension: 'O_X', weight: 1 },
  '0a000002-0000-4000-8000-000000000002': { dimension: 'O_X', weight: -1 },
  '0a000003-0000-4000-8000-000000000003': { dimension: 'O_X', weight: 1 },
  '0a000004-0000-4000-8000-000000000004': { dimension: 'O_X', weight: -1 },
  '0a000005-0000-4000-8000-000000000005': { dimension: 'O_X', weight: 1 },
  '0a000006-0000-4000-8000-000000000006': { dimension: 'O_X', weight: -1 },
  '0a000007-0000-4000-8000-000000000007': { dimension: 'O_X', weight: 1 },
  '0a000008-0000-4000-8000-000000000008': { dimension: 'O_X', weight: -1 },
  '0a000009-0000-4000-8000-000000000009': { dimension: 'O_X', weight: 1 },
  '0a00000a-0000-4000-8000-00000000000a': { dimension: 'O_X', weight: -1 },

  // G_F
  'f0000001-0000-4000-8000-000000000001': { dimension: 'G_F', weight: 1 },
  'f0000002-0000-4000-8000-000000000002': { dimension: 'G_F', weight: -1 },
  'f0000003-0000-4000-8000-000000000003': { dimension: 'G_F', weight: 1 },
  'f0000004-0000-4000-8000-000000000004': { dimension: 'G_F', weight: -1 },
  'f0000005-0000-4000-8000-000000000005': { dimension: 'G_F', weight: 1 },
  'f0000006-0000-4000-8000-000000000006': { dimension: 'G_F', weight: -1 },
  'f0000007-0000-4000-8000-000000000007': { dimension: 'G_F', weight: 1 },
  'f0000008-0000-4000-8000-000000000008': { dimension: 'G_F', weight: -1 },
  'f0000009-0000-4000-8000-000000000009': { dimension: 'G_F', weight: 1 },
  'f000000a-0000-4000-8000-00000000000a': { dimension: 'G_F', weight: -1 },
};

export const TYPE_DETAILS: TypeDetail[] = [
  { code: 'EBOG', name: '集体意志', description: '人群能量与集体意志的象征，握拳般的几何形态，规整而短促的节奏线条，坚硬、直接、冲击感强', promptSuffix: '握拳般的几何形态，规整而短促的节奏线条，坚硬、直接、冲击感强' },
  { code: 'ECOG', name: '纪律极光', description: '纪律与速度的象征，锐利斜切的金属片层，重复推进的动势，精确、冷静、高速', promptSuffix: '锐利斜切的金属片层，重复推进的动势，精确、冷静、高速' },
  { code: 'ECXG', name: '失控爆裂', description: '失控爆裂的象征，撕裂与碎片化构图，强烈运动模糊，噪点与裂纹如同爆破', promptSuffix: '撕裂与碎片化构图，强烈运动模糊，噪点与裂纹如同爆破' },
  { code: 'EBXG', name: '仪式信使', description: '仪式与行动的象征，火焰痕迹与粗粝布料纹理，抗议旗帜般的抽象轮廓，原始而有方向', promptSuffix: '火焰痕迹与粗粝布料纹理，抗议旗帜般的抽象轮廓，原始而有方向' },
  { code: 'IBOG', name: '巨石丰碑', description: '沉重秩序与谱系的象征，巨石碑般的结构体，古老符号的抽象纹样，稳定、庄严、缓慢压迫', promptSuffix: '巨石碑般的结构体，古老符号的抽象纹样，稳定、庄严、缓慢压迫' },
  { code: 'ICOG', name: '精密脉冲', description: '精密控制的象征，复杂机械与分形纹理，细密但不混乱，冷硬而高强度的内在张力', promptSuffix: '复杂机械与分形纹理，细密但不混乱，冷硬而高强度的内在张力' },
  { code: 'IBXG', name: '冷峻塔尖', description: '冷峻传统的象征，冰冷空旷的空间感，远处尖塔或山脊的抽象轮廓，肃穆、克制、宿命感', promptSuffix: '冰冷空旷的空间感，远处尖塔或山脊的抽象轮廓，肃穆、克制、宿命感' },
  { code: 'ICXG', name: '内向坍缩', description: '内向崩塌的象征，向内坍缩的漩涡构图，黑雾与压迫层次，窒息感强烈而锋利', promptSuffix: '向内坍缩的漩涡构图，黑雾与压迫层次，窒息感强烈而锋利' },
  { code: 'EBOF', name: '开放回响', description: '扩散与传播的象征，开放式几何结构向外展开，现代材质混合，像舞台灯光扫过', promptSuffix: '开放式几何结构向外展开，现代材质混合，像舞台灯光扫过' },
  { code: 'ECOF', name: '动力引擎', description: '稳定推进的能量象征，厚重机械运动感，引擎与齿轮般的抽象节律，持续、可靠、有力量', promptSuffix: '厚重机械运动感，引擎与齿轮般的抽象节律，持续、可靠、有力量' },
  { code: 'ECXF', name: '失真波形', description: '风格碰撞的象征，多材质断裂拼贴，失真波形般的扭曲，实验性强但中心稳定', promptSuffix: '多材质断裂拼贴，失真波形般的扭曲，实验性强但中心稳定' },
  { code: 'EBXF', name: '迁移轨迹', description: '行动中转化的象征，路径与迁移的抽象轨迹，破坏后重组的形态，动势明确、持续前进', promptSuffix: '路径与迁移的抽象轨迹，破坏后重组的形态，动势明确、持续前进' },
  { code: 'IBOF', name: '重塑理性', description: '重写结构的象征，层层叠加的建筑式抽象，秩序被重新编排，理性而不保守', promptSuffix: '层层叠加的建筑式抽象，秩序被重新编排，理性而不保守' },
  { code: 'ICOF', name: '内省光痕', description: '内省修复的象征，暗色基调中微弱暖光，柔和但不温柔，像伤口结痂后的纹理', promptSuffix: '暗色基调中微弱暖光，柔和但不温柔，像伤口结痂后的纹理' },
  { code: 'IBXF', name: '迷雾边界', description: '边界消散的象征，巨大空间与雾化层叠，远近景拉开，氛围缓慢覆盖一切', promptSuffix: '巨大空间与雾化层叠，远近景拉开，氛围缓慢覆盖一切' },
  { code: 'ICXF', name: '感官过载', description: '感官过载的象征，噪点洪流与溶解感，边缘燃烧与腐蚀纹理，强刺激但不花哨', promptSuffix: '噪点洪流与溶解感，边缘燃烧与腐蚀纹理，强刺激但不花哨' },
];

export const AI_PROMPT_PREFIX = "暗黑抽象专辑封面，地下重型音乐美学，电影级光影，高对比，粗颗粒胶片质感，低饱和，细节丰富，中心留出轻微呼吸空间，无文字无logo";
export const AI_NEGATIVE_PROMPT = "不要文字，不要logo，不要卡通，不要可爱风，不要清晰人脸，不要UI元素，不要霓虹赛博风过强，不要明亮糖果色";
