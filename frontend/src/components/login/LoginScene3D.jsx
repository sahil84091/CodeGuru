import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'

/**
 * LoginScene3D – Premium Black Hole with post-processing for CodeGuru.
 *
 * Ported from the user-provided standalone visualization and themed
 * to CodeGuru's green/cyan/purple palette. Features:
 *  - EffectComposer with UnrealBloomPass for cinematic glow
 *  - Gravitational lensing post-processing shader with chromatic aberration
 *  - 80K twinkling stars with custom vertex/fragment shaders
 *  - Event horizon sphere with Fresnel green edge glow
 *  - Accretion disk with 3D simplex noise spiral plasma
 *  - Mouse parallax (replaces OrbitControls to not interfere with UI)
 *  - Activation burst when the user submits the login form
 */

// ── Constants ────────────────────────────────────────────────────
const BLACK_HOLE_RADIUS = 1.3
const DISK_INNER_RADIUS = BLACK_HOLE_RADIUS + 0.2
const DISK_OUTER_RADIUS = 8.0
const DISK_TILT_ANGLE = Math.PI / 3.0

export default function LoginScene3D({ activating = false, orbitRef }) {
  const hostRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const activatingRef = useRef(false)

  useEffect(() => {
    activatingRef.current = activating
  }, [activating])

  const handleMouseMove = useCallback((e) => {
    mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
    mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined

    // ═══════════════════════════════════════════════════════════════
    //  SCENE, CAMERA, RENDERER
    // ═══════════════════════════════════════════════════════════════
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x010604, 0.022)

    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 4000)
    camera.position.set(-6.5, 5.0, 6.5)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor(0x020504, 1)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    host.appendChild(renderer.domElement)

    // ═══════════════════════════════════════════════════════════════
    //  POST-PROCESSING — Bloom + Gravitational Lensing
    // ═══════════════════════════════════════════════════════════════
    const w = Math.max(host.clientWidth, 1)
    const h = Math.max(host.clientHeight, 1)
    renderer.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()

    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(w, h),
      0.35,  // restrained glow keeps the disk bright while preserving the blackhole detail
      0.42,  // radius
      0.82   // threshold: bloom only the brightest parts of the disk
    )
    composer.addPass(bloomPass)

    // ── Gravitational lensing shader ──
    const lensingShader = {
      uniforms: {
        tDiffuse: { value: null },
        blackHoleScreenPos: { value: new THREE.Vector2(0.5, 0.5) },
        lensingStrength: { value: 0.12 },
        lensingRadius: { value: 0.3 },
        aspectRatio: { value: w / h },
        chromaticAberration: { value: 0.005 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec2 blackHoleScreenPos;
        uniform float lensingStrength;
        uniform float lensingRadius;
        uniform float aspectRatio;
        uniform float chromaticAberration;
        varying vec2 vUv;

        void main() {
          vec2 screenPos = vUv;
          vec2 toCenter = screenPos - blackHoleScreenPos;
          toCenter.x *= aspectRatio;
          float dist = length(toCenter);

          float distortionAmount = lensingStrength / (dist * dist + 0.003);
          distortionAmount = clamp(distortionAmount, 0.0, 0.7);
          float falloff = smoothstep(lensingRadius, lensingRadius * 0.3, dist);
          distortionAmount *= falloff;

          vec2 offset = normalize(toCenter) * distortionAmount;
          offset.x /= aspectRatio;

          vec2 distortedUvR = screenPos - offset * (1.0 + chromaticAberration);
          vec2 distortedUvG = screenPos - offset;
          vec2 distortedUvB = screenPos - offset * (1.0 - chromaticAberration);

          float r = texture2D(tDiffuse, distortedUvR).r;
          float g = texture2D(tDiffuse, distortedUvG).g;
          float b = texture2D(tDiffuse, distortedUvB).b;

          gl_FragColor = vec4(r, g, b, 1.0);
        }
      `,
    }
    const lensingPass = new ShaderPass(lensingShader)
    composer.addPass(lensingPass)

    // ═══════════════════════════════════════════════════════════════
    //  1. STARFIELD — 80K twinkling stars with custom shaders
    // ═══════════════════════════════════════════════════════════════
    const starGeometry = new THREE.BufferGeometry()
    const starCount = 80000
    const starPositions = new Float32Array(starCount * 3)
    const starColors = new Float32Array(starCount * 3)
    const starSizes = new Float32Array(starCount)
    const starTwinkle = new Float32Array(starCount)
    const starFieldRadius = 2000

    // CodeGuru-themed star palette — greens, cyans, purples, whites
    const starPalette = [
      new THREE.Color(0x88ffaa), // green tint
      new THREE.Color(0xaaffcc), // pale green
      new THREE.Color(0x88eeff), // cyan
      new THREE.Color(0xaaddff), // light blue
      new THREE.Color(0xddaaff), // lavender
      new THREE.Color(0xffffff), // white
      new THREE.Color(0xccffcc), // soft green
      new THREE.Color(0xffeecc), // warm white
      new THREE.Color(0x55ff88), // green
      new THREE.Color(0x88ffff), // bright cyan
    ]

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3
      const phi = Math.acos(-1 + (2 * i) / starCount)
      const theta = Math.sqrt(starCount * Math.PI) * phi
      const radius = Math.cbrt(Math.random()) * starFieldRadius + 100

      starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      starPositions[i3 + 2] = radius * Math.cos(phi)

      const starColor = starPalette[Math.floor(Math.random() * starPalette.length)].clone()
      starColor.multiplyScalar(Math.random() * 0.7 + 0.3)
      starColors[i3] = starColor.r
      starColors[i3 + 1] = starColor.g
      starColors[i3 + 2] = starColor.b
      starSizes[i] = THREE.MathUtils.randFloat(0.6, 3.0)
      starTwinkle[i] = Math.random() * Math.PI * 2
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3))
    starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1))
    starGeometry.setAttribute('twinkle', new THREE.BufferAttribute(starTwinkle, 1))

    const starMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        attribute float size;
        attribute float twinkle;
        varying vec3 vColor;
        varying float vTwinkle;

        void main() {
          vColor = color;
          vTwinkle = sin(uTime * 2.5 + twinkle) * 0.5 + 0.5;

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * uPixelRatio * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vTwinkle;

        void main() {
          float dist = distance(gl_PointCoord, vec2(0.5));
          if (dist > 0.5) discard;

          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          alpha *= (0.2 + vTwinkle * 0.8);

          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)

    // ═══════════════════════════════════════════════════════════════
    //  2. EVENT HORIZON GLOW — Fresnel edge glow (BackSide sphere)
    // ═══════════════════════════════════════════════════════════════
    const eventHorizonMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uCameraPosition: { value: camera.position },
        uActivating: { value: 0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uCameraPosition;
        uniform float uActivating;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vec3 viewDirection = normalize(uCameraPosition - vPosition);
          float fresnel = 1.0 - abs(dot(vNormal, viewDirection));
          fresnel = pow(fresnel, 2.5);

          // CodeGuru green glow instead of orange
          vec3 glowColor = mix(
            vec3(0.0, 1.0, 0.4),       // Green base
            vec3(0.2, 0.75, 1.0),       // Cyan shift
            sin(uTime * 0.5) * 0.3 + 0.3
          );
          // On activation, glow intensifies
          glowColor += vec3(0.0, 0.5, 0.2) * uActivating;

          float pulse = sin(uTime * 2.5) * 0.15 + 0.85;
          pulse += uActivating * 0.4;

          gl_FragColor = vec4(glowColor * fresnel * pulse * 0.78, fresnel * 0.26);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    })

    const eventHorizon = new THREE.Mesh(
      new THREE.SphereGeometry(BLACK_HOLE_RADIUS * 1.05, 128, 64),
      eventHorizonMat
    )
    scene.add(eventHorizon)

    // ═══════════════════════════════════════════════════════════════
    //  3. BLACK HOLE CORE — pure black sphere
    // ═══════════════════════════════════════════════════════════════
    const blackHoleMesh = new THREE.Mesh(
      new THREE.SphereGeometry(BLACK_HOLE_RADIUS, 128, 64),
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    )
    blackHoleMesh.renderOrder = 0
    scene.add(blackHoleMesh)

    // ═══════════════════════════════════════════════════════════════
    //  4. ACCRETION DISK — simplex noise plasma shader
    //     CodeGuru themed: green-hot → cyan → teal → purple outer
    // ═══════════════════════════════════════════════════════════════
    const diskMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uActivating: { value: 0 },
        // Color gradient: named by original position in disk (inner→outer)
        // uColorOuter = visually the INNER edge (near black hole)
        // uColorHot = visually the OUTER edge (far from black hole)
        uColorHot: { value: new THREE.Color(0xeeffee) },  // Hot white-green (innermost ring)
        uColorMid1: { value: new THREE.Color(0x00ff66) },  // CodeGuru green
        uColorMid2: { value: new THREE.Color(0x00ddaa) },  // Teal/emerald
        uColorMid3: { value: new THREE.Color(0x38bdf8) },  // Cyan accent
        uColorOuter: { value: new THREE.Color(0x5533aa) }, // Purple outer edge
        uNoiseScale: { value: 2.5 },
        uFlowSpeed: { value: 0.22 },
        uDensity: { value: 1.3 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying float vRadius;
        varying float vAngle;
        void main() {
          vUv = uv;
          vRadius = length(position.xy);
          vAngle = atan(position.y, position.x);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uActivating;
        uniform vec3 uColorHot;
        uniform vec3 uColorMid1;
        uniform vec3 uColorMid2;
        uniform vec3 uColorMid3;
        uniform vec3 uColorOuter;
        uniform float uNoiseScale;
        uniform float uFlowSpeed;
        uniform float uDensity;

        varying vec2 vUv;
        varying float vRadius;
        varying float vAngle;

        // ── Simplex 3D Noise ──
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

        float snoise(vec3 v) {
          const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ * ns.x + ns.yyyy;
          vec4 y = y_ * ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0) * 2.0 + 1.0;
          vec4 s1 = floor(b1) * 2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }

        void main() {
          float normalizedRadius = smoothstep(${DISK_INNER_RADIUS.toFixed(2)}, ${DISK_OUTER_RADIUS.toFixed(2)}, vRadius);

          float spiral = vAngle * 3.0 - (1.0 / (normalizedRadius + 0.1)) * 2.0;
          vec2 noiseUv = vec2(
            vUv.x + uTime * uFlowSpeed * (2.0 / (vRadius * 0.3 + 1.0)) + sin(spiral) * 0.1,
            vUv.y * 0.8 + cos(spiral) * 0.1
          );
          float noiseVal1 = snoise(vec3(noiseUv * uNoiseScale, uTime * 0.15));
          float noiseVal2 = snoise(vec3(noiseUv * uNoiseScale * 3.0 + 0.8, uTime * 0.22));
          float noiseVal3 = snoise(vec3(noiseUv * uNoiseScale * 6.0 + 1.5, uTime * 0.3));

          float noiseVal = (noiseVal1 * 0.45 + noiseVal2 * 0.35 + noiseVal3 * 0.2);
          noiseVal = (noiseVal + 1.0) * 0.5;

          // Color gradient: inner (normalizedRadius≈0) → outer (normalizedRadius≈1)
          vec3 color = uColorOuter;
          color = mix(color, uColorMid3, smoothstep(0.0, 0.25, normalizedRadius));
          color = mix(color, uColorMid2, smoothstep(0.2, 0.55, normalizedRadius));
          color = mix(color, uColorMid1, smoothstep(0.5, 0.75, normalizedRadius));
          color = mix(color, uColorHot, smoothstep(0.7, 0.95, normalizedRadius));

          color *= (0.5 + noiseVal * 1.0);

          // Activation green boost
          vec3 activationColor = vec3(0.0, 1.0, 0.4);
          color = mix(color, activationColor, uActivating * 0.3 * noiseVal);

          float brightness = pow(1.0 - normalizedRadius, 1.0) * 3.5 + 0.5;
          brightness *= (0.3 + noiseVal * 2.2);
          brightness *= 1.0 + uActivating * 0.6;

          float pulse = sin(uTime * 1.8 + normalizedRadius * 12.0 + vAngle * 2.0) * 0.15 + 0.85;
          brightness *= pulse;

          float alpha = uDensity * (0.2 + noiseVal * 0.9);
          alpha *= smoothstep(0.0, 0.15, normalizedRadius);
          alpha *= (1.0 - smoothstep(0.85, 1.0, normalizedRadius));
          alpha = clamp(alpha, 0.0, 1.0);

          gl_FragColor = vec4(color * brightness, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const accretionDisk = new THREE.Mesh(
      new THREE.RingGeometry(DISK_INNER_RADIUS, DISK_OUTER_RADIUS, 256, 128),
      diskMaterial
    )
    accretionDisk.rotation.x = DISK_TILT_ANGLE
    accretionDisk.renderOrder = 1
    scene.add(accretionDisk)

    // ═══════════════════════════════════════════════════════════════
    //  6. PORTAL BURST — green ring on activation
    // ═══════════════════════════════════════════════════════════════
    const portalBurstMat = new THREE.MeshStandardMaterial({
      color: 0x00ff66,
      emissive: 0x00ff66,
      emissiveIntensity: 6,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    })
    const portalBurst = new THREE.Mesh(
      new THREE.TorusGeometry(2.0, 0.1, 12, 80),
      portalBurstMat
    )
    portalBurst.rotation.x = DISK_TILT_ANGLE
    scene.add(portalBurst)

    // ═══════════════════════════════════════════════════════════════
    //  RESIZE HANDLER
    // ═══════════════════════════════════════════════════════════════
    let resizeTimeout
    const resize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        const rw = Math.max(host.clientWidth, 1)
        const rh = Math.max(host.clientHeight, 1)
        camera.aspect = rw / rh
        camera.updateProjectionMatrix()
        renderer.setSize(rw, rh)
        composer.setSize(rw, rh)
        bloomPass.resolution.set(rw, rh)
        lensingPass.uniforms.aspectRatio.value = rw / rh
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
      }, 100)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(host)
    resize()

    // ═══════════════════════════════════════════════════════════════
    //  ANIMATION LOOP
    // ═══════════════════════════════════════════════════════════════
    const clock = new THREE.Timer()
    clock.connect(document)
    const blackHoleScreenPosVec3 = new THREE.Vector3()
    let activationPhase = 0

    // Base camera position for parallax offset
    const baseCamPos = camera.position.clone()

    const renderFrame = () => {
      clock.update()
      const deltaTime = clock.getDelta()
      const elapsedTime = clock.getElapsed()

      // ── Mouse parallax — subtle camera offset ──
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const scrollProgress = THREE.MathUtils.clamp(orbitRef?.current?.value ?? 0, 0, 1)
      // Give each story beat a distinct blackhole viewpoint while the scroll stays natural.
      const orbitAngle = scrollProgress * 0.68
      const orbitCos = Math.cos(orbitAngle)
      const orbitSin = Math.sin(orbitAngle)
      const orbitX = baseCamPos.x * orbitCos + baseCamPos.z * orbitSin
      const orbitZ = baseCamPos.z * orbitCos - baseCamPos.x * orbitSin
      camera.position.x = THREE.MathUtils.damp(camera.position.x, orbitX + mx * 0.7, 2.1, deltaTime || 1 / 60)
      camera.position.y = THREE.MathUtils.damp(camera.position.y, baseCamPos.y - scrollProgress * 0.62 + my * 0.45, 2.1, deltaTime || 1 / 60)
      camera.position.z = THREE.MathUtils.damp(camera.position.z, orbitZ, 2.1, deltaTime || 1 / 60)
      camera.lookAt(0, 0, 0)

      // ── Update uniforms ──
      diskMaterial.uniforms.uTime.value = elapsedTime
      starMaterial.uniforms.uTime.value = elapsedTime
      eventHorizonMat.uniforms.uTime.value = elapsedTime
      eventHorizonMat.uniforms.uCameraPosition.value.copy(camera.position)

      // ── Gravitational lensing — project black hole to screen space ──
      blackHoleScreenPosVec3.copy(blackHoleMesh.position).project(camera)
      lensingPass.uniforms.blackHoleScreenPos.value.set(
        (blackHoleScreenPosVec3.x + 1) / 2,
        (blackHoleScreenPosVec3.y + 1) / 2
      )

      // ── Gentle rotation ──
      stars.rotation.y += (deltaTime || 1 / 60) * 0.003
      stars.rotation.x += (deltaTime || 1 / 60) * 0.001
      accretionDisk.rotation.z += (deltaTime || 1 / 60) * 0.005

      // ── Activation Effects ──
      if (activatingRef.current) {
        activationPhase = Math.min(activationPhase + 0.015, 1)
      } else {
        activationPhase = Math.max(activationPhase - 0.02, 0)
      }

      // Disk activation
      diskMaterial.uniforms.uActivating.value = activationPhase
      eventHorizonMat.uniforms.uActivating.value = activationPhase

      // Bloom intensifies
      bloomPass.strength = 0.35 + activationPhase * 0.3

      // Lensing strengthens
      lensingPass.uniforms.lensingStrength.value = 0.12 + activationPhase * 0.15

      // Portal burst ring
      portalBurstMat.opacity = activationPhase * 0.85
      portalBurst.rotation.z = elapsedTime * 3
      portalBurst.scale.setScalar(1 + activationPhase * 0.8)

      // Disk spins faster during activation
      accretionDisk.rotation.z += activationPhase * (deltaTime || 1 / 60) * 0.3

      // Render with post-processing
      composer.render(deltaTime || 1 / 60)
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        renderer.setAnimationLoop(null)
        return
      }

      // Reset the clock so returning from a background tab does not jump the scene.
      clock.reset()
      renderer.setAnimationLoop(renderFrame)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    if (!document.hidden) renderer.setAnimationLoop(renderFrame)

    // ═══════════════════════════════════════════════════════════════
    //  CLEANUP
    // ═══════════════════════════════════════════════════════════════
    return () => {
      clearTimeout(resizeTimeout)
      observer.disconnect()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clock.dispose()
      renderer.setAnimationLoop(null)
      scene.traverse((obj) => {
        obj.geometry?.dispose()
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
          mats.forEach((m) => {
            m.map?.dispose()
            m.dispose()
          })
        }
      })
      composer.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [orbitRef])

  return (
    <div
      ref={hostRef}
      className="fixed inset-0 z-0"
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    />
  )
}
