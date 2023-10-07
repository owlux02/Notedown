import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter';
import {
  materialDark,
  materialLight,
} from 'react-syntax-highlighter';

import { CopyIcon, PasteIcon, SunIcon, MoonIcon } from './assets/assets';
import styles from './styles.module.css';

const CodeMD = ({ children, language, isDark, setIsDark }: any) => {
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
        <button onClick={() => setIsDark(!isDark)}>
          {isDark ? <MoonIcon /> : <SunIcon />}
        </button>

        <CopyToClipboard text={children}>
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
        style={isDark ? materialDark : materialLight}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeMD;
