class TriPrism{
    constructor(){
        this.type = "triprism";
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.normalMatrix = new Matrix4();
        this.textureNum = -2;
    }

    render(){
        var rgba = this.color;

        gl.uniform1i(u_whichTexture, this.textureNum);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        this.normalMatrix.setInverseOf(this.matrix);
        this.normalMatrix.transpose();
        gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);

        drawTriangle3DUV([0.0, 1.0, 0.0,  1.0,0.0,0.0,  1.0,1.0,0.0],[1,0, 0,1, 1,1]);
        drawTriangle3D([0.0,1.0,0.0,  0.0,0.0,0.0,  1.0,0.0,0.0]);

        drawTriangle3D([1.0,1.0,0.0, 1.0,0.0,0.5, 1.0,0.0,0.0]);

        drawTriangle3D([0.0,0.0,0.5,  0.0,1.0,0.0,  0.0,0.0,0.0]);

        //pass color
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);

        // Side faces (long rectangles)
        let sideNormals = [
            [0,0,-1], [0,0,1], [1,0,0], [-1,0,0]
        ];
        let sideVertices = [
            [[0,1,0, 0,0,0, 1,0,0], [0,1,0, 1,0,0, 1,1,0]],    // front
            [[0,1,0, 0,0,0.5, 1,0,0.5], [0,1,0, 1,0,0.5, 1,1,0]], // back
            [[1,1,0, 1,0,0, 1,0,0.5], [1,1,0, 1,0,0.5, 1,1,0.5]], // right
            [[0,1,0, 0,0,0.5, 0,0,0], [0,1,0, 0,1,0.5, 0,0,0]]   // left
        ];

        for (let i = 0; i < sideVertices.length; i++) {
            let verts = sideVertices[i];
            let n = sideNormals[i];
            drawTriangle3DUVNormal(verts[0], [0,0,1,1,1,0], [n[0],n[1],n[2], n[0],n[1],n[2], n[0],n[1],n[2]]);
            drawTriangle3DUVNormal(verts[1], [0,0,1,1,1,0], [n[0],n[1],n[2], n[0],n[1],n[2], n[0],n[1],n[2]]);
        }

        drawTriangle3D([0.0, 0.0, 0.0,  0.0,0.0,0.5,  1.0,0.0,0.5]);
        drawTriangle3D([0.0,0.0,0.0,  1.0,0.0,0.5,  1.0,0.0,0.0]);

        drawTriangle3D([0.0,1.0,0.0,  1.0,0.0,0.5,  1.0,1.0,0.0]);
        drawTriangle3D([0.0,1.0,0.0, 0.0,0.0,0.5, 1.0,0.0,0.5]);
    }
}