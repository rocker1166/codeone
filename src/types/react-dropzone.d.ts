// types/react-dropzone.d.ts
import 'react-dropzone';

declare module 'react-dropzone' {
  interface DropzoneOptions {
    webkitdirectory?: boolean; // Adding the webkitdirectory property
  }
}
