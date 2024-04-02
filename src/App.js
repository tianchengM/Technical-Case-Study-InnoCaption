import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Toast from 'react-bootstrap/Toast';
import 'bootstrap/dist/css/bootstrap.min.css';

// cart
function Cart({ cart, setCart, showCart, setShowCart }) {
  // handle cart display
  function handleShowCart() {
    setShowCart(true)
  }
  function handleClose() {
    setShowCart(false)
  }
  // modify cart from cart modal
  function modifyProductFromCart(newProduct, type) {
    setCart(preCart => {
      const existProduct = preCart.find(product => product.id === newProduct.id);
      if (type === "up") {
        return preCart.map(product => product.id === newProduct.id ? { ...product, quantity: product.quantity + 1 } : product)
      }
      else {
        if (existProduct.quantity === 1) {
          return preCart.filter(product => product.id !== newProduct.id);
        }
        else {
          return preCart.map(product => product.id === newProduct.id ? { ...product, quantity: product.quantity - 1 } : product)
        }
      }
    }
    )
  }
  const cartStyle = {
    position: 'fixed',
    right: '20px',
    top: '20px',
    width: "100px",
    height: "100px"
  }
  return (
    <>
      {/* show cart, allowing addion, edition, and delete of products  */}
      <Button style={cartStyle} variant="dark" onClick={handleShowCart}>
        Cart
      </Button>
      <Modal show={showCart} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Your Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {cart && cart.map(product => (
                <tr key={product.id}>
                  <td>{product.title}</td>
                  <td><Button variant="danger" onClick={() => modifyProductFromCart(product, "down")}> - </Button>
                    &nbsp;{product.quantity} &nbsp;
                    <Button variant="success" onClick={() => modifyProductFromCart(product, "up")}> + </Button></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

// search
function Search({ input, setInput, setData }) {
  function handleInputChange(e) {
    setInput(e.target.value);
  }
  // search products
  function searchProducts() {
    const url = "https://dummyjson.com/products/search?q=" + input
    fetch(url, {
      headers: {
        accept: 'application/json',
      }
    })
      .then(res => res.json())
      .then(res => setData(res.products));
  }
  return (
    <>
      {/* search bar */}
      <input type='text' value={input} onChange={handleInputChange} />
      <Button variant="success" onClick={searchProducts}>Search</Button>
    </>
  )
}

// products
function Products({ data, setCart, setShowToast }) {
  const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  };
  // add new products from prouct list
  function addProduct(newProduct) {
    setCart(preCart => {
      const existProduct = preCart.find(product => product.id === newProduct.id);
      if (existProduct) {
        return preCart.map(product => product.id === newProduct.id ? { ...product, quantity: product.quantity + 1 } : product)
      }
      return [...preCart, { ...newProduct, quantity: 1 }]
    })
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  }
  return (
    <>
      {/* show purchasable products */}
      <div style={containerStyle}>
        {data && data.map(product => (
          <div style={{ padding: '10px', margin: '10px' }} key={product.id}>
            <img src={product.images[0]} alt='img' height='200px' width='250px' />
            <div style={{ border: '1px solid black', width: '250px' }}>
              {product.title}
              <br></br>
              Rating: {product.rating}
              <br></br>
              Original price {product.price}. Now -{product.discountPercentage}%
              <br></br>
              <Button variant="primary" onClick={() => addProduct(product)}>Add to Cart</Button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

// toast notification
function ToastNotification({ showToast }) {
  return (
    <>
      <Toast show={showToast} style={{
        position: 'fixed',
        right: '40%',
        top: '20px',
      }}>
        <Toast.Body>You have successfully added a product!</Toast.Body>
      </Toast>
    </>
  )
}

export default function App() {
  const [data, setData] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [cart, setCart] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [input, setInput] = useState("");

  // fetch example products
  useEffect(() => {
    fetch('https://dummyjson.com/products', {
      headers: {
        accept: 'application/json',
      }
    })
      .then(res => res.json())
      .then(res => {
        setData(res.products)
      })
  }, []);
  // fetch example cart
  useEffect(() => {
    fetch('https://dummyjson.com/carts/1', {
      headers: {
        accept: 'application/json',
      }
    })
      .then(res => res.json())
      .then(res => {
        setCart(res.products)
      })
  }, []);

  return (
    <div>
      <h1>Technical Case Study</h1>
      <Search input={input} setInput={setInput} setData={setData} />
      <Products data={data} setCart={setCart} setShowToast={setShowToast} />
      <Cart cart={cart} setCart={setCart} showCart={showCart} setShowCart={setShowCart} />
      <ToastNotification showToast={showToast} />
    </div>
  );
}

