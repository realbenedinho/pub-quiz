import './App.css';
import React, { useState } from 'react';
import { Carousel } from 'react-bootstrap';
import JSZip from 'jszip';

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

        for (let i = 1; i <= 35; i++) {
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
 
  const handleSaveAllImages = () => {
    const zip = new JSZip();

    pixelatedImages.forEach((dataURL, index) => {
      // Extract the image data from the base64-encoded data URL
      const imageData = dataURL.split(',')[1];
      // Add the image to the zip file
      zip.file(`Pixelated${index}.png`, imageData, { base64: true });
    });

    // Generate the zip file and initiate a download
    zip.generateAsync({ type: 'blob' }).then((content) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'pixelated_images.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };


  return (
    <div>
      <input type="file" onChange={handleImageUpload} />
      <br></br>
      <div className="carousel-container d-flex justify-content-center">
      <Carousel fade data-interval="1" data-ride="true">
        {pixelatedImages.map((dataURL, index) => (
          <Carousel.Item key={index} onClick={() => handleImageSelection(index)}>
            <img src={dataURL} className="d-block img-class" alt={"Pixelated " + index} />
          </Carousel.Item>
        ))}
        {image && (
          <Carousel.Item>
            <img src={image.src} className="d-block img-class" alt="Pixelated" />
          </Carousel.Item>
        )}
      </Carousel>
      </div>
      <br></br>
      <button onClick={handleSaveAllImages}>Alle Bilder speichern</button>
    </div>
  );
}

export default App;