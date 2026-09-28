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

    scene.add(new THREE.HemisphereLight(0xcafff2, 0x08100e, 2.2))
    const key = new THREE.DirectionalLight(0xc9fff1, 3.3)
    key.position.set(-3, 4, 6)
    scene.add(key)
    const rim = new THREE.PointLight(0x00f2b3, 5, 8)
    rim.position.set(0, 0, 2.5)
    scene.add(rim)

    const bow = new THREE.Group()
    scene.add(bow)
    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x111a19, metalness: 0.9, roughness: 0.24 })
    const graphite = new THREE.MeshStandardMaterial({ color: 0x30423f, metalness: 0.92, roughness: 0.2 })
    const green = new THREE.MeshStandardMaterial({ color: 0x51ffdc, emissive: 0x00dca8, emissiveIntensity: 2.7, metalness: 0.25, roughness: 0.22 })
    const stringMaterial = new THREE.LineBasicMaterial({ color: 0xc8fff5, transparent: true, opacity: 0.95 })

    const limb = [[-2.03, -0.84, 0], [-1.75, -0.38, 0.02], [-1.48, 0.13, 0.07], [-1.12, 0.43, 0.09], [-0.62, 0.39, 0.06], [0, 0.16, 0], [0.62, 0.39, 0.06], [1.12, 0.43, 0.09], [1.48, 0.13, 0.07], [1.75, -0.38, 0.02], [2.03, -0.84, 0]]
    bow.add(tube(limb, 0.1, darkMetal, 72))
    bow.add(tube(limb, 0.042, graphite, 72))
    bow.add(tube([[-1.9, -0.55, 0.11], [-1.45, 0.14, 0.13], [-0.95, 0.38, 0.12]], 0.018, green))
    bow.add(tube([[1.9, -0.55, 0.11], [1.45, 0.14, 0.13], [0.95, 0.38, 0.12]], 0.018, green))

    for (const x of [-2.03, 2.03]) {
      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.12, 18, 14), graphite)
      tip.position.set(x, -0.84, 0.03)
      bow.add(tip)
      const light = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 10), green)
      light.position.set(x, -0.84, 0.12)
      bow.add(light)
    }

    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.72, 0.32), darkMetal)
    grip.position.set(0, -0.55, 0.06)
    grip.rotation.z = -0.1
    bow.add(grip)
    const gripPlate = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.46, 0.08), graphite)
    gripPlate.position.set(0, -0.55, 0.24)
    bow.add(gripPlate)
    const codeCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.13, 0), green)
    codeCore.position.set(0, -0.53, 0.31)
    bow.add(codeCore)

    const stringGeometry = new THREE.BufferGeometry()
    const string = new THREE.Line(stringGeometry, stringMaterial)
    scene.add(string)
    const arrow = new THREE.Group()
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 1.38, 10), graphite)
    shaft.position.y = 0.12
    arrow.add(shaft)
    const point = new THREE.Mesh(new THREE.ConeGeometry(0.095, 0.25, 8), green)
    point.position.y = 0.9
    arrow.add(point)
    const nock = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 10), green)
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
