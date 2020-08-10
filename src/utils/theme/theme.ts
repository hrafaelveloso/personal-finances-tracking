import { createMuiTheme } from '@material-ui/core/styles';
import overrides from './overrides';
import palette from './palette';

const theme = createMuiTheme({
  palette,
  overrides,
  props: {
    MuiButton: {
      variant: 'contained',
      color: 'primary',
    },
  },
});

export default theme;
