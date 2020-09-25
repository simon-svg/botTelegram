import React, { useEffect, useState } from 'react';
import ProductItem from './components/ProductItems';
import './App.scss';
import { nanoid } from 'nanoid';

function App() {
  const [data, setDate] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [globalCounter, setGlobalCounter] = useState(3);
  const [itemPrice, setItemPrice] = useState(0);
  useEffect(() => {
    setIsLoading(true)


    // GET -------
    fetch('https://designer.fstrk.io/api/partners/chats/84d7967f-3334-4ca3-ae2d-e90d72f11745/variables/', {
      headers: { 'bot-key': 'c7736d90-a435-4f22-920a-1f5d9ce77fb3' }
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setDate(data['cart-8f23fa09-c277-424a-9604-f5dd1c859bea'].products);
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])
  useEffect(() => {
    setItemPrice(0)
    data.map(e => {
      setItemPrice(prevState => prevState + (e.discount_price * e.quantity))
    })
  }, [data])
  const handleGlobalAdd = () => {
    setGlobalCounter(globalCounter + 1)
  }






  // POST -------
  const post = (newDataa) => {
    setDate(newDataa)
    let fData = {
      'cart-8f23fa09-c277-424a-9604-f5dd1c859bea': {
        'products': newDataa,
      }
    }
    fetch("https://designer.fstrk.io/api/partners/chats/84d7967f-3334-4ca3-ae2d-e90d72f11745/variables/", {
      method: "POST",
      body: JSON.stringify(fData),
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json',
        'bot-key': 'c7736d90-a435-4f22-920a-1f5d9ce77fb3',
      },
    })
      .then((res) => res)
  }







  const increment = (id) => {
    setItemPrice(0)
    const newData = data.map(e => {
      return {
        ...e,
        quantity: e.guid === id ? e.quantity + 1 : e.quantity
      }
    })
    setDate(newData)
    post(newData)
  }





  const decrement = (id) => {
    const newData = data.map(e => {
      return {
        ...e,
        quantity: e.guid === id ? e.quantity - 1 : e.quantity
      }
    })
    post(newData)
  }




  const delet = (id) => {
    const newData = data.filter(e => e.guid !== id)
    setDate(newData)
    post(newData)
  }




  const order = (e) => {
    e.preventDefault();
    setDate(data)
    let fData = {
      'cart-8f23fa09-c277-424a-9604-f5dd1c859bea': {
        'products': data,
      }
    }
    fetch("https://designer.fstrk.io/api/partners/chats/84d7967f-3334-4ca3-ae2d-e90d72f11745/variables/", {
      method: "POST",
      body: JSON.stringify(fData),
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json',
        'bot-key': 'c7736d90-a435-4f22-920a-1f5d9ce77fb3',
      },
    })
      .then((res) => res)
      .then(() => {
        fetch('https://api.telegram.org/bot1378834776:AAH8vF6I5CkmFKD4e7Z8nY3MpAb3TEq9gzo/getUpdates')
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            return data.result[data.result.length - 1]
          })
          .then((data) => {
            let id = data.message.from.id;
            let loc = document.location.href;
            let newWindow = window.open(`https://api.telegram.org/bot1378834776:AAH8vF6I5CkmFKD4e7Z8nY3MpAb3TEq9gzo/sendMessage?chat_id=${id}&text=Данные сохранены! ${loc}`, "_blank")
            return {
              newWindow,
              data
            };
          })
          .then(({ newWindow, data }) => {
            setTimeout(() => {
              newWindow.close()
            }, 1000);
            return data
          })
          .then((data) => {
            let username = data.message.from.username;
            document.location.assign(`tg://resolve?domain=@${username}`)
          })
      })
  }




  const deleteAll = (id) => {
    const newData = data.slice(0, 0)
    post(newData)
  }




  return (
    <div className="App">
      <div className="items__top">
        <div className="items__basket">
          <h3>Корзина {globalCounter}</h3>
        </div>
        <div className="items__price">
          <span className="items__price_cont">{itemPrice} руб.</span>
        </div>
      </div>
      <div className="items">{
        isLoading ? '...loading' : data
          .map((elem) => <ProductItem
            key={nanoid()}
            id={elem.guid}
            imgLink={elem.image}
            price={elem.price}
            discount_price={elem.discount_price}
            title={elem.title}
            quantity={elem.quantity}
            size={elem.choices.field_multichoice.value}
            increment={increment}
            decrement={decrement}
            delet={delet}
          />)
      }</div>
      <form action="#" className="items__boot">
        <button className="button__add button" type="submit" onClick={order}>Oформить заказ</button>
        <button className="button" type="submit" onClick={deleteAll}>Oчистить корзину</button>
      </form>
    </div>
  );
}
export default App;