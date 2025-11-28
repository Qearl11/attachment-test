/**
 * 计算依恋类型得分
 * @param {Object} answers - 用户答案对象 { questionId: score } (score: 1-7)
 * @param {Array} items - 题目定义数组
 * @returns {Object} { anxiety: number, avoidance: number }
 */
export const calculateDimensionScore = (answers, items) => {
  let anxietySum = 0;
  let anxietyCount = 0;
  let avoidanceSum = 0;
  let avoidanceCount = 0;

  items.forEach((item) => {
    const rawScore = answers[item.id];
    if (rawScore === undefined) return; // 未回答

    // 处理反向计分 (1-7分制：8 - score)
    const finalScore = item.reverse ? 8 - rawScore : rawScore;

    if (item.dimension === "anxiety") {
      anxietySum += finalScore;
      anxietyCount++;
    } else if (item.dimension === "avoidance") {
      avoidanceSum += finalScore;
      avoidanceCount++;
    }
  });

  return {
    anxiety: anxietyCount > 0 ? (anxietySum / anxietyCount).toFixed(2) : 0,
    avoidance:
      avoidanceCount > 0 ? (avoidanceSum / avoidanceCount).toFixed(2) : 0,
  };
};

/**
 * 判定依恋类型
 * @param {number} anxiety - 焦虑分
 * @param {number} avoidance - 回避分
 * @returns {string} 类型名称 (Secure, Anxious, Avoidant, Disorganized)
 */
export const getAttachmentStyle = (anxiety, avoidance) => {
  // 阈值通常为中点，这里假设为 4.0 (1-7分制的中点)
  // 也可以根据具体常模调整，例如 3.5
  const THRESHOLD = 4.0;

  const highAnxiety = anxiety > THRESHOLD;
  const highAvoidance = avoidance > THRESHOLD;

  if (!highAnxiety && !highAvoidance) return "Secure (安全型)";
  if (highAnxiety && !highAvoidance) return "Anxious (焦虑型)";
  if (!highAnxiety && highAvoidance) return "Avoidant (回避型)";
  if (highAnxiety && highAvoidance) return "Disorganized (混乱型)";

  return "Unknown";
};
