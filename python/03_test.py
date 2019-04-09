import requests
from PIL import Image
from io import BytesIO
import numpy
from tensorflow.python.keras.models import load_model

# URL = 'https://img.bfmtv.com/c/630/420/171/066d0cc8542764982cce201a2ce8c.jpeg'  # Other
# URL = 'https://www.paul-uk.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/C/r/Croissant-3002_1_1.jpg'  # croissant
URL = 'http://couteaux-et-tirebouchons.com/wp-content/uploads/2016/01/Pain-au-chocolat-ou-chocolatine.jpg'  # Pain choco
croissant = requests.get(URL)
croissant = Image.open(BytesIO(croissant.content))
croissant.thumbnail((224, 224))
croissant = croissant.resize((224, 224))
croissant.show()

croissant_np = numpy.expand_dims(numpy.array(croissant.convert('RGB')), 0) / 255

model = load_model('croissant.hdf5')

prediction = model.predict(croissant_np)[0]
print(prediction)
if prediction[0] > 0.5:
    print('croissant')
elif prediction[1] > 0.5:
    print('pain au chocolat')
else:
    print('other')
