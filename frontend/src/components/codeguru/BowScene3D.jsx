import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function tube(points, radius, material, segments = 56) {
  const curve = new THREE.CatmullRomCurve3(points.map(([x, y, z = 0]) => new THREE.Vector3(x, y, z)))
  return new THREE.Mesh(new THREE.TubeGeometry(curve, segments, radius, 9, false), material)
}

export default function BowScene3D({ aimingSlot = 0, drawAmount = 0 }) {
  const hostRef = useRef(null)
  const drawRef = useRef(0)
  const aimRef = useRef(0)

  useEffect(() => {
    drawRef.current = drawAmount
  }, [drawAmount])

  useEffect(() => {
    aimRef.current = (aimingSlot - 2.5) * 0.13
  }, [aimingSlot])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50)
    camera.position.set(0, 0.1, 7.4)
    camera.lookAt(0, 0, 0)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    host.appendChild(renderer.domElement)

    scene.add(new THREE.HemisphereLight(0xb5ffee, 0x040a08, 2.4))
    const key = new THREE.DirectionalLight(0xd4fff3, 3.5)
    key.position.set(-3, 4, 6)
    scene.add(key)
    
    // Emerald ground caustic bounce light (matching fantasy floor caustic)
    const caustic = new THREE.PointLight(0x00ff88, 3.8, 10)
    caustic.position.set(0, -1.8, 1.2)
    scene.add(caustic)

    // Subtle warm gold rim light for fantasy depth
    const goldRim = new THREE.PointLight(0xffb84d, 1.8, 8)
    goldRim.position.set(2.5, 1, 2)
    scene.add(goldRim)

    const rim = new THREE.PointLight(0x00f2b3, 4.5, 8)
    rim.position.set(0, 0, 2.5)
    scene.add(rim)

    const bow = new THREE.Group()
    scene.add(bow)

    // Premium fantasy materials
    const darkObsidian = new THREE.MeshStandardMaterial({ color: 0x0b1411, metalness: 0.94, roughness: 0.18 })
    const damascusTrim = new THREE.MeshStandardMaterial({ color: 0x1f332a, metalness: 0.92, roughness: 0.24 })
    const goldAccent = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95, roughness: 0.28 })
    const runeGreen = new THREE.MeshStandardMaterial({ color: 0x00ff99, emissive: 0x00e676, emissiveIntensity: 3.6, metalness: 0.2, roughness: 0.18 })
    const stringMaterial = new THREE.LineBasicMaterial({ color: 0x9effd8, transparent: true, opacity: 0.95 })

    const limb = [[-2.03, -0.84, 0], [-1.75, -0.38, 0.02], [-1.48, 0.13, 0.07], [-1.12, 0.43, 0.09], [-0.62, 0.39, 0.06], [0, 0.16, 0], [0.62, 0.39, 0.06], [1.12, 0.43, 0.09], [1.48, 0.13, 0.07], [1.75, -0.38, 0.02], [2.03, -0.84, 0]]
    bow.add(tube(limb, 0.105, darkObsidian, 72))
    bow.add(tube(limb, 0.045, damascusTrim, 72))
    // Glowing emerald rune channels
    bow.add(tube([[-1.9, -0.55, 0.11], [-1.45, 0.14, 0.13], [-0.95, 0.38, 0.12]], 0.022, runeGreen))
    bow.add(tube([[1.9, -0.55, 0.11], [1.45, 0.14, 0.13], [0.95, 0.38, 0.12]], 0.022, runeGreen))

    // Gold accent collars at limb tips
    for (const x of [-2.03, 2.03]) {
      const tipCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 0.12, 16), goldAccent)
      tipCollar.position.set(x * 0.92, -0.72, 0.02)
      bow.add(tipCollar)

      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.12, 18, 14), damascusTrim)
      tip.position.set(x, -0.84, 0.03)
      bow.add(tip)
      const light = new THREE.Mesh(new THREE.SphereGeometry(0.048, 12, 10), runeGreen)
      light.position.set(x, -0.84, 0.12)
      bow.add(light)
    }

    // Grip section with gold and obsidian layering
    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.74, 0.33), darkObsidian)
    grip.position.set(0, -0.55, 0.06)
    grip.rotation.z = -0.1
    bow.add(grip)

    const gripCollar1 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.06, 0.35), goldAccent)
    gripCollar1.position.set(0, -0.22, 0.06)
    bow.add(gripCollar1)

    const gripCollar2 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.06, 0.35), goldAccent)
    gripCollar2.position.set(0, -0.88, 0.06)
    bow.add(gripCollar2)

    const gripPlate = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.48, 0.09), damascusTrim)
    gripPlate.position.set(0, -0.55, 0.24)
    bow.add(gripPlate)

    // Code Core Gem (radiant octahedron)
    const codeCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.14, 0), runeGreen)
    codeCore.position.set(0, -0.53, 0.31)
    bow.add(codeCore)

    const stringGeometry = new THREE.BufferGeometry()
    const string = new THREE.Line(stringGeometry, stringMaterial)
    scene.add(string)
    const arrow = new THREE.Group()
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.036, 1.4, 12), damascusTrim)
    shaft.position.y = 0.12
    arrow.add(shaft)
    const point = new THREE.Mesh(new THREE.ConeGeometry(0.105, 0.28, 8), runeGreen)
    point.position.y = 0.92
    arrow.add(point)
    const nock = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 10), runeGreen)
    nock.position.y = -0.58
    arrow.add(nock)
    bow.add(arrow)

    const resize = () => {
      const width = Math.max(host.clientWidth, 1)
      const height = Math.max(host.clientHeight, 1)
      // Keep the canvas CSS size in CSS pixels while the drawing buffer uses DPR.
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.position.z = Math.max(2.55, 7.35 / camera.aspect)
      camera.updateProjectionMatrix()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(host)
    resize()
    renderer.setAnimationLoop((time) => {
      const pull = drawRef.current
      // Keep the bow limbs level; only turn the arrow toward the selected slot.
      bow.rotation.z = 0
      bow.position.y = THREE.MathUtils.damp(bow.position.y, -pull * 0.12, 8, 1 / 60)
      codeCore.rotation.y = time * 0.0012
      codeCore.rotation.x = time * 0.0007
      arrow.position.set(0, -0.48 - pull * 0.38, 0.32 + pull * 0.3)
      arrow.rotation.x = -0.12 - pull * 0.08
      arrow.rotation.z = -aimRef.current
      string.geometry.setFromPoints([
        new THREE.Vector3(-2.03, -0.84, 0.02),
        new THREE.Vector3(0, -0.1 - pull * 0.62, 0.2 + pull * 0.52),
        new THREE.Vector3(2.03, -0.84, 0.02),
      ])
      renderer.render(scene, camera)
    })

    return () => {
      observer.disconnect()
      renderer.setAnimationLoop(null)
      scene.traverse((object) => {
        object.geometry?.dispose()
        if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach((material) => material.dispose())
      })
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={hostRef} className="pointer-events-none absolute inset-0" aria-hidden="true" />
}
