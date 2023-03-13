import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';

function App() {
  const [image, setImage] = useState(null);
  const [pixelatedImages, setPixelatedImages] = useState([]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const pixelatedImages = [];

        for (let i = 1; i <= 25; i++) {
          const pixelSize = i * 10;
          const pixelatedCanvas = document.createElement('canvas');
          pixelatedCanvas.width = img.width;
          pixelatedCanvas.height = img.height;
          const pixelatedCtx = pixelatedCanvas.getContext('2d');
          pixelatedCtx.imageSmoothingEnabled = false;
          pixelatedCtx.drawImage(canvas, 0, 0, img.width, img.height, 0, 0, pixelSize, pixelSize);
          pixelatedCtx.drawImage(pixelatedCanvas, 0, 0, pixelSize, pixelSize, 0, 0, img.width, img.height);

          pixelatedImages.push(pixelatedCanvas.toDataURL());
        }

        setImage(img);
        setPixelatedImages(pixelatedImages);
      };
      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  };

  const handleImageSelection = (index) => {
    const img = new Image();
    img.onload = () => {
      setImage(img);
    };
    img.src = pixelatedImages[index];
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} />

      {image && <img src={image.src} alt="Pixelated" />}

      {pixelatedImages.map((dataURL, index) => (
        <img key={index} src={dataURL} alt="Pixelated" onClick={() => handleImageSelection(index)} />
      ))}
    </div>
  );
}

export default App;