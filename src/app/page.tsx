/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from "../components/ui/button"
import { X } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [files, setFiles] = useState<File[]>([])
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAbout, setShowAbout] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const filteredFiles = acceptedFiles.filter(file => {
      const extension = file.name.split('.').pop()?.toLowerCase()
      // Exclude specific file types
      return extension !== 'jpg' && extension !== 'pdf' && extension !== 'png' && extension !== 'gif';
    })

    if (filteredFiles.length > 0) {
      setFiles(prevFiles => [...prevFiles, ...filteredFiles])
      setError(null)
    } else {
      setError('No valid files selected. Please upload only code files.')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: { 'application/javascript': ['.js', '.jsx', '.ts', '.tsx'], 'text/plain': ['.txt', '.css'] },
    // Add the webkitdirectory property to support folder uploads
   
  })

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))

    try {
      const response = await fetch('/api/combine', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        setDownloadUrl(result.downloadUrl)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to process files')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('An unexpected error occurred')
    }

    setIsLoading(false)
  }

  const handleCancel = () => {
    setFiles([])
    setDownloadUrl(null)
    setError(null)
  }

  const handleRemoveFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
    if (files.length === 1) {
      setDownloadUrl(null)
    }
  }

  const toggleAbout = () => {
    setShowAbout(prev => !prev);
  };

  return (
    <div {...getRootProps()} className="  p-4  flex justify-center items-center min-h-screen">
      <input {...getInputProps()} />
      <div className={`fixed inset-0 pointer-events-none ${isDragActive ? 'bg-blue-100 bg-opacity-50' : ''}`} />
      <div className="max-w-3xl mx-auto  backdrop-blur-lg rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">Code Combiner</div>
            <Button variant="outline" onClick={toggleAbout}>
              About
            </Button>
          </div>
          <p className="block mt-1 text-lg leading-tight font-medium text-white">Upload your code files</p>
          <p className="mt-2 text-gray-500">Drag and drop your code files anywhere on the screen, or click the button below to select files</p>
          
          <Button
            onClick={() => document.querySelector('input')?.click()}
            variant="outline"
            className="mt-4 w-full"
          >
            Select Files or Drag and Drop 
          </Button>

          {files.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-white">Selected files:</h4>
              <ul className="mt-2 border border-gray-200 rounded-md divide-y divide-gray-200">
                {files.map((file, index) => (
                  <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                    <div className="w-0 flex-1 flex items-center">
                      <span className="ml-2 flex-1 w-0 truncate  text-white">{file.name}</span>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="font-medium text-red-700 hover:text-red-950"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {error && (
            <div className="mt-4 text-red-600">
              {error}
            </div>
          )}
          
          <div className="mt-6 flex space-x-4">
            <Button
              onClick={handleSubmit}
              disabled={files.length === 0 || isLoading}
              className="flex-1"
            >
              {isLoading ? 'Processing...' : 'Combine Files'}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1"
              disabled={files.length === 0 && !downloadUrl}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel All
            </Button>
          </div>
          
          {downloadUrl && (
            <div className="mt-6">
              <a
                href={downloadUrl}
                download="combined_code.txt"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Download Combined File
              </a>
            </div>
          )}
          
        </div>
      </div>

      {/* About modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h3 className="text-lg font-semibold">About Code Combiner</h3>
            <p className="mt-2">This application allows you to upload multiple code files, combine them into a single text file, and download the result.</p>
            <h1>author: <Link href="https://sumanjana.vercel.app/" className='text-blue-600  font-bold'>suman jana</Link></h1>
            
            <button onClick={toggleAbout} className="mt-4 text-blue-500">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
