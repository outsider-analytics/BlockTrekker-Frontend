import Button from 'components/Button';
import Flex from 'components/Flex';
import Input from 'components/Input';
import Modal, { DefaultModalProps } from 'components/Modal';
import Typography from 'components/Typography';
import { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import remarkGfm from 'remark-gfm';
import { ALLOWED_MARKDOWN_ELEMENTS } from 'utils/constants';

const useStyles = createUseStyles({
  markdown: {
    height: 'calc(100% - 120px)',
    overflowY: 'auto',
    // width: '100%',
  },
  markdownSection: {
    color: '#FCFCFC',
    wordWrap: 'break-word',
  },
});

type DashboardTextModalProps = {
  onFinish: (format: string, text: string) => void;
} & DefaultModalProps;

export default function DashboardTextModal({
  onClose,
  onFinish,
  open,
}: DashboardTextModalProps): JSX.Element {
  const styles = useStyles();
  const [renderMarkdown, setRenderMarkdown] = useState<boolean>(false);
  const [text, setText] = useState<string>('');

  useEffect(() => {
    if (open) {
      setRenderMarkdown(false);
      setText('');
    }
  }, [open]);

  return (
    <Modal
      onClose={onClose}
      open={open}
      style={{
        padding: '24px',
        width: `min(${renderMarkdown ? '1000px' : '500px'}, 100%)`,
      }}
    >
      <Flex
        alignItems="center"
        justifyContent="space-between"
        style={{ color: '#FCFCFC' }}
      >
        <Typography variant="h5">Add text</Typography>
        <Flex gap="16px">
          <label>
            <input
              checked={!renderMarkdown}
              onChange={() => setRenderMarkdown(false)}
              type="checkbox"
            />
            Plaintext
          </label>
          <label>
            <input
              checked={renderMarkdown}
              onChange={() => setRenderMarkdown(true)}
              type="checkbox"
            />
            Markdown
          </label>
        </Flex>
      </Flex>
      <Flex
        gap="16px"
        justifyContent="center"
        mt="12px"
        style={{ height: '100%', width: '100%' }}
      >
        <Input
          onChange={(e) => setText(e.target.value)}
          rows={23}
          style={{ height: 'calc(100% - 120px)' }}
          value={text}
          textarea
          title="Text"
          wrapperStyle={{
            flex: renderMarkdown ? 0.5 : 1,
            width: renderMarkdown ? '50%' : '100%',
          }}
        />
        {renderMarkdown && (
          <div
            className={styles.markdownSection}
            style={{
              flex: renderMarkdown ? 0.5 : 1,
              width: renderMarkdown ? '50%' : '100%',
            }}
          >
            <Typography style={{ textAlign: 'center' }} variant="h6">
              Rendered Markdown
            </Typography>
            <ReactMarkdown
              allowedElements={ALLOWED_MARKDOWN_ELEMENTS}
              className={styles.markdown}
              remarkPlugins={[remarkGfm]}
            >
              {text}
            </ReactMarkdown>
          </div>
        )}
      </Flex>
      <Flex
        justifyContent="space-between"
        style={{
          bottom: '24px',
          left: '24px',
          position: 'absolute',
          width: 'calc(100% - 48px)',
        }}
      >
        <Button onClick={() => onClose()} text="Close" />
        <Button
          onClick={() =>
            onFinish(renderMarkdown ? 'markdown' : 'plaintext', text)
          }
          text="Save"
        />
      </Flex>
    </Modal>
  );
}
