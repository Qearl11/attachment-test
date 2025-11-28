export const questions = {
  // 第一部分：个人资料 (Profile)
  profile: [
    {
      id: "p1",
      text_en: "What is your current situation?",
      text_zh: "您目前的情感状态是？",
      type: "choice",
      options: [
        { value: "single", label_en: "I am single", label_zh: "单身" },
        {
          value: "relationship",
          label_en: "I am in a relationship",
          label_zh: "恋爱中 / 已婚",
        },
      ],
    },
    {
      id: "p2",
      text_en: "How old are you?",
      text_zh: "您的年龄是？",
      type: "choice",
      options: [
        { value: "under_18", label_zh: "18岁以下" },
        { value: "18_24", label_zh: "18-24岁" },
        { value: "25_30", label_zh: "25-30岁" },
        { value: "31_40", label_zh: "31-40岁" },
        { value: "41_50", label_zh: "41-50岁" },
        { value: "above_50", label_zh: "50岁以上" },
      ],
    },
    {
      id: "p4",
      text_en: "What is your Gender?",
      text_zh: "您的性别是？",
      type: "choice",
      options: [
        { value: "man", label_zh: "男性" },
        { value: "woman", label_zh: "女性" },
        { value: "non_binary", label_zh: "非二元性别" },
        { value: "prefer_not_say", label_zh: "不愿透露" },
      ],
    },
    {
      id: "p5",
      text_en: "Do you have children?",
      text_zh: "您有孩子吗？",
      type: "choice",
      options: [
        { value: "yes", label_zh: "是" },
        { value: "no", label_zh: "否" },
      ],
    },
  ],

  // 核心依恋测试题库 (ECR-RS 变体)
  // 包含四个模块：Mother, Father, Partner, General
  // 计分逻辑：1-7分。
  // dimension: 'anxiety' (焦虑) | 'avoidance' (回避)
  // reverse: true (反向计分，即 8 - score)
  attachment: {
    sections: [
      {
        id: "mother",
        title_en: "Relationship Structure Mother/Caregiver #1",
        title_zh: "关系结构：母亲",
        description_zh:
          "请根据您与母亲（或类似母亲角色的抚养人）的关系回答以下问题。",
      },
      {
        id: "father",
        title_en: "Relationship Structure Father/Caregiver #2",
        title_zh: "关系结构：父亲",
        description_zh:
          "请根据您与父亲（或类似父亲角色的抚养人）的关系回答以下问题。",
      },
      {
        id: "partner",
        title_en: "Relationship Structure Romantic Partner",
        title_zh: "关系结构：浪漫伴侣",
        description_zh:
          "请根据您与当前的浪漫伴侣的关系回答。如果您目前单身，请根据最近一段有意义的关系回答。如果从未恋爱过，请想象您在一段关系中可能会有的感受。",
      },
      {
        id: "general",
        title_en: "General Attachment Style",
        title_zh: "总体依恋类型",
        description_zh:
          "请阅读以下陈述，并评价它们在多大程度上描述了您在一般亲密关系中的感受。",
      },
    ],
    // 9道核心题目模板 (适用于以上所有部分，只是顺序可能不同，这里统一标准化顺序以便调用)
    // 注意：原题中不同部分的题目顺序可能不同，但内容是一样的。
    // 这里为了代码复用，我们定义一个标准的题目池，实际渲染时可以根据ID映射。
    items: [
      {
        id: "q_worry_care",
        text_en:
          "I worry that this person won't care about me as much as I care about him or her.",
        text_zh: "我担心这个人不像我关心他/她那样关心我。",
        dimension: "anxiety",
        reverse: false,
      },
      {
        id: "q_discuss_problems",
        text_en: "I usually discuss my problems and concerns with this person.",
        text_zh: "我通常会和这个人讨论我的问题和顾虑。",
        dimension: "avoidance",
        reverse: true, // 越同意代表越不回避 -> 反向
      },
      {
        id: "q_afraid_abandon",
        text_en: "I'm afraid that this person may abandon me.",
        text_zh: "我害怕这个人会抛弃我。",
        dimension: "anxiety",
        reverse: false,
      },
      {
        id: "q_prefer_hide",
        text_en: "I prefer not to show this person how I feel deep down.",
        text_zh: "我宁愿不向这个人展示我内心深处的感受。",
        dimension: "avoidance",
        reverse: false,
      },
      {
        id: "q_talk_things",
        text_en: "I talk things over with this person.",
        text_zh: "我会和这个人商量事情。",
        dimension: "avoidance",
        reverse: true,
      },
      {
        id: "q_worry_not_care",
        text_en: "I often worry that this person doesn't really care for me.",
        text_zh: "我经常担心这个人并不是真的关心我。",
        dimension: "anxiety",
        reverse: false,
      },
      {
        id: "q_uncomfortable_open",
        text_en: "I don't feel comfortable opening up to this person.",
        text_zh: "我觉得向这个人敞开心扉不舒服。",
        dimension: "avoidance",
        reverse: false,
      },
      {
        id: "q_easy_depend",
        text_en: "I find it easy to depend on this person.",
        text_zh: "我发现很容易依赖这个人。",
        dimension: "avoidance",
        reverse: true,
      },
      {
        id: "q_help_turn",
        text_en: "It helps to turn to this person in times of need.",
        text_zh: "在需要的时候向这个人求助是有帮助的。",
        dimension: "avoidance",
        reverse: true,
      },
    ],
  },

  // 罗森伯格自尊量表 (Rosenberg Self Esteem)
  // 计分：1-4 (Strongly Disagree - Strongly Agree)
  // 部分题目反向计分
  selfEsteem: [
    {
      text_en: "I am able to do things as well as most other people.",
      text_zh: "我能像大多数人一样把事情做好。",
      reverse: false,
    },
    {
      text_en: "I certainly feel useless at times.",
      text_zh: "我有时确实觉得自己很没用。",
      reverse: true,
    },
    {
      text_en: "On the whole, I am satisfied with myself.",
      text_zh: "总的来说，我对自己感到满意。",
      reverse: false,
    },
    {
      text_en: "I take a positive attitude toward myself.",
      text_zh: "我对自己持积极肯定的态度。",
      reverse: false,
    },
    {
      text_en: "I feel I do not have much to be proud of.",
      text_zh: "我觉得自己没有什么值得骄傲的。",
      reverse: true,
    },
    {
      text_en: "At times I think I am no good at all.",
      text_zh: "有时我觉得自己一无是处。",
      reverse: true,
    },
    {
      text_en: "I feel that I have a number of good qualities.",
      text_zh: "我觉得我有许多优点。",
      reverse: false,
    },
    {
      text_en: "All in all, I am inclined to feel that I am a failure.",
      text_zh: "总的来说，我倾向于觉得自己是个失败者。",
      reverse: true,
    },
    {
      text_en: "I wish I could have more respect for myself.",
      text_zh: "我希望我能更尊重自己。",
      reverse: true,
    },
    {
      text_en:
        "I feel that I'm a person of worth, at least on an equal plane with others.",
      text_zh: "我觉得自己是个有价值的人，至少与别人是平等的。",
      reverse: false,
    },
  ],

  // DERS-16 情绪调节量表 -> 改为 ERQ 情绪调节策略量表
  // 计分：1-7 (Strongly Disagree - Strongly Agree)
  // 维度：reappraisal (认知重评), suppression (表达抑制)
  erq: [
    {
      id: "erq_1",
      text_en:
        "When I want to feel more positive emotion (such as joy or amusement), I change what I’m thinking about.",
      text_zh:
        "当我想产生更多正向情绪（如快乐或有趣）时，我会改变我对当前处境的看法。",
      dimension: "reappraisal",
    },
    {
      id: "erq_2",
      text_en: "I keep my emotions to myself.",
      text_zh: "我会把自己的情绪保留在心底。",
      dimension: "suppression",
    },
    {
      id: "erq_3",
      text_en:
        "When I want to feel less negative emotion (such as sadness or anger), I change what I’m thinking about.",
      text_zh:
        "当我想减少负向情绪（如悲伤或愤怒）时，我会改变我对当前处境的看法。",
      dimension: "reappraisal",
    },
    {
      id: "erq_4",
      text_en:
        "When I am feeling positive emotions, I am careful not to express them.",
      text_zh: "当我感到正向情绪时，我会小心地不把它们表达出来。",
      dimension: "suppression",
    },
    {
      id: "erq_5",
      text_en:
        "When I’m faced with a stressful situation, I make myself think about it in a way that helps me stay calm.",
      text_zh:
        "当我面对有压力的情境时，我会让自己用一种能使我保持冷静的方式去想它。",
      dimension: "reappraisal",
    },
    {
      id: "erq_6",
      text_en: "I control my emotions by not expressing them.",
      text_zh: "我通过不表达情绪来控制我的情绪。",
      dimension: "suppression",
    },
    {
      id: "erq_7",
      text_en:
        "When I want to feel more positive emotion, I change the way I’m thinking about the situation.",
      text_zh: "当我想产生更多正向情绪时，我会改变我在想的事物。",
      dimension: "reappraisal",
    },
    {
      id: "erq_8",
      text_en:
        "I control my emotions by changing the way I think about the situation I’m in.",
      text_zh: "我通过改变我对当前处境的看法来控制我的情绪。",
      dimension: "reappraisal",
    },
    {
      id: "erq_9",
      text_en:
        "When I am feeling negative emotions, I make sure not to express them.",
      text_zh: "当我感到负向情绪时，我会确保不把它们表达出来。",
      dimension: "suppression",
    },
    {
      id: "erq_10",
      text_en:
        "When I want to feel less negative emotion, I change the way I’m thinking about the situation.",
      text_zh: "当我想减少负向情绪时，我会改变我在想的事物。",
      dimension: "reappraisal",
    },
  ],
};
