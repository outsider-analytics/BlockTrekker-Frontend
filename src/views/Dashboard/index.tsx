import { createUseStyles } from 'react-jss';
import RGL, { WidthProvider } from 'react-grid-layout';
import { useEffect, useState } from 'react';
import { COLUMNS, ROW_HEIGHT, WIDTH } from './constants';
import { useParams } from 'react-router-dom';
import { getAllVisualizations } from 'api/visualizationApi';
import ChartWrapper from 'components/Charts/ChartWrapper';

const ReactGridLayout = WidthProvider(RGL);

const useStyles = createUseStyles({
  card: {
    backgroundColor: '#34383D',
    borderRadius: '4px',
  },
});

export default function Dashboard(): JSX.Element {
  const { address } = useParams();
  const styles = useStyles();
  const [layout, setLayout] = useState<any[]>([]);

  useEffect(() => {
    // if (!address) return;
    // (async () => {
    //   const res = await getAllVisualizations(address);
    //   const data = await res.json();
    //   const arr: any[] = [];
    //   let index = 0;
    //   data.results.forEach((query: any) => {
    //     arr.push(
    //       ...query.visualizations.map((viz: any) => {
    //         index++;
    //         return {
    //           index,
    //           viz,
    //           results: query.results,
    //           x: index * 4,
    //           y: 0,
    //           w: 8,
    //           h: 2,
    //         };
    //       })
    //     );
    //   });
    //   setLayout(arr);
    // })();
  }, [address]);

  return (
    <div>
      <ReactGridLayout
        className='layout'
        cols={COLUMNS}
        layout={layout}
        rowHeight={ROW_HEIGHT}
        width={WIDTH}
      >
        {layout.map((item) => (
          <div className={styles.card} key={item.index}>
            <ChartWrapper
              chartType={item.viz.chartType}
              color={item.viz.color}
              rows={item.results}
              xKey={item.viz.xKey}
              yKey={item.viz.yKey}
            />
          </div>
        ))}
      </ReactGridLayout>
    </div>
  );
}
