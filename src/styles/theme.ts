import { createMuiTheme } from '@material-ui/core/styles';

import indigo from '@material-ui/core/colors/indigo';
// import pink from '@material-ui/core/colors/pink';
import blue from '@material-ui/core/colors/blue';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: indigo,
    secondary: blue,
  },
});

export default theme;