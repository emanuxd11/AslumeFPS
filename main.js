import * as THREE from 'three';
import { App } from './App.js';
import { GuiInterface } from '../GuiInterface.js';
import { Contents } from '../Contents.js';

// create the Application object
const app = new App()
// initializes the Application
app.init()

// create the Contents object
const contents = new Contents(app)
// initializes the Contents
contents.init()
// hooks the Contents object in the Application object
app.setContents(contents);

// create the gui interface object
const gui = new GuiInterface(app);
// set the Contents object in the gui interface object
gui.setContents(contents);

// we call the gui interface init 
// after Contents were created because
// interface elements may control Contents items
gui.init();

// main animation loop - calls every 50-60 ms.
app.render();
