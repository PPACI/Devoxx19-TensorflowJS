from PIL import Image
import numpy
from tensorflow.python.keras.preprocessing.image import ImageDataGenerator
from tensorflow.python.keras.applications.mobilenet import MobileNet
from tensorflow.python.keras.models import Model
from tensorflow.python.keras.layers import Dense, Dropout, BatchNormalization
from tensorflow.python.keras.optimizers import Adam
from tensorflow.python.keras.callbacks import *

# Create image data generator
image_generator = ImageDataGenerator(
    validation_split=0.15,
    horizontal_flip=True,
    zoom_range=0.1,
    width_shift_range=0.1,
    height_shift_range=0.1,
    rotation_range=5,
    rescale=1. / 255
)
train_generator = image_generator.flow_from_directory("dataset", subset="training", target_size=(224, 224),
                                                      batch_size=8)
validation_generator = image_generator.flow_from_directory("dataset", subset="validation", target_size=(224, 224),
                                                           batch_size=8)

# Show an image from train set
Image.fromarray((next(train_generator)[0][0] * 255).astype(numpy.uint8)).show()

# Create model
mobile = MobileNet(
    input_shape=(224, 224, 3),
    include_top=False,
    weights='imagenet',
    pooling='avg',
    alpha=0.5
)
output = Dropout(0.4)(mobile.output)
output = Dense(8, activation="relu")(output)
output = Dense(3, activation="sigmoid")(output)

model = Model(inputs=mobile.input, outputs=output)
model.summary()

# Compile model
model.compile(optimizer=Adam(amsgrad=True), loss="categorical_crossentropy", metrics=["accuracy"])

callbacks = [
    ReduceLROnPlateau(
        patience=3,
        factor=0.2,
        verbose=1,
        min_lr=1e-5
    ),
    ModelCheckpoint(
        filepath="croissant.hdf5",
        verbose=1,
        save_best_only=True
    )
]

# Train
model.fit_generator(
    generator=train_generator,
    steps_per_epoch=256,
    epochs=50,
    verbose=1,
    validation_data=validation_generator,
    validation_steps=40,
    callbacks=callbacks
)
