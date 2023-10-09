import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx'
import { materialDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import { CopyIcon, PasteIcon } from './assets/assets';
import styles from './styles.module.css';

const CodeMD = ({ children, language }: any) => {
  const [isCopied, setIsCopied] = useState(false);

  SyntaxHighlighter.registerLanguage('jsx', jsx);

  const setCopied = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  return (
    <div className={styles.code}>
      <div className={styles.codeIcons}>
        <CopyToClipboard text={children.props.children}>
          <button onClick={() => setCopied()}>
            {isCopied ? (
              <span title="Copied!">
                <PasteIcon />
              </span>
            ) : (
              <span title="Copy to Clipboard">
                <CopyIcon />
              </span>
            )}
          </button>
        </CopyToClipboard>
      </div>

      <SyntaxHighlighter
        language={language}
        style={materialDark}
      >
        {children.props.children}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeMD;
