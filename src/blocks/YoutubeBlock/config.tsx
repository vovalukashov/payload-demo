import { Block } from 'payload'

const extractVideoId = (urlOrId: string): string => {
  const match = urlOrId.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([\w-]{11})/,
  )
  return match && match[1] ? match[1] : urlOrId
}

export const YoutubeBlock: Block = {
  slug: 'youtube',
  interfaceName: 'YoutubeBlock',
  fields: [
    {
      name: 'videoId',
      label: 'YouTube Video ID or URL',
      type: 'text',
      required: true,
      hooks: {
        beforeChange: [
          ({ value }) => {
            if (value && typeof value === 'string') {
              return extractVideoId(value)
            }
            return value
          },
        ],
      },
    },
  ],
  admin: {
    components: {
      Block: 'src/blocks/YoutubeBlock/AdminComponent',
    },
  },
}
