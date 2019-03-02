import React, {Component} from 'react';
import './App.css';
import {withStyles} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";

const styles = {
    root: {
        flexGrow: 1,
    },
    demo:{
        height: '800px'
    },
    paper:{
      width: '300px',
      height: '300px'
    }
};


class App extends Component {
    render() {
        const {classes} = this.props;
        return (
            <React.Fragment>
                <CssBaseline/>
                <div className={classes.root}>
                    <AppBar position="static">
                        <Typography variant="h2" color="inherit">
                            Devoxx - Croissant
                        </Typography>
                    </AppBar>
                    <Grid container className={classes.demo} justify="space-evenly" alignItems="center">
                        <Grid item xs="{6}">
                            <Paper className={classes.paper}>
                                Image
                            </Paper>
                        </Grid>
                        <Grid item xs="{4}">
                            <Paper className={classes.paper}>
                                Prediction
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(App);
