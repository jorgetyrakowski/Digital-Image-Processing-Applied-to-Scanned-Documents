class mycanvas {

    constructor(){
        this.createCanvas();    
    }

    createCanvas(){
        const imagen = document.querySelector('#imagen');
        const btn_restore = document.querySelector('#restore');
        const btn_rotate = document.querySelector('#rotate');
        const btn_contrast = document.querySelector('#contrast');
        const btn_grayscale = document.querySelector('#grayscale');
        const imagenPreview = document.querySelector('#imagenPreview');
        const select_canvas = document.querySelector('#select_canvas');
        const ctx = select_canvas.getContext("2d");
        let x=0;
        let y=0;
        let width=select_canvas.width;
        let height=select_canvas.height; 
        let originalData;
        let matrix;
        let matrixV; 
        imagen.addEventListener('change', ()=>{
            
            const selectImagen = imagen.files;

            if (!selectImagen || !selectImagen.length) {
                imagenPreview.src = "";
                return;
              }

                const firstFile = selectImagen[0];
                const objectURL = URL.createObjectURL(firstFile);
                imagenPreview.src = objectURL;              

                imagenPreview.onload = function(){
                    ctx.clearRect(0, 0, ctx.canvas.offsetWidth, ctx.canvas.offsetHeight);
                    ctx.drawImage(imagenPreview, x, y, width, height);
                    let imgData = ctx.getImageData(x,y,width,height);
                    originalData = imgData.data;
                    
                }     
        });

        btn_rotate.addEventListener('click', ()=>{
          var value = -90;
          let width=select_canvas.width;
          let height=select_canvas.height;
          var cos = Math.cos(value*Math.PI/180);
          var sin = Math.sin(value*Math.PI/180);
          transform(ctx, width, height, [cos, sin, -sin, cos, -cos*width/2 + sin*height/2 + width/2, -sin*width/2 - cos*height/2 + height/2]);
       });

        btn_grayscale.addEventListener('click', ()=>{
           matrix = [ 1/3, 1/3, 1/3, 1/3, 1/3, 1/3, 1/3, 1/3, 1/3 ];
           matrixV = [ 0, 0, 0 ];
           filters(ctx, matrix, matrixV);
        });

        btn_contrast.addEventListener('click', ()=>{
            var value = 10;
            var f = (259 * (value + 255)) / (255 * (259 - value));
            matrix = [f, 0, 0, 0, f, 0, 0, 0, f];
            matrixV = [ 128*(1-f), 128*(1-f), 128*(1-f)];
           filters(ctx, matrix, matrixV);
        })

        btn_restore.addEventListener('click', ()=>{
          restorePixel(ctx);
        });
       
        function filters(ctx, matriz, matrizV){
          let imgData = ctx.getImageData(x,y,width,height);
          console.log(imgData.data);
          for(let i=0; i < imgData.data.length; i+= 4){ 
              const matrizRGB = {  r: imgData.data[i], g: imgData.data[i+1], b: imgData.data[i+2] };
              //RGB Red
              imgData.data[i] = matriz[0] * matrizRGB.r + matriz[1] * matrizRGB.g + matriz[2] * matrizRGB.b + matrizV[0];  
              //RGB Green
              imgData.data[i+1] = matriz[3] * matrizRGB.r + matriz[4] * matrizRGB.g + matriz[5] * matrizRGB.b + matrizV[1];
              //RGB Blue
              imgData.data[i+2] = matriz[6] * matrizRGB.r + matriz[7] * matrizRGB.g + matriz[8] * matrizRGB.b + matrizV[2];
          }
          ctx.putImageData(imgData, 0, 0);
        }

        function restorePixel(ctx) {   
           let imgData = ctx.getImageData(x,y,width,height);
            for(let i=0; i < imgData.data.length; i+= 4){
              //r
              imgData.data[i] = originalData[i];
              //g
              imgData.data[i + 1] = originalData[i + 1];
              //b
              imgData.data[i + 2] = originalData[i + 2];
            }
            ctx.putImageData(imgData, 0, 0);
        } 
        
        function transform(ctx, w, h, matrix){
            var pxlData = ctx.getImageData( 0, 0, w, h).data;
            var imageData = ctx.createImageData(w, h);
            var newPxlData = imageData.data;
            for (var x = 0; x < w; x++){
              for (var y = 0; y < h; y++){
                var nx = Math.floor(matrix[0]*x + matrix[2]*y + matrix[4]);
                var ny = Math.floor(matrix[1]*x + matrix[3]*y + matrix[5]);
                if (nx >= 0 && nx < w && ny>=0 && ny < h){
                  newPxlData[(y*w + x)*4]     = pxlData[(ny*w + nx)*4];
                  newPxlData[(y*w + x)*4 + 1] = pxlData[(ny*w + nx)*4 + 1];
                  newPxlData[(y*w + x)*4 + 2] = pxlData[(ny*w + nx)*4 + 2];
                  newPxlData[(y*w + x)*4 + 3] = pxlData[(ny*w + nx)*4 + 3];
                }
              }
            }
            ctx.putImageData(imageData, 0, 0);
          }
    }
}

new mycanvas();