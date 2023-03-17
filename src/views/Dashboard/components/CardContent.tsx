import ChartWrapper from 'components/Charts/ChartWrapper';
import Typography from 'components/Typography';
import { createUseStyles } from 'react-jss';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { ALLOWED_MARKDOWN_ELEMENTS } from 'utils/constants';
import remarkGfm from 'remark-gfm';

const useStyles = createUseStyles({
  chart: {
    height: '90%',
    marginTop: '10px',
    width: '100%',
  },
});

type CardContentProps = {
  content: any;
};

export default function CardContent({
  content,
}: CardContentProps): JSX.Element {
  const styles = useStyles();
  if (content.elementType === 'text') {
    if (content.content.format === 'markdown') {
      return (
        <ReactMarkdown
          allowedElements={ALLOWED_MARKDOWN_ELEMENTS}
          remarkPlugins={[remarkGfm]}
        >
          {content.content.text}
        </ReactMarkdown>
      );
    }
    return <Typography variant='h4'>{content.content.text}</Typography>;
  } else {
    return (
      <>
        <Typography variant='h5'>Chart Name</Typography>
        <div className={styles.chart}>
          <ChartWrapper
            chartType={content.content.chartType}
            color={content.content.color}
            data={content.content.data}
            xKey={content.content.xKey}
            yKey={content.content.yKey}
          />
        </div>
      </>
    );
  }
}
