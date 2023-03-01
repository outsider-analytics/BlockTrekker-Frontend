import { createUseStyles } from 'react-jss';
import GridLayout, { Layout, WidthProvider } from 'react-grid-layout';
import { useEffect, useMemo, useState } from 'react';
import { COLUMNS, DEFAULT_LAYOUT, ROW_HEIGHT, WIDTH } from './constants';
import { useParams } from 'react-router-dom';
import ChartWrapper from 'components/Charts/ChartWrapper';
import Button from 'components/Button';
import MainLayout from 'layouts/MainLayout';
import Flex from 'components/Flex';
import { AiFillCloseCircle, AiFillEdit, AiFillSave } from 'react-icons/ai';
import { Trash2 } from 'react-feather';
import AddVisualizationModal from './components/AddVisualizationModal';
import { getDashboard, saveDashboard } from 'api/dashboardApi';
import CardContent from './components/CardContent';
import { FadeLoader } from 'react-spinners';
import RemoveModal from 'components/Modal/RemoveModal';
import { addVisualizationToDashboard } from 'api/dashboardApi';

const ResponsiveGridLayout = WidthProvider(GridLayout);

const useStyles = createUseStyles({
  card: {
    backgroundColor: '#34383D',
    borderRadius: '4px',
    boxSizing: 'border-box',
    color: '#FCFCFC',
    fontSize: '24px',
    padding: '16px 40px 16px 16px',
    position: 'relative',
  },
  gridLayout: {
    padding: '0px',
    width: '100%',
  },
  header: {
    color: '#FCFCFC',
    fontSize: '48px',
    fontWeight: 500,
  },
});

export type GridInstructions = {
  h: number;
  i: string;
  w: number;
  x: number;
  y: number;
};

type LayoutWidget = {
  gridInstructions: GridInstructions;
  item: any;
};

export default function Dashboard(): JSX.Element {
  const { address } = useParams();
  const styles = useStyles();
  const [editedLayout, setEditedLayout] = useState<any[] | undefined>(
    undefined
  );
  const [isEditing, setIsEditing] = useState(false);
  const [layout, setLayout] = useState<LayoutWidget[]>([]);
  const [loading, setLoading] = useState(true);
  const [queryData, setQuerydata] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [showRemove, setShowRemove] = useState(-1);
  const [showVisualizationModal, setShowVisualizationModal] = useState(false);

  const addVisulization = async (visualization: any) => {
    if (!address) return;
    const maxY = layout.reduce((max, { gridInstructions }) => {
      return Math.max(max, gridInstructions.y);
    }, 0);
    const gridInstructions = {
      i: `${layout.length + 1}`,
      h: 3,
      w: 6,
      x: 0,
      y: maxY + 1,
    };
    const res = await addVisualizationToDashboard(address, {
      gridInstructions,
      item: { content: visualization, elementType: 'visualization' },
    });
    setShowVisualizationModal(false);
  };

  const cancelEdit = () => {
    setEditedLayout(undefined);
    setIsEditing(false);
  };

  const dataToLayout = (data: any) => {
    return data.map((item: any) => {
      const { gridInstructions, ...rest } = item;
      return { gridInstructions, item: rest };
    });
  };

  const grid = useMemo(() => {
    return (editedLayout ?? layout).map(
      ({ gridInstructions }) => gridInstructions
    );
  }, [editedLayout, layout]);

  const onLayoutChange = (newLayout: Layout[]) => {
    if (!isEditing) return;
    setEditedLayout((prev) => {
      if (prev) {
        return prev.map((widget, index) => {
          const { h, i, w, x, y } = newLayout[index];
          return {
            gridInstructions: { h, i, w, x, y },
            item: widget.item,
          };
        });
      } else {
        const copy = layout.slice();
        return copy.map((widget, index) => {
          const { h, i, w, x, y } = newLayout[index];
          return {
            gridInstructions: { h, i, w, x, y },
            item: widget.item,
          };
        });
      }
    });
  };

  const removeItem = () => {
    setEditedLayout((prev) => {
      if (!prev) {
        const copy = layout.slice();
        copy.splice(showRemove, 1);
        return copy;
      } else {
        prev.splice(showRemove, 1);
        return prev;
      }
    });
    setShowRemove(-1);
  };

  const save = async () => {
    setSaving(true);
    if (!address || !editedLayout) return;
    const dashboard = editedLayout.slice().map((item) => {
      if (item.elementType === 'visualization') {
        // If query id exists then visualization is not default
        if (item.content.id) {
          const { data, ...rest } = item.content;
          return {
            content: rest,
            ...item,
          };
        }
        // Store all chart info for default visuzalization
        return item;
      }
      return item;
    });
    await saveDashboard(address, { queries: [], dashboard });
    setLayout(editedLayout.slice());
    setEditedLayout(undefined);
    setIsEditing(false);
  };

  useEffect(() => {
    if (!address) return;
    (async () => {
      const res = await getDashboard(address);
      const { dashboard, queryData } = await res.json();
      if (!dashboard) {
        const layoutWidgets = dataToLayout(DEFAULT_LAYOUT);
        setLayout(layoutWidgets);
      } else {
        setLayout(dashboard.dashboardWidgets);
      }
      setQuerydata(queryData);
      setLoading(false);
    })();
  }, [address]);

  return (
    <MainLayout>
      {loading ? (
        <Flex
          alignItems='center'
          direction='column'
          justifyContent='center'
          style={{ minHeight: 'calc(100vh - 120px)' }}
        >
          <FadeLoader color='#5451FF' />
        </Flex>
      ) : (
        <>
          <Flex alignItems='center' justifyContent='space-between' mb='12px'>
            <div className={styles.header}>Dashboard</div>
            <Flex gap='16px'>
              {isEditing ? (
                <Button disabled={saving} onClick={() => cancelEdit()}>
                  <Flex alignItems='center' gap='8px'>
                    <div>Cancel</div>
                    <AiFillCloseCircle />
                  </Flex>
                </Button>
              ) : (
                <Button
                  onClick={() => setShowVisualizationModal(true)}
                  text='Add visualization'
                />
              )}
              <Button
                disabled={saving || (isEditing && !editedLayout)}
                onClick={() => (isEditing ? save() : setIsEditing(true))}
              >
                <Flex alignItems='center' gap='8px'>
                  {isEditing ? (
                    <>
                      <div>{saving ? 'Saving...' : 'Save'}</div>
                      <AiFillSave />
                    </>
                  ) : (
                    <>
                      <div>Edit</div>
                      <AiFillEdit />
                    </>
                  )}
                </Flex>
              </Button>
            </Flex>
          </Flex>
          <ResponsiveGridLayout
            className={styles.gridLayout}
            cols={COLUMNS}
            containerPadding={[0, 0]}
            isDraggable={isEditing}
            isResizable={isEditing}
            layout={grid}
            onLayoutChange={onLayoutChange}
            rowHeight={ROW_HEIGHT}
          >
            {(editedLayout ?? layout).map(
              ({ gridInstructions, item }, index) => {
                if (item.elementType === 'visualization' && item.content.id) {
                  const queryId = item.content.id.split('-')[0];
                  item.content = { ...item.content, data: queryData[queryId] };
                }
                return (
                  <div className={styles.card} key={gridInstructions.i}>
                    <Flex
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '10px',
                      }}
                    >
                      {isEditing && (
                        <Trash2
                          onClick={() => setShowRemove(index)}
                          size={16}
                          style={{ cursor: 'pointer' }}
                        />
                      )}
                    </Flex>
                    <CardContent content={item} />
                  </div>
                );
              }
            )}
          </ResponsiveGridLayout>
          <AddVisualizationModal
            existingVisualiztions={[]}
            onClose={() => setShowVisualizationModal(false)}
            onFinish={(viz) => addVisulization(viz)}
            open={showVisualizationModal}
          />
          <RemoveModal
            onClose={() => setShowRemove(-1)}
            onRemove={() => removeItem()}
            open={showRemove >= 0}
          />
        </>
      )}
    </MainLayout>
  );
}
