import tensorflowjs
from tensorflow.python.keras.models import load_model
model = load_model('croissant.hdf5')
tensorflowjs.converters.save_keras_model(model, 'model_js')