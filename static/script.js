let drawing = false;
let offsetLeft = 0;
let offsetTop = 0;

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const hiddenCanvas = document.createElement('canvas');
hiddenCanvas.width = 600;
hiddenCanvas.height = 400;
const hiddenContext = hiddenCanvas.getContext('2d');

const startCanvas = () => {
    canvas.onmousedown = mouseDownHandler;
    canvas.onmousemove = mouseMoveHandler;
    canvas.onmouseup = mouseUpHandler;
    for (let o=canvas; o; o=o.offsetParent) {
        offsetLeft += (o.offsetLeft - o.scrollLeft);
        offsetTop += (o.offsetTop - o.scrollTop);
    }
    draw();
};

const getPosition = (givenEvent) => {
    let currEvent = givenEvent;
    if (!currEvent && event) {
        currEvent = event;
    } else if (!currEvent && !event) {
        currEvent = null;
    }

    let left = 0;
    let top = 0;

    if (currEvent.pageX) {
        left = currEvent.pageX;
        top  = currEvent.pageY;
    } else if (document.documentElement.scrollLeft) {
        left = currEvent.clientX + document.documentElement.scrollLeft;
        top  = currEvent.clientY + document.documentElement.scrollTop;
    } else  {
        left = currEvent.clientX + document.body.scrollLeft;
        top  = currEvent.clientY + document.body.scrollTop;
    }
    left -= offsetLeft;
    top -= offsetTop;

    return {x : left, y : top};
};

const mouseDownHandler = (event) => {
    drawing = true;
    let position = getPosition(event);
    context.beginPath();
    context.lineWidth = 3.0;
    context.strokeStyle = "#66FCF1";
    context.moveTo(position.x, position.y);
};

const mouseMoveHandler = (event) => {
    if (!drawing) return;
    let position = getPosition(event);
    context.lineTo(position.x, position.y);
    context.stroke();
};

const mouseUpHandler = (event) => {
    if (!drawing) return;
    mouseMoveHandler(event);
    context.closePath();
    drawing = false;
};

const draw = () => {
    context.fillStyle = "#0B0C10";
    context.fillRect(0,0,600,400);
};

const discolorCanvas = () => {
    const imageData = context.getImageData(0,0,600,400);
    const data = imageData.data;
    let i = 0;
    while (i < data.length) {
        if (data[i] !== 11) {
            data[i] = 0;
            data[i+1] = 0;
            data[i+2] = 0;
        }

        if (data[i] === 11) {
            data[i] = 255;
            data[i+1] = 255;
            data[i+2] = 255;
        }

        i += 4;
    }
    hiddenContext.putImageData(imageData, 0, 0);
};

const clearCanvas = () => {
    context.clearRect(0,0,600,400);
    draw();
};

const sendImage = async () => {
    discolorCanvas();
    const picture = await new Promise(resolve => hiddenCanvas.toBlob(resolve, 'image/jpeg'));
    const request = new XMLHttpRequest();
    request.addEventListener('load', (event) => {
        console.log('res', event.target.response);
        const result = document.getElementById('result');
        result.innerHTML = event.target.response;
    });
    request.addEventListener('error', (event) => {
        console.log('event error', event);
    });
    request.open('POST', '/predictions');
    const formData = new FormData();
    formData.append('picture', picture, 'picture.jpeg');
    request.send(formData);
};

document.getElementById("clear-button").onclick = clearCanvas;
document.getElementById("predict-button").onclick = sendImage;

onload = startCanvas;