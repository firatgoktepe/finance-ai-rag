const PromptSuggestionBtnMobile = ({ text, onClick }) => {
  return (
    <button className="prompt-sug-btn" onTouchStart={onClick}>
      {text}
    </button>
  );
};

export default PromptSuggestionBtnMobile;
