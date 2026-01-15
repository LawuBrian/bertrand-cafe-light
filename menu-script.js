/**
 * Menu Page Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    initCategoryFilter();
    initMenuAddToCart();
});

/**
 * Category Filter
 */
function initCategoryFilter() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    const menuSections = document.querySelectorAll('.menu-section');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;

            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter items
            if (category === 'all') {
                menuItems.forEach(item => {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.4s ease';
                });
                menuSections.forEach(section => section.style.display = 'block');
            } else {
                menuItems.forEach(item => {
                    if (item.dataset.category === category) {
                        item.style.display = 'block';
                        item.style.animation = 'fadeIn 0.4s ease';
                    } else {
                        item.style.display = 'none';
                    }
                });

                // Show/hide sections based on matching items
                menuSections.forEach(section => {
                    const sectionCategory = section.dataset.section;
                    const hasVisibleItems = section.querySelectorAll(`.menu-item[data-category="${category}"]`).length > 0;
                    section.style.display = hasVisibleItems ? 'block' : 'none';
                });
            }
        });
    });
}

/**
 * Menu Add to Cart
 */
function initMenuAddToCart() {
    const addBtns = document.querySelectorAll('.btn-add');

    addBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.item;
            const price = parseInt(btn.dataset.price);

            // Call global addToCart function from main script
            if (typeof addToCart === 'function') {
                addToCart(name, price);
            }

            // Visual feedback
            btn.classList.add('added');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Added!</span>
            `;

            setTimeout(() => {
                btn.classList.remove('added');
                btn.innerHTML = originalHTML;
            }, 1500);
        });
    });
}

// Add fade animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
