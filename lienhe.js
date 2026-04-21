document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const notification = document.getElementById('successNotification');
    if (notification) {
        notification.style.display = 'none'; 
    }
    if (form && notification) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); 
            notification.style.display = 'block'; 
            setTimeout(() => {
                notification.classList.add('show');
            }, 10); 
            form.reset();
            setTimeout(function() {
                notification.classList.remove('show');
                setTimeout(() => {
                     notification.style.display = 'none';
                }, 500); 
            }, 3000); 
        });
    }
});