declare module 'docxtemplater-image-module-free' {
  class ImageModule {
    constructor(options: {
      centered?: boolean
      fileType?: string
      getImage: (tagValue: string) => Buffer | Uint8Array
      getSize: (img: Buffer | Uint8Array, tagValue: string) => [number, number]
    })
  }
  export default ImageModule
}
