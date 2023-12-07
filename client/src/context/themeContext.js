// ** Material UI
import { CssBaseline } from '@mui/material' 
import { createTheme, ThemeProvider  } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7fbf7f',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const ThemeContextProvider = (props) => {
  const {
    children
  } = props

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

export default ThemeContextProvider