import ReactMarkdown from "react-markdown";

const markdownComponents = {
  p: ({ children }: any) => <p className="bub">{children}</p>,
  strong: ({ children }: any) => <strong className="bub">{children}</strong>,
  ul: ({ children }: any) => <ul className="bub">{children}</ul>,
  li: ({ children }: any) => (
    <li className="bub">
      (<span className="bub">✅</span>
      <span>{children}</span>)
    </li>
  ),
  a: ({ children }: any) => <a className="bub">{children}</a>,
  h1: ({ children }: any) => <h1>{children}</h1>,
  h2: ({ children }: any) => <h2>{children}</h2>,
  h3: ({ children }: any) => <h3>{children}</h3>,
};

const Bubble = ({ message }) => {
  const { content, role } = message;
  return (
    <div className={`${role} bub`}>
      <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
    </div>
  );
};

export default Bubble;
