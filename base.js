import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GridMapHelper } from '../../helpers/GridMapHelper'
import {resizeCanvasToDisplaySize} from '../../helpers/Util'
import {Fire} from '../../helpers/FireObject/Fire'
import { CSG } from 'helpers/CSGMesh'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, 2, 1, 1000)
camera.position.set(0,15,30)

const renderer = new THREE.WebGLRenderer({canvas: document.getElementById("sceneView")})

window.addEventListener( 'resize', function(){
    resizeCanvasToDisplaySize(renderer,camera);
}, false );

const ambientLight = new THREE.HemisphereLight('white','darkslategrey',0.5)

const mainLight = new THREE.DirectionalLight('white',0.7)
mainLight.position.set(2,1,1)

const controls = new OrbitControls(camera, renderer.domElement)

const gridMapHelper = new GridMapHelper()

const plane = gridMapHelper.createGridPlane()

const fireClock = new THREE.Clock()
const fireTexPath = new URL('fire.png',import.meta.url).toString()
const fireTex = new THREE.TextureLoader().load(fireTexPath)
const fireHole = new Fire(fireTex)
fireHole.scale.set(1.2, 3.0, 1.2)
fireHole.position.set(gridMapHelper.getGlobalXPositionFromCoord(7),1.5,gridMapHelper.getGlobalZPositionFromCoord(5))
gridMapHelper.addFireHole(7,5)

const cylinderMesh1 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 32))
const cylinderMesh2 = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 1, 32))

cylinderMesh2.position.set(gridMapHelper.getGlobalXPositionFromCoord(4.5),0.25,gridMapHelper.getGlobalZPositionFromCoord(4.5))
cylinderMesh2.matrixAutoUpdate = false
cylinderMesh2.updateMatrix()

const cylinderCSG1 = CSG.fromMesh(cylinderMesh1)
const cylinderCSG2 = CSG.fromMesh(cylinderMesh2)

const cylindersSubtractCSG = cylinderCSG1.subtract(cylinderCSG2)
const cylindersSubtractMesh = CSG.toMesh(cylindersSubtractCSG, new THREE.Matrix4())

const cylinderTexPath = new URL('brick.avif',import.meta.url).toString()
const cylinderTex = new THREE.TextureLoader().load(cylinderTexPath)

cylindersSubtractMesh.material.map = cylinderTex
cylindersSubtractMesh.position.set(gridMapHelper.getGlobalXPositionFromCoord(7),0.5,gridMapHelper.getGlobalZPositionFromCoord(5))

const cylinderMesh3 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.7, 1.1, 64))
const cylinderMesh4 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.7, 64))

cylinderMesh4.position.set(gridMapHelper.getGlobalXPositionFromCoord(4.5),0.25,gridMapHelper.getGlobalZPositionFromCoord(4.5))
cylinderMesh4.matrixAutoUpdate = false
cylinderMesh4.updateMatrix()

const cylinderCSG3 = CSG.fromMesh(cylinderMesh3)
const cylinderCSG4 = CSG.fromMesh(cylinderMesh4)

const cylindersSubtractCSG1 = cylinderCSG3.subtract(cylinderCSG4)
const cylindersSubtractMesh1 = CSG.toMesh(cylindersSubtractCSG1, new THREE.Matrix4())
cylindersSubtractMesh1.material = new THREE.MeshPhongMaterial({color: 'black'})
cylindersSubtractMesh1.position.set(gridMapHelper.getGlobalXPositionFromCoord(7),0.5,gridMapHelper.getGlobalZPositionFromCoord(5))

scene.add(ambientLight)
scene.add(mainLight)
scene.add(plane)
scene.add(fireHole)
scene.add(cylindersSubtractMesh)
scene.add(cylindersSubtractMesh1)

function animate() {
    requestAnimationFrame(animate)
    fireHole.update(fireClock)
    controls.update()
    renderer.render(scene, camera)
}

resizeCanvasToDisplaySize(renderer,camera)
animate()