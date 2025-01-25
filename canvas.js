let isDrawing = false;
    let x = 0;
    let y = 0;
    
    document.getElementById("annotate").addEventListener("click", () => {
      const canvas = document.createElement("canvas");
      canvas.id = "annotationCanvas";
      canvas.style.position = "absolute";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.zIndex = "9999";
    
      const ctx = canvas.getContext("2d");
      document.body.appendChild(canvas);
    
      canvas.addEventListener("mousedown", (e) => {
        isDrawing = true;
        x = e.clientX;
        y = e.clientY;
      });
    
      canvas.addEventListener("mousemove", (e) => {
        if (!isDrawing) return;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();
        x = e.clientX;
        y = e.clientY;
      });
    
      canvas.addEventListener("mouseup", () => {
        isDrawing = false;
      });
    });