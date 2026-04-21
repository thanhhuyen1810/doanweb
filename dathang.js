// Cart State
let cart = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    updateCartDisplay();
    attachProductEvents();
    handleImageErrors();
});

// Gán sự kiện click cho các sản phẩm
function attachProductEvents() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Lấy thông tin sản phẩm từ thuộc tính data-
            const id = parseInt(this.dataset.id);
            const name = this.dataset.name;
            const price = parseInt(this.dataset.price);
            
            const product = { id, name, price };
            addToCart(product);
            
            // Add animation effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
}

// Xử lý lỗi ảnh sản phẩm
function handleImageErrors() {
    const productImages = document.querySelectorAll('.product-image');
    productImages.forEach(img => {
        img.onerror = function() {
            this.onerror = null;
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjEwMCIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+JDE5OTk7bmggc+ahbiBwaOG6p20gdMOwbiB24bqtcCBo4buNIGzDoG08L3RleHQ+PC9zdmc+';
            this.style.background = '#f0f0f0';
        };
    });
}

// Add to Cart
function addToCart(product) {
    if (!product.price) {
        showNotification('⚠️ Sản phẩm này cần liên hệ để đặt hàng!', 'warning');
        return;
    }
    
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity++;
        showNotification(`✅ Đã thêm ${product.name} vào giỏ hàng!`, 'success');
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
        showNotification(`✅ Đã thêm ${product.name} vào giỏ hàng!`, 'success');
    }
    saveCart();
    updateCartDisplay();
    
    // Animate cart button
    const cartBtn = document.querySelector('.cart-badge');
    cartBtn.style.animation = 'pulse 0.5s ease';
    setTimeout(() => {
        cartBtn.style.animation = '';
    }, 500);
}

// Update Cart Display
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const totalPrice = document.getElementById('totalPrice');
    const cartCount = document.querySelector('.cart-badge');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 20px; color: #666;">Giỏ hàng trống</p>';
        totalPrice.textContent = '0';
        cartCount.textContent = '0';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    let itemCount = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
        total += item.price * item.quantity;
        itemCount += item.quantity;
    });
    
    totalPrice.textContent = formatPrice(total);
    cartCount.textContent = itemCount;
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
            showNotification('🗑️ Đã xóa sản phẩm khỏi giỏ hàng', 'info');
        }
        
        saveCart();
        updateCartDisplay();
    }
}

// Show Checkout Form
function showCheckoutForm() {
    if (cart.length === 0) {
        showNotification('⚠️ Giỏ hàng trống! Vui lòng thêm sản phẩm trước.', 'warning');
        return;
    }
    
    const checkoutForm = document.getElementById('checkoutForm');
    checkoutForm.style.display = 'block';
    checkoutForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Submit Order
function submitOrder(event) {
    event.preventDefault();
    
    if (cart.length === 0) {
        showNotification('⚠️ Giỏ hàng trống!', 'warning');
        return;
    }
    
    // Get form data
    const form = event.target;
    const formData = {
        name: form.querySelector('input[type="text"]').value,
        phone: form.querySelector('input[type="tel"]').value,
        address: form.querySelectorAll('input[type="text"]')[1].value,
        note: form.querySelector('textarea').value,
        payment: form.querySelector('input[name="payment"]:checked').value,
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
    
    console.log('Đơn hàng:', formData);
    
    // Create order summary
    let orderSummary = '🎉 Đặt hàng thành công!\n\n';
    orderSummary += `👤 Khách hàng: ${formData.name}\n`;
    orderSummary += `📱 SĐT: ${formData.phone}\n`;
    orderSummary += `📍 Địa chỉ: ${formData.address}\n`;
    orderSummary += `💰 Tổng tiền: ${formatPrice(formData.total)}\n`;
    orderSummary += `💳 Thanh toán: ${formData.payment === 'cod' ? 'COD' : 'Chuyển khoản'}\n\n`;
    orderSummary += 'Chúng tôi sẽ liên hệ với bạn sớm nhất!';
    
    // Show success message
    alert(orderSummary);
    showNotification('✅ Đơn hàng đã được gửi thành công!', 'success');
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartDisplay();
    
    // Hide form and reset
    document.getElementById('checkoutForm').style.display = 'none';
    form.reset();
    
    // Scroll to thank you message
    document.querySelector('.thank-you-box').scrollIntoView({ behavior: 'smooth' });
}

// Format Price
function formatPrice(price) {
    return price.toLocaleString('vi-VN') + '₫';
}

// Show Notification
function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 24px;">${getNotificationIcon(type)}</span>
            <span>${message}</span>
        </div>
    `;
    
    const colors = {
        success: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
        warning: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
        info: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
        error: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.success};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        font-weight: 500;
        min-width: 250px;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Get Notification Icon
function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        warning: '⚠️',
        info: 'ℹ️',
        error: '❌'
    };
    return icons[type] || icons.success;
}

// Save Cart to Local Storage
function saveCart() {
    try {
        localStorage.setItem('cartData', JSON.stringify(cart));
    } catch (e) {
        console.log('Không thể lưu giỏ hàng:', e);
    }
}

// Load Cart from Local Storage
function loadCart() {
    try {
        const savedCart = localStorage.getItem('cartData');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    } catch (e) {
        console.log('Không thể tải giỏ hàng:', e);
        cart = [];
    }
}