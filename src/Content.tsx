import { useTheme, ThemeProvider } from "@emotion/react";
import { createTheme, Drawer, Container, Grid, Stack, Typography, CssBaseline, Box, AppBar, Toolbar, IconButton, Button } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import { useState, useMemo, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { MultiBackend, TouchTransition } from 'react-dnd-multi-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

import PlayerTable from "./components/PlayerTable";
import ResultBox from "./components/ResultBox";
import { TGEventList } from "./components/TGEventList";
import ThemeSwitch from "./components/ThemeSwitch";
import { TGEventPlayerListProvider } from "./context/PlayerListContext";
import { useTGEventContext } from "./context/TGEventContext";
import { useTGEventListContext } from "./context/TGEventListContext";
import { createNewUncofirmedResult } from "./types/types";

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
      
      const ResultPanel = () => {
        const [resultList, setResultList] = useState(tgEvent.results);
        const createNewResult = () => {
          setResultList([createNewUncofirmedResult(tgEvent.playerList), ...resultList]); 
        };

        useEffect(() => {
          tgEvent.results = resultList;
        }, [resultList]);

        return (
          <Stack direction="column" useFlexGap flexWrap="wrap">
          <Box>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h4">{tgEvent.name}</Typography>
              <Button variant="contained" color="primary" onClick={createNewResult}>
                新しいチーム分けを作る
              </Button>
            </div>
          </Box>
              <DndProvider backend={HTML5Backend}>
          {resultList.map((result) => <ResultBox key={result.id} result={result} />)}
              </DndProvider>
        </Stack>
        );
      }

      return useMemo(() => (
        <TGEventPlayerListProvider tgEvent={tgEvent}>
          <Drawer anchor="right" open={playerListDrawerOpen} onClose={togglePlayerListDrawer(false)}>
            <PlayerTable />
          </Drawer>
          <Container>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ResultPanel />
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