import React from 'react';
import { Link } from 'react-router-dom';
import Div from '../Div';
import './movingtext.scss';

export default function MovingText2({ data, reverseDirection }) {
  return (
    <Div className="cs-moving_text_wrap cs-type1 cs-bold cs-primary_font">
      <Div className="cs-moving_text_in">
        <Div
          className={
            reverseDirection
              ? 'cs-moving_text cs-reverse_animation'
              : 'cs-moving_text'
          }
        >
          {data.map((item, index) => (
            <>
              <Link key={index} to={item.href}>
                {item.title}
              </Link>
              -
            </>
          ))}
        </Div>
        <Div
          className={
            reverseDirection
              ? 'cs-moving_text cs-reverse_animation'
              : 'cs-moving_text'
          }
        >
          {data.map((item, index) => (
            <>
              <Link key={index} to={item.href}>
                {item.title}
              </Link>
              -
            </>
          ))}
        </Div>
      </Div>
    </Div>
  );
}
