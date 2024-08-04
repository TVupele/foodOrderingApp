let cart = [];
let totalPrice = 0;
let token = null;

function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    }).then(response => response.json())
      .then(data => {
          alert(data.message);
      })
      .catch(error => console.error('Error:', error));
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    }).then(response => response.json())
      .then(data => {
          token = data.token;
          alert('Login successful');
          fetchOrders();
      })
      .catch(error => console.error('Error:', error));
}

function addToCart(item, price) {
    cart.push({ item, price });
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    totalPrice = 0;
    cart.forEach((cartItem, index) => {
        const li = document.createElement('li');
        li.textContent = `${cartItem.item} - $${cartItem.price}`;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => {
            cart.splice(index, 1);
            updateCart();
        };
        li.appendChild(removeButton);
        cartItems.appendChild(li);
        totalPrice += cartItem.price;
    });
    document.getElementById('total-price').textContent = `Total: $${totalPrice}`;
}

async function placeOrder() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    if (!token) {
        alert('Please log in to place an order');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ items: cart, total: totalPrice }),
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.message);
            cart = [];
            updateCart();
            fetchOrders();
        } else {
            alert('Failed to place order. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}

async function fetchOrders() {
    if (!token) {
        alert('Please log in to view your orders');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/orders', {
            method: 'GET',
            headers: {
                'Authorization': token
            },
        });

        if (response.ok) {
            const orders = await response.json();
            const orderList = document.getElementById('order-list');
            orderList.innerHTML = '';
            orders.forEach(order => {
                const li = document.createElement('li');
                li.textContent = `Order #${order._id} - Total: $${order.total} - Date: ${new Date(order.date).toLocaleString()}`;
                orderList.appendChild(li);
            });
        } else {
            alert('Failed to fetch orders. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}
