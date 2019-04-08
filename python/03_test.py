import requests
from PIL import Image
from io import BytesIO
import numpy
from tensorflow.python.keras.models import load_model

URL = 'https://media-cdn.tripadvisor.com/media/photo-s/0e/59/3a/e2/le-pain-au-chocolat-a.jpg'
croissant = requests.get(URL)
croissant = Image.open(BytesIO(croissant.content))
croissant.thumbnail((224, 224))
croissant = croissant.resize((224, 224))
croissant.show()

croissant_np = numpy.expand_dims(numpy.array(croissant.convert('RGB')), 0) / 255

model = load_model('croissant_185.hdf5')

prediction = model.predict(croissant_np)[0]
print(prediction)
if prediction[0] > 0.5:
    print('croissant')
elif prediction[1] > 0.5:
    print('pain au chocolat')
else:
    print('other')
