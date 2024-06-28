'use client'

import { useState } from 'react'
import decodeICO from 'decode-ico'

export default function Home() {

  const [icons, setIcons] = useState<any[]>([])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    const decodedIcons = decodeICO(uint8Array)

    const processedIcons = await Promise.all(decodedIcons.map(processIcon))
    setIcons(processedIcons)
  }

  const processIcon = async (icon: any): Promise<any> => {
    if (icon.type === 'png') {
      return {
        width: icon.width,
        height: icon.height,
        dataUrl: URL.createObjectURL(new Blob([icon.data], { type: 'image/png' })),
        ogType: 'png'
      }
    } else {
      // For BMP, we need to convert it to PNG
      return convertBmpToPng(icon)
    }
  }

  const convertBmpToPng = (bmpData: any): any => {
    const canvas = document.createElement('canvas')
    canvas.width = bmpData.width
    canvas.height = bmpData.height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not get canvas context')

    ctx.putImageData(bmpData, 0, 0)

    return {
      width: bmpData.width,
      height: bmpData.height,
      dataUrl: canvas.toDataURL('image/png'),
      ogType: 'bmp'
    }
  }

  return (
    <main className="min-h-screen p-24">
      <h1 className="text-4xl font-bold mb-8">ICO Viewer</h1>
      <input
        type="file"
        accept=".ico"
        onChange={handleFileUpload}
        className="mb-8"
      />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {icons.map((icon, index) => (
          <div key={index} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">
              {icon.width}x{icon.height}: {icon.ogType}
            </h2>
            <img
              src={icon.dataUrl}
              alt={`Icon ${index + 1}`}
              className="mx-auto"
              style={{ width: icon.width, height: icon.height }}
            />
          </div>
        ))}
      </div>
    </main>
  )

}
