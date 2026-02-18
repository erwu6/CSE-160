class Cube{
    constructor(){
        this.type = "cube";
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.textureNum = -2;
        this.buffer = null;
        this.cubeVerts32 = new Float32Array([
            0,0,0, 1,0,0,  1,1,0,
            0,0,0, 1,1,0,  0,1,0,
            
            0,1,0,  0,1,1,  1,1,1,
            0,1,0,  1,1,1,  1,1,0,

            1,1,0,  1,1,1,  1,0,0,
            1,0,0,  1,1,1,  1,0,1,

            0,1,0,  0,1,1,  0,0,0,
            0,0,0,  0,1,1,  0,0,1,

            0,0,0,  0,0,1,  1,0,1,
            0,0,0,  1,0,1,  1,0,0,

            0,0,1,  1,1,1,  1,0,1,
            0,0,1,  0,1,1,  1,1,1]);
        this.cubeVerts = [
            0,0,0, 1,1,0,  1,0,0,
            0,0,0, 0,1,0,  1,1,0,
            
            0,1,0,  0,1,1,  1,1,1,
            0,1,0,  1,1,1,  1,1,0,

            1,1,0,  1,1,1,  1,0,0,
            1,0,0,  1,1,1,  1,0,1,

            0,1,0,  0,1,1,  0,0,0,

            0,0,0,  0,1,1,  0,0,1,
            0,0,0,  0,0,1,  1,0,1,

            0,0,0,  0,0,1,  1,0,0,
            0,0,1,  1,1,1,  1,0,1,
            0,0,1,  0,1,1,  1,1,1
        ];
    }

    render(){
        gl.useProgram(gl.program);
        var rgba = this.color;

        gl.uniform1i(u_whichTexture, this.textureNum);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements)

        drawTriangle3DUV([0.0, 0.0, 0.0,  1.0,1.0,0.0,  1.0,0.0,0.0], [1,0, 0,1, 1,1]);
        // drawTriangle3D([0.0, 0.0, 0.0,  1.0,1.0,0.0,  1.0,0.0,0.0]);
        // drawTriangle3D([0.0,0.0,0.0,  0.0,1.0,0.0,  1.0,1.0,0.0]);
        drawTriangle3DUV([0.0,0.0,0.0,  0.0,1.0,0.0,  1.0,1.0,0.0], [0,0, 0,1, 1,1]);

        //pass color
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3])

        drawTriangle3DUV([0.0, 1.0, 0.0,  0.0,1.0,1.0,  1.0,1.0,1.0], [1,0, 0,1, 1,1]);
        drawTriangle3DUV([0.0,1.0,0.0,  1.0,1.0,1.0,  1.0,1.0,0.0], [0,0, 0,1, 1,1]);

        drawTriangle3DUV([0.0,1.0,1.0,  0.0,0.0,1.0,  1.0,1.0,1.0], [1,0, 0,1, 1,1]);
        drawTriangle3DUV([1.0,1.0,1.0,  1.0,0.0,1.0,  0.0,0.0,1.0], [0,0, 0,1, 1,1]);

        drawTriangle3DUV([0.0,0.0,1.0,  1.0,0.0,1.0,  0.0,0.0,0.0], [1,0, 0,1, 1,1]);
        drawTriangle3DUV([0.0,0.0,0.0,  1.0,0.0,1.0,  1.0,0.0,0.0], [0,0, 0,1, 1,1]);

        drawTriangle3DUV([1.0,0.0,1.0,  1.0,1.0,1.0,  1.0,1.0,0.0], [1,0, 0,1, 1,1]);
        drawTriangle3DUV([1.0,1.0,0.0,  1.0,0.0,0.0,  1.0,0.0,1.0], [0,0, 0,1, 1,1]);

        drawTriangle3DUV([0.0,0.0,0.0,  0.0,1.0,0.0,  0.0,1.0,1.0], [1,0, 0,1, 1,1]);
        drawTriangle3DUV([0.0,1.0,1.0,  0.0,0.0,1.0,  0.0,0.0,0.0], [0,0, 0,1, 1,1]);
    }

    
    
    renderFast(){
        gl.useProgram(gl.program);
        var rgba = this.color;

        gl.uniform1i(u_whichTexture, this.textureNum);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        if (g_vertexBuffer == null) {
            initTriangle3D();
        }

        // var vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.cubeVerts32, gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        // For UV: use default texture coordinates (0,0) to (1,1) tiling
        var uv = [
            // 1,0,  0,1, 1,1,
            // 0,1,  0,0, 1,0,
            0,0,  1,0,  1,1,
            0,0,  1,1,  0,1,
            
            // 1,0,  0,1,  1,1,
            // 0,0,  1,1,  1,0,
            0,1, 0,0, 1,0,
            0,1, 1,0, 1,1,
            
            // 1,0,  0,1,  1,1,
            // 0,0,  0,1,  1,1,
            0,1, 1,1, 0,0,
            0,0, 1,1, 1,0,

            // 1,0,  0,1,  1,1,
            // 0,0,  0,1,  1,1,
            1,1, 0,1, 1,0,
            1,0, 0,1, 0,0,
            
            // 1,0,  0,1,  1,1,
            // 0,0,  0,1,  1,1,
            0,1,  0,0,  1,0,
            0,1,  1,0,  1,1,
            
            // 1,0,  0,1,  1,1,
            // 0,0,  0,1,  1,1
            0,0,  1,1,  1,0,
            0,0,  0,1,  1,1,
        ];
        
        var uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_UV);
        
        gl.drawArrays(gl.TRIANGLES, 0, 36);
    }
}