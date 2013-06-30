/// <reference path="../decl/three.d.ts" />
/// <reference path="../data/Data3D.ts" />

module demo.cubes
{
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

            var table = {

                right :  [ [ 0, 0,-1],   // left 
                           [ 0, 0, 1],   // right
                           [ 0, 1, 0],   // top
                           [ 0,-1, 0] ], // bottom
                left  :  [ [ 0, 0, 1],   // left 
                           [ 0, 0,-1],   // right
                           [ 0, 1, 0],   // top
                           [ 0,-1, 0] ], // bottom
                top    : [ [-1, 0, 0],   // left 
                           [ 1, 0, 0],   // right
                           [ 0, 0, 1],   // top
                           [ 0, 0,-1] ], // bottom
                bottom : [ [-1, 0, 0],   // left 
                           [ 1, 0, 0],   // right
                           [ 0, 0,-1],   // top
                           [ 0, 0, 1] ], // bottom
                back  :  [ [ 1, 0, 0],   // left 
                           [-1, 0, 0],   // right
                           [ 0, 1, 0],   // top
                           [ 0,-1, 0] ], // bottom
                front :  [ [-1, 0 , 0],  // left 
                           [ 1, 0, 0],   // right
                           [ 0, 1, 0],   // top
                           [ 0,-1, 0] ]  // bottom
            };

            var facetable = [table.right, 
                             table.left, 
                             table.top, 
                             table.bottom, 
                             table.back, 
                             table.front];
             
            for(var face_index = 0; face_index < 6; face_index ++) {

                var left   = this.multicube.cubes.get(facetable[face_index][0][0], facetable[face_index][0][1], facetable[face_index][0][2] );
                var right  = this.multicube.cubes.get(facetable[face_index][1][0], facetable[face_index][1][1], facetable[face_index][1][2] );
                var top    = this.multicube.cubes.get(facetable[face_index][2][0], facetable[face_index][2][1], facetable[face_index][2][2] );
                var bottom = this.multicube.cubes.get(facetable[face_index][3][0], facetable[face_index][3][1], facetable[face_index][3][2] );
                
                var flags = [0, 0, 0, 0];
                if      (top == null)        flags[0] = 1;
                else if (top.value == 0)     flags[0] = 1;
                else                         flags[0] = 0;
                if      (right == null)      flags[1] = 1;
                else if (right.value == 0)   flags[1] = 1;
                else                         flags[1] = 0;
                if      (bottom == null)     flags[2] = 1;
                else if (bottom.value == 0)  flags[2] = 1;
                else                         flags[2] = 0;  
                if      (left == null)       flags[3] = 1;
                else if (left.value == 0)    flags[3] = 1;
                else                         flags[3] = 0;                       
            }
        }

        public computeFaceVisibility (includeAdjancent:boolean): void {
            
            

            var adjacent_index = [ [this.x + 1, this.y, this.z], 

                                   [this.x - 1, this.y, this.z],  

                                   [this.x, this.y + 1, this.z], 

                                   [this.x, this.y - 1, this.z],  

                                   [this.x, this.y, this.z + 1],  

                                   [this.x, this.y, this.z - 1] ];

            // shared face removal.

            if(this.value != 0) { 
                
                for(var i = 0; i < 6; i++) 
                {
                    var adjacent = this.multicube.cubes.get(adjacent_index[i][0], adjacent_index[i][1], adjacent_index[i][2]);
                    
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
                    var adjacent = this.multicube.cubes.get(adjacent_index[i][0], adjacent_index[i][1], adjacent_index[i][2]);

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
            
            var div = 1 / 16;

            // cube lookup table
            var table = {

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
                              new THREE.Vector3( 0, 1, 0),   // 2
                              new THREE.Vector3( 0,-1, 0),   // 3
                              new THREE.Vector3( 0, 0, 1),   // 4
                              new THREE.Vector3( 0, 0,-1) ], // 6
                //texcoords : [ new THREE.Vector2(0, 0),       // 0
                //              new THREE.Vector2(1, 0),       // 1
                //              new THREE.Vector2(1, 1),       // 2
                //              new THREE.Vector2(0, 1) ],     // 3  
                 texcoords : [ new THREE.Vector2(div * 15, 0),       // 0
                              new THREE.Vector2(div * 16, 0),       // 1
                              new THREE.Vector2(div * 16, 1),       // 2
                              new THREE.Vector2(div * 15, 1) ],     // 3  

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

                        var position = table.positions [table.index_positions[face_index][vert_index]].clone();

                        var normal   = table.normals   [table.index_normals  [face_index][vert_index]].clone();

                        var texcoord = table.texcoords [table.index_texcoords[face_index][vert_index]].clone();

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
                    (<any>this.faceVertexUvs[0]).push([

                        cube.texcoords[0],

                        cube.texcoords[1],

                        cube.texcoords[2],

                        cube.texcoords[3],
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