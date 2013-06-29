var demo;
(function (demo) {
    (function (data) {
        var Data3D = (function () {
            function Data3D(width, height, depth) {
                this.values = new Array(width * height * depth);
                this.width = width;
                this.height = height;
                this.depth = depth;
            }
            Data3D.prototype.set = function (value, x, y, z) {
                if (x >= 0 && x < this.width)
                    if (y >= 0 && y < this.height)
                        if (z >= 0 && z < this.depth)
                            this.values[this.offset(x, y, z)] = value;
            };

            Data3D.prototype.get = function (x, y, z) {
                if (x >= 0 && x < this.width)
                    if (y >= 0 && y < this.height)
                        if (z >= 0 && z < this.depth)
                            return this.values[this.offset(x, y, z)];
                return null;
            };

            Data3D.prototype.each = function (callback) {
                var offset = 0;
                for (var z = 0; z < this.depth; z++) {
                    for (var y = 0; y < this.height; y++) {
                        for (var x = 0; x < this.width; x++) {
                            callback(this.values[offset], offset, x, y, z);
                            offset = offset + 1;
                        }
                    }
                }
            };

            Data3D.prototype.map = function (callback) {
                var data = new Data3D(this.width, this.height, this.depth);
                var ref = data;
                var offset = 0;
                for (var z = 0; z < this.depth; z++) {
                    for (var y = 0; y < this.height; y++) {
                        for (var x = 0; x < this.width; x++) {
                            ref.values[offset] = callback(this.values[offset], offset, x, y, z);
                            offset = offset + 1;
                        }
                    }
                }
                return data;
            };

            Data3D.prototype.address = function (offset) {
                return {
                    x: Math.floor(offset / 1 % this.width),
                    y: Math.floor(offset / this.width % this.height),
                    z: Math.floor(offset / (this.width * this.height) % this.depth)
                };
            };

            Data3D.prototype.offset = function (x, y, z) {
                return x + (y * this.width) + (z * this.width * this.height);
            };
            return Data3D;
        })();
        data.Data3D = Data3D;
    })(demo.data || (demo.data = {}));
    var data = demo.data;
})(demo || (demo = {}));
//@ sourceMappingURL=Data3D.js.map
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var demo;
(function (demo) {
    (function (cubes) {
        var Cube = (function () {
            function Cube(multicube, value, offset, x, y, z) {
                this.multicube = multicube;

                this.value = value;

                this.offset = offset;

                this.x = x;

                this.y = y;

                this.z = z;

                this.positions = new Array(24);

                this.normals = new Array(24);

                this.texcoords = new Array(24);

                this.faces = new Array(6);

                this.faces_copy = new Array(6);
            }
            Cube.prototype.setValue = function (value) {
                this.value = value;

                this.computeFaceVisibility(true);
            };

            Cube.prototype.setFace = function (i, face) {
                this.faces[i] = face;

                this.faces_copy[i] = this.faces[i].clone();
            };
            Cube.prototype.show = function () {
                for (var i = 0; i < 6; i++)
                    this.showFace(i);
            };
            Cube.prototype.hide = function () {
                for (var i = 0; i < 6; i++)
                    this.hideFace(i);
            };
            Cube.prototype.hideFace = function (i) {
                this.faces[i].a = 0;

                this.faces[i].b = 0;

                this.faces[i].c = 0;

                this.faces[i].d = 0;

                this.multicube.verticesNeedUpdate = true;
            };

            Cube.prototype.showFace = function (i) {
                this.faces[i].a = this.faces_copy[i].a;

                this.faces[i].b = this.faces_copy[i].b;

                this.faces[i].c = this.faces_copy[i].c;

                this.faces[i].d = this.faces_copy[i].d;

                this.multicube.verticesNeedUpdate = true;
            };

            Cube.prototype.computeFaceVisibility = function (includeAdjancent) {
                var adjacent_index = [
                    [this.x + 1, this.y, this.z],
                    [this.x - 1, this.y, this.z],
                    [this.x, this.y + 1, this.z],
                    [this.x, this.y - 1, this.z],
                    [this.x, this.y, this.z + 1],
                    [this.x, this.y, this.z - 1]
                ];

                if (this.value != 0) {
                    for (var i = 0; i < 6; i++) {
                        var adjacent = this.multicube.cubes.get(adjacent_index[i][0], adjacent_index[i][1], adjacent_index[i][2]);

                        if (adjacent == null) {
                            this.showFace(i);
                        } else if (adjacent.value == 0) {
                            this.showFace(i);
                        } else {
                            this.hideFace(i);
                        }
                    }
                } else {
                    this.hide();
                }

                if (includeAdjancent) {
                    for (var i = 0; i < 6; i++) {
                        var adjacent = this.multicube.cubes.get(adjacent_index[i][0], adjacent_index[i][1], adjacent_index[i][2]);

                        if (adjacent) {
                            adjacent.computeFaceVisibility(false);
                        }
                    }
                }

                this.multicube.verticesNeedUpdate = true;

                this.multicube.uvsNeedUpdate = true;
            };
            return Cube;
        })();
        cubes.Cube = Cube;

        var MultiCube = (function (_super) {
            __extends(MultiCube, _super);
            function MultiCube(data) {
                _super.call(this);

                this.setup(data);
            }
            MultiCube.prototype.setup = function (data) {
                var _this = this;
                var table = {
                    positions: [
                        new THREE.Vector3(0, 0, 0),
                        new THREE.Vector3(0, 1, 0),
                        new THREE.Vector3(1, 1, 0),
                        new THREE.Vector3(1, 0, 0),
                        new THREE.Vector3(1, 0, 1),
                        new THREE.Vector3(1, 1, 1),
                        new THREE.Vector3(0, 1, 1),
                        new THREE.Vector3(0, 0, 1)
                    ],
                    normals: [
                        new THREE.Vector3(1, 0, 0),
                        new THREE.Vector3(-1, 0, 0),
                        new THREE.Vector3(0, 1, 0),
                        new THREE.Vector3(0, -1, 0),
                        new THREE.Vector3(0, 0, 1),
                        new THREE.Vector3(0, 0, -1)
                    ],
                    texcoords: [
                        new THREE.Vector2(0, 0),
                        new THREE.Vector2(1, 0),
                        new THREE.Vector2(1, 1),
                        new THREE.Vector2(0, 1)
                    ],
                    index_positions: [
                        [3, 2, 5, 4],
                        [7, 6, 1, 0],
                        [5, 2, 1, 6],
                        [7, 0, 3, 4],
                        [4, 5, 6, 7],
                        [0, 1, 2, 3]
                    ],
                    index_normals: [
                        [0, 0, 0, 0],
                        [1, 1, 1, 1],
                        [3, 3, 3, 3],
                        [2, 2, 2, 2],
                        [4, 4, 4, 4],
                        [5, 5, 5, 5]
                    ],
                    index_texcoords: [
                        [0, 1, 2, 3],
                        [0, 1, 2, 3],
                        [0, 1, 2, 3],
                        [0, 1, 2, 3],
                        [0, 1, 2, 3],
                        [0, 1, 2, 3]
                    ]
                };

                var half_width = (data.width / 2);

                var half_height = (data.height / 2);

                var half_depth = (data.depth / 2);

                this.cubes = data.map(function (value, offset, x, y, z) {
                    var cube = new Cube(_this, value, offset, x, y, z);

                    var index = 0;

                    for (var face_index = 0; face_index < 6; face_index++) {
                        var length = _this.vertices.length;

                        var face = new THREE.Face4(length + 0, length + 1, length + 2, length + 3);

                        for (var vert_index = 0; vert_index < 4; vert_index++) {
                            var position = table.positions[table.index_positions[face_index][vert_index]].clone();

                            var normal = table.normals[table.index_normals[face_index][vert_index]].clone();

                            var texcoord = table.texcoords[table.index_texcoords[face_index][vert_index]].clone();

                            position.x = position.x + (x - half_width);

                            position.y = position.y + (y - half_height);

                            position.z = position.z + (z - half_depth);

                            _this.vertices.push(position);

                            face.normal = normal;

                            face.vertexNormals.push(normal);

                            cube.positions[index] = position;

                            cube.texcoords[index] = texcoord;

                            cube.normals[index] = normal;

                            index++;
                        }

                        (_this.faceVertexUvs[0]).push([
                            cube.texcoords[0],
                            cube.texcoords[1],
                            cube.texcoords[2],
                            cube.texcoords[3]
                        ]);

                        _this.faces.push(face);

                        cube.setFace(face_index, face);
                    }

                    return cube;
                });

                this.cubes.each(function (cube, offset, x, y, z) {
                    cube.computeFaceVisibility(false);
                });

                this.verticesNeedUpdate = true;

                this.uvsNeedUpdate = true;
            };
            return MultiCube;
        })(THREE.Geometry);
        cubes.MultiCube = MultiCube;
    })(demo.cubes || (demo.cubes = {}));
    var cubes = demo.cubes;
})(demo || (demo = {}));
//@ sourceMappingURL=MultiCube.js.map
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
            this.setup_data();
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

        App.prototype.setup_data = function () {
            this.data = new demo.data.Data3D(12, 12, 12);
            for (var i = 0; i < this.data.values.length; i++) {
                var n = Math.floor(Math.random() * 200);
                if (n > 50) {
                    this.data.values[i] = 0;
                } else {
                    this.data.values[i] = 1;
                }
            }
        };

        App.prototype.setup_object = function () {
            var texture = THREE.ImageUtils.loadTexture('/static/scripts/demo/assets/cube.0.png');
            var materials = [
                new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false, side: THREE.FrontSide, map: texture }),
                new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, wireframeLinewidth: 1, transparent: true, opacity: 1, side: THREE.FrontSide })
            ];

            this.multicube = new demo.cubes.MultiCube(this.data);
            this.mesh = THREE.SceneUtils.createMultiMaterialObject(this.multicube, materials);
            this.scene.add(this.mesh);
        };

        App.prototype.render = function () {
            this.renderer.render(this.scene, this.camera);
        };
        return App;
    })();
    demo.App = App;
})(demo || (demo = {}));
//@ sourceMappingURL=App.js.map
//@ sourceMappingURL=index.js.map
