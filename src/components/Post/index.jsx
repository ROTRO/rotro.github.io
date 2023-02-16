import React from 'react'
import { Link } from 'react-router-dom'
import Div from '../Div'
import './post.scss'

export default function Post({url, src, alt, date, title}) {
  return (
    <Div className="cs-post cs-style1">
      <Link to={url} className="cs-post_thumb">
        <img src={src} alt={alt} />
        <Div className="cs-post_overlay" />
      </Link>
      <Div className="cs-post_info">
        <Div className="cs-posted_by">{date}</Div>
        <h2 className="cs-post_title"><Link to="blog-details.html">{title}</Link></h2>
      </Div>
    </Div>
  )
}
