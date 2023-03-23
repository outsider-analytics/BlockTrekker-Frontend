import {
  addWidgetToDashboard,
  getDashboard,
  saveDashboard,
} from 'api/dashboardApi';
import Button from 'components/Button';
import Flex from 'components/Flex';
import ConfirmationModal from 'components/Modal/ConfirmationModal';
import MainLayout from 'layouts/MainLayout';
import { RootLocation } from 'locations';
import { useEffect, useMemo, useState } from 'react';
import GridLayout, { Layout, WidthProvider } from 'react-grid-layout';
import { AiFillCloseCircle, AiFillEdit, AiFillSave } from 'react-icons/ai';
import { FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import { createUseStyles } from 'react-jss';
import { useNavigate, useParams } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';

import CardContent from './components/CardContent';
import DashboardTextModal from './components/DashboardTextModal';
import DashboardVisualizationModal from './components/DashboardVisualizationModal';
import { COLUMNS, DEFAULT_LAYOUT, ROW_HEIGHT } from './constants';

const ResponsiveGridLayout = WidthProvider(GridLayout);

const useStyles = createUseStyles({
  back: {
    color: '#FCFCFC',
    cursor: 'pointer',
  },
  card: ({ isEditing }: { isEditing: boolean }) => ({
    backgroundColor: '#34383D',
    borderRadius: '4px',
    boxSizing: 'border-box',
    color: '#FCFCFC',
    cursor: isEditing ? 'move' : 'default',
    fontSize: '24px',
    overflow: 'hidden',
    padding: '16px 40px 16px 16px',
    position: 'relative',
    wordWrap: 'break-word',
  }),
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
  // TODO: Change from any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any;
};

export default function Dashboard(): JSX.Element {
  const { address } = useParams();
  const navigate = useNavigate();
  // TODO: Change from any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editedLayout, setEditedLayout] = useState<any[] | undefined>(
    undefined
  );
  const [isEditing, setIsEditing] = useState(false);
  const styles = useStyles({ isEditing });
  const [layout, setLayout] = useState<LayoutWidget[]>([]);
  const [loading, setLoading] = useState(true);
  const [neverSaved, setNeverSaved] = useState(false);
  // TODO: Change from any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [queryData, setQuerydata] = useState<{ [key: string]: any[] }>({});
  const [saving, setSaving] = useState(false);
  const [showRemove, setShowRemove] = useState(-1);
  const [showVisualizationModal, setShowVisualizationModal] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);

  // TODO: Change from any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addVisulization = async (visualization: any) => {
    if (!address) return;
    const widget = generateNewWidget(visualization, 'visualization');
    let res;
    if (neverSaved) {
      const dashboard = transformDashboardForSave([...layout, widget]);
      // TODO: Clean this up and make more efficient
      res = await addWidgetToDashboard(address, {
        dashboard,
        widget,
      });
    } else {
      res = await addWidgetToDashboard(address, {
        widget,
      });
    }
    const { queryId, results } = await res.json();
    setQuerydata((prev) => ({
      [queryId]: results,
      ...prev,
    }));
    setLayout((prev) => [...prev, widget]);
    setNeverSaved(false);
    setShowVisualizationModal(false);
  };

  const addText = async (format: string, text: string) => {
    if (!address) return;
    const content = { format, text };
    const widget = generateNewWidget(content, 'text');
    if (neverSaved) {
      const dashboard = transformDashboardForSave([...layout, widget]);
      // TODO: Clean this up and make more efficient
      await addWidgetToDashboard(address, {
        dashboard,
        widget,
      });
    } else {
      await addWidgetToDashboard(address, {
        widget,
      });
    }
    setLayout((prev) => [...prev, widget]);
    setNeverSaved(false);
    setShowTextModal(false);
  };

  const cancelEdit = () => {
    setEditedLayout(undefined);
    setIsEditing(false);
  };

  // TODO: Change from any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataToLayout = (data: any) => {
    // TODO: Change from any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((item: any) => {
      const { gridInstructions, ...rest } = item;
      return { gridInstructions, item: rest };
    });
  };

  // TODO: Change from any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const decrementIds = (index: number, widgets: any[]) => {
    for (let i = index; i < widgets.length; i++) {
      const prevId = widgets[i].gridInstructions.id;
      widgets[i].gridInstructions.id = `${Number(prevId) - 1}`;
    }
    return widgets;
  };

  // TODO: Change from any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const generateNewWidget = (content: any, elementType: string) => {
    const maxes = layout.reduce(
      (max, { gridInstructions }) => {
        const maxI = Math.max(max[0], Number(gridInstructions.i));
        const maxY = Math.max(max[1], gridInstructions.y);
        return [maxI, maxY];
      },
      [0, 0]
    );
    const widget = {
      gridInstructions: {
        i: `${maxes[0] + 1}`,
        h: elementType === 'text' && content.format === 'plaintext' ? 1 : 3,
        w: 6,
        x: 0,
        y: maxes[1] + 1,
      },
      item: { content, elementType },
    };
    return widget;
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
        return decrementIds(showRemove, copy);
      } else {
        prev.splice(showRemove, 1);
        return decrementIds(showRemove, prev);
      }
    });
    setShowRemove(-1);
  };

  const save = async () => {
    setSaving(true);
    if (!address || !editedLayout) return;
    const dashboard = transformDashboardForSave(editedLayout);
    await saveDashboard(address, dashboard);
    setSaving(false);
    setLayout(editedLayout.slice());
    setEditedLayout(undefined);
    setIsEditing(false);
  };

  // TODO: Change from any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformDashboardForSave = (dashboard: any[]) => {
    return dashboard.slice().map(({ gridInstructions, item }) => {
      if (item.elementType === 'visualization') {
        // If query id exists then visualization is not default
        if (item.content.id) {
          const { data, ...rest } = item.content;
          return {
            item: {
              content: rest,
              ...item,
            },
            gridInstructions,
          };
        }
        // Store all chart info for default visuzalization
        return { gridInstructions, item };
      }
      return { gridInstructions, item };
    });
  };

  const visualizations = useMemo(() => {
    return layout
      .filter(
        (widget) =>
          widget.item.elementType === 'visualization' && widget.item.content.id
      )
      .map((widget) => widget.item.content.id);
  }, [layout]);

  useEffect(() => {
    if (!address) return;
    (async () => {
      const res = await getDashboard(address);
      const { dashboard, queryData } = await res.json();
      if (!dashboard) {
        const layoutWidgets = dataToLayout(DEFAULT_LAYOUT);
        setLayout(layoutWidgets);
        setNeverSaved(true);
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
          alignItems="center"
          direction="column"
          justifyContent="center"
          style={{ minHeight: 'calc(100vh - 120px)' }}
        >
          <FadeLoader color="#5451FF" />
        </Flex>
      ) : (
        <>
          <FiArrowLeft
            className={styles.back}
            onClick={() => navigate(RootLocation)}
          />
          <Flex alignItems="center" justifyContent="space-between" mb="12px">
            <div className={styles.header}>Dashboard</div>
            <Flex gap="16px">
              {isEditing ? (
                <Button disabled={saving} onClick={() => cancelEdit()}>
                  <Flex alignItems="center" gap="8px">
                    <div>Cancel</div>
                    <AiFillCloseCircle />
                  </Flex>
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => setShowTextModal(true)}
                    text="Add text"
                  />
                  <Button
                    onClick={() => setShowVisualizationModal(true)}
                    text="Add visualization"
                  />
                </>
              )}
              <Button
                disabled={saving || (isEditing && !editedLayout)}
                onClick={() => (isEditing ? save() : setIsEditing(true))}
              >
                <Flex alignItems="center" gap="8px">
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
                        <FiTrash2
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
          <DashboardVisualizationModal
            existingVisualiztions={visualizations}
            onClose={() => setShowVisualizationModal(false)}
            onFinish={(viz) => addVisulization(viz)}
            open={showVisualizationModal}
          />
          <DashboardTextModal
            onClose={() => setShowTextModal(false)}
            onFinish={addText}
            open={showTextModal}
          />
          <ConfirmationModal
            actionText="Remove"
            onClose={() => setShowRemove(-1)}
            onFinish={() => removeItem()}
            open={showRemove >= 0}
            title="Remove?"
          />
        </>
      )}
    </MainLayout>
  );
}
