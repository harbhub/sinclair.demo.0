var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var demo;
(function (demo) {
    var Cube = (function () {
        function Cube(multicube) {
            this.multicube = multicube;
            this.cubes = [];
            this.faces = [];
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.needsUpdate = true;
        }
        Cube.prototype.reset = function () {
            for (var n in this.faces) {
                this.faces[n].a = 0;
                this.faces[n].b = 0;
                this.faces[n].c = 0;
                this.faces[n].d = 0;
            }
        };

        Cube.prototype.update = function () {
            if (this.needsUpdate) {
                var cube = null;
                this.reset();

                if (this.value == 1) {
                    var offsets = this.get_cube_vertex_offsets(this.x, this.y, this.z);

                    cube = this.locate_cube(this.x - 1, this.y, this.z);
                    if (cube) {
                        if (cube.value == 0) {
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

                    cube = this.locate_cube(this.x + 1, this.y, this.z);
                    if (cube) {
                        if (cube.value == 0) {
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

                    cube = this.locate_cube(this.x, this.y - 1, this.z);
                    if (cube) {
                        if (cube.value == 0) {
                            this.faces[2].a = offsets[0];
                            this.faces[2].b = offsets[4];
                            this.faces[2].c = offsets[5];
                            this.faces[2].d = offsets[1];
                        }
                    } else {
                        this.faces[2].a = offsets[0];
                        this.faces[2].b = offsets[4];
                        this.faces[2].c = offsets[5];
                        this.faces[2].d = offsets[1];
                    }

                    cube = this.locate_cube(this.x, this.y + 1, this.z);
                    if (cube) {
                        if (cube.value == 0) {
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

                    cube = this.locate_cube(this.x, this.y, this.z - 1);
                    if (cube) {
                        if (cube.value == 0) {
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

                    cube = this.locate_cube(this.x, this.y, this.z + 1);
                    if (cube) {
                        if (cube.value == 0) {
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
        };

        Cube.prototype.locate_cube = function (x, y, z) {
            for (var n in this.cubes) {
                if (this.cubes[n].x == x) {
                    if (this.cubes[n].y == y) {
                        if (this.cubes[n].z == z) {
                            return this.cubes[n];
                        }
                    }
                }
            }
            return null;
        };

        Cube.prototype.get_cube_vertex_offsets = function (x, y, z) {
            var cube_offset = this.multicube.get_cube_offset(x, y, z);
            return [
                this.multicube.get_vertex_offset(x + 0, y + 0, z + 0),
                this.multicube.get_vertex_offset(x + 0, y + 0, z + 1),
                this.multicube.get_vertex_offset(x + 0, y + 1, z + 0),
                this.multicube.get_vertex_offset(x + 0, y + 1, z + 1),
                this.multicube.get_vertex_offset(x + 1, y + 0, z + 0),
                this.multicube.get_vertex_offset(x + 1, y + 0, z + 1),
                this.multicube.get_vertex_offset(x + 1, y + 1, z + 0),
                this.multicube.get_vertex_offset(x + 1, y + 1, z + 1)
            ];
        };
        return Cube;
    })();
    demo.Cube = Cube;

    var MultiCube = (function (_super) {
        __extends(MultiCube, _super);
        function MultiCube(data, width, height, depth) {
            _super.call(this);

            this.data = data;
            this.width = width;
            this.height = height;
            this.depth = depth;
            this.cubes = [];

            this.setup_vertex_buffer();
            this.setup_face_buffer();
            this.setup_cube_buffer();
            this.update();

            this.verticesNeedUpdate = true;
            this.computeBoundingSphere();
            this.computeCentroids();
            this.computeFaceNormals();
        }
        MultiCube.prototype.update = function () {
            for (var n in this.cubes) {
                this.cubes[n].update();
            }
            this.verticesNeedUpdate = true;
        };

        MultiCube.prototype.setValue = function (value, x, y, z) {
            var offset = 0;
            var cube = this.cubes[this.get_cube_offset(x, y, z)];
            cube.value = value;

            offset = this.get_cube_offset(cube.x - 1, cube.y, cube.z);
            if (offset >= 0 && offset < this.cubes.length) {
                this.cubes[offset].needsUpdate = true;
            }

            offset = this.get_cube_offset(cube.x + 1, cube.y, cube.z);
            if (offset >= 0 && offset < this.cubes.length) {
                this.cubes[offset].needsUpdate = true;
            }

            offset = this.get_cube_offset(cube.x, cube.y - 1, cube.z);
            if (offset >= 0 && offset < this.cubes.length) {
                this.cubes[offset].needsUpdate = true;
            }

            offset = this.get_cube_offset(cube.x, cube.y + 1, cube.z);
            if (offset >= 0 && offset < this.cubes.length) {
                this.cubes[offset].needsUpdate = true;
            }

            offset = this.get_cube_offset(cube.x, cube.y, cube.z - 1);
            if (offset >= 0 && offset < this.cubes.length) {
                this.cubes[offset].needsUpdate = true;
            }

            offset = this.get_cube_offset(cube.x, cube.y, cube.z + 1);
            if (offset > 0 && offset < this.cubes.length) {
                this.cubes[offset].needsUpdate = true;
            }
        };

        MultiCube.prototype.setup_vertex_buffer = function () {
            var size = (this.width + 1) * (this.height + 1) * (this.depth + 1);
            this.vertices = new Array(size);
            var half_width = (this.width / 2);
            var half_height = (this.height / 2);
            var half_depth = (this.depth / 2);
            for (var z = 0; z < this.depth + 1; z++) {
                for (var y = 0; y < this.height + 1; y++) {
                    for (var x = 0; x < this.width + 1; x++) {
                        this.vertices[this.get_vertex_offset(x, y, z)] = new THREE.Vector3(x - half_width, y - half_height, z - half_depth);
                    }
                }
            }
        };

        MultiCube.prototype.setup_face_buffer = function () {
            var size = (this.width * this.height * this.depth * 6);
            this.faces = new Array(size);
            var idx = 0;
            for (var z = 0; z < this.depth; z++) {
                for (var y = 0; y < this.height; y++) {
                    for (var x = 0; x < this.width; x++) {
                        for (var i = 0; i < 6; i++) {
                            this.faces[idx] = new THREE.Face4(0, 0, 0, 0);
                            idx++;
                        }
                    }
                }
            }
        };

        MultiCube.prototype.setup_cube_buffer = function () {
            var idx = 0;
            for (var z = 0; z < this.depth; z++) {
                for (var y = 0; y < this.height; y++) {
                    for (var x = 0; x < this.width; x++) {
                        var cube = new Cube(this);
                        cube.value = this.data[this.get_cube_offset(x, y, z)];
                        cube.x = x;
                        cube.y = y;
                        cube.z = z;
                        cube.faces.push(this.faces[idx + 0]);
                        cube.faces.push(this.faces[idx + 1]);
                        cube.faces.push(this.faces[idx + 2]);
                        cube.faces.push(this.faces[idx + 3]);
                        cube.faces.push(this.faces[idx + 4]);
                        cube.faces.push(this.faces[idx + 5]);
                        cube.needsUpdate = true;
                        this.cubes.push(cube);
                        idx = idx + 6;
                    }
                }
            }

            for (var n in this.cubes) {
                var cube = this.cubes[n];
                var offset = 0;

                offset = this.get_cube_offset(cube.x - 1, cube.y, cube.z);
                if (offset >= 0 && offset < this.cubes.length)
                    cube.cubes.push(this.cubes[offset]);

                offset = this.get_cube_offset(cube.x + 1, cube.y, cube.z);
                if (offset >= 0 && offset < this.cubes.length)
                    cube.cubes.push(this.cubes[offset]);

                offset = this.get_cube_offset(cube.x, cube.y - 1, cube.z);
                if (offset >= 0 && offset < this.cubes.length)
                    cube.cubes.push(this.cubes[offset]);

                offset = this.get_cube_offset(cube.x, cube.y + 1, cube.z);
                if (offset >= 0 && offset < this.cubes.length)
                    cube.cubes.push(this.cubes[offset]);

                offset = this.get_cube_offset(cube.x, cube.y, cube.z - 1);
                if (offset >= 0 && offset < this.cubes.length + 1)
                    cube.cubes.push(this.cubes[offset]);

                offset = this.get_cube_offset(cube.x, cube.y, cube.z + 1);
                if (offset >= 0 && offset < this.cubes.length)
                    cube.cubes.push(this.cubes[offset]);
            }
        };

        MultiCube.prototype.get_cube_offset = function (x, y, z) {
            return x + (y * this.width) + (z * this.width * this.height);
        };

        MultiCube.prototype.get_vertex_offset = function (x, y, z) {
            return x + (y * (this.width + 1)) + (z * (this.width + 1) * (this.height + 1));
        };

        MultiCube.generate_random = function (width, height, depth) {
            var data = [];
            for (var z = 0; z < depth - 0; z++) {
                for (var y = 0; y < height - 0; y++) {
                    for (var x = 0; x < width - 0; x++) {
                        if (x == 0 || y == 0 || z == 0 || x == width - 1 || z == depth - 1) {
                            data.push(1);
                        } else {
                            var rand = Math.floor(Math.random() * 6);
                            if (rand == 0) {
                                data.push(1);
                            } else {
                                data.push(0);
                            }
                        }
                    }
                }
            }
            return new MultiCube(data, width, height, depth);
        };

        MultiCube.create = function (defaultValue, width, height, depth) {
            var data = new Array(width * height * depth);
            for (var i = 0; i < data.length; i++) {
                data[i] = defaultValue;
            }
            return new MultiCube(data, width, height, depth);
        };
        return MultiCube;
    })(THREE.Geometry);
    demo.MultiCube = MultiCube;
})(demo || (demo = {}));
//@ sourceMappingURL=MultiCube.js.map
var demo;
(function (demo) {
    var AStarNode = (function () {
        function AStarNode() {
            this.nodes = new Array();

            this.x = 0;

            this.y = 0;

            this.z = 0;
        }
        return AStarNode;
    })();
    demo.AStarNode = AStarNode;

    var AStar = (function () {
        function AStar(data, width, height, depth) {
            this.setup(data, width, height, depth);
        }
        AStar.prototype.setup = function (data, width, height, depth) {
            if (data.length != (width * height * depth))
                throw new Error("astar: the buffer length is not width * height.");

            this.data = data;

            this.width = width;

            this.height = height;

            this.depth = depth;

            this.nodes = new Array();

            for (var z = 0; z < this.depth; z++) {
                for (var y = 0; y < this.height; y++) {
                    for (var x = 0; x < this.width; x++) {
                        var node = new AStarNode();
                        node.value = data[this.offset(x, y, z)];
                        node.x = x;
                        node.y = y;
                        node.z = z;
                        this.nodes.push(node);
                    }
                }
            }

            for (var z = 0; z < this.depth; z++) {
                for (var y = 0; y < this.height; y++) {
                    for (var x = 0; x < this.width; x++) {
                        var node = this.nodes[this.offset(x, y, z)];
                        for (var cz = -1; cz < 2; cz++) {
                            for (var cy = -1; cy < 2; cy++) {
                                for (var cx = -1; cx < 2; cx++) {
                                    if (cx != 0 && cy != 0 && cz != 0) {
                                        var offset = this.offset(x + cx, y + cy, z + cz);
                                        if (offset > 0 && offset < this.nodes.length) {
                                            node.nodes.push(this.nodes[offset]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };

        AStar.prototype.offset = function (x, y, z) {
            return x + (y * this.width) + (z * this.width * this.height);
        };
        return AStar;
    })();
    demo.AStar = AStar;
})(demo || (demo = {}));
//@ sourceMappingURL=AStar.js.map
var demo;
(function (demo) {
    var App = (function () {
        function App(element, width, height) {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.v = 1;
            this.element = element;

            this.setup_element(width, height);

            this.setup_renderer(width, height);

            this.setup_camera(width, height);

            this.setup_scene();

            this.setup_object();
        }
        App.prototype.setup_element = function (width, height) {
            this.element.style.width = width.toString() + 'px';

            this.element.style.height = height.toString() + 'px';
        };

        App.prototype.setup_renderer = function (width, height) {
            this.renderer = new THREE.WebGLRenderer({});

            this.renderer.setSize(width, height);

            this.element.appendChild(this.renderer.domElement);
        };

        App.prototype.setup_camera = function (width, height) {
            this.camera = new THREE.PerspectiveCamera(60, width / height, 1, 12000);

            this.camera.position = new THREE.Vector3(0, 0, -10);

            this.camera.up = new THREE.Vector3(0, 1, 0);

            this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        };

        App.prototype.setup_scene = function () {
            this.scene = new THREE.Scene();
        };

        App.prototype.setup_object = function () {
            var materials = [
                new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false, side: THREE.DoubleSide }),
                new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, wireframeLinewidth: 20, transparent: true, opacity: 1, side: THREE.DoubleSide })
            ];

            var width = 10;

            var height = 10;

            var depth = 10;

            this.geometry = demo.MultiCube.create(0, width, height, depth);

            var astar = new demo.AStar(this.geometry.data, width, height, depth);

            this.object = THREE.SceneUtils.createMultiMaterialObject(this.geometry, materials);

            this.scene.add(this.object);
        };

        App.prototype.render = function () {
            this.geometry.setValue(this.v, this.x, this.y, this.z);

            this.geometry.update();

            this.x = this.x + 1;

            if (this.x > 9) {
                this.x = 0;
                this.y = this.y + 1;
            }
            if (this.y > 9) {
                this.x = 0;
                this.y = 0;
                this.z = this.z + 1;
            }
            if (this.z > 9) {
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.v = this.v == 1 ? 0 : 1;
            }

            this.renderer.render(this.scene, this.camera);
        };
        return App;
    })();
    demo.App = App;
})(demo || (demo = {}));
//@ sourceMappingURL=App.js.map
//@ sourceMappingURL=index.js.map
