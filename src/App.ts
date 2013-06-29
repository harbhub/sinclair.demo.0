/// <reference path="decl/ecma.d.ts" />
/// <reference path="decl/three.d.ts" />
/// <reference path="data/Data3D.ts" />
/// <reference path="cubes/MultiCube.ts" />

declare var console:any;

module demo 
{
    export class App 
    {
        public element   : any;
        public renderer  : THREE.WebGLRenderer;
        public camera    : THREE.PerspectiveCamera;
        public scene     : THREE.Scene;
        public object    : THREE.Object3D;
        public data      : demo.data.Data3D<number>;
        public multicube : demo.cubes.MultiCube;

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
            this.data = new demo.data.Data3D<number>(16, 16, 16);
            for(var i = 0; i < this.data.values.length; i++) { 
                this.data.values[i] = Math.floor(Math.random() * 2);
                //this.data.values[i] = 1;
            }
        }

        private setup_object():void 
        {
            var materials = [
            new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: false, side: THREE.FrontSide } ),
            new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, wireframeLinewidth: 20, transparent: true, opacity: 1, side: THREE.FrontSide } )
            ];
            
            this.multicube = new demo.cubes.MultiCube(this.data);

            this.multicube.cubes.each((cube, offset, x, y, z)=> {
                //var n = Math.floor(Math.random() * 2);
                //if(n == 0)
                //cube.hide();
            });


            this.object    = THREE.SceneUtils.createMultiMaterialObject( this.multicube, materials );
            

            
            this.scene.add(this.object);

        }

         
        private x:number = 0;
        private y:number = 0;
        private z:number = 0;
        private v:number = 1;

        public render(): void 
        {   
            //this.geometry.setValue(this.v, Math.floor(Math.random()  * 10), Math.floor(Math.random()  * 10), Math.floor(Math.random()  * 10));
            //this.geometry.setValue(this.v, this.x, this.y, this.z);
            //this.geometry.update();
            
            //this.x = this.x + 1;

            //if(this.x > 9) {
            //    this.x = 0;
            //    this.y = this.y + 1;
            //}
            //if(this.y > 9) {
            //    this.x = 0;
            //    this.y = 0;
            //    this.z = this.z + 1;
            //}
            //if(this.z > 9) {
            //    this.x = 0;
            //    this.y = 0;
            //    this.z = 0;
            //    this.v = this.v == 1 ? 0 : 1;
            //}   

            this.renderer.render(this.scene, this.camera);
        }
    }
}