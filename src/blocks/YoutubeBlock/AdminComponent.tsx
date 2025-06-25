'use client'

import React from 'react'
import { BlockEditButton, useBlockComponentContext } from '@payloadcms/richtext-lexical/client'
import { useFormFields } from '@payloadcms/ui'

const extractVideoId = (urlOrId: string): string => {
  const match = urlOrId.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([\w-]{11})/,
  )
  return match && match[1] ? match[1] : urlOrId
}

const YoutubeBlockAdmin = () => {
  const { initialState } = useBlockComponentContext()

  const videoIdValue = useFormFields(([fields]) => {
    return fields.videoId?.value as string
  })

  const rawVideoId = videoIdValue || (initialState as any)?.videoId?.initialValue || ''
  const videoId = extractVideoId(rawVideoId)

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', position: 'relative' }}>
      <strong>YouTube Embed Preview</strong>
      <BlockEditButton />
      {videoId ? (
        <iframe
          width="100%"
          height="240"
          src={`https://www.youtube.com/embed/${videoId}`}
          frameBorder="0"
          allowFullScreen
          style={{ marginTop: '1rem' }}
        />
      ) : (
        <div style={{ marginTop: '1rem', color: '#888' }}>No video ID provided yet.</div>
      )}
    </div>
  )
}

export default YoutubeBlockAdmin
