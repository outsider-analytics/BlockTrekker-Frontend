import ChartWrapper from 'components/Charts/ChartWrapper';
import Typography from 'components/Typography';
import { createUseStyles } from 'react-jss';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import remarkGfm from 'remark-gfm';
import { truncateText } from 'utils';
import { ALLOWED_MARKDOWN_ELEMENTS } from 'utils/constants';

const useStyles = createUseStyles({
  chart: {
    height: '90%',
    marginTop: '10px',
    width: '100%',
  },
});

type CardContentProps = {
  // TODO: Change from any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    return <Typography variant="h4">{content.content.text}</Typography>;
  } else {
    return (
      <>
        <Typography variant="h5">
          {content.content.name ||
            (() => {
              const id = content.content.id.split('-');
              return `${truncateText(id[0])} / Viz ${id[1]}`;
            })()}
        </Typography>
        <div className={styles.chart}>
          <ChartWrapper
            chartType={content.content.chartType}
            color={content.content.color}
            data={content.content.data}
            grid={content.content.renderGrid}
            scale={content.content.scale}
            stackBy={
              content.content.stackBy
                ? {
                    stackColumn: content.content.stackBy,
                    valueColumn: content.content.yKey,
                  }
                : undefined
            }
            xAxisTitle={content.content.xAxisTitle}
            xKey={content.content.xKey}
            yAxisTitle={content.content.yAxisTitle}
            yKey={content.content.yKey}
          />
        </div>
      </>
    );
  }
}
