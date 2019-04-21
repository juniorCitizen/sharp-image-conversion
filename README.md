# Image Conversion Utility (sharp-image-conversion)

Sharp.js wrapper for single image resize, manipulation and format conversion then output to file or buffer.

## Installation

```bash
npm install --save sharp-image-conversion
```

## Usage

```javascript
// instantiate (optional resizing will be applied to all output files/buffered data)
const ImageConverter = require('sharp-image-conversion')
const imageConverter = new ImageConverter('./filename.jpg', {
  xLimit: 1920,
  yLimit: 1080,
})

// convert to PNG and output to disk with specified image manipulation params (only the target path is required)
imageConverter.streamCopy(
  './newFilename.png',
  'png',
  {
    compressionLevel: 5,
    quality: 50,
  })

// convert to webP and output to buffer, with no other alterations
imageConverter
  .toBuffer('webp')
  .then(buffer => {
    // do something with the buffered image data
  })
  .catch(error => {
    console.log(error)
  })
```

## API

### new **Instance**(**_sourceFilePath_** : _String_, **_resizeOption?_** : _Object_)

creates an instance and specify the optional resizing parameter object in the format of:

```javascript
const resizingOptions = {
  xLimit: 1920, // optional
  yLimit: 1080, // optional
}
```

**Instance.streamCopy**(**_targetFilePath_** : _String_, **_targetFormat?_** : _String_, **_outputOptions?_** : _Object_)

copy the file specified during instantiation using node.js stream after converting to the optionally specified image format with optionally appied image manipulation parameters

note 1: refer to Sharp docs for supported image formats.

note 2: specified _outputOptions_ are ignored if _targetFormat_ is undefined or null.

```javascript
// output options are ignored in this case
instance.streamCopy('targetPath', undefined, {
  option_1: blah_1,
  option_2: blah_2,
})
```

note 3: _outputOptions_ should match the _targetFormat_ according to Sharp's docs.

**Instance.toBuffer**(**_targetFormat?_** : _String_, **_outputOptions?_** : _Object_)

buffer the image data from the file specified during instantiation after converting to the optionally specified image format with optionally appied image manipulation parameters

see notes from **Instance.StreamCopy** method

## License

MIT
