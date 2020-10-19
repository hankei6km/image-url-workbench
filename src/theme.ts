import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// https://github.com/mui-org/material-ui/blob/dc68f1ae8470a38660e2dd40fba319dcba405784/examples/nextjs/src/theme.js

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#556cd6'
    },
    secondary: {
      main: '#19857b'
    },
    error: {
      main: red.A400
    },
    background: {
      default: '#fff'
    }
  }
});

export default theme;
