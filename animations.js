function transformButtons() {
    const buttons = document.querySelectorAll('.animate-button');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const existingRipple = document.querySelector('.ripple');
            if(existingRipple) {
                existingRipple.remove();
            }

            const circle = document.createElement('span');
            const diameter = Math.max(button.clientWidth, button.clientHeight);
            const radius = diameter / 2;

            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${x - radius}px`;
            circle.style.top = `${y - radius}px`;
            circle.classList.add('ripple');

            button.appendChild(circle);

            circle.addEventListener('animationend', () => {
                circle.remove();
            })
        })
    })
}

transformButtons();