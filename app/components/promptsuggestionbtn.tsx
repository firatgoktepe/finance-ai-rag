const PromptSuggestionBtn = ({ text, onClick }) => {
  return (
    <button type="button" className="prompt-sug-btn" onClick={onClick}>
      {text}
    </button>
  );
};

export default PromptSuggestionBtn;
