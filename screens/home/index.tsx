import { useSQLiteContext } from 'expo-sqlite';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RN from '../../components/RN';
import { TodoAddButton, TodoList, TodoModal } from '../../components/Todo';
import { todoStore } from '../../store/todo.store';
import { COLORS } from '../../constants/colors';

const HomeScreen = () => {
  const db = useSQLiteContext();

  useEffect(() => {
    const initialize = async () => {
      try {
        await todoStore.initialize(db);
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };

    initialize();
  }, [db]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <RN.View style={styles.container}>
        <TodoList />
        <TodoAddButton />
        <TodoModal />
      </RN.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
  },
});

export default observer(HomeScreen);
