import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyIcon, PasteIcon } from './assets/assets';
import styles from './styles.module.css';

const CodeMD = ({ children }: any) => {
  const [isCopied, setIsCopied] = useState(false);

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

      <pre>{children.props.children}</pre>
    </div>
  );
};

export default CodeMD;
