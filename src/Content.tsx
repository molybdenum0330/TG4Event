import { useTheme, ThemeProvider } from "@emotion/react";
import { createTheme, Drawer, Container, Grid, Stack, Typography, CssBaseline, Box, AppBar, Toolbar, IconButton } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import { useState, useMemo } from "react";
import PlayerTable from "./components/PlayerTable";
import ResultBox from "./components/ResultBox";
import { TGEventList } from "./components/TGEventList";
import ThemeSwitch from "./components/ThemeSwitch";
import { TGEventPlayerListProvider } from "./context/PlayerListContext";
import { useTGEventContext } from "./context/TGEventContext";
import { useTGEventListContext } from "./context/TGEventListContext";

const Content = () => {
    const [tgEventListDrawerOpen, setTGEventListDrawerOpen] = useState(false);
    const [playerListDrawerOpen, setPlayerListDrawerOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
  
    const theme = useTheme();
    // const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
    const toggleTGEventListDrawer = (open: boolean) => () => {
      setTGEventListDrawerOpen(open);
    };
  
    const togglePlayerListDrawer = (open: boolean) => () => {
      setPlayerListDrawerOpen(open);
    };
  
    const handleThemeChange = () => {
      setDarkMode(!darkMode);
    };
  
    const lightTheme = createTheme({
      palette: {
        mode: 'light',
      },
    });
  
    const darkTheme = createTheme({
      palette: {
        mode: 'dark',
      },
    });
  
    const TGEventPanel = () => {
      const {tgEvent} = useTGEventContext();
      
      return useMemo(() => (
        <TGEventPlayerListProvider tgEvent={tgEvent}>
          <Drawer anchor="right" open={playerListDrawerOpen} onClose={togglePlayerListDrawer(false)}>
            <PlayerTable />
          </Drawer>
          <Container>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack direction="column" useFlexGap flexWrap="wrap">
                  <Typography variant="h4">{tgEvent.name}</Typography>
                  {tgEvent.results.map((result) => <ResultBox result={result} />)}
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </TGEventPlayerListProvider>),
        [tgEvent]
     );
    };
  
    const MainContent = () => {
      const {tgEventList} = useTGEventListContext();
      return useMemo(() => (
          <>
            <Drawer anchor="left" open={tgEventListDrawerOpen} onClose={toggleTGEventListDrawer(false)}>
              <TGEventList />
            </Drawer>
            <TGEventPanel />
          </>
        ),
        [tgEventList]
     );
    };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleTGEventListDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              TG4Event
            </Typography>
            <ThemeSwitch darkMode={darkMode} handleThemeChange={handleThemeChange} />
            <IconButton edge="end" color="inherit" aria-label="player-list" onClick={togglePlayerListDrawer(true)}>
              <PeopleIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <MainContent />
      </Box>
    </ThemeProvider>
  );
};

export default Content;