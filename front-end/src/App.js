import React, { useEffect, useRef, useState } from 'react';
import { AppBar, CssBaseline, Grid, Paper, Toolbar, Typography } from '@material-ui/core';
import { Bar } from 'react-chartjs-2';
import { CloudUpload } from '@material-ui/icons'
import * as tf from "@tensorflow/tfjs";
import Fab from "@material-ui/core/es/Fab/Fab";
import styles from "./App.css";


export default function App() {
    const [results, setResults] = useState([0, 0]);
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
        // Actual prediction
        const input = tf.browser.fromPixels(target)
            .resizeBilinear([224, 224])
            .expandDims(0)
            .toFloat()
            .div(tf.scalar(255));
        // input.print();
        const prediction = model.predict(input);
        const rawResults = await prediction.data()
        setResults(rawResults.slice(0, 2));
    };

    function chartData() {
        return {
            labels: ['croissant', 'paint au chocolat'],
            datasets: [{
                label: 'classification',
                data: results
            }]
        }
    };

    const chartOptions= {
        scales: {
            yAxes: [{
                ticks: {
                    max: 1,
                    min: 0,
                    stepSize: 0.2
                }
            }]
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
                            <Bar data={chartData()} width={300} options={chartOptions}/>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </>
    );
}
