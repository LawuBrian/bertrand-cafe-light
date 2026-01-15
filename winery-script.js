/**
 * Winery Page Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    initWineryAddToCart();
    initWineCategories();
});

/**
 * Wine Add to Cart
 */
function initWineryAddToCart() {
    const addBtns = document.querySelectorAll('.btn-wine-add');

    addBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.item;
            const price = parseInt(btn.dataset.price);

            if (typeof addToCart === 'function') {
                addToCart(name, price);
            }

            // Visual feedback
            const originalText = btn.textContent;
            btn.textContent = 'Added!';
            btn.style.background = '#722f37';
            btn.style.borderColor = '#722f37';
            btn.style.color = '#e8e0d0';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.style.borderColor = '';
                btn.style.color = '';
            }, 1500);
        });
    });
}

/**
 * Wine Category Hover Effects
 */
function initWineCategories() {
    const categories = document.querySelectorAll('.wine-category');

    categories.forEach(cat => {
        cat.addEventListener('mouseenter', () => {
            const icon = cat.querySelector('.category-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });

        cat.addEventListener('mouseleave', () => {
            const icon = cat.querySelector('.category-icon');
            if (icon) {
                icon.style.transform = '';
            }
        });
    });
}
