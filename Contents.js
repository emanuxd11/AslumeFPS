import * as THREE from "three";
import { MyAxis } from "./Axis.js";
import { Floor } from "./Objects/Floor.js";
import { Wall } from './Objects/Wall.js';
import { Table } from './Objects/Table.js';
import { Plate } from './Objects/Plate.js';
import { Cake } from './Objects/Cake.js';
import { Candle } from './Objects/Candle.js';
import { Flame } from './Objects/Flame.js';
import { Toilet } from "./Objects/Toilet.js";
import { Bed } from "./Objects/Bed.js";
import { Sink } from "./Objects/Sink.js";
import { Spotlight } from "./Objects/Spotlight.js";
import { JailWall } from "./Objects/JailWall.js";
import { Painting } from "./Objects/Painting.js"
import { FlowerJar } from "./Objects/FlowerJar.js";
import { Flower } from "./Objects/Flower.js";
import { HelicalSpring } from "./Objects/HelicalSpring.js";
import { BeetleTubes } from "./Objects/BeetleTubes.js";
import { Ceiling } from "./Objects/Ceiling.js";
import { CeilingLight } from "./Objects/CeilingLight.js";
import { Mirror } from "./Objects/Mirror.js";
import { Stool } from "./Objects/Stool.js";
import { Blanket } from "./Objects/Blanket.js"
import { Newspaper } from "./Objects/Newspaper.js";


/**
 *  This class contains the Contents of out Application
 */
class Contents {

  /**
   * constructs the object
   * @param { App } app 
   */
  constructor(app) {
    this.app = app;
    this.axis = null;

    this.floorWidth  = 15;
    this.floorLength = 15;

    this.wallHeight = 10;

    this.tableLegHeight = 2.9;
    this.tableThickness = 0.2;
    this.cakeHeight = 0.25;
    this.plateThickness = 0.075;
    this.candleHeight = 0.2;
    this.candleRadius = 0.015;

    this.initialTime = Date.now();
  }

  /**
   * Initialize the Contents
   */
  init() {

    if (this.axis === null) {
      this.axis = new MyAxis(this);
      this.app.scene.add(this.axis);
    }

    // add an ambient light
    const ambientLight = new THREE.AmbientLight(0x555555, 1);
    this.app.scene.add(ambientLight);

    this.planeTexture = new THREE.TextureLoader().load('./Textures/floor.jpg');
    this.planeTexture.wrapS = THREE.RepeatWrapping;
    this.planeTexture.wrapT = THREE.RepeatWrapping;

    this.diffusePlaneColor = "rgb(128,128,128)";
    this.specularPlaneColor = "rgb(0,0,0)";
    this.planeShininess = 0;

    this.planeMaterial = new THREE.MeshPhongMaterial({
      color: this.diffusePlaneColor,
      specular: this.specularPlaneColor,
      emissive: "#000000",
      shininess: this.planeShininess,
      map: this.planeTexture
    });

    let planeSizeU = 10;
    let planeSizeV = 7;
    let planeUVRate = planeSizeV / planeSizeU;
    let planeTextureUVRate = 3354 / 2385;
    let planeTextureRepeatU = 1;
    let planeTextureRepeatV = planeTextureRepeatU * planeUVRate * planeTextureUVRate;

    this.planeTexture.repeat.set(planeTextureRepeatU, planeTextureRepeatV);
    this.planeTexture.rotation = 0;
    this.planeTexture.offset = new THREE.Vector2(0, 0);

    const floor = new Floor(this.app, "floor", 0, 0, 0, this.floorWidth, this.floorLength, 0);
    floor.build();

    const ceiling = new Ceiling(this.app, "ceiling", 0, this.wallHeight, 0, this.floorWidth, this.floorLength, 0);
    ceiling.build();
    this.ceilingLight = new CeilingLight({
      app: this.app, 
      name: "ceiling light", 
      y: this.wallHeight,
      intensity: 115,
      enableShadows: true,
    });
    this.ceilingLight.build();

    const jailWall = new JailWall(this.app, "jail wall", 0, this.wallHeight / 2, -this.floorWidth / 2, this.floorWidth, this.wallHeight, 0.05, 0.3, 0);
    const wall2 = new Wall(this.app, "wall2", -this.floorWidth / 2, this.wallHeight / 2, 0, this.floorLength, this.wallHeight, Math.PI / 2);
    const wall3 = new Wall(this.app, "wall3", this.floorWidth / 2, this.wallHeight / 2, 0, this.floorLength, this.wallHeight, -Math.PI / 2);
    const wall4 = new Wall(this.app, "wall4", 0, this.wallHeight / 2, this.floorLength / 2, this.floorWidth, this.wallHeight, Math.PI);
    jailWall.build();
    wall2.build();
    wall3.build();
    wall4.build();

    const plate = new Plate(this.app, "plate", 0, this.tableLegHeight + this.tableThickness + this.plateThickness / 2, 0, 0.8, this.plateThickness);
    plate.build();

    const cake = new Cake(this.app, "cake", 0, 0, 0, 0, 0.5, this.cakeHeight, Math.PI * 1.8);
    cake.build();

    const candle = new Candle(this.app, "candle", 0, this.candleHeight / 2, 0, this.candleHeight, this.candleRadius);
    candle.build();

    this.flame = new Flame(this.app, "flame", 0, candle.height / 2, 0, 0.015, 0.05);
    this.flame.build();

    const table = new Table(this.app, "table", 0, 0, 0, 3.5, 3.5, this.tableThickness, this.tableLegHeight, 0.1);
    table.build();

    const stool = new Stool({
      app: this.app,
      name: "fallen stool",
      x: 2.7,
      y: 0,
      z: 5.25,
    });
    stool.build();

    this.toilet = new Toilet(this.app, 'toilet', 5.65, 0, -5.76);
    this.toilet.build();

    const bed = new Bed(this.app, 'bed', -4.35, 0, 6.3);
    bed.build();

    const sink = new Sink(this.app, 'sink', 2.5, 1.75, -6.84, Math.PI / 2)
    sink.build();

    const blanket = new Blanket(this.app, 'blanket', -4, 2, 7.15)
    blanket.sceneObject.rotation.x = Math.PI / 2; 
    blanket.build();

    const jar = new FlowerJar({
      app: this.app,
    });
    jar.build();

    const flower = new Flower(this.app, "flower");
    flower.build();

    const newspaper = new Newspaper(this.app, "newspaper");
    newspaper.build();

    const spring = new HelicalSpring(this.app, "spring", 0, 0, 0, 0);
    spring.build();

    this.spotLight = new Spotlight(this.app, 'spotlight', 5.65, 7, -7.54);
    this.spotLight.build();

    table.addSubObject(cake);
    table.addSubObject(plate);
    table.addSubObject(spring);
    table.addSubObject(jar);
    table.addSubObject(newspaper);
    cake.addSubObject(candle);
    candle.addSubObject(this.flame);
    candle.translate(0, this.cakeHeight / 2, 0);
    cake.translate(0, this.cakeHeight / 2 + this.tableLegHeight + this.tableThickness + this.plateThickness / 2, 0);
    spring.translate(1, this.cakeHeight / 2 + this.tableLegHeight + this.tableThickness + this.plateThickness / 2 + 0.058, -1.25);
    candle.translate(0.25, 0, -0.25);
    jar.addSubObject(flower);
    flower.translate(0, 0.8, 0);
    jar.translate(1.2, this.tableLegHeight + this.tableThickness, 1.2);
    newspaper.translate(-1.2, this.tableLegHeight + this.tableThickness, 0);
    table.translate(this.floorWidth / 2 - table.width / 2 - 0.5, 0, this.floorWidth / 2 - table.width / 2 - 0.5);
    table.rotate(new THREE.Vector3(0, 1, 0), -Math.PI / 2);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 0);
    directionalLight.target.position.set(0, 2, 0);
    this.app.scene.add(directionalLight);
    this.app.scene.add(directionalLight.target);

    // Paintings
    const jonkler_painting = new Painting(this.app, "painting", -this.floorWidth / 2, this.wallHeight / 2, 0, Math.PI / 2, 1.332, 2, 0.1, 0.05, './Textures/jonkler.jpg');
    jonkler_painting.build();

    const man_painting= new Painting(this.app, "painting", -this.floorWidth / 2, this.wallHeight / 2, 6, Math.PI / 2, 1.5, 1.5, 0.1, 0.05, './Textures/man_id_win.jpg');
    man_painting.build();

    // beetle + frame
    const beetleScale = 0.5;
    const beetle = new BeetleTubes(this.app, "beetle", 0, 0, 0, 0);
    beetle.scale(beetleScale, beetleScale, beetleScale);
    beetle.build();

    const beetleFrame = new Painting(this.app, "painting", 0, 0, 0, 0, beetle.totalLength * beetleScale * 2 , beetle.totalHeight * beetleScale + 1.5, 0.1, 0.05, './Textures/cars_track.jpg');
    beetleFrame.build();
    beetleFrame.addSubObject(beetle);
    beetleFrame.translate(this.floorWidth / 2, this.wallHeight / 2, 0)
    beetleFrame.rotate(new THREE.Vector3(0, 1, 0), -Math.PI / 2);
    beetle.rotate(new THREE.Vector3(0, 1, 0), Math.PI);
    beetle.translate(0, 0, -beetle.radius / 2);

    const mirror = new Mirror({
      app: this.app, 
      name: "mirror", 
      x: 2.5, 
      y: 5, 
      z: -this.floorLength / 2 + 0.05, 
      innerWidth: 1.5, 
      innerHeight: 2.5,
    });
    mirror.build();

    // Outside scenario
    const outerFloor1 = new Floor(this.app, "outerFloor1", -this.floorLength, 0, -this.floorWidth, this.floorWidth, this.floorLength, 0);
    outerFloor1.build();
    
    const outerFloor2 = new Floor(this.app, "outerFloor2", 0, 0, -this.floorWidth, this.floorWidth, this.floorLength, 0);
    outerFloor2.build();

    const outerFloor3 = new Floor(this.app, "outerFloor3", this.floorLength, 0, -this.floorWidth, this.floorWidth, this.floorLength, 0);
    outerFloor3.build();

    const outerCeiling1 = new Ceiling(this.app, "outerCeiling1", -this.floorLength, this.wallHeight, -this.floorWidth, this.floorWidth, this.floorLength, 0);
    outerCeiling1.build();
    
    const outerCeiling2 = new Ceiling(this.app, "outerCeiling2", 0, this.wallHeight, -this.floorWidth, this.floorWidth, this.floorLength, 0);
    outerCeiling2.build();

    const outerCeiling3 = new Ceiling(this.app, "outerCeiling3", this.floorLength, this.wallHeight, -this.floorWidth, this.floorWidth, this.floorLength, 0);
    outerCeiling3.build();

    const outerCeilingLight1 = new CeilingLight({
      app: this.app, 
      name: "outer ceiling light 1", 
      x: -this.floorLength, 
      y: this.wallHeight, 
      z: -this.floorWidth, 
      rotation: 0
    });
    outerCeilingLight1.build();

    const outerCeilingLight2 = new CeilingLight({
      app: this.app, 
      name: "outer ceiling light 2",
      y: this.wallHeight, 
      z: -this.floorWidth
    });
    outerCeilingLight2.build();

    const outerCeilingLight3 = new CeilingLight({
      app: this.app, 
      name: "outer ceiling light 3", 
      x: this.floorLength, 
      y: this.wallHeight, 
      z: -this.floorWidth
    });
    outerCeilingLight3.build();

    const outerWall1 = new Wall(this.app, "outerWall1", 0, this.wallHeight / 2, -this.floorWidth * 1.5, this.floorLength, this.wallHeight, 0);
    outerWall1.build();

    const outerWall2 = new Wall(this.app, "outerWall2", -this.floorWidth, this.wallHeight / 2, -this.floorWidth * 1.5, this.floorLength, this.wallHeight, 0);
    outerWall2.build();

    const outerWall3 = new Wall(this.app, "outerWall3", this.floorWidth, this.wallHeight / 2, -this.floorWidth * 1.5, this.floorLength, this.wallHeight, 0);
    outerWall3.build();

    const outerWall4 = new Wall(this.app, "outerWall4", -this.floorWidth * 1.5, this.wallHeight / 2, -this.floorWidth, this.floorLength, this.wallHeight, Math.PI / 2);
    outerWall4.build();

    const outerWall5 = new Wall(this.app, "outerWall5", this.floorWidth * 1.5, this.wallHeight / 2, -this.floorWidth , this.floorLength, this.wallHeight, -Math.PI / 2);
    outerWall5.build();
  }

  /**
   * updates the Contents
   * this method is called from the render method of the app
   */
  update() {
    // const deltaTime = Date.now() - this.initialTime;
    this.flame.update();
  }

}

export { Contents };
