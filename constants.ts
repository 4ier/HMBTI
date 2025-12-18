
import { Question, TypeDetail } from './types';

export const QUESTIONS_PER_DIMENSION = 6;
export const MAX_SKIP_PER_DIMENSION = 1;
export const MODEL_VERSION = 'v1.05';

// 预置美学图片池 (使用符合暗黑/工业/重型美学的抽象图)
const IMAGE_POOLS: Record<string, string[]> = {
  EBOG: [
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1470790376778-a9fbc86d70e2?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop'
  ],
  ICXG: [
    'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1533132248148-daafaeae082a?q=80&w=1000&auto=format&fit=crop'
  ],
  // ... 其他类型使用通用池作为演示，实际应用中可为每个code配置专属池
};

const DEFAULT_POOL = [
  'https://images.unsplash.com/photo-1514525253344-f81bad3b7c2a?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1536697246747-09196623285a?q=80&w=1000&auto=format&fit=crop'
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

export const QUESTION_BANK: Question[] = [
  // I_E
  { id: 'ie-1', dimension: 'I_E', text: '听重型音乐时，我更倾向于选择一个不被打扰的空间。', isActive: true, weight: 1 },
  { id: 'ie-2', dimension: 'I_E', text: '如果环境不允许我自由活动，我会觉得音乐体验被削弱了。', isActive: true, weight: -1 },
  { id: 'ie-3', dimension: 'I_E', text: '听音乐时，我很少同时关注周围发生的事情。', isActive: true, weight: 1 },
  { id: 'ie-4', dimension: 'I_E', text: '我听音乐时，会自然注意到他人的反应或现场氛围。', isActive: true, weight: -1 },
  { id: 'ie-5', dimension: 'I_E', text: '听完真正击中我的音乐后，我通常会变得更安静。', isActive: true, weight: 1 },
  { id: 'ie-6', dimension: 'I_E', text: '听完音乐后，我会有想说话、想行动的冲动。', isActive: true, weight: -1 },
  { id: 'ie-7', dimension: 'I_E', text: '我很少需要向别人解释我为什么喜欢某种音乐。', isActive: true, weight: 1 },
  { id: 'ie-8', dimension: 'I_E', text: '和别人一起分享音乐体验，会让我感觉更完整。', isActive: true, weight: -1 },
  { id: 'ie-9', dimension: 'I_E', text: '即使错过一场重要现场，只要音乐本身还在，我可以接受。', isActive: true, weight: 1 },
  { id: 'ie-10', dimension: 'I_E', text: '如果没能亲身参与现场，我会觉得“少了点什么”。', isActive: true, weight: -1 },

  // C_B
  { id: 'cb-1', dimension: 'C_B', text: '我通常在情绪已经被触发后，才会打开重型音乐。', isActive: true, weight: -1 },
  { id: 'cb-2', dimension: 'C_B', text: '即使情绪平稳，我也会持续听某些音乐作为背景支撑。', isActive: true, weight: 1 },
  { id: 'cb-3', dimension: 'C_B', text: '听完音乐后，我更关心“舒服没舒服”。', isActive: true, weight: -1 },
  { id: 'cb-4', dimension: 'C_B', text: '听完音乐后，我更关心“是否更清楚自己在做什么”。', isActive: true, weight: 1 },
  { id: 'cb-5', dimension: 'C_B', text: '如果情绪已经通过别的方式释放，我对音乐的需求会明显下降。', isActive: true, weight: -1 },
  { id: 'cb-6', dimension: 'C_B', text: '即使情绪稳定，我也会因为认同而回到某些音乐。', isActive: true, weight: 1 },
  { id: 'cb-7', dimension: 'C_B', text: '我很少把音乐当成长期的一部分来看待。', isActive: true, weight: -1 },
  { id: 'cb-8', dimension: 'C_B', text: '有些音乐已经融入了我对自己的理解。', isActive: true, weight: 1 },
  { id: 'cb-9', dimension: 'C_B', text: '一段时间不听重型音乐，对我来说问题不大。', isActive: true, weight: -1 },
  { id: 'cb-10', dimension: 'C_B', text: '长期脱离某类音乐，会让我感觉自己被抽空了一部分。', isActive: true, weight: 1 },

  // O_X
  { id: 'ox-1', dimension: 'O_X', text: '结构清晰会让我更容易沉浸。', isActive: true, weight: 1 },
  { id: 'ox-2', dimension: 'O_X', text: '不确定性本身会让我兴奋。', isActive: true, weight: -1 },
  { id: 'ox-3', dimension: 'O_X', text: '我对“听得懂”这件事很看重。', isActive: true, weight: 1 },
  { id: 'ox-4', dimension: 'O_X', text: '即使听不懂，只要够极端我也愿意继续听。', isActive: true, weight: -1 },
  { id: 'ox-5', dimension: 'O_X', text: '如果一首歌显得失控，我会本能地警惕。', isActive: true, weight: 1 },
  { id: 'ox-6', dimension: 'O_X', text: '我享受音乐中那种“随时可能出事”的感觉。', isActive: true, weight: -1 },
  { id: 'ox-7', dimension: 'O_X', text: '我更容易反复听结构稳定的作品。', isActive: true, weight: 1 },
  { id: 'ox-8', dimension: 'O_X', text: '我更容易反复听充满变数的作品。', isActive: true, weight: -1 },
  { id: 'ox-9', dimension: 'O_X', text: '我更欣赏对声音的掌控力。', isActive: true, weight: 1 },
  { id: 'ox-10', dimension: 'O_X', text: '我更欣赏突破边界的冒险。', isActive: true, weight: -1 },

  // G_F
  { id: 'gf-1', dimension: 'G_F', text: '我判断一支乐队时，会参考它来自哪里、继承了什么。', isActive: true, weight: 1 },
  { id: 'gf-2', dimension: 'G_F', text: '我判断一支乐队时，更看重它现在在做什么。', isActive: true, weight: -1 },
  { id: 'gf-3', dimension: 'G_F', text: '我对“这个不算那个风格”的说法并不反感。', isActive: true, weight: 1 },
  { id: 'gf-4', dimension: 'G_F', text: '我对风格标签的争论通常不太在意。', isActive: true, weight: -1 },
  { id: 'gf-5', dimension: 'G_F', text: '历史和传承是音乐价值的重要组成部分。', isActive: true, weight: 1 },
  { id: 'gf-6', dimension: 'G_F', text: '历史不应该成为创作的负担。', isActive: true, weight: -1 },
  { id: 'gf-7', dimension: 'G_F', text: '我对变化太快的风格会感到不适。', isActive: true, weight: 1 },
  { id: 'gf-8', dimension: 'G_F', text: '我对不断变化的风格反而更有兴趣。', isActive: true, weight: -1 },
  { id: 'gf-9', dimension: 'G_F', text: '我更信任时间检验过的东西。', isActive: true, weight: 1 },
  { id: 'gf-10', dimension: 'G_F', text: '我更信任当下的表达强度。', isActive: true, weight: -1 },
];

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
