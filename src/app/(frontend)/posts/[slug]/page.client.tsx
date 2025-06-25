'use client'
import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PostHero } from '@/heros/PostHero'
import { Post } from '@/payload-types'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import RichText from '@/components/RichText'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

const PageClient: React.FC<{ post: Post }> = ({ post }) => {
  /* Force the header to be dark mode while we have an image behind it */
  const { setHeaderTheme } = useHeaderTheme()

  const [ok, setOk] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  function checkPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (input === post.password) {
      setOk(true)
      setError('')
    } else {
      setError('Wrong password')
    }
  }

  if (post.isProtected && !ok) {
    return (
      <form onSubmit={checkPassword} style={{ maxWidth: 320, margin: '3rem auto' }}>
        <h2 className="text-center text-2xl">Password protected post</h2>
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Password"
          style={{ width: '100%', padding: 8, marginBottom: 12 }}
        />
        <Button type="submit" style={{ width: '100%' }}>
          Show content
        </Button>
        {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
      </form>
    )
  }

  return (
    <>
      <PostHero post={post} />
      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <RichText className="max-w-[48rem] mx-auto" data={post.content} enableGutter={false} />
            {post.relatedPosts && post.relatedPosts.length > 0 && (
              <RelatedPosts
                className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
                docs={post.relatedPosts.filter((post) => typeof post === 'object')}
              />
            )}
        </div>
      </div>
    </>
  )
}

export default PageClient
