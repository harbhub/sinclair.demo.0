module demo.data {

    export class Data3D <T> {
        public values : T[];
        public width  : number;
        public height : number;
        public depth  : number;

        constructor(width:number, height: number, depth:number) {
            this.values   = new Array<T>(width * height * depth);
            this.width    = width;
            this.height   = height;
            this.depth    = depth;
        }

        // sets the value within the cube.
        public set (value:T, x:number, y:number, z:number) : void {
            if(x >= 0 && x < this.width)  
                if(y >= 0 && y < this.height)
                    if(z >= 0 && z < this.depth) 
                        this.values[this.offset(x, y, z)] = value;
        }

        // gets the value within the cube.
        public get (x:number, y:number, z:number) : T {
            if(x >= 0 && x < this.width)  
                if(y >= 0 && y < this.height)
                    if(z >= 0 && z < this.depth) 
                        return this.values[this.offset(x, y, z)];
            return null;
        }

        // iterates over items in the cube (row major).
        public each (callback:(value:T, offset:number, x:number, y:number, z:number)=>void) : void {
            var offset = 0;
            for(var z = 0; z < this.depth; z++){ 
                for(var y = 0; y < this.height; y++) { 
                    for(var x = 0; x < this.width; x++) { 
                        callback(this.values[offset], offset, x, y, z);
                        offset = offset + 1;
                    }
                }
            }
        }

        // maps this data3d object into another data3d object.
        public map <S> (callback:(value:T, offset:number, x:number, y:number, z:number)=> S): Data3D <S> {
           var data = new Data3D <S> (this.width, this.height, this.depth); 
           var ref  = <any>data;
           var offset = 0;
           for(var z = 0; z < this.depth; z++) { 
               for(var y = 0; y < this.height; y++) { 
                   for(var x = 0; x < this.width; x++) { 
                       ref.values[offset] = callback(this.values[offset], offset, x, y, z);
                       offset = offset + 1;
                   }
               }
           }
           return data;
        }

        // returns an address within the cube by the offset.
        public address (offset:number) : {x:number; y:number;z:number;} {
            return {
		        x : Math.floor(offset / 1 % this.width),
		        y : Math.floor(offset / this.width % this.height),
		        z : Math.floor(offset / (this.width*this.height) % this.depth)
	        };
        }

        // gets the offset within the cube by the address.
        public offset  (x:number, y:number, z:number) : number {
            return x + (y * this.width) + (z * this.width * this.height);
        }
    }
}