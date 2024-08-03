let cart = [];
let totalPrice = 0;

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
        li.textContent = `${cartItem.item} - N${cartItem.price}`;
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
    document.getElementById('total-price').textContent = `Total: N${totalPrice}`;
}

function placeOrder() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert('Order placed successfully!');
    cart = [];
    updateCart();
}
