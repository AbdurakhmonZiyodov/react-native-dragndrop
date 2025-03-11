import { useSQLiteContext } from 'expo-sqlite';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import DraggableFlatList, { RenderItem } from 'react-native-draggable-flatlist';
import { Task } from '../../../@types/todo.types';
import { COLORS } from '../../../constants/colors';
import { SIZES } from '../../../constants/dimensions';
import { todoStore } from '../../../store/todo.store';
import RN from '../../RN';
import Item from './Item';

const TodoList = () => {
  const db = useSQLiteContext();
  const data = toJS(todoStore.list);

  const handleDragEnd = useCallback(
    async ({ data: reorderedData }: { data: Task[] }) => {
      await todoStore.updateTaskPositions(db, reorderedData);
    },
    [db],
  );

  const renderItem: RenderItem<Task> = useCallback(
    ({ item, drag, isActive, getIndex }) => (
      <Item
        item={item}
        drag={drag}
        isActive={isActive}
        index={getIndex() || 0}
      />
    ),
    [],
  );

  const renderEmptyComponent = useCallback(
    () => (
      <RN.View pt={SIZES.height * 0.45}>
        <RN.Text style={styles.emptyText}>
          {'You currently have no tasks.'}
        </RN.Text>
      </RN.View>
    ),
    [],
  );

  return (
    <RN.View style={styles.container}>
      <DraggableFlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        onDragEnd={handleDragEnd}
        ListEmptyComponent={renderEmptyComponent}
      />
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.gray,
    textAlign: 'center',
  },
});

export default observer(TodoList);
