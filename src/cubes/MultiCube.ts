/// <reference path="../decl/three.d.ts" />
/// <reference path="../data/Data3D.ts" />

module demo.cubes
{
    export class indexing {

        public static cube_table = {

                positions : [ new THREE.Vector3(0, 0, 0),    // 0
                              new THREE.Vector3(0, 1, 0),    // 1
                              new THREE.Vector3(1, 1, 0),    // 2
                              new THREE.Vector3(1, 0, 0),    // 3
                              new THREE.Vector3(1, 0, 1),    // 4
                              new THREE.Vector3(1, 1, 1),    // 5
                              new THREE.Vector3(0, 1, 1),    // 6
                              new THREE.Vector3(0, 0, 1) ],  // 7

                normals   : [ new THREE.Vector3( 1, 0, 0),   // 0
                              new THREE.Vector3(-1, 0, 0),   // 1
                              new THREE.Vector3( 0,-1, 0),   // 2
                              new THREE.Vector3( 0, 1, 0),   // 3
                              new THREE.Vector3( 0, 0, 1),   // 4
                              new THREE.Vector3( 0, 0,-1) ], // 6

                texcoords : [ new THREE.Vector2(0, 0),       // 0
                              new THREE.Vector2(1, 0),       // 1
                              new THREE.Vector2(1, 1),       // 2
                              new THREE.Vector2(0, 1) ],     // 3  

                index_positions : [  [4, 3, 2, 5],   // face right    
                                     [0, 7, 6, 1],   // face left   
                                     [2, 1, 6, 5],   // face top 
                                     [4, 7, 0, 3],   // face bottom    
                                     [7, 4, 5, 6],   // face back
                                     [3, 0, 1, 2] ], // face front 

                 index_normals   : [ [0, 0, 0, 0],   // face right    
                                     [1, 1, 1, 1],   // face left          
                                     [3, 3, 3, 3],   // face top 
                                     [2, 2, 2, 2],   // face bottom    
                                     [4, 4, 4, 4],   // face back     
                                     [5, 5, 5, 5] ], // face front  

                 index_texcoords : [ [0, 1, 2, 3],   // face right    
                                     [0, 1, 2, 3],   // face left     
                                     [0, 1, 2, 3],   // face top      
                                     [0, 1, 2, 3],   // face bottom    
                                     [0, 1, 2, 3],   // face back     
                                     [0, 1, 2, 3] ]  // face front
            };
              
        public static create_adjacent_multicube_indices(x:number, y:number, z:number) : number[][] {
                return  [ [x + 1, y + 0, z + 0],   // right
                        [x - 1, y + 0, z + 0],   // left
                        [x + 0, y + 1, z + 0],   // top
                        [x + 0, y - 1, z + 0],   // bottom
                        [x + 0, y + 0, z + 1],   // back
                        [x + 0, y + 0, z - 1] ]; // front
        }

        public static cube_texture_index_hash:any = {
            "0000": 0,  "0001": 1,  "0010": 2,  "0011": 3,
            "0100": 4,  "0101": 5,  "0110": 6,  "0111": 7,          
            "1000": 8,  "1001": 9,  "1010": 10, "1011": 11,
            "1100": 12, "1101": 13, "1110": 14, "1111": 15
        }

        public static create_adjacent_face_multicube_indices(x:number, y:number, z:number): number[][][] {
            return [ // RIGHT
                    [[x + 0, y + 0, z - 1],   // left 
                     [x + 0, y + 0, z + 1],   // right
                     [x + 0, y - 1, z + 0],   // top
                     [x + 0, y + 1, z + 0] ], // bottom
                    // LEFT
                    [[x + 0, y + 0, z + 1],   // left 
                     [x + 0, y + 0, z - 1],   // right
                     [x + 0, y - 1, z + 0],   // top
                     [x + 0, y + 1, z + 0] ], // bottom
                    // TOP
                    [[x - 1, y + 0, z + 0],   // left  
                     [x + 1, y + 0, z + 0],   // right
                     [x + 0, y + 0, z - 1],   // top
                     [x + 0, y + 0, z + 1]],  // bottom
                    // BOTTOM
                    [[x - 1, y + 0, z + 0],   // left 
                     [x + 1, y + 0, z + 0],   // right
                     [x + 0, y + 0, z + 1],   // top
                     [x + 0, y + 0, z - 1]],  // bottom
                    //  BACK
                    [[x + 1, y + 0, z + 0],   // left 
                     [x - 1, y + 0, z + 0],   // right
                     [x + 0, y - 1, z + 0],   // top
                     [x + 0, y + 1, z + 0]],  // bottom
                    // FRONT
                    [[x - 1, y + 0, z + 0],   // left 
                     [x + 1, y + 0, z + 0],   // right
                     [x + 0, y - 1, z + 0],   // top
                     [x + 0, y + 1, z + 0]]]; // bottom               
        }
    }           

    export class Cube {

        public multicube    : MultiCube;
        public value        : number;
        public offset       : number;
        public x            : number;
        public y            : number;
        public z            : number;
        public positions    : Array<THREE.Vector3>;
        public normals      : Array<THREE.Vector3>;
        public texcoords    : Array<THREE.Vector2>;
        public faces        : Array<THREE.Face4>;
        public faces_copy   : Array<THREE.Face4>;

        
        public adjacent_multicube_indices      : number[][];
        public adjacent_face_multicube_indices : number[][][];
        public adjacent_face_multicube_key     : number[];

        constructor(multicube:MultiCube, value:number, offset:number, x:number, y:number, z:number) {
            
            this.multicube    = multicube;
            this.value        = value;
            this.offset       = offset;
            this.x            = x;
            this.y            = y;
            this.z            = z;   
            this.positions    = new Array<THREE.Vector3>(24);
            this.normals      = new Array<THREE.Vector3>(24);
            this.texcoords    = new Array<THREE.Vector2>(24);
            this.faces        = new Array<THREE.Face4>(6);
            this.faces_copy   = new Array<THREE.Face4>(6);

            // precompute the indices for this cube.
            this.adjacent_multicube_indices      = indexing.create_adjacent_multicube_indices(this.x, this.y, this.z);
            this.adjacent_face_multicube_indices = indexing.create_adjacent_face_multicube_indices(this.x, this.y, this.z);
            this.adjacent_face_multicube_key     = [0, 0, 0, 0];
        }

        public getValue() : number {

            return this.value;
        }

        public setValue(value:number): void {
        
            this.value = value;

            this.computeFaceVisibility(true);
        }

        public setFace (i:number, face:THREE.Face4): void {

            this.faces[i] = face;

            this.faces_copy [i] = this.faces[i].clone();

        }
        public show() : void {

            for(var i = 0; i < 6; i++) 

                this.showFace(i);
             
        }
        public hide() : void {

            for(var i = 0; i < 6; i++) 

                this.hideFace(i);
        }
        public hideFace(i:number) : void {

            this.faces[i].a = 0;

            this.faces[i].b = 0;

            this.faces[i].c = 0;

            this.faces[i].d = 0;                

            this.multicube.verticesNeedUpdate  = true;
        }

        public showFace(i:number) : void {

            this.faces[i].a = this.faces_copy[i].a;

            this.faces[i].b = this.faces_copy[i].b;

            this.faces[i].c = this.faces_copy[i].c;

            this.faces[i].d = this.faces_copy[i].d;      

            this.multicube.verticesNeedUpdate  = true;                  
        }

        public computeUVConfiguration(): void {

            if(this.value != 0) { 
                        
                var index = this.adjacent_face_multicube_indices;

                var div   = 1 / 16;
                          
                for(var face_index = 0; face_index < 6; face_index ++) {
                    
                    var left   = this.multicube.cubes.get(index[face_index][0][0], index[face_index][0][1], index[face_index][0][2] );
                    var right  = this.multicube.cubes.get(index[face_index][1][0], index[face_index][1][1], index[face_index][1][2] );
                    var top    = this.multicube.cubes.get(index[face_index][2][0], index[face_index][2][1], index[face_index][2][2] );
                    var bottom = this.multicube.cubes.get(index[face_index][3][0], index[face_index][3][1], index[face_index][3][2] );
                    
                    this.adjacent_face_multicube_key[2] = (top    == null || top.value    == 0) ? 1 : 0;
                    this.adjacent_face_multicube_key[3] = (right  == null || right.value  == 0) ? 1 : 0;
                    this.adjacent_face_multicube_key[0] = (bottom == null || bottom.value == 0) ? 1 : 0;
                    this.adjacent_face_multicube_key[1] = (left   == null || left.value   == 0) ? 1 : 0;
                    
                    var offset         = indexing.cube_texture_index_hash[this.adjacent_face_multicube_key.join('')];
                    var texcoord_index = (face_index * 4);
                    this.texcoords[texcoord_index + 0].x = div * offset; 
                    this.texcoords[texcoord_index + 1].x = div * (offset + 1);
                    this.texcoords[texcoord_index + 2].x = div * (offset + 1);
                    this.texcoords[texcoord_index + 3].x = div * offset;                   
                }
            }
             

            this.multicube.uvsNeedUpdate = true;
        }

        public computeFaceVisibility (includeAdjancent:boolean): void {
            
            this.computeUVConfiguration();
            
            var index = this.adjacent_multicube_indices;

            // shared face removal.

            if(this.value != 0) { 
                
                for(var i = 0; i < 6; i++) 
                {
                    var adjacent = this.multicube.cubes.get(index[i][0], index[i][1], index[i][2]);
                    
                    if(adjacent == null) 
                    {
                         this.showFace(i);
                    }
                    else if(adjacent.value == 0)  
                    {
                         this.showFace(i);
                    }
                    else 
                    {
                        this.hideFace(i);
                    }
                }
            } 
            else 
            {
                this.hide();
            }
            

            // do adjacent cubes.

            if(includeAdjancent)
            {
                for(var i = 0; i < 6; i++) 
                {
                    var adjacent = this.multicube.cubes.get(index[i][0], index[i][1], index[i][2]);

                    if(adjacent)
                    {
                        adjacent.computeFaceVisibility(false);
                    }
                }
            }

            this.multicube.verticesNeedUpdate  = true;

            this.multicube.uvsNeedUpdate       = true; 
        }
    }
    
    export class MultiCube extends THREE.Geometry {

        public cubes : demo.data.Data3D<Cube>;

        constructor( data:demo.data.Data3D<number> ) {
            
            super();

            this.setup(data);
        }
        
        private setup(data:demo.data.Data3D<number>): void {  

            // cube lookup table
            

            var half_width  = (data.width  / 2);

            var half_height = (data.height / 2);

            var half_depth  = (data.depth  / 2);
            
            this.cubes = data.map< Cube > ((value:number, offset:number, x:number, y:number, z:number) => { 

                var cube   = new Cube(this, value, offset, x, y, z);

                var index  = 0;

                for(var face_index = 0; face_index < 6; face_index++) {

                    var length = this.vertices.length;

                    var face   = new THREE.Face4 (length + 0, length + 1, length + 2, length + 3);

                    for(var vert_index = 0; vert_index < 4; vert_index++) {

                        var position = indexing.cube_table.positions [indexing.cube_table.index_positions[face_index][vert_index]].clone();

                        var normal   = indexing.cube_table.normals   [indexing.cube_table.index_normals  [face_index][vert_index]].clone();

                        var texcoord = indexing.cube_table.texcoords [indexing.cube_table.index_texcoords[face_index][vert_index]].clone();

                        position.x = position.x + (x - half_width);

                        position.y = position.y + (y - half_height);

                        position.z = position.z + (z - half_depth);

                        this.vertices.push         (position);
                        
                        face.normal = normal;

                        face.vertexNormals.push(normal);

                        cube.positions [index] = position;

                        cube.texcoords [index] = texcoord;

                        cube.normals   [index] = normal;

                        index ++;
                    }

                    // push face uvs'

                    var offset = face_index * 4;

                    (<any>this.faceVertexUvs[0]).push([

                        cube.texcoords[offset + 0],

                        cube.texcoords[offset + 1],

                        cube.texcoords[offset + 2],

                        cube.texcoords[offset + 3],
                    ]);
                    
                    this.faces.push (face);

                    cube.setFace (face_index, face);
                }

                return cube;
            });

            this.cubes.each((cube, offset, x, y, z) => {

                cube.computeFaceVisibility(false);

            });

            this.verticesNeedUpdate  = true;

            this.uvsNeedUpdate       = true;                      
        }
    }
}