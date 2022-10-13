import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useNavigate } from "react-router-dom";
import { ROUTE_PATH } from '../app/constants/routePath';

function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    };
  }

const tabs = [ 'DASHBOARD', 'BUILD', 'PROPERTY' ];


const TopBar = () => {
    const [value, setValue] = React.useState(0);
    let navigate = useNavigate();

    const handleChange = (event, newValue) => {
        setValue(newValue);
        console.log('new value', newValue);
        navigate(`/${ROUTE_PATH[tabs[newValue]]}/`);
        console.log("tab valuer", newValue)
      };

    return(
    <AppBar position="static" color='secondary'>
    <Container maxWidth="xl">
      <Toolbar disableGutters>
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="/"
          sx={{
            mr: 3,
            ml: 3,
            display: { xs: 'flex' },
            fontFamily: 'monospace',
            // width: '150px',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          EDCAST
        </Typography>
        <Box 
        sx={{ width: '50%' }}
        >
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          {
            tabs.map((tab, index) => {
              return (  <Tab key={tab} label={tab} {...a11yProps(index)} /> )
            })
          }
        </Tabs>
        </Box>
      </Toolbar>
    </Container>
  </AppBar>
    )
}

export default TopBar;