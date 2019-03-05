import React, {useEffect, useRef, useState} from 'react';
import {AppBar, CssBaseline, Grid, Paper, Toolbar, Typography} from '@material-ui/core';
import {Edit} from '@material-ui/icons'
import * as tf from "@tensorflow/tfjs";
import Fab from "@material-ui/core/es/Fab/Fab";
import styles from "./App.css";


export default function App() {
    const [model, setModel] = useState(null);
    const [results, setResults] = useState(null);
    const [image, setImage] = useState(`${process.env.PUBLIC_URL}devoxx.png`);
    const fileInputEl = useRef(null);

    const loadModel = async () => {
        try {
            setModel(await tf.loadLayersModel(`${process.env.PUBLIC_URL}/model/model.json`));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadModel();
    }, []);

    const predict = async image => {
        // Actual prediction
        const input = tf.browser.fromPixels(image)
            .resizeBilinear([224, 224])
            .expandDims(0);
        input.print();
        const prediction = model.predict(input);
        setResults(await prediction.data());
    };

    const handleFileChange = e => {
        e.preventDefault();
        const reader = new FileReader();
        const file = e.target.files[0];

        reader.onloadend = () => {
            // add preview
            setImage(reader.result);

            // construct a new Image object for tf.js
            const image = new Image();
            image.onload = () => {
                predict(image)
            };

            image.src = reader.result;
        };

        reader.readAsDataURL(file)
    };

    const chooseFile = () => {
        fileInputEl.current.click();
    };


    const resultsDescription = () => {
        if (results === null){
            return 'Prediction'
        } else if (results[0] > 0.5) {
            return `Croissant : ${results[0]}`
        } else {
            return `Pain au chocolat : ${results[1]}`
        }
    };


    return (
        <>
            <CssBaseline/>
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
                            <div className={styles.container}>
                                <img src={image} alt="input" className={styles.image}/>
                                <Fab color="primary" aria-label="Edit" className={styles.fab} onClick={chooseFile}>
                                    <Edit />
                                </Fab>
                            </div>
                            <input type="file" id="file" ref={fileInputEl} className={styles.fileInput} onChange={handleFileChange}/>
                            {resultsDescription()}
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </>
    );
}
