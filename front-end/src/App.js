import React, { useEffect, useRef, useState } from 'react';
import { AppBar, CssBaseline, Grid, Paper, Toolbar, Typography } from '@material-ui/core';
import { CloudUpload } from '@material-ui/icons'
import * as tf from "@tensorflow/tfjs";
import Fab from "@material-ui/core/es/Fab/Fab";
import styles from "./App.css";


export default function App() {
    const [results, setResults] = useState(null);
    const [image, setImage] = useState(`${process.env.PUBLIC_URL}devoxx.png`);
    const webcamEl = useRef(null);

    const loadModel = async () => {
        try {
            return await tf.loadLayersModel(`${process.env.PUBLIC_URL}/model/model.json`);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadModel().then(model => {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(webcamStream => {
                    webcamEl.current.ontimeupdate = event => predict(event, model);
                    webcamEl.current.srcObject = webcamStream
                }).catch(console.error)
        });
    }, []);

    async function predict(event, model) {
        const { target } = event
        console.log(target)
        // Actual prediction
        const input = tf.browser.fromPixels(target)
            .resizeBilinear([224, 224])
            .expandDims(0);
        input.print();
        const prediction = model.predict(input);
        setResults(await prediction.data());
    };

    const resultsDescription = () => {
        if (results === null) {
            return 'Prediction'
        } else if (results[0] > 0.5) {
            return `Croissant : ${results[0]}`
        } else {
            return `Pain au chocolat : ${results[1]}`
        }
    };


    return (
        <>
            <CssBaseline />
            <div className="root">
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" color="inherit">
                            Devoxx - Croissant
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Grid container justify="space-evenly" alignItems="center" >
                    <Grid item xs={12} sm={10} md={8} lg={6}>
                        <Paper className={styles.root}>
                            <Grid container justify="space-evenly" alignItems="center" >
                                <Grid item xs={12} sm={10} md={8} lg={6}>
                                    <div className={styles.container}>
                                        <video id="v1" autoPlay width="500" height="500" ref={webcamEl}></video>
                                    </div>
                                </Grid>
                            </Grid>
                            {resultsDescription()}
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </>
    );
}
