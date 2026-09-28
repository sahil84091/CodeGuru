import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * ThreeLearningWorld - CodeGuru Interactive 3D Biome Realm
 * 
 * Renders the 6 interactive learning biomes in 3D:
 * 1. Foundations (Mossy forest plinth with floating Code Core Cube)
 * 2. Data Structures (Icy glacial mountain peaks with floating frost crystals)
 * 3. Algorithms (Sandstone desert ziggurat with palm trees and torches)
 * 4. Problem Solving (Cyber sci-fi tech platform with glowing circuit tracks)
 * 5. Projects (Obsidian void platform with purple amethyst crystals & portal)
 * 6. Compete (Volcanic caldera with lava fissures & 3D golden trophy)
 * 
 * Connected by winding rivers, bridges, and glowing energy spline paths.
 */
export default function ThreeLearningWorld({ onNodeClick }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || 900
    const height = container.clientHeight || 580

    // 1. Scene & Background
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#080D0B')
    scene.fog = new THREE.FogExp2('#080D0B', 0.01)

    // 2. Camera (Isometric Perspective)
    const aspect = width / height
    const camera = new THREE.PerspectiveCamera(34, aspect, 0.1, 1000)
    // Isometric viewpoint angles
    camera.position.set(0, 32, 38)
    camera.lookAt(0, 0, 0)

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.35
    container.appendChild(renderer.domElement)

    // Master Group for smooth mouse tilt / parallax
    const worldGroup = new THREE.Group()
    scene.add(worldGroup)

    // 4. Lighting Setup
    const ambientLight = new THREE.AmbientLight('#D9F3E5', 1.45)
    scene.add(ambientLight)

    const sunLight = new THREE.DirectionalLight('#D8F3E5', 2.8)
    sunLight.position.set(20, 45, 25)
    sunLight.castShadow = true
    sunLight.shadow.mapSize.width = 2048
    sunLight.shadow.mapSize.height = 2048
    sunLight.shadow.camera.near = 0.5
    sunLight.shadow.camera.far = 100
    sunLight.shadow.camera.left = -22
    sunLight.shadow.camera.right = 22
    sunLight.shadow.camera.top = 22
    sunLight.shadow.camera.bottom = -22
    sunLight.shadow.bias = -0.0005
    scene.add(sunLight)

    // Secondary fill light for rim highlights
    const rimLight = new THREE.DirectionalLight('#4FD1C5', 1.0)
    rimLight.position.set(-25, 20, -20)
    scene.add(rimLight)

    // 5. Materials Repository
    const materials = {
      darkGrass: new THREE.MeshStandardMaterial({ color: '#132A1C', roughness: 0.85, metalness: 0.1 }),
      lushGrass: new THREE.MeshStandardMaterial({ color: '#1E462E', roughness: 0.75, metalness: 0.1 }),
      stoneGrey: new THREE.MeshStandardMaterial({ color: '#1A2320', roughness: 0.9, metalness: 0.2 }),
      darkCliff: new THREE.MeshStandardMaterial({ color: '#101714', roughness: 0.95, metalness: 0.1 }),
      water: new THREE.MeshStandardMaterial({
        color: '#0A4354',
        roughness: 0.15,
        metalness: 0.2,
        transparent: true,
        opacity: 0.88,
      }),
      waterFoam: new THREE.MeshBasicMaterial({ color: '#56CFB2', transparent: true, opacity: 0.6 }),
      pineNeedles: new THREE.MeshStandardMaterial({ color: '#0F3020', roughness: 0.8 }),
      pineNeedlesLight: new THREE.MeshStandardMaterial({ color: '#184730', roughness: 0.8 }),
      woodTrunk: new THREE.MeshStandardMaterial({ color: '#3A281A', roughness: 0.9 }),
      
      // Node 1 Materials (Foundations)
      codeCube: new THREE.MeshStandardMaterial({
        color: '#00FF66',
        emissive: '#00CC52',
        emissiveIntensity: 0.85,
        roughness: 0.2,
        metalness: 0.8,
        wireframe: false,
      }),
      orbitRing: new THREE.MeshBasicMaterial({ color: '#00FF66', transparent: true, opacity: 0.75 }),

      // Node 2 Materials (Data Structures - Ice)
      iceRock: new THREE.MeshStandardMaterial({ color: '#1E354D', roughness: 0.4, metalness: 0.3 }),
      snowPeak: new THREE.MeshStandardMaterial({ color: '#DCEBFA', roughness: 0.5, metalness: 0.1 }),
      frostCrystal: new THREE.MeshStandardMaterial({
        color: '#64B5F6',
        emissive: '#1E88E5',
        emissiveIntensity: 0.9,
        roughness: 0.1,
        metalness: 0.4,
        transparent: true,
        opacity: 0.9,
      }),

      // Node 3 Materials (Algorithms - Desert)
      sandstoneBase: new THREE.MeshStandardMaterial({ color: '#7D6137', roughness: 0.9 }),
      sandstoneTop: new THREE.MeshStandardMaterial({ color: '#BA9455', roughness: 0.8 }),
      torchGold: new THREE.MeshStandardMaterial({
        color: '#FFD54F',
        emissive: '#FF9800',
        emissiveIntensity: 1.2,
      }),

      // Node 4 Materials (Problem Solving - Cyber)
      cyberPlate: new THREE.MeshStandardMaterial({ color: '#101B24', roughness: 0.3, metalness: 0.8 }),
      cyberLine: new THREE.MeshBasicMaterial({ color: '#00E5FF' }),
      hologramPanel: new THREE.MeshStandardMaterial({
        color: '#00E5FF',
        emissive: '#00B0FF',
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.65,
        wireframe: true,
      }),

      // Node 5 Materials (Projects - Obsidian Portal)
      obsidianPlate: new THREE.MeshStandardMaterial({ color: '#120D1D', roughness: 0.4, metalness: 0.6 }),
      amethystCrystal: new THREE.MeshStandardMaterial({
        color: '#AB47BC',
        emissive: '#8E24AA',
        emissiveIntensity: 1.0,
        roughness: 0.2,
        metalness: 0.5,
      }),
      portalEnergy: new THREE.MeshBasicMaterial({ color: '#E1BEE7', transparent: true, opacity: 0.75 }),

      // Node 6 Materials (Compete - Magma & Trophy)
      volcanicBasalt: new THREE.MeshStandardMaterial({ color: '#1A1412', roughness: 0.9, metalness: 0.2 }),
      magmaLava: new THREE.MeshStandardMaterial({
        color: '#FF3D00',
        emissive: '#FF5722',
        emissiveIntensity: 1.6,
        roughness: 0.3,
      }),
      goldTrophy: new THREE.MeshStandardMaterial({
        color: '#FFD700',
        emissive: '#FFA000',
        emissiveIntensity: 0.3,
        roughness: 0.18,
        metalness: 0.9,
      }),
    }

    // Helper: Create stylized low-poly pine tree
    const createTree = (x, y, z, scale = 1) => {
      const treeGroup = new THREE.Group()
      treeGroup.position.set(x, y, z)
      treeGroup.scale.set(scale, scale, scale)

      // Trunk
      const trunkGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.7, 5)
      const trunk = new THREE.Mesh(trunkGeo, materials.woodTrunk)
      trunk.position.y = 0.35
      trunk.castShadow = true
      treeGroup.add(trunk)

      // 3 Cone layers
      const cone1Geo = new THREE.ConeGeometry(0.55, 0.7, 5)
      const cone1 = new THREE.Mesh(cone1Geo, materials.pineNeedles)
      cone1.position.y = 0.8
      cone1.castShadow = true
      treeGroup.add(cone1)

      const cone2Geo = new THREE.ConeGeometry(0.42, 0.6, 5)
      const cone2 = new THREE.Mesh(cone2Geo, materials.pineNeedlesLight)
      cone2.position.y = 1.15
      cone2.castShadow = true
      treeGroup.add(cone2)

      const cone3Geo = new THREE.ConeGeometry(0.28, 0.5, 5)
      const cone3 = new THREE.Mesh(cone3Geo, materials.pineNeedles)
      cone3.position.y = 1.45
      cone3.castShadow = true
      treeGroup.add(cone3)

      worldGroup.add(treeGroup)
    }

    // Helper: Create stylized palm tree for Desert island
    const createPalmTree = (parentGroup, x, y, z, scale = 1) => {
      const palm = new THREE.Group()
      palm.position.set(x, y, z)
      palm.scale.set(scale, scale, scale)

      const trunkGeo = new THREE.CylinderGeometry(0.06, 0.1, 1.2, 5)
      const trunk = new THREE.Mesh(trunkGeo, materials.woodTrunk)
      trunk.position.y = 0.6
      trunk.rotation.z = 0.12
      trunk.castShadow = true
      palm.add(trunk)

      // Palm fronds
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2
        const frondGeo = new THREE.ConeGeometry(0.2, 0.8, 4)
        const frond = new THREE.Mesh(frondGeo, materials.lushGrass)
        frond.position.set(Math.sin(angle) * 0.3, 1.1, Math.cos(angle) * 0.3)
        frond.rotation.set(Math.PI / 3, angle, 0)
        frond.castShadow = true
        palm.add(frond)
      }
      parentGroup.add(palm)
    }

    // 6. Island Meshes & Interactive Objects
    const interactiveObjects = []

    // ----------------------------------------------------
    // BASE TERRAIN & RIVER
    // ----------------------------------------------------
    // Stylized Island archipelago base
    const terrainGeo = new THREE.CylinderGeometry(18, 19, 1.5, 36)
    const terrain = new THREE.Mesh(terrainGeo, materials.darkCliff)
    terrain.position.y = -1.2
    terrain.receiveShadow = true
    worldGroup.add(terrain)

    // Lush top plate
    const topPlateGeo = new THREE.CylinderGeometry(17.8, 18, 0.4, 36)
    const topPlate = new THREE.Mesh(topPlateGeo, materials.darkGrass)
    topPlate.position.y = -0.3
    topPlate.receiveShadow = true
    worldGroup.add(topPlate)

    // River Spline (carved winding river flowing through center)
    const riverPoints = [
      new THREE.Vector3(-2, 0.05, -12),
      new THREE.Vector3(-1.5, 0.05, -7),
      new THREE.Vector3(-2.8, 0.05, -2),
      new THREE.Vector3(-1.5, 0.05, 2),
      new THREE.Vector3(-3.2, 0.05, 7),
      new THREE.Vector3(-4.5, 0.05, 12),
    ]
    const riverCurve = new THREE.CatmullRomCurve3(riverPoints)
    const riverGeo = new THREE.TubeGeometry(riverCurve, 40, 1.1, 10, false)
    const riverMesh = new THREE.Mesh(riverGeo, materials.water)
    riverMesh.scale.set(1.4, 0.05, 1)
    riverMesh.position.y = -0.18
    worldGroup.add(riverMesh)

    // Wooden arched bridge between Node 6 and Node 5
    const bridgeGroup = new THREE.Group()
    bridgeGroup.position.set(-2.5, 0.1, 4.2)
    bridgeGroup.rotation.y = -0.6
    const bridgePlankGeo = new THREE.BoxGeometry(1.6, 0.12, 0.7)
    const bridgePlank = new THREE.Mesh(bridgePlankGeo, materials.woodTrunk)
    bridgePlank.castShadow = true
    bridgeGroup.add(bridgePlank)
    worldGroup.add(bridgeGroup)

    // Waterfall cascade rocks near center
    for (let i = 0; i < 4; i++) {
      const rockGeo = new THREE.DodecahedronGeometry(0.5 + Math.random() * 0.4, 0)
      const rock = new THREE.Mesh(rockGeo, materials.stoneGrey)
      rock.position.set(-1.8 + (i % 2) * 0.8, -0.1 + i * 0.2, -6 + i * 1.2)
      rock.rotation.set(Math.random(), Math.random(), 0)
      rock.castShadow = true
      rock.receiveShadow = true
      worldGroup.add(rock)
    }

    // ----------------------------------------------------
    // NODE 1: FOUNDATIONS (Top-Left)
    // ----------------------------------------------------
    const node1Group = new THREE.Group()
    node1Group.position.set(-9.2, 0.5, -4.5)
    node1Group.userData = { id: 'foundations', title: 'Foundations', path: '/mission/1.1' }

    // Plinth layers (hexagonal stepped stone)
    const n1BaseGeo = new THREE.CylinderGeometry(3.6, 4.0, 1.2, 6)
    const n1Base = new THREE.Mesh(n1BaseGeo, materials.darkCliff)
    n1Base.position.y = 0
    n1Base.receiveShadow = true
    n1Base.castShadow = true
    node1Group.add(n1Base)

    const n1TopGeo = new THREE.CylinderGeometry(3.3, 3.6, 0.35, 6)
    const n1Top = new THREE.Mesh(n1TopGeo, materials.lushGrass)
    n1Top.position.y = 0.75
    n1Top.receiveShadow = true
    node1Group.add(n1Top)

    // Stone Dais
    const daisGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.3, 8)
    const dais = new THREE.Mesh(daisGeo, materials.stoneGrey)
    dais.position.y = 1.0
    dais.receiveShadow = true
    dais.castShadow = true
    node1Group.add(dais)

    // 4 Rune Obelisks
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4
      const obeliskGeo = new THREE.BoxGeometry(0.32, 1.2, 0.32)
      const obelisk = new THREE.Mesh(obeliskGeo, materials.stoneGrey)
      obelisk.position.set(Math.sin(angle) * 1.4, 1.5, Math.cos(angle) * 1.4)
      obelisk.castShadow = true
      node1Group.add(obelisk)

      // Rune glow stripe
      const runeGeo = new THREE.BoxGeometry(0.34, 0.4, 0.34)
      const rune = new THREE.Mesh(runeGeo, materials.codeCube)
      rune.position.set(Math.sin(angle) * 1.4, 1.6, Math.cos(angle) * 1.4)
      node1Group.add(rune)
    }

    // THE 3D ROTATING CODE CORE CUBE
    const cubeGeo = new THREE.BoxGeometry(1.0, 1.0, 1.0)
    const codeCube = new THREE.Mesh(cubeGeo, materials.codeCube)
    codeCube.position.y = 2.4
    codeCube.castShadow = true
    node1Group.add(codeCube)

    // Orbiting Neon Ring
    const orbitGeo = new THREE.TorusGeometry(1.2, 0.04, 8, 32)
    const orbitRing1 = new THREE.Mesh(orbitGeo, materials.orbitRing)
    orbitRing1.position.y = 2.4
    orbitRing1.rotation.x = Math.PI / 3
    node1Group.add(orbitRing1)

    const orbitRing2 = new THREE.Mesh(orbitGeo, materials.orbitRing)
    orbitRing2.position.y = 2.4
    orbitRing2.rotation.y = Math.PI / 3
    node1Group.add(orbitRing2)

    // Node 1 Point Light (Mint pulsing)
    const node1Light = new THREE.PointLight('#00FF66', 2.8, 9)
    node1Light.position.set(0, 2.8, 0)
    node1Group.add(node1Light)

    // Pine trees on Island 1
    createPalmTree(node1Group, -2.2, 0.8, -1.2, 0.8)
    createPalmTree(node1Group, -1.8, 0.8, 1.5, 0.9)
    createPalmTree(node1Group, 1.8, 0.8, -1.8, 0.85)

    worldGroup.add(node1Group)
    interactiveObjects.push(node1Group)

    // ----------------------------------------------------
    // NODE 2: DATA STRUCTURES (Top-Center Frost Peak)
    // ----------------------------------------------------
    const node2Group = new THREE.Group()
    node2Group.position.set(0, 1.6, -9.5)
    node2Group.userData = { id: 'data-structures', title: 'Data Structures' }

    // Glacial mountain cone base
    const mountainGeo = new THREE.ConeGeometry(4.2, 3.5, 7)
    const mountain = new THREE.Mesh(mountainGeo, materials.iceRock)
    mountain.position.y = 1.0
    mountain.castShadow = true
    mountain.receiveShadow = true
    node2Group.add(mountain)

    // Snow cap
    const snowCapGeo = new THREE.ConeGeometry(2.2, 1.8, 7)
    const snowCap = new THREE.Mesh(snowCapGeo, materials.snowPeak)
    snowCap.position.y = 2.4
    snowCap.castShadow = true
    node2Group.add(snowCap)

    // Floating Ice Crystals
    const crystalGroup = new THREE.Group()
    crystalGroup.position.y = 3.6
    const crystals = []
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2
      const radius = 0.9 + Math.random() * 0.4
      const cGeo = new THREE.OctahedronGeometry(0.35 + Math.random() * 0.2, 0)
      const cMesh = new THREE.Mesh(cGeo, materials.frostCrystal)
      cMesh.position.set(Math.sin(angle) * radius, (Math.random() - 0.5) * 0.8, Math.cos(angle) * radius)
      cMesh.rotation.set(Math.random(), Math.random(), Math.random())
      crystalGroup.add(cMesh)
      crystals.push(cMesh)
    }
    node2Group.add(crystalGroup)

    const node2Light = new THREE.PointLight('#64B5F6', 2.2, 8)
    node2Light.position.set(0, 3.6, 0)
    node2Group.add(node2Light)

    worldGroup.add(node2Group)
    interactiveObjects.push(node2Group)

    // ----------------------------------------------------
    // NODE 3: ALGORITHMS (Top-Right Desert Citadel)
    // ----------------------------------------------------
    const node3Group = new THREE.Group()
    node3Group.position.set(9.2, 0.4, -4.5)
    node3Group.userData = { id: 'algorithms', title: 'Algorithms' }

    // Stepped pyramid ziggurat (3 tiers)
    const zigg1Geo = new THREE.BoxGeometry(5.2, 0.9, 5.2)
    const zigg1 = new THREE.Mesh(zigg1Geo, materials.sandstoneBase)
    zigg1.position.y = 0.45
    zigg1.castShadow = true
    zigg1.receiveShadow = true
    node3Group.add(zigg1)

    const zigg2Geo = new THREE.BoxGeometry(3.6, 0.8, 3.6)
    const zigg2 = new THREE.Mesh(zigg2Geo, materials.sandstoneTop)
    zigg2.position.y = 1.3
    zigg2.castShadow = true
    zigg2.receiveShadow = true
    node3Group.add(zigg2)

    const zigg3Geo = new THREE.BoxGeometry(2.2, 0.8, 2.2)
    const zigg3 = new THREE.Mesh(zigg3Geo, materials.sandstoneBase)
    zigg3.position.y = 2.1
    zigg3.castShadow = true
    node3Group.add(zigg3)

    // Golden Sun Altar on top
    const altarGeo = new THREE.DodecahedronGeometry(0.5, 0)
    const altar = new THREE.Mesh(altarGeo, materials.torchGold)
    altar.position.y = 2.9
    altar.castShadow = true
    node3Group.add(altar)

    // 4 Corner Braziers
    const brazierPositions = [
      [-1.5, 1.8, -1.5],
      [1.5, 1.8, -1.5],
      [-1.5, 1.8, 1.5],
      [1.5, 1.8, 1.5],
    ]
    brazierPositions.forEach(([bx, by, bz]) => {
      const bGeo = new THREE.CylinderGeometry(0.12, 0.18, 0.4, 6)
      const bMesh = new THREE.Mesh(bGeo, materials.stoneGrey)
      bMesh.position.set(bx, by, bz)
      node3Group.add(bMesh)

      const flameGeo = new THREE.SphereGeometry(0.12, 6, 6)
      const flame = new THREE.Mesh(flameGeo, materials.torchGold)
      flame.position.set(bx, by + 0.25, bz)
      node3Group.add(flame)
    })

    // Palm trees
    createPalmTree(node3Group, -2.2, 0.9, 1.8, 1.1)
    createPalmTree(node3Group, 2.1, 0.9, -1.9, 0.95)

    const node3Light = new THREE.PointLight('#FFD54F', 2.2, 8)
    node3Light.position.set(0, 3.2, 0)
    node3Group.add(node3Light)

    worldGroup.add(node3Group)
    interactiveObjects.push(node3Group)

    // ----------------------------------------------------
    // NODE 4: PROBLEM SOLVING (Bottom-Right Cyber Platform)
    // ----------------------------------------------------
    const node4Group = new THREE.Group()
    node4Group.position.set(8.8, -0.2, 4.5)
    node4Group.userData = { id: 'problem-solving', title: 'Problem Solving' }

    // Cyber platform base
    const cyberBaseGeo = new THREE.CylinderGeometry(3.6, 3.9, 1.0, 6)
    const cyberBase = new THREE.Mesh(cyberBaseGeo, materials.cyberPlate)
    cyberBase.position.y = 0.5
    cyberBase.castShadow = true
    cyberBase.receiveShadow = true
    node4Group.add(cyberBase)

    // Stepped hexagonal tiers
    const cyberTierGeo = new THREE.CylinderGeometry(2.6, 2.9, 0.4, 6)
    const cyberTier = new THREE.Mesh(cyberTierGeo, materials.stoneGrey)
    cyberTier.position.y = 1.2
    node4Group.add(cyberTier)

    // Central Server Monolith
    const serverGeo = new THREE.BoxGeometry(0.8, 1.6, 0.8)
    const serverMesh = new THREE.Mesh(serverGeo, materials.cyberPlate)
    serverMesh.position.y = 2.1
    serverMesh.castShadow = true
    node4Group.add(serverMesh)

    // Hologram Floating Data Screens
    const holo1 = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.5), materials.hologramPanel)
    holo1.position.set(-1.1, 2.2, 0)
    holo1.rotation.y = Math.PI / 4
    node4Group.add(holo1)

    const holo2 = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.5), materials.hologramPanel)
    holo2.position.set(1.1, 2.2, 0)
    holo2.rotation.y = -Math.PI / 4
    node4Group.add(holo2)

    // Glowing cyan line perimeter
    const lineGeo = new THREE.RingGeometry(2.3, 2.4, 6)
    const lineMesh = new THREE.Mesh(lineGeo, materials.cyberLine)
    lineMesh.rotation.x = -Math.PI / 2
    lineMesh.position.y = 1.42
    node4Group.add(lineMesh)

    const node4Light = new THREE.PointLight('#00E5FF', 2.4, 8)
    node4Light.position.set(0, 2.5, 0)
    node4Group.add(node4Light)

    worldGroup.add(node4Group)
    interactiveObjects.push(node4Group)

    // ----------------------------------------------------
    // NODE 5: PROJECTS (Bottom-Center Obsidian Rift)
    // ----------------------------------------------------
    const node5Group = new THREE.Group()
    node5Group.position.set(0.5, -0.6, 6.8)
    node5Group.userData = { id: 'projects', title: 'Projects' }

    // Obsidian rock base
    const obsBaseGeo = new THREE.CylinderGeometry(3.5, 3.8, 0.8, 7)
    const obsBase = new THREE.Mesh(obsBaseGeo, materials.obsidianPlate)
    obsBase.position.y = 0.4
    obsBase.castShadow = true
    obsBase.receiveShadow = true
    node5Group.add(obsBase)

    // Purple crystal clusters
    for (let i = 0; i < 9; i++) {
      const angle = (i / 9) * Math.PI * 2
      const rad = 1.6 + Math.random() * 0.7
      const h = 0.8 + Math.random() * 1.4
      const cGeo = new THREE.ConeGeometry(0.25, h, 5)
      const cMesh = new THREE.Mesh(cGeo, materials.amethystCrystal)
      cMesh.position.set(Math.sin(angle) * rad, 0.8 + h / 2, Math.cos(angle) * rad)
      cMesh.rotation.set((Math.random() - 0.5) * 0.4, angle, (Math.random() - 0.5) * 0.4)
      cMesh.castShadow = true
      node5Group.add(cMesh)
    }

    // Portal gateway arch
    const archPillar1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.8, 0.3), materials.stoneGrey)
    archPillar1.position.set(-0.7, 1.6, 0)
    archPillar1.castShadow = true
    node5Group.add(archPillar1)

    const archPillar2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.8, 0.3), materials.stoneGrey)
    archPillar2.position.set(0.7, 1.6, 0)
    archPillar2.castShadow = true
    node5Group.add(archPillar2)

    const archTop = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.3, 0.35), materials.stoneGrey)
    archTop.position.set(0, 2.5, 0)
    archTop.castShadow = true
    node5Group.add(archTop)

    // Swirling portal center
    const portalCenter = new THREE.Mesh(new THREE.RingGeometry(0.1, 0.65, 16), materials.portalEnergy)
    portalCenter.position.set(0, 1.6, 0)
    node5Group.add(portalCenter)

    const node5Light = new THREE.PointLight('#BA68C8', 2.4, 8)
    node5Light.position.set(0, 2.2, 0)
    node5Group.add(node5Light)

    worldGroup.add(node5Group)
    interactiveObjects.push(node5Group)

    // ----------------------------------------------------
    // NODE 6: COMPETE (Bottom-Left Volcanic Caldera & Trophy)
    // ----------------------------------------------------
    const node6Group = new THREE.Group()
    node6Group.position.set(-8.8, -0.2, 3.8)
    node6Group.userData = { id: 'compete', title: 'Compete' }

    // Basalt Caldera Base
    const calderaGeo = new THREE.CylinderGeometry(3.6, 4.0, 1.1, 8)
    const caldera = new THREE.Mesh(calderaGeo, materials.volcanicBasalt)
    caldera.position.y = 0.55
    caldera.castShadow = true
    caldera.receiveShadow = true
    node6Group.add(caldera)

    // Crater Rim
    const rimGeo = new THREE.TorusGeometry(1.6, 0.45, 6, 12)
    const rimMesh = new THREE.Mesh(rimGeo, materials.volcanicBasalt)
    rimMesh.rotation.x = Math.PI / 2
    rimMesh.position.y = 1.1
    rimMesh.castShadow = true
    node6Group.add(rimMesh)

    // Molten Lava Lake in crater
    const lavaGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.1, 16)
    const lavaMesh = new THREE.Mesh(lavaGeo, materials.magmaLava)
    lavaMesh.position.y = 0.95
    node6Group.add(lavaMesh)

    // 3D Golden Trophy
    const trophyGroup = new THREE.Group()
    trophyGroup.position.set(0, 2.0, 0)

    const cupPedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.45, 0.35, 8), materials.goldTrophy)
    cupPedestal.position.y = 0.18
    cupPedestal.castShadow = true
    trophyGroup.add(cupPedestal)

    const cupStem = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.5, 8), materials.goldTrophy)
    cupStem.position.y = 0.55
    cupStem.castShadow = true
    trophyGroup.add(cupStem)

    const cupBowl = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.7, 8), materials.goldTrophy)
    cupBowl.position.y = 1.05
    cupBowl.rotation.x = Math.PI
    cupBowl.castShadow = true
    trophyGroup.add(cupBowl)

    // Trophy handles
    const handleGeo = new THREE.TorusGeometry(0.28, 0.05, 6, 12)
    const handle1 = new THREE.Mesh(handleGeo, materials.goldTrophy)
    handle1.position.set(-0.5, 1.1, 0)
    trophyGroup.add(handle1)

    const handle2 = new THREE.Mesh(handleGeo, materials.goldTrophy)
    handle2.position.set(0.5, 1.1, 0)
    trophyGroup.add(handle2)

    node6Group.add(trophyGroup)

    const node6Light = new THREE.PointLight('#FF5722', 2.4, 8)
    node6Light.position.set(0, 2.2, 0)
    node6Group.add(node6Light)

    worldGroup.add(node6Group)
    interactiveObjects.push(node6Group)

    // ----------------------------------------------------
    // PINE TREES SCATTERED ACROSS VALLEYS
    // ----------------------------------------------------
    const treeCoords = [
      [-5.2, 0, -2.5],
      [-4.6, 0, -5.5],
      [-6.5, 0, -7.0],
      [3.2, 0, -7.0],
      [4.8, 0, -5.0],
      [3.5, 0, -2.0],
      [-4.5, 0, 1.5],
      [4.8, 0, 1.8],
      [5.5, 0, 6.8],
      [-5.5, 0, 7.5],
    ]
    treeCoords.forEach(([tx, ty, tz]) => {
      createTree(tx, ty, tz, 0.8 + Math.random() * 0.35)
    })

    // Wooden Directional Signpost
    const signpostGroup = new THREE.Group()
    signpostGroup.position.set(3.5, 0.2, 1.2)
    const signPole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.4, 6), materials.woodTrunk)
    signPole.position.y = 0.7
    signpostGroup.add(signPole)
    const signBoard = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.35, 0.08), materials.sandstoneBase)
    signBoard.position.set(0, 1.25, 0)
    signpostGroup.add(signBoard)
    worldGroup.add(signpostGroup)

    // ----------------------------------------------------
    // GLOWING ENERGY SPLINE PATHS (Nodes 1 -> 2 -> 3 -> 4 -> 5 -> 6)
    // ----------------------------------------------------
    // Path 1 -> 2 (Active Unlocked Glowing Neon Pulse)
    const p12Curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-6.2, 1.2, -5.8),
      new THREE.Vector3(-3.5, 1.4, -7.8),
      new THREE.Vector3(-1.8, 1.8, -8.6),
    ])
    const p12Geo = new THREE.TubeGeometry(p12Curve, 30, 0.12, 8, false)
    const p12Mat = new THREE.MeshStandardMaterial({
      color: '#00FF66',
      emissive: '#00FF66',
      emissiveIntensity: 1.5,
      roughness: 0.2,
    })
    const p12Mesh = new THREE.Mesh(p12Geo, p12Mat)
    worldGroup.add(p12Mesh)

    // Other dashed connector paths (2->3, 3->4, 4->5, 5->6)
    const dashedPaths = [
      // 2 -> 3
      [
        new THREE.Vector3(1.8, 1.8, -8.6),
        new THREE.Vector3(4.8, 1.4, -7.2),
        new THREE.Vector3(7.0, 1.0, -5.5),
      ],
      // 3 -> 4
      [
        new THREE.Vector3(8.5, 0.8, -2.0),
        new THREE.Vector3(9.2, 0.6, 1.2),
        new THREE.Vector3(8.2, 0.4, 3.2),
      ],
      // 4 -> 5
      [
        new THREE.Vector3(6.5, 0.2, 5.5),
        new THREE.Vector3(4.0, 0.1, 6.8),
        new THREE.Vector3(2.5, 0.1, 7.0),
      ],
      // 5 -> 6
      [
        new THREE.Vector3(-1.5, 0.1, 6.8),
        new THREE.Vector3(-4.5, 0.2, 5.5),
        new THREE.Vector3(-6.5, 0.4, 4.2),
      ],
    ]

    dashedPaths.forEach((pts) => {
      const curve = new THREE.CatmullRomCurve3(pts)
      const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.08, 6, false)
      const tubeMat = new THREE.MeshStandardMaterial({
        color: '#243A30',
        emissive: '#1F3F31',
        emissiveIntensity: 0.4,
        roughness: 0.6,
      })
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat)
      worldGroup.add(tubeMesh)
    })

    // Ambient floating dust motes / glowing particles
    const particleCount = 70
    const particleGeo = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 26
      particlePositions[i + 1] = 0.5 + Math.random() * 8
      particlePositions[i + 2] = (Math.random() - 0.5) * 26
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    const particleMat = new THREE.PointsMaterial({
      color: '#00FF66',
      size: 0.16,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    })
    const particleSystem = new THREE.Points(particleGeo, particleMat)
    worldGroup.add(particleSystem)

    // ----------------------------------------------------
    // INTERACTION & ANIMATION LOOP
    // ----------------------------------------------------
    let targetRotationX = 0
    let targetRotationY = 0

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      targetRotationY = nx * 0.08 // subtle isometric tilt
      targetRotationX = -ny * 0.05
    }

    container.addEventListener('mousemove', handleMouseMove)

    // Raycasting for clicking 3D islands directly
    const raycaster = new THREE.Raycaster()
    const mouseVector = new THREE.Vector2()

    const handleClick = (e) => {
      const rect = container.getBoundingClientRect()
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseVector.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)

      raycaster.setFromCamera(mouseVector, camera)
      const intersects = raycaster.intersectObjects(worldGroup.children, true)

      if (intersects.length > 0) {
        let hitObject = intersects[0].object
        // Find ancestor with userData.id
        while (hitObject && (!hitObject.userData || !hitObject.userData.id)) {
          hitObject = hitObject.parent
        }
        if (hitObject && hitObject.userData && hitObject.userData.id) {
          if (onNodeClick) onNodeClick(hitObject.userData)
        }
      }
    }

    container.addEventListener('click', handleClick)

    // Resize Observer
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    // Main Animation Loop
    let animationFrameId
    let clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      const elapsedTime = clock.getElapsedTime()

      // 1. Smooth Camera Tilt from Mouse
      worldGroup.rotation.y += (targetRotationY - worldGroup.rotation.y) * 0.05
      worldGroup.rotation.x += (targetRotationX - worldGroup.rotation.x) * 0.05

      // 2. Animate Node 1 Code Core Cube
      codeCube.rotation.x = elapsedTime * 0.8
      codeCube.rotation.y = elapsedTime * 1.2
      codeCube.position.y = 2.4 + Math.sin(elapsedTime * 2) * 0.12
      orbitRing1.rotation.z = elapsedTime * 1.5
      orbitRing2.rotation.x = -elapsedTime * 1.1

      // Pulse mint light
      node1Light.intensity = 2.4 + Math.sin(elapsedTime * 3) * 0.7

      // 3. Animate Node 2 Floating Crystals
      crystals.forEach((c, idx) => {
        c.position.y += Math.sin(elapsedTime * 2 + idx) * 0.003
        c.rotation.y += 0.015
      })

      // 4. Animate Node 5 Portal vortex
      portalCenter.rotation.z = -elapsedTime * 1.5

      // 5. Animate Node 6 Trophy rotation
      trophyGroup.rotation.y = elapsedTime * 0.7

      // 6. Slowly drift dust particles
      const positions = particleGeo.attributes.position.array
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] += 0.012
        if (positions[i] > 10) {
          positions[i] = 0.5
        }
      }
      particleGeo.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('click', handleClick)
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
      renderer.dispose()
      scene.clear()
    }
  }, [onNodeClick])

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[520px] md:min-h-[580px] lg:min-h-[620px] cursor-grab active:cursor-grabbing select-none"
    />
  )
}
