/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-unknown-property */
import {
  Suspense,
  useRef,
  useLayoutEffect,
  useEffect,
  useMemo,
} from 'react'
import { Canvas, useFrame, useLoader, useThree, invalidate } from '@react-three/fiber'
import {
  OrbitControls,
  useGLTF,
  useFBX,
  useProgress,
  Html,
  Environment,
  ContactShadows,
} from '@react-three/drei'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import * as THREE from 'three'
import type { Group, Light, Mesh, Object3D } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

const isTouch =
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0)

const deg2rad = (d: number) => (d * Math.PI) / 180
const DECIDE = 8
const ROTATE_SPEED = 0.005
const INERTIA = 0.925
const PARALLAX_MAG = 0.05
const PARALLAX_EASE = 0.12
const HOVER_MAG = deg2rad(6)
const HOVER_EASE = 0.15

/** Distancia de cámara para que el modelo llene el visor (respeta aspect ratio) */
function getCameraFitDistance(
  camera: THREE.PerspectiveCamera,
  radius: number,
  padding: number,
) {
  const vFov = (camera.fov * Math.PI) / 180
  const aspect = Math.max(camera.aspect, 0.25)
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect)
  const distV = radius / Math.sin(vFov / 2)
  const distH = radius / Math.sin(hFov / 2)
  return Math.max(distV, distH) * padding
}

/** Coloca la cámara mirando al centro del modelo encuadrado */
function frameCameraToSphere(
  camera: THREE.PerspectiveCamera,
  center: THREE.Vector3,
  radius: number,
  padding: number,
  aspect: number,
) {
  camera.aspect = aspect
  const distance = getCameraFitDistance(camera, radius, padding)
  const dir = new THREE.Vector3(0, 0, 1)
  camera.position.copy(center).add(dir.multiplyScalar(distance))
  camera.lookAt(center)
  camera.near = Math.max(distance / 80, 0.01)
  camera.far = distance * 80
  camera.updateProjectionMatrix()
}

type LoaderProps = { placeholderSrc?: string }

const Loader = ({ placeholderSrc }: LoaderProps) => {
  const { progress, active } = useProgress()
  if (!active && placeholderSrc) return null
  return (
    <Html center>
      {placeholderSrc ? (
        <img
          src={placeholderSrc}
          width={128}
          height={128}
          alt=""
          style={{ filter: 'blur(8px)', borderRadius: 8 }}
        />
      ) : (
        `${Math.round(progress)} %`
      )}
    </Html>
  )
}

type DesktopControlsProps = {
  pivot: THREE.Vector3
  min: number
  max: number
  zoomEnabled: boolean
}

const DesktopControls = ({ pivot, min, max, zoomEnabled }: DesktopControlsProps) => {
  const ref = useRef<OrbitControlsImpl>(null)
  useFrame(() => {
    if (ref.current) ref.current.target.copy(pivot)
  })
  return (
    <OrbitControls
      ref={ref}
      makeDefault
      enablePan={false}
      enableRotate={false}
      enableZoom={zoomEnabled}
      minDistance={min}
      maxDistance={max}
    />
  )
}

type ModelInnerProps = {
  url: string
  xOff: number
  yOff: number
  pivot: THREE.Vector3
  initYaw: number
  initPitch: number
  minZoom: number
  maxZoom: number
  enableMouseParallax: boolean
  enableManualRotation: boolean
  enableHoverRotation: boolean
  enableManualZoom: boolean
  autoFrame: boolean
  framePadding: number
  modelScale: number
  fadeIn: boolean
  autoRotate: boolean
  autoRotateSpeed: number
  onLoaded?: () => void
}

const ModelInner = ({
  url,
  xOff,
  yOff,
  pivot,
  initYaw,
  initPitch,
  minZoom,
  maxZoom,
  enableMouseParallax,
  enableManualRotation,
  enableHoverRotation,
  enableManualZoom,
  autoFrame,
  framePadding,
  modelScale,
  fadeIn,
  autoRotate,
  autoRotateSpeed,
  onLoaded,
}: ModelInnerProps) => {
  const outer = useRef<Group>(null)
  const inner = useRef<Group>(null)
  const fittedRadius = useRef(0.5)
  const { camera, gl, size } = useThree()

  const vel = useRef({ x: 0, y: 0 })
  const tPar = useRef({ x: 0, y: 0 })
  const cPar = useRef({ x: 0, y: 0 })
  const tHov = useRef({ x: 0, y: 0 })
  const cHov = useRef({ x: 0, y: 0 })

  const ext = useMemo(() => url.split('.').pop()?.toLowerCase() ?? '', [url])
  const content = useMemo(() => {
    if (ext === 'glb' || ext === 'gltf') return useGLTF(url).scene.clone()
    if (ext === 'fbx') return useFBX(url).clone()
    if (ext === 'obj') return useLoader(OBJLoader, url).clone()
    console.error('Unsupported format:', ext)
    return null
  }, [url, ext])

  const pivotW = useRef(new THREE.Vector3())
  const modelReady = useRef(false)

  const applyAutoFrame = () => {
    if (!autoFrame || !(camera instanceof THREE.PerspectiveCamera) || !modelReady.current) return

    const aspect = size.width / Math.max(size.height, 1)
    frameCameraToSphere(
      camera,
      pivotW.current,
      fittedRadius.current,
      framePadding,
      aspect,
    )
    invalidate()
  }

  useLayoutEffect(() => {
    if (!content || !inner.current || !outer.current) return
    modelReady.current = false

    const g = inner.current
    g.updateWorldMatrix(true, true)

    const preSphere = new THREE.Box3()
      .setFromObject(g)
      .getBoundingSphere(new THREE.Sphere())
    const preRadius = Math.max(preSphere.radius, 1e-4)
    const normalize = (1 / (preRadius * 2)) * modelScale

    g.position.set(-preSphere.center.x, -preSphere.center.y, -preSphere.center.z)
    g.scale.setScalar(normalize)

    g.traverse((o: Object3D) => {
      const mesh = o as Mesh
      if (mesh.isMesh) {
        mesh.castShadow = true
        mesh.receiveShadow = true
        if (fadeIn && mesh.material) {
          const mat = mesh.material as THREE.Material & { transparent?: boolean; opacity?: number }
          mat.transparent = true
          mat.opacity = 0
        }
      }
    })

    outer.current.position.set(0, 0, 0)
    outer.current.rotation.set(initPitch, initYaw, 0)
    outer.current.updateWorldMatrix(true, true)

    const fitted = new THREE.Box3()
      .setFromObject(outer.current)
      .getBoundingSphere(new THREE.Sphere())
    fittedRadius.current = Math.max(fitted.radius, 1e-4)
    pivotW.current.copy(fitted.center)
    pivot.copy(fitted.center)

    modelReady.current = true
    applyAutoFrame()

    if (fadeIn) {
      let t = 0
      const id = setInterval(() => {
        t += 0.05
        const v = Math.min(t, 1)
        g.traverse((o: Object3D) => {
          const mesh = o as Mesh
          if (mesh.isMesh && mesh.material) {
            const mat = mesh.material as THREE.Material & { opacity?: number }
            mat.opacity = v
          }
        })
        invalidate()
        if (v === 1) {
          clearInterval(id)
          onLoaded?.()
        }
      }, 16)
      return () => clearInterval(id)
    }
    onLoaded?.()
  }, [content])

  // Re-encuadra al cambiar el tamaño del canvas (viewport / resize)
  useLayoutEffect(() => {
    if (!modelReady.current) return
    applyAutoFrame()
  }, [size.width, size.height, framePadding, autoFrame, modelScale])

  useEffect(() => {
    if (!enableManualRotation || isTouch) return
    const el = gl.domElement
    let drag = false
    let lx = 0
    let ly = 0
    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return
      drag = true
      lx = e.clientX
      ly = e.clientY
      window.addEventListener('pointerup', up)
    }
    const move = (e: PointerEvent) => {
      if (!drag || !outer.current) return
      const dx = e.clientX - lx
      const dy = e.clientY - ly
      lx = e.clientX
      ly = e.clientY
      outer.current.rotation.y += dx * ROTATE_SPEED
      outer.current.rotation.x += dy * ROTATE_SPEED
      vel.current = { x: dx * ROTATE_SPEED, y: dy * ROTATE_SPEED }
      invalidate()
    }
    const up = () => {
      drag = false
    }
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [gl, enableManualRotation])

  useEffect(() => {
    if (!isTouch) return
    const el = gl.domElement
    const pts = new Map<number, { x: number; y: number }>()

    let mode: 'idle' | 'decide' | 'rotate' | 'pinch' = 'idle'
    let sx = 0
    let sy = 0
    let lx = 0
    let ly = 0
    let startDist = 0
    let startZ = 0

    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (pts.size === 1) {
        mode = 'decide'
        sx = lx = e.clientX
        sy = ly = e.clientY
        // Evita que el navegador haga scroll en lugar de rotar
        if (enableManualRotation) e.preventDefault()
      } else if (pts.size === 2 && enableManualZoom) {
        mode = 'pinch'
        const [p1, p2] = [...pts.values()]
        startDist = Math.hypot(p1.x - p2.x, p1.y - p2.y)
        startZ = camera.position.z
        e.preventDefault()
      }
      invalidate()
    }

    const move = (e: PointerEvent) => {
      const p = pts.get(e.pointerId)
      if (!p) return
      p.x = e.clientX
      p.y = e.clientY

      if (mode === 'decide') {
        const dx = e.clientX - sx
        const dy = e.clientY - sy
        // Cualquier arrastre sobre el canvas rota el modelo (no solo horizontal)
        if (Math.hypot(dx, dy) > DECIDE) {
          if (enableManualRotation) {
            mode = 'rotate'
            try {
              el.setPointerCapture(e.pointerId)
            } catch {
              /* setPointerCapture puede fallar en algunos navegadores */
            }
            e.preventDefault()
          } else {
            mode = 'idle'
            pts.clear()
          }
        }
      }

      if (mode === 'rotate' && outer.current) {
        e.preventDefault()
        const dx = e.clientX - lx
        const dy = e.clientY - ly
        lx = e.clientX
        ly = e.clientY
        outer.current.rotation.y += dx * ROTATE_SPEED
        outer.current.rotation.x += dy * ROTATE_SPEED
        vel.current = { x: dx * ROTATE_SPEED, y: dy * ROTATE_SPEED }
        invalidate()
      } else if (mode === 'pinch' && pts.size === 2) {
        e.preventDefault()
        const [p1, p2] = [...pts.values()]
        const d = Math.hypot(p1.x - p2.x, p1.y - p2.y)
        const ratio = startDist / d
        camera.position.z = THREE.MathUtils.clamp(startZ * ratio, minZoom, maxZoom)
        invalidate()
      }
    }

    const up = (e: PointerEvent) => {
      pts.delete(e.pointerId)
      if (mode === 'rotate' && pts.size === 0) mode = 'idle'
      if (mode === 'pinch' && pts.size < 2) mode = 'idle'
    }

    el.addEventListener('pointerdown', down, { passive: false })
    window.addEventListener('pointermove', move, { passive: false })
    window.addEventListener('pointerup', up, { passive: true })
    window.addEventListener('pointercancel', up, { passive: true })
    return () => {
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [gl, enableManualRotation, enableManualZoom, minZoom, maxZoom, camera])

  useEffect(() => {
    if (isTouch) return
    const mm = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      if (enableMouseParallax) tPar.current = { x: -nx * PARALLAX_MAG, y: -ny * PARALLAX_MAG }
      if (enableHoverRotation) tHov.current = { x: ny * HOVER_MAG, y: nx * HOVER_MAG }
      invalidate()
    }
    window.addEventListener('pointermove', mm)
    return () => window.removeEventListener('pointermove', mm)
  }, [enableMouseParallax, enableHoverRotation])

  useFrame((_, dt) => {
    if (!outer.current) return
    let need = false
    cPar.current.x += (tPar.current.x - cPar.current.x) * PARALLAX_EASE
    cPar.current.y += (tPar.current.y - cPar.current.y) * PARALLAX_EASE
    const phx = cHov.current.x
    const phy = cHov.current.y
    cHov.current.x += (tHov.current.x - cHov.current.x) * HOVER_EASE
    cHov.current.y += (tHov.current.y - cHov.current.y) * HOVER_EASE

    const dragX = vel.current.x
    const dragY = vel.current.y
    vel.current.x *= INERTIA
    vel.current.y *= INERTIA

    if (autoFrame) {
      // Sin unproject: el modelo permanece centrado y la cámara define el zoom
      outer.current.position.set(0, 0, 0)
      const parallaxX = enableMouseParallax ? cPar.current.y * 0.4 : 0
      const parallaxY = enableMouseParallax ? cPar.current.x * 0.4 : 0
      outer.current.rotation.x = initPitch + cHov.current.x + parallaxX + dragY
      outer.current.rotation.y = initYaw + cHov.current.y + parallaxY + dragX
    } else {
      const ndc = pivotW.current.clone().project(camera)
      ndc.x += xOff + cPar.current.x
      ndc.y += yOff + cPar.current.y
      outer.current.position.copy(ndc.unproject(camera))
      outer.current.rotation.x += cHov.current.x - phx
      outer.current.rotation.y += cHov.current.y - phy
      outer.current.rotation.y += dragX
      outer.current.rotation.x += dragY
    }

    if (autoRotate) {
      outer.current.rotation.y += autoRotateSpeed * dt
      need = true
    }

    if (Math.abs(vel.current.x) > 1e-4 || Math.abs(vel.current.y) > 1e-4) need = true

    if (
      Math.abs(cPar.current.x - tPar.current.x) > 1e-4 ||
      Math.abs(cPar.current.y - tPar.current.y) > 1e-4 ||
      Math.abs(cHov.current.x - tHov.current.x) > 1e-4 ||
      Math.abs(cHov.current.y - tHov.current.y) > 1e-4
    )
      need = true

    if (need) invalidate()
  })

  if (!content) return null
  return (
    <group ref={outer}>
      <group ref={inner}>
        <primitive object={content} />
      </group>
    </group>
  )
}

export type ModelViewerProps = {
  url: string
  width?: number
  height?: number
  modelXOffset?: number
  modelYOffset?: number
  defaultRotationX?: number
  defaultRotationY?: number
  defaultZoom?: number
  minZoomDistance?: number
  maxZoomDistance?: number
  enableMouseParallax?: boolean
  enableManualRotation?: boolean
  enableHoverRotation?: boolean
  /** false = la rueda del mouse hace scroll de página, no zoom del modelo */
  enableManualZoom?: boolean
  ambientIntensity?: number
  keyLightIntensity?: number
  fillLightIntensity?: number
  rimLightIntensity?: number
  environmentPreset?:
    | 'none'
    | 'forest'
    | 'apartment'
    | 'city'
    | 'dawn'
    | 'lobby'
    | 'night'
    | 'park'
    | 'studio'
    | 'sunset'
    | 'warehouse'
  autoFrame?: boolean
  /** Menor = cámara más cerca del modelo (solo con autoFrame) */
  framePadding?: number
  /** Escala extra del modelo respecto al encuadre automático */
  modelScale?: number
  placeholderSrc?: string
  showScreenshotButton?: boolean
  screenshotLabel?: string
  fadeIn?: boolean
  autoRotate?: boolean
  autoRotateSpeed?: number
  onModelLoaded?: () => void
  /** Evita que el canvas capture el scroll vertical de la página */
  isolatePageScroll?: boolean
  className?: string
}

const ModelViewer = ({
  url,
  width = 400,
  height = 400,
  modelXOffset = 0,
  modelYOffset = 0,
  defaultRotationX = -50,
  defaultRotationY = 20,
  defaultZoom = 0.5,
  minZoomDistance = 0.5,
  maxZoomDistance = 10,
  enableMouseParallax = true,
  enableManualRotation = true,
  enableHoverRotation = true,
  enableManualZoom = true,
  ambientIntensity = 0.3,
  keyLightIntensity = 1,
  fillLightIntensity = 0.5,
  rimLightIntensity = 0.8,
  environmentPreset = 'forest',
  autoFrame = false,
  framePadding = 1.2,
  modelScale = 1,
  placeholderSrc,
  showScreenshotButton = true,
  screenshotLabel = 'Capture',
  fadeIn = false,
  autoRotate = false,
  autoRotateSpeed = 0.35,
  onModelLoaded,
  isolatePageScroll = true,
  className,
}: ModelViewerProps) => {
  useEffect(() => {
    useGLTF.preload(url)
  }, [url])

  const pivot = useRef(new THREE.Vector3()).current
  const contactRef = useRef<THREE.Group>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.Camera | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const initYaw = deg2rad(defaultRotationX)
  const initPitch = deg2rad(defaultRotationY)
  const camZ = Math.min(Math.max(defaultZoom, minZoomDistance), maxZoomDistance)

  const zoomEnabled = enableManualZoom && !isolatePageScroll

  // Scroll de página con rueda; en móvil fuerza touch-action none en canvas para rotar
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const touchRotation = isTouch && enableManualRotation
    let canvas: HTMLCanvasElement | null = null
    let onWheel: ((e: WheelEvent) => void) | null = null

    const bindCanvas = () => {
      const next = wrapper.querySelector('canvas')
      if (!next || next === canvas) return !!canvas

      if (canvas && onWheel) {
        canvas.removeEventListener('wheel', onWheel, { capture: true })
      }

      canvas = next
      canvas.style.touchAction = touchRotation ? 'none' : isolatePageScroll ? 'pan-y' : 'auto'

      onWheel = (e: WheelEvent) => {
        if (!isolatePageScroll) return
        if (e.ctrlKey || e.metaKey) return
        e.stopPropagation()
      }
      if (isolatePageScroll) {
        canvas.addEventListener('wheel', onWheel, { passive: true, capture: true })
      }
      return true
    }

    if (bindCanvas()) {
      return () => {
        if (canvas && onWheel) canvas.removeEventListener('wheel', onWheel, { capture: true })
      }
    }

    const observer = new MutationObserver(() => {
      if (bindCanvas()) observer.disconnect()
    })
    observer.observe(wrapper, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      if (canvas && onWheel) canvas.removeEventListener('wheel', onWheel, { capture: true })
    }
  }, [isolatePageScroll, enableManualRotation])

  const capture = () => {
    const g = rendererRef.current
    const s = sceneRef.current
    const c = cameraRef.current
    if (!g || !s || !c) return
    g.shadowMap.enabled = false
    const tmp: { l: Light; cast: boolean }[] = []
    s.traverse((o) => {
      const light = o as Light & { castShadow?: boolean }
      if (light.isLight && 'castShadow' in light) {
        tmp.push({ l: light, cast: !!light.castShadow })
        light.castShadow = false
      }
    })
    if (contactRef.current) contactRef.current.visible = false
    g.render(s, c)
    const urlPNG = g.domElement.toDataURL('image/png')
    const a = document.createElement('a')
    a.download = 'model.png'
    a.href = urlPNG
    a.click()
    g.shadowMap.enabled = true
    tmp.forEach(({ l, cast }) => {
      l.castShadow = cast
    })
    if (contactRef.current) contactRef.current.visible = true
    invalidate()
  }

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{
        width,
        height,
        touchAction: isTouch && enableManualRotation ? 'none' : 'pan-y',
        position: 'relative',
      }}
    >
      {showScreenshotButton && (
        <button
          type="button"
          onClick={capture}
          className="absolute top-4 right-4 z-10 cursor-pointer rounded-lg border border-white/25 bg-black/60 px-4 py-2 text-xs text-white backdrop-blur-sm transition-colors hover:bg-black/80"
        >
          {screenshotLabel}
        </button>
      )}

      <Canvas
        shadows
        dpr={[1, 2]}
        frameloop="demand"
        gl={{ preserveDrawingBuffer: true }}
        onCreated={({ gl, scene, camera }) => {
          rendererRef.current = gl
          sceneRef.current = scene
          cameraRef.current = camera
          gl.setClearColor('#000000', 1)
          scene.background = new THREE.Color('#000000')
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.outputColorSpace = THREE.SRGBColorSpace
        }}
        camera={{ fov: 38, position: [0, 0, camZ], near: 0.01, far: 100 }}
        style={{
          width: '100%',
          height: '100%',
          touchAction: isTouch && enableManualRotation ? 'none' : 'pan-y',
          background: '#000000',
        }}
      >
        {environmentPreset !== 'none' && (
          <Environment
            preset={environmentPreset as Exclude<typeof environmentPreset, 'none'>}
            background={false}
          />
        )}

        <ambientLight intensity={ambientIntensity} />
        <directionalLight position={[5, 5, 5]} intensity={keyLightIntensity} castShadow />
        <directionalLight position={[-5, 2, 5]} intensity={fillLightIntensity} />
        <directionalLight position={[0, 4, -5]} intensity={rimLightIntensity} />

        <ContactShadows
          ref={contactRef}
          position={[0, -0.5, 0]}
          opacity={0.35}
          scale={10}
          blur={2}
        />

        <Suspense fallback={<Loader placeholderSrc={placeholderSrc} />}>
          <ModelInner
            url={url}
            xOff={modelXOffset}
            yOff={modelYOffset}
            pivot={pivot}
            initYaw={initYaw}
            initPitch={initPitch}
            minZoom={minZoomDistance}
            maxZoom={maxZoomDistance}
            enableMouseParallax={enableMouseParallax}
            enableManualRotation={enableManualRotation}
            enableHoverRotation={enableHoverRotation}
            enableManualZoom={enableManualZoom}
            autoFrame={autoFrame}
            framePadding={framePadding}
            modelScale={modelScale}
            fadeIn={fadeIn}
            autoRotate={autoRotate}
            autoRotateSpeed={autoRotateSpeed}
            onLoaded={onModelLoaded}
          />
        </Suspense>

        {!isTouch && (
          <DesktopControls
            pivot={pivot}
            min={minZoomDistance}
            max={maxZoomDistance}
            zoomEnabled={zoomEnabled}
          />
        )}
      </Canvas>
    </div>
  )
}

export default ModelViewer
