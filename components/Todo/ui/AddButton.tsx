import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import RN from '../../RN';
import { addAlpha, COLORS } from '../../../constants/colors';
import { useCallback } from 'react';
import { todoStore } from '../../../store/todo.store';

export default function AddButton() {
  const onCreateTask = useCallback(() => {
    todoStore.showModal();
  }, []);

  return (
    <RN.TouchableOpacity style={styles.shadow} onPress={onCreateTask}>
      <LinearGradient
        colors={[COLORS.orange, COLORS.deepOrange]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.button}
      >
        <MaterialIcons name={'add'} size={28} color={COLORS.white} />
      </LinearGradient>
    </RN.TouchableOpacity>
  );
}

const styles = RN.StyleSheet.create({
  shadow: {
    shadowColor: addAlpha(COLORS.orange, 0.5),
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
  },
});
