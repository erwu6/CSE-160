class Camera{
    constructor(){
        this.eye=new Vector(0,0,3);
        this.at = new Vector(0,0,-100);
        this.up = new Vector(0,1,0);
        // Map bounds (world coordinates matching g_map indices 0..31 mapped to -16..15)
        this.minX = -16;
        this.maxX = 15;
        this.minZ = -16;
        this.maxZ = 15;
    }

    // clamp a Vector's x/z to the map bounds (modifies in place)
    clampToBounds(v){
        if (v.x < this.minX) v.x = this.minX;
        if (v.x > this.maxX) v.x = this.maxX;
        if (v.z < this.minZ) v.z = this.minZ;
        if (v.z > this.maxZ) v.z = this.maxZ;
        if (v.y < 0) v.y = 0;
    }

    // return g_map if position `pos` would be inside a solid map cube
    isBlocked(pos){
        // map cell indices
        var x = Math.floor(pos.x + 16);
        var y = Math.floor(pos.z + 16);
        if (x < 0 || x >= 32 || y < 0 || y >= 32) return false;
        return g_map[x][y];
    }

    forward(dt){
        // let f = vec3.create();
        var f = this.at.subtract(this.eye);
        // vec3.subtract(f, this.at, this.eye);
        f = f.divide(f.length());
        let speed = f.multiply(dt);
        // vec3.normalize(f, f);
        var holdAt = this.at.add(speed);
        // vec3.add(this.at, this.at, f);
        var holdEye = this.eye.add(speed);
        // vec3.add(this.eye, this.eye, f);
        if (!this.isBlocked(holdEye)){
            this.at = holdAt;
            this.eye = holdEye;
            this.clampToBounds(this.eye);
            this.clampToBounds(this.at);
        }
    }

    back(dt){
        // let f = vec3.create();
        var f = this.at.subtract(this.eye);
        // vec3.subtract(f, this.at, this.eye);
        f = f.divide(f.length());
        let speed = f.multiply(dt);
        // vec3.normalize(f, f);
        var holdAt = this.at.subtract(speed);
        // vec3.subtract(this.at, this.at, f);
        var holdEye = this.eye.subtract(speed);
        // vec3.add(this.eye, this.eye, f);
        if (!this.isBlocked(holdEye)){
            this.at = holdAt;
            this.eye = holdEye;
            this.clampToBounds(this.eye);
            this.clampToBounds(this.at);
        }
    }

    left(dt){
        // let f = vec3.create();
        // let s = vec3.create();
        var f = this.at.subtract(this.eye);
        // vec3.subtract(f, this.at, this.eye);
        f = f.divide(f.length());
        // vec3.normalize(f, f);
        var s = f.cross(this.up);
        // vec3.cross(s, f, this.up);
        s = s.divide(s.length());
        let speed = s.multiply(dt);
        var holdAt = this.at.add(speed);
        // vec3.add(this.at, this.at, f);
        var holdEye = this.eye.add(speed);
        // vec3.add(this.eye, this.eye, f);
        if (!this.isBlocked(holdEye)){
            this.at = holdAt;
            this.eye = holdEye;
            this.clampToBounds(this.eye);
            this.clampToBounds(this.at);
        }
    }

    right(dt){
        // let f = vec3.create();
        // let s = vec3.create();
        var f = this.at.subtract(this.eye);
        // vec3.subtract(f, this.at, this.eye);
        f = f.divide(f.length());
        // vec3.normalize(f, f);
        var s = f.cross(this.up);
        // vec3.cross(s, f, this.up);
        s = s.divide(s.length());
        let speed = s.multiply(dt);
        var holdAt = this.at.subtract(speed);
        // vec3.subtract(this.at, this.at, f);
        var holdEye = this.eye.subtract(speed);
        // vec3.subtract(this.eye, this.eye, f);
        if (!this.isBlocked(holdEye)){
            this.at = holdAt;
            this.eye = holdEye;
            this.clampToBounds(this.eye);
            this.clampToBounds(this.at);
        }
    }

    panLeft(dt){
        var f = this.at.subtract(this.eye);
        var fvec = new Vector3([f.x, f.y, f.z]);
        var rotationMatrix = new Matrix4().setRotate(5*dt, this.up.x, this.up.y, this.up.z);
        var f_prime = rotationMatrix.multiplyVector3(fvec);
        this.at = new Vector(
            this.eye.x + f_prime.elements[0],
            this.eye.y + f_prime.elements[1],
            this.eye.z + f_prime.elements[2]
        );
        this.clampToBounds(this.at);
    }

    panRight(dt){
        var f = this.at.subtract(this.eye);
        var fvec = new Vector3([f.x, f.y, f.z]);
        var rotationMatrix = new Matrix4().setRotate(-5*dt, this.up.x, this.up.y, this.up.z);
        var f_prime = rotationMatrix.multiplyVector3(fvec);
        this.at = new Vector(
            this.eye.x + f_prime.elements[0],
            this.eye.y + f_prime.elements[1],
            this.eye.z + f_prime.elements[2]
        );
        this.clampToBounds(this.at);
    }

    panUp(dt){
        var f = this.at.subtract(this.eye);
        var fvec = new Vector3([f.x, f.y, f.z]);
        var s = f.cross(this.up);
        var svec = new Vector3([s.x, s.y, s.z]);
        var rotationMatrix = new Matrix4().setRotate(5*dt, svec.elements[0], svec.elements[1], svec.elements[2]);
        var f_prime = rotationMatrix.multiplyVector3(fvec);
        this.at = new Vector(
            this.eye.x + f_prime.elements[0],
            this.eye.y + f_prime.elements[1],
            this.eye.z + f_prime.elements[2]
        );
        this.clampToBounds(this.at);
    }

    panDown(dt){
        var f = this.at.subtract(this.eye);
        var fvec = new Vector3([f.x, f.y, f.z]);
        var s = f.cross(this.up);
        var svec = new Vector3([s.x, s.y, s.z]);
        var rotationMatrix = new Matrix4().setRotate(-5*dt, svec.elements[0], svec.elements[1], svec.elements[2]);
        var f_prime = rotationMatrix.multiplyVector3(fvec);
        this.at = new Vector(
            this.eye.x + f_prime.elements[0],
            this.eye.y + f_prime.elements[1],
            this.eye.z + f_prime.elements[2]
        );
        this.clampToBounds(this.at);
    }

    reset(){
        this.eye=new Vector(0,0,3);
        this.at = new Vector(0,0,-100);
        this.up = new Vector(0,1,0);
    }
}