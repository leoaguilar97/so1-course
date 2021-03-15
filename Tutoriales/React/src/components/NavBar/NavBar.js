import React, { useState } from 'react';
import { makeStyles, ThemeProvider, useTheme } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import TimeLine from '../TimeLine/TimeLine'
import Graph from '../Graph/Graph'

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';


const useStyles = makeStyles(() => ({
    drawerHeader: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    link: {
        textDecoration: 'none'
    }
}));

const NavBar = () => {
    const classes = useStyles();
    const theme = useTheme();

    const [open, setOpen] = useState(false);

    const drawerOpen = () => {
        setOpen(true)
    }

    const drawerClose = () => {
        setOpen(false)
    }

    return (
        <div>
            <AppBar position='static'>
                <Toolbar variant='dense'>
                    <IconButton onClick={drawerOpen} edge='start'>
                        <MenuIcon></MenuIcon>
                    </IconButton>
                    <Typography variant='h6'>
                        React Essentials
                    </Typography>
                </Toolbar>
            </AppBar>
            <Router>
                <Drawer open={open}>
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={drawerClose} edge='start'>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </div>
                    <List>
                        <Link to='Mensajes' className={classes.link}>
                            <ListItem button>
                                <ListItemText primary="MENSAJES" />
                            </ListItem>
                        </Link>
                        <Link to='grafica' className={classes.link}>
                            <ListItem button>
                                <ListItemText primary="GRAFAICA" />
                            </ListItem>
                        </Link>
                    </List>
                </Drawer>
                <Switch>
                    <Route exact path='/'>
                        Hola mundo
                    </Route>
                    <Route exact path='/Mensajes'>
                        <TimeLine />
                    </Route>
                    <Route exact path='/grafica'>
                        <Graph />
                    </Route>
                </Switch>
            </Router>
        </div>
    )
}


export default NavBar;