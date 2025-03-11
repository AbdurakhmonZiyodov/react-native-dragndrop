import { LayoutAnimation } from 'react-native';
import RN from '../components/RN';

export const makeLayoutAnimation = () => {
  LayoutAnimation.easeInEaseOut();
};

export const CoreStyle = RN.StyleSheet.create({
  flexGrow1: {
    flexGrow: 1,
  },
  flex1: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
