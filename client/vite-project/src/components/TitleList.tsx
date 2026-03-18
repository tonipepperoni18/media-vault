/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { useState } from 'react'

import { fetchTitleByUPC, fetchTitles } from '../services/titlesApi'

  type Title = {
    id: number
    title: string
    barcode: string
    format: string | null
    media_type: string | null
    release_year: number | null
    notes: string | null
    rip_status: string | null
    poster_url: string | null
  }

const TitleList = () => {

  const [titles, setTitles] = useState<Title[]>([])
  const [singleTitle, setSingleTitle] = useState<Title | null>(null)
  const [upc, setUpc] = useState("")
 
  const handleLoadTitles = async () => {
    const data = await fetchTitles()
    setTitles(data)
    setSingleTitle(null)
  }
  
  const handleSearch = async () => {
    const data = await fetchTitleByUPC(upc)
    setSingleTitle(data)
    setTitles([])
  }
  return (
    <div>
      <button onClick={handleLoadTitles}> Load All Titles</button>
      <input
      value={upc}
      onChange={(e) => setUpc(e.target.value)} 
      placeholder='Enter Upc'/>

      <button onClick={handleSearch}>Search Title</button>

      {singleTitle && (
        <div>
          <h2>{singleTitle.title}</h2>
          <h2>{singleTitle.barcode}</h2>
          <h2>{singleTitle.format}</h2>
        </div>
      )}

      {titles.map((title) => (
        <div key={title.id}>
          {title.title} - {title.barcode}
        </div>
      ))}
    </div>
  )
}

export default TitleList