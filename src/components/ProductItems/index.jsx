import React, { useState, useEffect } from 'react';
import style from './style.module.scss';

const ProductItem = (
  { imgLink,
    discount_price,
    price,
    title,
    size,
    quantity,
    id,
    increment,
    decrement,
    delet,
  }
) => {
  return (
    <div className={style.items__cont}>
      <div className={style.item}>
        <div className={style.description}>
          <div className={style.description_image}>
            <img src={imgLink} alt='image' />
          </div>
          <div className={style.description_info}>
            <div className={style.description_title}>{title}</div>
            <div className={style.description_size}>Размер: {size}</div>
            <div className={style.description_price}>
              <span>{discount_price ? discount_price * quantity : price * quantity} руб.</span>
              <span className={style.old_price}>{discount_price ? price * quantity + " руб." : null}</span>
              </div>
          </div>
        </div>
        <div className={style.action}>
          <button type="button" className={style.btn} onClick={() => delet(id)}><i className={`${style.recycleBin} fa fa-trash-o`}></i></button>
          <div className={style.count}>{quantity}</div>
          <button type="button" onClick={() => increment(id)} className={style.btn}>+</button>
          {quantity !== 1 ? (<button type="button" onClick={() => decrement(id)} className={style.btn}>-</button>) : null}
        </div>
      </div>
    </div>
  )
}
export default ProductItem;