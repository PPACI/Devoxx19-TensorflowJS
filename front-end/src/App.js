import React, {Component} from 'react';
import './App.css';
import {withStyles} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import * as tf from "@tensorflow/tfjs";

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
            model: null,
            results: null,
            imageUrl: 'https://dvxfrance.cdn.prismic.io/dvxfrance/f4989a9f149ab92da707fb3acb7b2dbf0ee33a3d_logo-texte-devoxx-france-2-lignes-400.png'
        };

        this.handleFileChange = this.handleFileChange.bind(this);
        this.predict = this.predict.bind(this);
    }

    componentDidMount() {
        console.log(process.env.PUBLIC_URL + '/model/model.json');
        tf.loadLayersModel(process.env.PUBLIC_URL + '/model/model.json')
            .then(model => {
                console.log(model);
                this.setState({model})
            })
            .catch(err => console.log(err))
    }

    predict(image) {
        // Actual prediction
        const input = tf.browser.fromPixels(image)
            .resizeBilinear([224, 224])
            .expandDims(0);
        input.print();
        const prediction = this.state.model.predict(input);
        prediction.data().then(results => {
            console.log(results);
            if (results[0] > 0.5) console.log("it's a croissant");
            else console.log("It's a pain au chocolat");
            this.setState({results})
        })
    }

    handleFileChange(e) {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            // add preview
            this.setState({
                imageUrl: reader.result
            });

            // construct a new Image object for tf.js
            let image = new Image();
            image.onload = () => {
                this.predict(image)
            };

            image.src = reader.result;
        };

        reader.readAsDataURL(file)
    }

    render() {
        const {classes} = this.props;

        let result;
        if (this.state.results === null){
            result = 'Prediction'
        }
        else if (this.state.results[0] > 0.5) {
            result = `Croissant : ${this.state.results[0]}`
        } else {
            result = `Pain au chocolat : ${this.state.results[1]}`
        }

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
                                {result}
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(App);
