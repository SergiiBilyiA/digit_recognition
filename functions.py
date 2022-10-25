import tensorflow as tf
import numpy as np
from PIL import Image


def picture_preprocessing(img_file):
    img = Image.open(img_file)
    bbox = Image.eval(img, lambda px: 255 - px).getbbox()
    width = bbox[2] - bbox[0]
    height = bbox[3] - bbox[1]
    if height > width:
        width = int(20.0 * width / height)
        height = 20
    else:
        height = int(20.0 * width / height)
        width = 20
    hstart = int((28 - height) / 2)
    wstart = int((28 - width) / 2)
    img_temp = img.crop(bbox).resize((width, height), Image.Resampling.BOX)
    new_img = Image.new('L', (28, 28), 255)
    new_img.paste(img_temp, (wstart, hstart))
    new_img = Image.eval(new_img, lambda px: 255 - px)
    data = np.asarray(new_img)
    copied_data = data.copy()
    for x in np.nditer(copied_data, op_flags=['readwrite']):
        if x[...] >= 25:
            x[...] = 255
        if x[...] < 25:
            x[...] = 0
    img_array = copied_data.reshape(1, 28, 28, 1)
    return img_array


def prediction(img_file):
    img_data = picture_preprocessing(img_file)
    model = tf.keras.models.load_model('models/first_model_for_deploy.h5')
    pred = model.predict(img_data)
    result = np.argmax(pred)
    return result



