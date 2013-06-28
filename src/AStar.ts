/// <reference path="decl/ecma.d.ts" />

module demo
{   
    export class AStarNode
    {
        public value  : number;

        public x      : number;
        
        public y      : number;

        public z      : number;

        public nodes  : Array<AStarNode>;

        constructor()
        {
            this.nodes = new Array<AStarNode>();
            
            this.x     = 0;
            
            this.y     = 0;

            this.z     = 0;
        }
    }

    export class AStar
    {
        public nodes  : Array<AStarNode>;

        public data   : number[];

        public width  : number;
        
        public height : number;

        public depth  : number;

        constructor(data:number[], width:number, height:number, depth:number)
        {
            this.setup(data, width, height, depth);
        }
        
        private setup(data:number[], width:number, height:number, depth:number) : void
        {
            if(data.length != (width * height * depth)) throw new Error("astar: the buffer length is not width * height.");
            
            this.data   = data;

            this.width  = width;

            this.height = height;

            this.depth  = depth;

            this.nodes  = new Array<AStarNode>();
            
            // first pass: create nodes
            for(var z = 0; z < this.depth; z++) {
                for(var y = 0; y < this.height; y++) {
                    for(var x = 0; x < this.width; x++) {
                        var node   = new AStarNode();
                        node.value = data[this.offset(x, y, z)];
                        node.x     = x;
                        node.y     = y;
                        node.z     = z;
                        this.nodes.push(node);
                    }               
                }
            }

            // second pass: create child nodes
            for(var z = 0; z < this.depth; z++) {
                for(var y = 0; y < this.height; y++) {
                    for(var x = 0; x < this.width; x++) {
                        var node = this.nodes[ this.offset(x , y , z) ];
                        for(var cz = -1; cz < 2; cz++) {
                            for(var cy = -1; cy < 2; cy++) {
                                for(var cx = -1; cx < 2; cx++) {
                                    // if not 'this' node.
                                    if(cx != 0 && cy != 0 && cz != 0) {
                                        var offset = this.offset(x + cx, y + cy,z + cz);
                                        if(offset > 0 && offset < this.nodes.length) {
                                            node.nodes.push( this.nodes[offset] );
                                        }
                                    }
                                }               
                            }
                        }                        
                    }               
                }
            }
        }

        private offset(x:number, y:number, z:number): number
        {
            return x + (y * this.width) + (z * this.width * this.height);
        }
    }

}