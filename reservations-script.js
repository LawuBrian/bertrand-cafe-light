/**
 * Reservations Page Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    initReservationForm();
    initTypeCardSelection();
    setMinDate();
});

/**
 * Set minimum date to today
 */
function setMinDate() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
}

/**
 * Type Card Selection
 */
function initTypeCardSelection() {
    const typeCards = document.querySelectorAll('.reservation-type-card');
    const typeSelect = document.getElementById('reservationType');

    typeCards.forEach(card => {
        card.addEventListener('click', () => {
            const type = card.dataset.type;

            // Update select
            if (typeSelect) {
                typeSelect.value = type;
            }

            // Visual feedback
            typeCards.forEach(c => c.style.borderColor = '');
            card.style.borderColor = 'var(--gold)';

            // Scroll to form
            const form = document.getElementById('bookingForm');
            if (form) {
                form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/**
 * Reservation Form Handler
 */
function initReservationForm() {
    const form = document.getElementById('reservationForm');
    const successModal = document.getElementById('reservationSuccessModal');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        console.log('Reservation submitted:', data);

        // Store reservation
        const reservations = JSON.parse(localStorage.getItem('bertrand_reservations') || '[]');
        reservations.push({
            ...data,
            id: Date.now(),
            status: 'pending',
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('bertrand_reservations', JSON.stringify(reservations));

        // Show success modal
        if (successModal) {
            successModal.classList.add('active');
        }

        // Reset form
        form.reset();
    });
}
