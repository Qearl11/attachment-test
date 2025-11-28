import React, { useState, useMemo, useEffect } from "react";
import { questions } from "../data/questions";
import Slider from "./Slider";
import ResultPage from "./ResultPage";

const LABELS_7_POINT = [
  "强烈反对",
  "反对",
  "有点反对",
  "中立/混合",
  "有点同意",
  "同意",
  "强烈同意",
];

const LABELS_5_POINT = [
  "几乎从不",
  "有时",
  "约一半时间",
  "大多数时间",
  "几乎总是",
];

const LABELS_5_POINT_AGREE = ["强烈反对", "反对", "中立", "同意", "强烈同意"];

const LABELS_4_POINT_AGREE = ["强烈反对", "反对", "同意", "强烈同意"];

const Quiz = () => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);

  // 将题目按章节分组
  const sections = useMemo(() => {
    const list = [];

    // 1. Profile Section
    list.push({
      id: "profile",
      title: "个人资料",
      description: "请告诉我们一些关于您的基本信息。",
      items: questions.profile.map((q) => ({ ...q, uniqueId: q.id })),
    });

    // 2. Attachment Sections (Mother, Father, Partner, General)
    questions.attachment.sections.forEach((section) => {
      list.push({
        id: section.id,
        title: section.title_zh,
        description: section.description_zh,
        items: questions.attachment.items.map((item) => {
          // 特殊处理：General部分的“这个人”改为“他人”
          let text_zh = item.text_zh;
          if (section.id === "general") {
            text_zh = text_zh.replace(/这个人/g, "他人");
          }
          return {
            ...item,
            text_zh,
            uniqueId: `${section.id}_${item.id}`,
            min: 1,
            max: 7,
            labels: LABELS_7_POINT,
          };
        }),
      });
    });

    // 3. Self Esteem Section
    list.push({
      id: "selfEsteem",
      title: "自尊量表",
      description: "请表明您对以下关于您自己的一般感受的陈述的同意程度。",
      items: questions.selfEsteem.map((q, idx) => ({
        ...q,
        id: `se_${idx}`,
        uniqueId: `se_${idx}`,
        min: 1,
        max: 5,
        labels: LABELS_5_POINT_AGREE,
      })),
    });

    // 4. ERQ Section
    list.push({
      id: "erq",
      title: "情绪调节策略量表",
      description: "请表明您对以下关于您情绪调节方式的陈述的同意程度。",
      items: questions.erq.map((q, idx) => ({
        ...q,
        id: `erq_${idx}`,
        uniqueId: `erq_${idx}`,
        min: 1,
        max: 5,
        labels: LABELS_5_POINT,
      })),
    });

    return list;
  }, []);

  const currentSection = sections[currentSectionIndex];
  const totalSections = sections.length;
  const progress = ((currentSectionIndex + 1) / totalSections) * 100;

  // 滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentSectionIndex]);

  const handleAnswer = (uniqueId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [uniqueId]: value,
    }));
  };

  // 检查当前章节是否全部完成
  const isCurrentSectionComplete = () => {
    return currentSection.items.every((item) => {
      const val = answers[item.uniqueId];
      return val !== undefined && val !== null && val !== "";
    });
  };

  const handleNext = () => {
    if (currentSectionIndex < totalSections - 1) {
      setCurrentSectionIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePrev = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((prev) => prev - 1);
    }
  };

  const finishQuiz = () => {
    setIsFinished(true);
    console.log("Answers:", answers);
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentSectionIndex(0);
    setIsFinished(false);
    window.scrollTo(0, 0);
  };

  const renderInput = (item) => {
    const val = answers[item.uniqueId];

    if (item.type === "choice") {
      return (
        <div className="options-container">
          {item.options.map((opt) => (
            <button
              key={opt.value}
              className={`option-btn ${val === opt.value ? "selected" : ""}`}
              onClick={() => handleAnswer(item.uniqueId, opt.value)}
            >
              {opt.label_zh}
            </button>
          ))}
        </div>
      );
    }

    if (item.type === "text") {
      return (
        <input
          type="text"
          className="text-input"
          value={val || ""}
          onChange={(e) => handleAnswer(item.uniqueId, e.target.value)}
          placeholder="请输入..."
        />
      );
    }

    // Slider
    return (
      <Slider
        value={val}
        onChange={(newValue) => handleAnswer(item.uniqueId, newValue)}
        min={item.min}
        max={item.max}
        labels={item.labels}
      />
    );
  };

  if (isFinished) {
    return <ResultPage answers={answers} onRestart={handleRestart} />;
  }

  return (
    <div className="quiz-container">
      {/* 进度条 */}
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      {/* 章节标题 */}
      <div className="section-header">
        <h2>{currentSection.title}</h2>
        {currentSection.description && <p>{currentSection.description}</p>}
      </div>

      {/* 渲染当前章节的所有题目 */}
      <div className="questions-list">
        {currentSection.items.map((item, index) => (
          <div key={item.uniqueId} className="card question-card">
            <div className="question-meta">
              Question {index + 1} of {currentSection.items.length}
            </div>

            <h3 className="question-text">{item.text_zh}</h3>
            {item.text_en && <p className="question-subtext">{item.text_en}</p>}

            <div className="input-area">{renderInput(item)}</div>
          </div>
        ))}
      </div>

      <div className="navigation-buttons">
        <button
          className="btn secondary"
          onClick={handlePrev}
          disabled={currentSectionIndex === 0}
        >
          上一页
        </button>
        <button
          className="btn primary"
          onClick={handleNext}
          disabled={!isCurrentSectionComplete()}
        >
          {currentSectionIndex === totalSections - 1 ? "提交" : "下一页"}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
