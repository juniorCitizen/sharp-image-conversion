const path = require('path')
const fs = require('fs-extra')
const sharp = require('sharp')

module.exports = class SharpImageConversion {
  /**
   * @description Creates an instance of SharpImageConversion class.
   *
   * @param {string} sourceFilePath - Source file path.
   * @param {Object} [resizeOptions=undefined] - Resizing options.
   */
  constructor(sourceFilePath, resizeOptions = undefined) {
    this._filePaths = {
      source: path.resolve(sourceFilePath),
      target: undefined,
    }
    this._resized = false
    this._image = sharp().rotate()
    this._imageTransformer = undefined
    if (resizeOptions) {
      this._imageTransformer
        .resize({
          width: resizeOptions.xLimit,
          height: resizeOptions.yLimit,
          fit: 'inside',
          background: {r: 0, g: 0, b: 0, alpha: 0},
        })
        .trim(1)
      this._resized = true
    }
  }

  /**
   * @description Convert and manipulate an image then copy to targetFilePath.
   *
   * @param {string} targetFilePath - Location to copy the output file.
   * @param {string} [targetFormat=undefined] - Target output format.
   * @param {Object} [outputOptions={}] - Image manipulation parameters.
   * @returns {undefined}
   */
  async streamCopy(
    targetFilePath,
    targetFormat = undefined,
    outputOptions = {}
  ) {
    try {
      this._filePaths.target = path.resolve(targetFilePath)
      const fileDir = path.dirname(this._filePaths.target)
      if (targetFormat) {
        this._imageTransformer.toFormat(targetFormat, outputOptions)
      }
      await fs.ensureDir(fileDir)
      const rs = fs.createReadStream(this._filePaths.source)
      const ws = fs.createWriteStream(this._filePaths.target)
      return await new Promise((resolve, reject) => {
        rs.on('error', reject)
        ws.on('error', reject)
        ws.on('finish', resolve)
        if (this._imageTransformer) {
          rs.pipe(this._imageTransformer).pipe(ws)
        } else {
          rs.pipe(ws)
        }
      })
        .then(() => Promise.resolve())
        .catch(error => {
          rs.destroy()
          ws.end()
          return Promise.reject(error)
        })
    } catch (error) {
      throw error
    }
  }

  /**
   * @description Convert and manipulate an image then output buffered data.
   *
   * @param {string} [targetFormat=undefined] - Target output format.
   * @param {Object} [outputOptions={}] - Image manipulation parameters.
   * @returns {Buffer} Buffered image data.
   */
  toBuffer(targetFormat = undefined, outputOptions = {}) {
    if (targetFormat) {
      this._imageTransformer.toFormat(targetFormat, outputOptions)
    }
    return this._imageTransformer.toBuffer()
  }
}
