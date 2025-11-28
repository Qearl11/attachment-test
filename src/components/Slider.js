import React from "react";
import "./Slider.css";

const Slider = ({ value, onChange, min = 1, max = 7, labels }) => {
  // 如果没有传入 labels，生成默认的数字标签
  const displayLabels =
    labels || Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const count = displayLabels.length;

  const handleChange = (e) => {
    onChange(Number(e.target.value));
  };

  // 计算对齐样式
  // 1. Input 宽度 = (N-1)/N * 100%
  // 2. Input 左边距 = 1/(2N) * 100%
  // 这样 Input 的两端正好对齐第一个和最后一个 Label 的中心
  const widthPercent = ((count - 1) / count) * 100;
  const offsetPercent = (1 / (2 * count)) * 100;

  const inputStyle = {
    width: `${widthPercent}%`,
    marginLeft: `${offsetPercent}%`,
  };

  // 计算背景进度条样式 (紫色填充)
  // 注意：这里的 percentage 是相对于 input 宽度的
  const percentage = value ? ((value - min) / (max - min)) * 100 : 0;

  const trackFillStyle = {
    width: `${percentage}%`,
  };

  // 获取当前选中的标签文本
  const currentLabelText = value ? displayLabels[value - min] : "";

  return (
    <div className="slider-container">
      {/* 当前值显示 */}
      <div className={`slider-current-value ${value ? "visible" : ""}`}>
        {currentLabelText}
      </div>

      {/* 自定义轨道层 (位于 Input 下方) */}
      <div className="slider-track-layer" style={inputStyle}>
        <div className="slider-track-bg"></div>
        {value && percentage > 0 && (
          <div className="slider-track-fill" style={trackFillStyle}></div>
        )}
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value || Math.ceil((max + min) / 2)}
        onChange={handleChange}
        onClick={handleChange}
        className={`slider-input ${value ? "has-value" : ""}`}
        style={inputStyle}
      />

      <div className="slider-labels">
        {displayLabels.map((label, index) => {
          const val = min + index;
          const isActive = value === val;

          return (
            <div
              key={val}
              className={`slider-label-item ${isActive ? "active" : ""}`}
              onClick={() => onChange(val)}
            >
              {/* 小圆点 (作为 Label 的一部分，点击 Label 即可触发) */}
              <div className="slider-dot"></div>
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Slider;
