import React from 'react'

export type YoutubeBlockProps = {
  videoId: string
  blockType: 'youtube'
}

export const YoutubeBlock: React.FC<YoutubeBlockProps> = ({ videoId }) => {
  return (
    <div className="overflow-hidden pb-[56.25%] relative h-0 my-8">
      <iframe
        width="853"
        height="480"
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
        className="absolute left-0 top-0 w-full h-full"
      />
    </div>
  )
}
