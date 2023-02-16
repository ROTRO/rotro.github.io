import { Icon } from '@iconify/react'
import React from 'react'
import { Link } from 'react-router-dom'

export default function Pagination() {
  return (
    <ul className="cs-pagination_box cs-center cs-white_color cs-mp0 cs-semi_bold">
      <li>
        <Link className="cs-pagination_item cs-center active" to="/blog">1</Link>
      </li>
      <li>
        <Link className="cs-pagination_item cs-center" to="/blog">2</Link>
      </li>
      <li>
        <Link className="cs-pagination_item cs-center" to="/blog">3</Link>
      </li>
      <li>
        <Link className="cs-pagination_item cs-center" to="/blog">4</Link>
      </li>
      <li>
        <Link to="#" className="cs-pagination_item cs-center">
          <Icon icon="akar-icons:chevron-right" />               
        </Link>
      </li>
    </ul>
  )
}
