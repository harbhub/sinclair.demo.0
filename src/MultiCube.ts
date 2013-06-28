/// <reference path="decl/three.d.ts" />

module demo
{
    export class Cube
    {
        public multicube   : MultiCube;
        public value       : number;
        public x           : number;
        public y           : number;
        public z           : number;
        public faces       : THREE.Face4   [];
        public cubes       : Cube [];
        public needsUpdate : boolean;

        constructor(multicube:MultiCube) 
        {
            this.multicube   = multicube;
            this.cubes       = [];
            this.faces       = [];
            this.x           = 0;
            this.y           = 0;
            this.z           = 0;
            this.needsUpdate = true;
        }

        public reset() : void {
            for(var n in this.faces) {
                this.faces[n].a = 0;
                this.faces[n].b = 0;
                this.faces[n].c = 0;
                this.faces[n].d = 0;
            }
        }

        // updates this cubes faces.
        public update() : void {
            if(this.needsUpdate) {
                var cube    = null;
                this.reset();
                if(this.value == 1) {
                    var offsets = this.get_cube_vertex_offsets(this.x, this.y, this.z); 
                    // left 
                    cube = this.locate_cube(this.x - 1, this.y, this.z);
                    if(cube) {
                        if(cube.value == 0) {
                            this.faces[0].a = offsets[3];
                            this.faces[0].b = offsets[2];
                            this.faces[0].c = offsets[0];
                            this.faces[0].d = offsets[1];
                        }
                   } else {
                        this.faces[0].a = offsets[3];
                        this.faces[0].b = offsets[2];
                        this.faces[0].c = offsets[0];
                        this.faces[0].d = offsets[1];                
                   }

                    // right 
                    cube = this.locate_cube(this.x + 1, this.y, this.z);
                    if(cube) {
                        if(cube.value == 0) {
                            this.faces[1].a = offsets[6];
                            this.faces[1].b = offsets[7];
                            this.faces[1].c = offsets[5];
                            this.faces[1].d = offsets[4];
                        }
                   } else {
                        this.faces[1].a = offsets[6];
                        this.faces[1].b = offsets[7];
                        this.faces[1].c = offsets[5];
                        this.faces[1].d = offsets[4];                 
                    }

                    // bottom 
                    cube = this.locate_cube(this.x, this.y - 1, this.z);
                    if(cube) {
                        if(cube.value == 0) {
                            this.faces[2].a = offsets[0];
                            this.faces[2].b = offsets[4];
                            this.faces[2].c = offsets[5];
                            this.faces[2].d = offsets[1]; 
                        } 
                    }
                    else {
                        this.faces[2].a = offsets[0];
                        this.faces[2].b = offsets[4];
                        this.faces[2].c = offsets[5];
                        this.faces[2].d = offsets[1];             
                    }

                    // top 
                    cube = this.locate_cube(this.x, this.y + 1, this.z);
                    if(cube) {
                        if(cube.value == 0) {
                            this.faces[3].a = offsets[3];
                            this.faces[3].b = offsets[7];
                            this.faces[3].c = offsets[6];
                            this.faces[3].d = offsets[2]; 
                        }
                   } else {
                        this.faces[3].a = offsets[3];
                        this.faces[3].b = offsets[7];
                        this.faces[3].c = offsets[6];
                        this.faces[3].d = offsets[2];                  
                    }

                    // back 
                    cube = this.locate_cube(this.x, this.y, this.z - 1);
                    if(cube) {
                        if(cube.value == 0) {
                            this.faces[5].a = offsets[2];
                            this.faces[5].b = offsets[6];
                            this.faces[5].c = offsets[4];
                            this.faces[5].d = offsets[0];
                        }
                    } else {
                        this.faces[5].a = offsets[2];
                        this.faces[5].b = offsets[6];
                        this.faces[5].c = offsets[4];
                        this.faces[5].d = offsets[0];                 
                    }

                    // front 
                    cube = this.locate_cube(this.x, this.y, this.z + 1);
                    if(cube) {
                        if(cube.value == 0) {
                            this.faces[4].a = offsets[7];
                            this.faces[4].b = offsets[3];
                            this.faces[4].c = offsets[1];
                            this.faces[4].d = offsets[5];
                        }
                    } else {
                        this.faces[4].a = offsets[7];
                        this.faces[4].b = offsets[3];
                        this.faces[4].c = offsets[1];
                        this.faces[4].d = offsets[5];                
                    }
                }
                this.needsUpdate = false;
            }
        }

        // locates this cubes adjacent cubes.
        private locate_cube(x:number, y:number, z:number): Cube {
            for(var n in this.cubes) {
                if(this.cubes[n].x == x) {
                    if(this.cubes[n].y == y) {
                        if(this.cubes[n].z == z) {
                            return this.cubes[n];
                        }             
                    }                  
                }
            }
            return null;
        }
        // returns the vertex offset within the multicube in which this face should apply.
        public get_cube_vertex_offsets(x: number, y: number, z: number): number[] {
            var cube_offset = this.multicube.get_cube_offset(x, y, z);
            return [
                this.multicube.get_vertex_offset(x + 0, y + 0, z + 0), // 0  
                this.multicube.get_vertex_offset(x + 0, y + 0, z + 1), // 1
                this.multicube.get_vertex_offset(x + 0, y + 1, z + 0), // 2
                this.multicube.get_vertex_offset(x + 0, y + 1, z + 1), // 3
                this.multicube.get_vertex_offset(x + 1, y + 0, z + 0), // 4
                this.multicube.get_vertex_offset(x + 1, y + 0, z + 1), // 5
                this.multicube.get_vertex_offset(x + 1, y + 1, z + 0), // 6
                this.multicube.get_vertex_offset(x + 1, y + 1, z + 1)  // 7
            ];
        }
    }


    export class MultiCube extends THREE.Geometry
    {
        public data         : number[];
        public width        : number;
        public height       : number;
        public depth        : number;
        public cubes        : Cube[];

        constructor (data: number[], width : number, height : number, depth : number) 
        {    
            super();
            
            this.data         = data;
            this.width        = width;
            this.height       = height;
            this.depth        = depth;
            this.cubes        = [];

            this.setup_vertex_buffer (); // creates a vertex grid for face placement.
            this.setup_face_buffer   (); // creates a index buffer large enough to hold every face.
            this.setup_cube_buffer   (); // creates a cube buffer and associates the faces accordingly.
            this.update              (); // initializes the cube faces.
            
            // compute this stuff ahead of time.
            this.computeBoundingSphere();
            this.computeCentroids();
            this.computeFaceNormals();
            this.verticesNeedUpdate  = true;
        }

        // updates the multicube geometry.
        public update(): void {
            for(var n in this.cubes) {
                this.cubes[n].update();
            }
            this.verticesNeedUpdate = true;
        }
        
        // sets a values within the multicube. 
        public setValue(value:number, x:number, y:number, z:number) : void {
            var offset = 0;
            var cube  = this.cubes[this.get_cube_offset(x, y, z)]; 
            cube.value = value;
            
            offset = this.get_cube_offset(cube.x - 1, cube.y, cube.z);
            if(offset >= 0 && offset < this.cubes.length) {
                this.cubes[offset].needsUpdate = true;
            } 
            
            offset = this.get_cube_offset(cube.x + 1, cube.y, cube.z);
            if(offset >= 0 && offset < this.cubes.length) {
                this.cubes[offset].needsUpdate = true;
            } 
                
            offset = this.get_cube_offset(cube.x, cube.y - 1, cube.z);
            if(offset >= 0 && offset < this.cubes.length) {
                this.cubes[offset].needsUpdate = true;
            } 

            offset = this.get_cube_offset(cube.x, cube.y + 1, cube.z);
            if(offset >= 0 && offset < this.cubes.length) {
                this.cubes[offset].needsUpdate = true;
            } 
  
            offset = this.get_cube_offset(cube.x, cube.y, cube.z - 1);
            if(offset >= 0 && offset < this.cubes.length) {
                this.cubes[offset].needsUpdate = true;
            } 
                                     
            offset = this.get_cube_offset(cube.x, cube.y, cube.z + 1);
            if(offset > 0 && offset < this.cubes.length) {
                this.cubes[offset].needsUpdate = true;
            } 
        }   
        
        // creates a vertex buffer grid.
        private setup_vertex_buffer() : void {
            var size        = (this.width + 1) * (this.height + 1) * (this.depth + 1);
            this.vertices   = new Array(size);
            var half_width  = (this.width  / 2);
            var half_height = (this.height / 2);
            var half_depth  = (this.depth  / 2);
            for (var z = 0; z < this.depth + 1; z++) {
                for (var y = 0; y < this.height + 1; y++) {
                    for (var x = 0; x < this.width + 1; x++) {
                        this.vertices[this.get_vertex_offset(x, y, z)] = new THREE.Vector3(x - half_width, y - half_height, z - half_depth);
                    }
                }
            }
        }

        // create a index buffer.
        private setup_face_buffer() : void {
            var size   = (this.width * this.height * this.depth * 6);
            this.faces = new Array(size);
            var idx    = 0;
            for (var z = 0; z < this.depth; z++) {
                for (var y = 0; y < this.height; y++) {
                    for (var x = 0; x < this.width; x++) {
                        for(var i = 0; i < 6; i++) {
                            this.faces[idx] = new THREE.Face4(0, 0, 0, 0);
                            idx++;
                        }
                    }
                }
            }            
        }

        // create cube buffer.
        private setup_cube_buffer() : void {
            var idx = 0;
            for(var z = 0; z < this.depth; z++) {
                for(var y = 0; y < this.height; y++) {
                    for(var x = 0; x < this.width; x++) {
                        var cube   = new Cube(this);
                        cube.value = this.data [ this.get_cube_offset(x, y, z) ];
                        cube.x     = x;
                        cube.y     = y;                        
                        cube.z     = z;
                        cube.faces.push( <THREE.Face4>this.faces[idx + 0] );  
                        cube.faces.push( <THREE.Face4>this.faces[idx + 1] );  
                        cube.faces.push( <THREE.Face4>this.faces[idx + 2] );  
                        cube.faces.push( <THREE.Face4>this.faces[idx + 3] );  
                        cube.faces.push( <THREE.Face4>this.faces[idx + 4] );  
                        cube.faces.push( <THREE.Face4>this.faces[idx + 5] );
                        cube.needsUpdate = true;
                        this.cubes.push  (cube);
                        idx = idx + 6;  
                    }               
                }
            }

            for(var n in this.cubes) {
                var cube:Cube = this.cubes[n];
                var offset    = 0;

                offset = this.get_cube_offset(cube.x - 1, cube.y, cube.z);
                if(offset >= 0 && offset < this.cubes.length) 
                    cube.cubes.push( this.cubes[offset] );
                
                offset = this.get_cube_offset(cube.x + 1, cube.y, cube.z);
                if(offset >= 0 && offset < this.cubes.length) 
                    cube.cubes.push( this.cubes[offset] );
                
                offset = this.get_cube_offset(cube.x, cube.y - 1, cube.z);
                if(offset >= 0 && offset < this.cubes.length) 
                    cube.cubes.push( this.cubes[offset] );

                offset = this.get_cube_offset(cube.x, cube.y + 1, cube.z);
                if(offset >= 0 && offset < this.cubes.length)  
                    cube.cubes.push( this.cubes[offset] );
  
                offset = this.get_cube_offset(cube.x, cube.y, cube.z - 1);
                if(offset >= 0 && offset < this.cubes.length + 1)  
                    cube.cubes.push( this.cubes[offset] );
                                     
                offset = this.get_cube_offset(cube.x, cube.y, cube.z + 1);
                if(offset >= 0 && offset < this.cubes.length)  
                    cube.cubes.push( this.cubes[offset] );                  
            }
        }

        // returns the cubes offset.   
        public get_cube_offset(x: number, y: number, z: number): number {
            return x + (y * this.width) + (z * this.width * this.height);
        }
        
        // returns the vertex offset.
        public get_vertex_offset(x: number, y: number, z: number): number {
            return x + (y * (this.width + 1)) + (z * (this.width + 1) * (this.height + 1));
        }

        // generates a random multicube.
        public static generate_random(width: number, height: number, depth: number) : MultiCube {
            var data : number[] = [];
            for (var z = 0; z < depth - 0; z++) {
                for (var y = 0; y < height - 0; y++) {
                    for (var x = 0; x < width - 0; x++) {
                        if (x == 0 || y == 0 || z == 0 || x == width - 1 || z == depth - 1) {
                             data.push(1);
                        } 
                        else {
                            var rand = Math.floor(Math.random() * 6);
                            if (rand == 0) {
                                data.push(1);
                            } 
                            else {
                                data.push(0);
                            }
                        }
                    }
                }
            }
            return new MultiCube(data, width, height, depth);
        }

        // creates a multicube and defaults all its values.
        public static create(defaultValue:number, width: number, height: number, depth: number) : MultiCube {
            var data = new Array(width * height * depth);
            for(var i = 0; i < data.length; i++) {
                data[i] = defaultValue;
            }
            return new MultiCube(data, width, height, depth);
        }
    }
}
