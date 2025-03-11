import { BlurView } from 'expo-blur';
import { useSQLiteContext } from 'expo-sqlite';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useMemo } from 'react';
import RNModal from 'react-native-modal';
import { addAlpha, COLORS } from '../../../constants/colors';
import { todoStore } from '../../../store/todo.store';
import RN from '../../RN';
import { isEmpty } from 'lodash';
import { isAndroid } from '../../../constants/platform';

const Modal = () => {
  const {
    changeInput,
    hideModal,
    inputValue,
    modalVisiblity,
    selectedTask,
    editTask,
    createTask,
  } = todoStore;
  const db = useSQLiteContext();

  const isCreate = useMemo(() => isEmpty(selectedTask), [selectedTask]);
  const inputPlaceholder = useMemo(
    () => (isCreate ? 'Enter new task' : 'Edit your task'),
    [isCreate],
  );
  const btnText = useMemo(() => (isCreate ? 'Create' : 'Update'), [isCreate]);
  const modalTitle = useMemo(
    () => (isCreate ? 'Add New Task' : 'Edit Task'),
    [isCreate],
  );

  const onClose = useCallback(() => {
    hideModal();
  }, [hideModal]);

  const onUpdateTask = useCallback(async () => {
    await editTask(db);
  }, [db, editTask]);

  const onCreateTask = useCallback(async () => {
    await createTask(db);
  }, [createTask, db]);

  const handleSave = useCallback(async () => {
    if (isCreate) {
      await onCreateTask();
    } else {
      await onUpdateTask();
    }
    onClose();
  }, [isCreate, onClose, onCreateTask, onUpdateTask]);

  return (
    <RNModal
      isVisible={modalVisiblity}
      style={styles.modal}
      backdropOpacity={0}
      onBackdropPress={hideModal}
    >
      <BlurView
        intensity={isAndroid ? 100 : 10}
        tint={'light'}
        style={[RN.StyleSheet.absoluteFill, styles.fullscreenBlur]}
      />
      <RN.View style={styles.modalContent}>
        <RN.Text style={styles.modalTitle}>{modalTitle}</RN.Text>
        <RN.TextInput
          value={inputValue}
          onChangeText={changeInput}
          style={styles.input}
          placeholder={inputPlaceholder}
          placeholderTextColor={COLORS.gray}
        />
        <RN.View style={styles.buttonContainer}>
          <RN.TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
          >
            <RN.Text style={styles.buttonText}>{btnText}</RN.Text>
          </RN.TouchableOpacity>
          <RN.TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
          >
            <RN.Text style={styles.buttonText}>{'Cancel'}</RN.Text>
          </RN.TouchableOpacity>
        </RN.View>
      </RN.View>
    </RNModal>
  );
};

const styles = RN.StyleSheet.create({
  modal: {
    justifyContent: 'center',
    margin: 0,
  },
  fullscreenBlur: {
    zIndex: -1, // Position the blur effect behind the modal content
  },
  modalContent: {
    backgroundColor: addAlpha(COLORS.white, 0.9),
    borderRadius: 20,
    padding: 25,
    marginHorizontal: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    color: COLORS.black2,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: addAlpha(COLORS.gray, 0.3),
    backgroundColor: addAlpha(COLORS.white, 0.6),
    borderRadius: 12,
    padding: 14,
    color: COLORS.black,
    marginBottom: 20,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: COLORS.orange,
  },
  cancelButton: {
    backgroundColor: addAlpha(COLORS.gray, 0.7),
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default observer(Modal);
