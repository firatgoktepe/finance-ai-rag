import useIsMobile from "../hooks/useIsMobile";
import PromptSuggestionBtn from "./promptsuggestionbtn";
import PromptSuggestionBtnMobile from "./promptSuggestionBtnMobile";

const PromptSuggestion = ({ onPromptClick }) => {
  const useMobile = useIsMobile();
  const prompts = [
    "who is founder of stock?",
    "what is difference between mutual fund and stock?",
    "How can maintain Financial things?",
    "Which is best Mutual fund or stock?",
  ];
  return (
    <div className="prompt-sug">
      {!useMobile
        ? prompts.map((prompt, index) => (
            <PromptSuggestionBtn
              key={`suggestion-${index}`}
              text={prompt}
              onClick={() => onPromptClick(prompt)}
            />
          ))
        : prompts.map((prompt, index) => (
            <PromptSuggestionBtnMobile
              key={`suggestion-${index}`}
              text={prompt}
              onClick={() => onPromptClick(prompt)}
            />
          ))}
    </div>
  );
};

export default PromptSuggestion;
