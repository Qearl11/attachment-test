import React, { useMemo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  ReferenceArea,
  Label,
} from "recharts";
import { questions } from "../data/questions";
import { calculateDimensionScore, getAttachmentStyle } from "../utils/scoring";
import { RECOMMENDATIONS } from "../data/recommendations";
import "./ResultPage.css";

// 定义象限背景色
const QUADRANT_COLORS = {
  secure: "#d0f0c0", // 左下：安全型 (绿色系)
  anxious: "#ffe0b2", // 右下：焦虑型 (橙色系)
  avoidant: "#bbdefb", // 左上：回避型 (蓝色系)
  disorganized: "#f8bbd0", // 右上：恐惧型 (粉色系)
};

// 定义不同关系的点的颜色
const POINT_COLORS = {
  mother: "#d32f2f", // 红色
  father: "#388e3c", // 绿色
  partner: "#1976d2", // 蓝色
  general: "#212121", // 黑色
};

const ATTACHMENT_DESCRIPTIONS = {
  "Secure (安全型)": {
    title: "安全型依恋 (Secure)",
    content: [
      "恭喜你——拥有安全型依恋是一件非常值得庆祝的事情！",
      "这通常意味着你的需求在成长过程中得到了相对充分的回应，或者你在生活中通过努力、自我觉察和健康的关系经营，逐渐建立起了稳定的情绪与连接方式。",
      "安全型依恋被认为是四种依恋类型中最平衡、最健康的一种。",
      "其余三种为不安全依恋：焦虑型、回避型和混乱型。大约每三个人中就有一人属于不安全依恋，他们往往会在不同生活领域呈现出依恋相关的困扰。",
      "在陪伴或支持具有不安全依恋的人时，目标是帮助他们逐渐往“后天安全型（Earned Secure）”发展——通过让他们在情绪表达、互动连接以及亲密关系中感到更加安全、被理解、被看见，从而建立稳固的心理基础。",
    ],
  },
  "Anxious (焦虑型)": {
    title: "焦虑型依恋 (Anxious)",
    content: [
      "你的评估结果显示你倾向于焦虑型依恋。",
      "焦虑型依恋者往往非常重视亲密关系，也渴望被爱、被回应、被肯定。然而，在成长过程中，你的情感需求可能时常得不到稳定的回应，这使你更容易担心被忽略、被拒绝或不被重视。",
      "在成人关系中，你可能更容易：",
      "• 担忧对方是否仍然在乎你",
      "• 过度关注关系中的细节、讯号与变化",
      "• 害怕被抛弃",
      "• 在被忽视时感到强烈不安或痛苦",
      "这些反应并不是你的错，它们通常来自于你曾经不得不靠敏锐和紧抓来维持安全感的时期。",
      "好消息是：焦虑型依恋是完全可以通过安全关系、疗愈经验以及自我练习逐渐转变的。",
      "许多人通过学习识别自己的需求、建立稳固边界和培养情绪调节能力，最终成长为“后天安全型”。",
      "你正在迈向这种改变的第一步。",
    ],
  },
  "Avoidant (回避型)": {
    title: "回避型依恋 (Avoidant)",
    content: [
      "你的评估结果显示你倾向于回避型依恋。",
      "回避型依恋者通常对独立、自主和空间感到非常重视。",
      "这通常与成长经历有关——你可能在早期关系中学会：“情绪表达不会被理解或支持”，“依赖他人可能带来失望”，因此你逐渐发展出一种自我保护方式：尽量不过度依赖他人、减少情绪暴露、保持距离。",
      "在关系中，你可能会：",
      "• 在他人靠得太近时感到压力",
      "• 不喜欢强烈的情绪表达",
      "• 更依赖理性而不是情绪交流",
      "• 需要大量个人空间来维持稳定感",
      "• 很难在关系中完全放下警惕",
      "这些都是你早期经历所形成的保护机制——它们曾经帮助你生存下来，也让你变得坚强。",
      "但与此同时，你也值得在关系中感到轻松、安全、被理解——不用时时刻刻保持距离或独立。",
      "通过稳定、可靠的关系体验，你也能一步步走向“后天安全型”，并在亲密和独立之间找到更舒适的平衡。",
    ],
  },
  "Disorganized (混乱型)": {
    title: "混乱型依恋 (Disorganized)",
    content: [
      "你的评估结果显示你倾向于混乱型依恋（Disorganized / Fearful-Avoidant）。",
      "混乱型依恋通常源于童年时期兼具吸引与恐惧的关系体验。",
      "你可能非常渴望亲密，但同时又害怕亲密；你渴望被理解，但又担心暴露情绪会带来伤害；你想靠近，却又会突然退缩。",
      "这种矛盾并不是你的问题，而是你的身心在多年里形成的保护反应——试图在“想连接”与“想避免痛苦”之间找平衡。",
      "在关系中，你可能会：",
      "• 时而靠近、时而疏离",
      "• 很难完全信任他人",
      "• 情绪反应较强烈或起伏大",
      "• 害怕亲密，也害怕孤独",
      "• 在压力下进入“关闭/冻住/逃离”模式",
      "这是一种非常复杂的依恋模式，但也意味着你拥有强烈的感受力与关系敏感度。",
      "更重要的是：混乱型依恋拥有最强的改善潜力。",
      "当你遇到安全、可靠、温暖的人际关系，或通过治疗 / 自我成长，你可以逐渐重建稳定的内在模板，并最终走向“后天安全型”。",
      "你并不需要一个人处理这些复杂情绪，你也值得拥有稳定、安全的连接。",
    ],
  },
};

const ResultPage = ({ answers, onRestart }) => {
  // 计算所有部分的得分
  const results = useMemo(() => {
    const sections = questions.attachment.sections;
    const items = questions.attachment.items;

    return sections.map((section) => {
      const sectionAnswers = {};
      items.forEach((item) => {
        const uniqueId = `${section.id}_${item.id}`;
        if (answers[uniqueId] !== undefined) {
          sectionAnswers[item.id] = answers[uniqueId];
        }
      });

      const scores = calculateDimensionScore(sectionAnswers, items);
      const style = getAttachmentStyle(scores.anxiety, scores.avoidance);

      return {
        id: section.id,
        name: section.title_zh.replace("关系结构：", ""),
        anxiety: parseFloat(scores.anxiety),
        avoidance: parseFloat(scores.avoidance),
        attachmentType: style,
      };
    });
  }, [answers]);

  // 计算自尊量表得分 (RSES)
  const selfEsteemScore = useMemo(() => {
    let score = 0;
    let count = 0;
    questions.selfEsteem.forEach((item, idx) => {
      const uniqueId = `se_${idx}`;
      const val = answers[uniqueId];
      if (val !== undefined) {
        // 原始输入 1-5 (Strongly Disagree - Strongly Agree)
        // 映射到 0-4 (0, 1, 2, 3, 4)
        // 公式: val - 1
        let itemScore = val - 1;

        // 反向计分: 4 - itemScore
        if (item.reverse) {
          itemScore = 4 - itemScore;
        }
        score += itemScore;
        count++;
      }
    });
    // 如果全部回答，满分40
    return count > 0 ? Math.round(score) : 0;
  }, [answers]);

  // 计算 ERQ 得分
  const erqScores = useMemo(() => {
    let reappraisalSum = 0;
    let reappraisalCount = 0;
    let suppressionSum = 0;
    let suppressionCount = 0;

    questions.erq.forEach((item, idx) => {
      const uniqueId = `erq_${idx}`;
      const val = answers[uniqueId];
      if (val !== undefined) {
        if (item.dimension === "reappraisal") {
          reappraisalSum += val;
          reappraisalCount++;
        } else if (item.dimension === "suppression") {
          suppressionSum += val;
          suppressionCount++;
        }
      }
    });

    const reappraisalScore =
      reappraisalCount > 0 ? reappraisalSum / reappraisalCount : 0;
    const suppressionScore =
      suppressionCount > 0 ? suppressionSum / suppressionCount : 0;

    // 计算整体情绪调节能力 (Overall ER)
    // 公式: (Reappraisal + (6 - Suppression)) / 2
    // 注意：这里使用 6 - Suppression 是为了将 1-5 分的反向计分标准化到 1-5 范围
    // 如果 Suppression 高 (5)，则得分为 1 (调节能力弱)
    // 如果 Suppression 低 (1)，则得分为 5 (调节能力强)
    const overallScore = (reappraisalScore + (6 - suppressionScore)) / 2;

    return {
      reappraisal: reappraisalScore.toFixed(1),
      suppression: suppressionScore.toFixed(1),
      overall: overallScore.toFixed(1),
    };
  }, [answers]);

  // 找到总体依恋风格 (General) 用于主要展示
  const generalResult = results.find((r) => r.id === "general") || results[0];
  const description = ATTACHMENT_DESCRIPTIONS[generalResult.attachmentType];

  // 获取综合建议
  const recommendation = useMemo(() => {
    if (!generalResult || selfEsteemScore === undefined || !erqScores.overall)
      return null;

    // 1. 依恋类型 Key
    let attachmentKey = "secure";
    if (generalResult.attachmentType.includes("Anxious"))
      attachmentKey = "anxious";
    else if (generalResult.attachmentType.includes("Avoidant"))
      attachmentKey = "avoidant";
    else if (generalResult.attachmentType.includes("Disorganized"))
      attachmentKey = "disorganized";

    // 2. 自尊水平 Key
    let seKey = "medium";
    if (selfEsteemScore >= 33) seKey = "high";
    else if (selfEsteemScore <= 20) seKey = "low";

    // 3. 情绪调节水平 Key
    let erqKey = "medium";
    const erqVal = parseFloat(erqScores.overall);
    if (erqVal >= 3.6) erqKey = "high";
    else if (erqVal <= 2.1) erqKey = "low";

    const key = `${attachmentKey}_${seKey}_${erqKey}`;
    return RECOMMENDATIONS[key];
  }, [generalResult, selfEsteemScore, erqScores]);

  // 图表数据：X轴为焦虑，Y轴为回避
  const chartData = results.map((r) => ({
    id: r.id,
    x: r.anxiety, // X Axis: Anxiety
    y: r.avoidance, // Y Axis: Avoidance
    name: r.name,
    attachmentType: r.attachmentType,
  }));

  // 自定义 Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="label">
            <strong>{data.name}</strong>
          </p>
          <p>焦虑 (Anxiety): {data.x}</p>
          <p>回避 (Avoidance): {data.y}</p>
          <p>类型: {data.attachmentType}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="result-container">
      <div className="result-header">
        <h2>您的总体依恋类型测试结果</h2>
        {/* <p>基于 ECR-RS 关系结构问卷分析</p> */}
      </div>

      {description && (
        <div className="general-result-description">
          <h3 className="description-title">{description.title}</h3>
          <div className="description-content">
            {description.content.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>
      )}

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              type="number"
              dataKey="x"
              name="焦虑"
              domain={[1, 7]}
              label={{
                value: "焦虑维度 (Anxiety)",
                position: "bottom",
                offset: 0,
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="回避"
              domain={[1, 7]}
              label={{
                value: "回避维度 (Avoidance)",
                angle: -90,
                position: "left",
              }}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* 
              绘制四个象限背景 
              X轴: 焦虑 (1-7), Y轴: 回避 (1-7)
              中点: 4
            */}

            {/* 左上: Avoidant (低焦虑, 高回避) -> x: 1-4, y: 4-7 */}
            <ReferenceArea
              x1={1}
              x2={4}
              y1={4}
              y2={7}
              fill={QUADRANT_COLORS.avoidant}
              fillOpacity={0.4}
            >
              <Label
                value="回避型 (Avoidant)"
                position="center"
                fill="#1565c0"
                fontSize={14}
                fontWeight="bold"
              />
            </ReferenceArea>

            {/* 右上: Disorganized (高焦虑, 高回避) -> x: 4-7, y: 4-7 */}
            <ReferenceArea
              x1={4}
              x2={7}
              y1={4}
              y2={7}
              fill={QUADRANT_COLORS.disorganized}
              fillOpacity={0.4}
            >
              <Label
                value="混乱型 (Disorganized)"
                position="center"
                fill="#c62828"
                fontSize={14}
                fontWeight="bold"
              />
            </ReferenceArea>

            {/* 左下: Secure (低焦虑, 低回避) -> x: 1-4, y: 1-4 */}
            <ReferenceArea
              x1={1}
              x2={4}
              y1={1}
              y2={4}
              fill={QUADRANT_COLORS.secure}
              fillOpacity={0.4}
            >
              <Label
                value="安全型 (Secure)"
                position="center"
                fill="#2e7d32"
                fontSize={14}
                fontWeight="bold"
              />
            </ReferenceArea>

            {/* 右下: Anxious (高焦虑, 低回避) -> x: 4-7, y: 1-4 */}
            <ReferenceArea
              x1={4}
              x2={7}
              y1={1}
              y2={4}
              fill={QUADRANT_COLORS.anxious}
              fillOpacity={0.4}
            >
              <Label
                value="焦虑型 (Anxious)"
                position="center"
                fill="#ef6c00"
                fontSize={14}
                fontWeight="bold"
              />
            </ReferenceArea>

            {/* 中心分割线 */}
            <ReferenceLine x={4} stroke="#666" strokeWidth={1} />
            <ReferenceLine y={4} stroke="#666" strokeWidth={1} />

            {/* 数据点 */}
            <Scatter name="Results" data={chartData}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={POINT_COLORS[entry.id] || "#000"}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* 结果详情列表 (仿照截图样式) */}
      <div className="result-details-list">
        <h3>详细得分</h3>
        <div className="score-list">
          {results.map((r) => (
            <div key={r.id} className="score-item">
              <div className="score-item-header">
                <span
                  className="color-dot"
                  style={{ backgroundColor: POINT_COLORS[r.id] || "#000" }}
                ></span>
                <span className="score-name">{r.name}</span>
              </div>
              <div className="score-values">
                <span>
                  焦虑: <strong>{r.anxiety}</strong>
                </span>
                <span className="divider">|</span>
                <span>
                  回避: <strong>{r.avoidance}</strong>
                </span>
              </div>
              <div className="score-type">{r.attachmentType}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 额外维度：自尊与情绪调节 */}
      <div className="extra-dimensions">
        <h3>其他心理维度</h3>

        {/* 自尊量表 */}
        <div className="dimension-card">
          <h4>一、自尊量表 (RSES)</h4>
          <div className="dimension-score">
            得分：<strong>{selfEsteemScore}</strong> / 30
          </div>
          <div className="dimension-desc">
            {selfEsteemScore >= 25 ? (
              <p>
                <strong>30–25 分｜高自尊</strong>
                <br />
                你对自己持积极评价，相信自身价值，即使在压力或挑战下也能维持稳定的自我感。高自尊者通常在亲密关系中更安全、更有能力表达需求，也更容易形成稳定的依恋模式。
              </p>
            ) : selfEsteemScore >= 16 ? (
              <p>
                <strong>24–16 分｜中等自尊</strong>
                <br />
                你的自我评价比较稳定，但在面对失败、拒绝或亲密关系中的矛盾时可能会短暂动摇。你具备良好的复原力，但还可以继续强化自我接纳与稳定性。
              </p>
            ) : (
              <p>
                <strong>15 分及以下｜低自尊</strong>
                <br />
                你可能对自己较为苛刻，容易因为外界反馈影响情绪。在关系中容易过度敏感、担心被拒绝，或避免表达需求。低自尊与依恋焦虑、依恋回避都高度相关。
              </p>
            )}
          </div>
        </div>

        {/* 情绪调节策略 */}
        <div className="dimension-card">
          <h4>二、情绪调节策略 (ERQ)</h4>

          {/* 整体情绪调节能力 */}
          <div className="erq-section overall-erq">
            <h5>🔸 整体情绪调节能力 (Overall ER)</h5>
            <div className="dimension-score">
              得分：<strong>{erqScores.overall}</strong> (1-7)
            </div>
            <div className="dimension-desc">
              {erqScores.overall >= 5.0 ? (
                <p>
                  <strong>情绪调节能力较强</strong>
                  <br />
                  你拥有较为成熟的情绪调节机制。你不仅善于通过认知重评来缓解负面情绪，而且不过度依赖压抑。这种平衡有助于你在面对压力时保持心理韧性，同时在人际关系中保持真实与连接。
                </p>
              ) : erqScores.overall >= 3.0 ? (
                <p>
                  <strong>情绪调节能力中等</strong>
                  <br />
                  你的情绪调节能力处于平均水平。你可能在某些情境下能很好地处理情绪，但在高压或特定触发点下可能会感到吃力。尝试多觉察自己的情绪反应模式，有意识地练习“换个角度看问题”而非“把情绪压下去”。
                </p>
              ) : (
                <p>
                  <strong>情绪调节能力较弱</strong>
                  <br />
                  你目前可能觉得情绪较难掌控，或者习惯于用压抑的方式来应对，这可能会让你感到内耗严重。这并不代表你“不好”，而是说明你需要学习新的情绪应对工具。心理咨询或情绪管理课程会对你很有帮助。
                </p>
              )}
            </div>
          </div>

          <div className="erq-sub-sections">
            <div className="erq-section">
              <h5>维度 1：认知重新评估 (Reappraisal)</h5>
              <div className="dimension-score">
                得分：<strong>{erqScores.reappraisal}</strong> (1-7)
              </div>
              <div className="dimension-desc">
                {erqScores.reappraisal >= 5.0 ? (
                  <p>
                    <strong>较高</strong>
                    <br />
                    你善于在情绪出现时重新理解情境，从而缓解负面感受。这是最稳定、最健康的情绪调节策略之一。与安全依恋、自尊稳定、对关系更乐观相关。
                  </p>
                ) : erqScores.reappraisal >= 3.0 ? (
                  <p>
                    <strong>中等</strong>
                    <br />
                    你可以通过认知方式调节情绪，但在压力较大或关系紧张时效果可能下降，可以通过刻意练习提升比例。
                  </p>
                ) : (
                  <p>
                    <strong>较低</strong>
                    <br />
                    你可能较少使用认知方式面对情绪，而更多依赖压抑、回避或情绪爆发。低重新评估往往与依恋焦虑、失控情绪、冲动行为相关。
                  </p>
                )}
              </div>
            </div>

            <div className="erq-section">
              <h5>维度 2：表达抑制 (Suppression)</h5>
              <div className="dimension-score">
                得分：<strong>{erqScores.suppression}</strong> (1-7)
              </div>
              <div className="dimension-desc">
                {erqScores.suppression >= 5.0 ? (
                  <p>
                    <strong>较高</strong>
                    <br />
                    你倾向于压抑或隐藏自己的情绪。虽然短期能避免冲突，但长期会降低亲密感与关系质量，也可能损害自尊。常见于回避型依恋者。
                  </p>
                ) : erqScores.suppression >= 3.0 ? (
                  <p>
                    <strong>中等</strong>
                    <br />
                    你会在某些情况下隐藏情绪，但不至于完全压抑。你有能力维持表面平静，但需要注意不要让情绪堆积。
                  </p>
                ) : (
                  <p>
                    <strong>较低</strong>
                    <br />
                    你比较愿意表达情绪，不太会压抑。若表达方式健康，这有助于关系品质；但若表达过度直接，可能需要练习“温和表达”。
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 综合建议板块 */}
      {recommendation && (
        <div className="recommendation-section">
          <h3>🔮 您的专属综合分析与建议</h3>
          <div className="recommendation-card">
            <h4 className="rec-title">{recommendation.title}</h4>
            <p className="rec-description">{recommendation.description}</p>

            <div className="rec-features">
              <h5>在关系中，您通常能够做到：</h5>
              <ul>
                {recommendation.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className="rec-advice">
              <h5>🌱 成长建议：</h5>
              <ul>
                {recommendation.advice.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <button className="restart-btn" onClick={onRestart}>
        重新测试
      </button>
    </div>
  );
};

export default ResultPage;
