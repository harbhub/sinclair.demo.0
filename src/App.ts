/// <reference path="decl/ecma.d.ts" />
/// <reference path="decl/three.d.ts" />
/// <reference path="data/Data3D.ts" />
/// <reference path="cubes/MultiCube.ts" />

declare var console:any;

module demo 
{
    export class App 
    {
        public element       : any;
        
        public renderer      : THREE.WebGLRenderer;
        
        public camera        : THREE.PerspectiveCamera;
        
        public scene         : THREE.Scene;
        
        public mesh          : THREE.Object3D;

        public data          : demo.data.Data3D<number>;

        public multicube     : demo.cubes.MultiCube;
        
        constructor ( element: any, width: number, height: number ) 
        {
            this.element  = element;
            this.setup_element(width, height);
            this.setup_renderer(width, height);
            this.setup_camera(width, height);

            this.setup_scene();
            this.setup_data ();
            this.setup_object();
        }

        private setup_element(width:number, height:number): void {
            this.element.style.width  = width.toString()  + 'px';
            this.element.style.height = height.toString() + 'px';            
        }

        private setup_renderer (width: number, height: number): void {
            this.renderer = new THREE.WebGLRenderer({ });
            this.renderer.setSize(width, height);
            this.element.appendChild( this.renderer.domElement );            
        }

        private setup_camera (width: number, height: number): void {
            this.camera          = new THREE.PerspectiveCamera(60, width / height, 1, 12000);
            this.camera.position = new THREE.Vector3(0, 0, -10);
            this.camera.up       = new THREE.Vector3(0, 1, 0);
            this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        }
        
        private setup_scene(): void {
            this.scene = new THREE.Scene();
        }

        private setup_data(): void {
            this.data = new demo.data.Data3D<number>(12, 12, 12);
            for(var i = 0; i < this.data.values.length; i++) { 
                var n = Math.floor(Math.random() * 200);
                if(n > 50) {
                    this.data.values[i] = 0;
                }
                else {
                    this.data.values[i] = 1;
                }
            }
        }

        private setup_object():void 
        {
            // setup cube
            var texture   = THREE.ImageUtils.loadTexture('/static/scripts/demo/assets/cube.0.png');
            var materials = [
                new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: false, side: THREE.FrontSide, map:texture } ),
                new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, wireframeLinewidth: 1, transparent: true, opacity: 1, side: THREE.FrontSide } )
            ];
            

            this.multicube     = new demo.cubes.MultiCube(this.data);
            this.mesh          = THREE.SceneUtils.createMultiMaterialObject( this.multicube, materials );
            this.scene.add(this.mesh);
        }

        private x:number = 0;
        private y:number = 0;
        private z:number = 0;
        private v:number = 1;

        public render(): void
        {
            //this.multicube.cubes.each((cube, offset, x, y, z) => {
                
            //    var cx = (x + Math.floor(this.x)) % this.data.width;

            //    var cy = (y + Math.floor(this.y)) % this.data.height;

            //    var cz = (z + Math.floor(this.z)) % this.data.depth;

            //    cube.setValue( this.data.get(cx, cy, cz) );
                    
            //});
            
            this.renderer.render(this.scene, this.camera);
        }
    }
}