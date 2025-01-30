import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';

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
  table: ({ children }: any) => <table className="finance-table">{children}</table>,
  thead: ({ children }: any) => <thead>{children}</thead>,
  tbody: ({ children }: any) => <tbody>{children}</tbody>,
  tr: ({ children }: any) => <tr>{children}</tr>,
  th: ({ children }: any) => <th className="finance-table-header">{children}</th>,
  td: ({ children }: any) => <td className="finance-table-cell">{children}</td>,
};

const Bubble = ({ message }) => {
  const { content, role } = message;
  return (
    <div className={`${role} bub`}>
      <ReactMarkdown 
        components={markdownComponents}
        rehypePlugins={[rehypeRaw]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Bubble;
