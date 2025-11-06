let maxZIndex = 1;

function dragElement(terrariumElement) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  let initialX = 0, initialY = 0;

  terrariumElement.ondblclick = bringFront;

  terrariumElement.ondragstart = dragStart;
  terrariumElement.setAttribute('draggable', true);
  terrariumElement.ondragend = stopDrag;

  function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    
    maxZIndex++;
    terrariumElement.style.zIndex = maxZIndex;

    pos3 = e.clientX;
    pos4 = e.clientY;
    initialX = terrariumElement.offsetLeft;
    initialY = terrariumElement.offsetTop;
    
    }

    function stopDrag(e) {
        const deltaX = e.clientX - pos3;
        const deltaY = e.clientY - pos4;
        terrariumElement.style.left = (initialX + deltaX) + "px";
        terrariumElement.style.top = (initialY + deltaY) + "px";

        document.ondragover = null;
    }

    document.body.ondragover = function(e) {
        e.preventDefault();
    }

    function bringFront() {
        maxZIndex++;
        terrariumElement.style.zIndex = maxZIndex;
    }
}

dragElement(document.getElementById('plant1'));
dragElement(document.getElementById('plant2'));
dragElement(document.getElementById('plant3'));
dragElement(document.getElementById('plant4'));
dragElement(document.getElementById('plant5'));
dragElement(document.getElementById('plant6'));
dragElement(document.getElementById('plant7'));
dragElement(document.getElementById('plant8'));
dragElement(document.getElementById('plant9'));
dragElement(document.getElementById('plant10'));
dragElement(document.getElementById('plant11'));
dragElement(document.getElementById('plant12'));
dragElement(document.getElementById('plant13'));
dragElement(document.getElementById('plant14'));