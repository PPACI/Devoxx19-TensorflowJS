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
    demo: {
        height: '800px'
    },
    paper: {
        width: '300px',
        height: '300px'
    },
    imageInput: {
        maxWidth: "300px",
        maxHeight: "270px"
    }
};


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUrl: null
        };

        this.handleFileChange = this.handleFileChange.bind(this);
    }

    handleFileChange(e) {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                imageUrl: reader.result
            });
        };

        reader.readAsDataURL(file)
    }

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
                        <Grid item xs={6}>
                            <Paper className={classes.paper}>
                                <img src={this.state.imageUrl} alt="input" className={classes.imageInput}/>
                                <input type="file" onChange={this.handleFileChange}/>
                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
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
