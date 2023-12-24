document.addEventListener('DOMContentLoaded', () => {
    const numberOfLights = 100;
    for (let i = 0; i < numberOfLights; i++) {
        createLight(i);
    }

    const socket = new WebSocket('ws://localhost:3000');

    socket.onopen = () => console.log('WebSocket connected');
    socket.onerror = (error) => console.log('WebSocket error:', error);

    socket.onmessage = (event) => {
        console.log('Message from server:', event.data);
        const data = JSON.parse(event.data);
    
        if (data.type === 'init') {
            Object.keys(data.lightsStatus).forEach(lightId => {
                updateLightStatus(lightId, data.lightsStatus[lightId]);
            });
        } else {
            updateLightStatus(data.lightId, data.status);
        }
    };
    
    function updateLightStatus(lightId, status) {
        const lightElement = document.querySelector(`[data-light-id="${lightId}"]`);
        if (!lightElement) {
            console.error('Light element not found:', lightId);
            return;
        }
    
        if (status === 'on') {
            // Example using RGB
            //lightElement.style.background = 'rgb(0, 255, 0)'; // Green color
    
            // Example using HSL
            lightElement.style.background = 'hsl(50, 93%, 21%)'; // Green color
        } else {
            // Example using RGB
            //lightElement.style.background = 'rgb(255, 0, 0)'; // Red color
    
            // Example using HSL
            lightElement.style.background = 'hsl(50, 100%, 50%)'; // Red color
        }
    }    
    
    function createLight(id) {
        const light = document.createElement('div');
        light.className = 'light';
        light.setAttribute('data-light-id', id);
        light.style.left = `${Math.random() * 90}%`;
        light.style.top = `${Math.random() * 90}%`;
        light.addEventListener('click', () => toggleLight(id, socket));
        document.getElementById('tree-container').appendChild(light);
    }

    function toggleLight(id, socket) {
        console.log('Toggling light:', id); // Added log for debugging
        socket.send(JSON.stringify({ lightId: id }));
    }
});
