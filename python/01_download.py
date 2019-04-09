from google_images_download import google_images_download

downloader = google_images_download.googleimagesdownload()

# Download images. Unplash is a an image website, it serve as random image keyword.
downloader.download(
    {
        "keywords": "croissant,pain au chocolat,unsplash",
        "output_directory": "dataset",
        "limit": 500,
        "chromedriver": "/home/pierre/Development/Devoxx/python/venv/lib/python3.6/site-packages/chromedriver_binary/chromedriver"
    }
)