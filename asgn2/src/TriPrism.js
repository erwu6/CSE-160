class TriPrism{
    constructor(){
        this.type = "triprism";
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
    }

    render(){
        var rgba = this.color;

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        drawTriangle3D([0.0, 1.0, 0.0,  1.0,0.0,0.0,  1.0,1.0,0.0]);
        drawTriangle3D([0.0,1.0,0.0,  0.0,0.0,0.0,  1.0,0.0,0.0]);

        drawTriangle3D([1.0,1.0,0.0, 1.0,0.0,0.5, 1.0,0.0,0.0]);

        drawTriangle3D([0.0,0.0,0.5,  0.0,1.0,0.0,  0.0,0.0,0.0]);

        //pass color
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);

        drawTriangle3D([0.0, 0.0, 0.0,  0.0,0.0,0.5,  1.0,0.0,0.5]);
        drawTriangle3D([0.0,0.0,0.0,  1.0,0.0,0.5,  1.0,0.0,0.0]);

        drawTriangle3D([0.0,1.0,0.0,  1.0,0.0,0.5,  1.0,1.0,0.0]);
        drawTriangle3D([0.0,1.0,0.0, 0.0,0.0,0.5, 1.0,0.0,0.5]);
    }
}