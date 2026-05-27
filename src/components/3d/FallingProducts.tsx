import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, RoundedBox } from '@react-three/drei'
import type { Group, Mesh } from 'three'

type ProductShape = 'browser' | 'phone' | 'cube' | 'ring'

/** Una pieza 3D que cae y flota en el lateral */
function FloatingProduct({
  position,
  shape,
  color,
  speed,
  side,
}: {
  position: [number, number, number]
  shape: ProductShape
  color: string
  speed: number
  side: 'left' | 'right'
}) {
  const groupRef = useRef<Group>(null)
  const offset = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime * speed + offset
    // Caída suave con oscilación lateral según el lado de la pantalla
    groupRef.current.position.y =
      position[1] - ((t * 0.4) % 14) + 7
    groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.3
    groupRef.current.rotation.z =
      (side === 'left' ? 1 : -1) * (0.4 + Math.sin(t * 0.3) * 0.2)
  })

  return (
    <group ref={groupRef} position={position}>
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
        {shape === 'browser' && <BrowserMockup color={color} />}
        {shape === 'phone' && <PhoneMockup color={color} />}
        {shape === 'cube' && <GlossyCube color={color} />}
        {shape === 'ring' && <GlossyRing color={color} />}
      </Float>
    </group>
  )
}

/** Mockup de ventana de navegador */
function BrowserMockup({ color }: { color: string }) {
  return (
    <group scale={0.55}>
      <RoundedBox args={[2.2, 1.4, 0.08]} radius={0.04} smoothness={4}>
        <meshStandardMaterial color="#1a1f2e" metalness={0.6} roughness={0.3} />
      </RoundedBox>
      <mesh position={[0, 0.52, 0.05]}>
        <boxGeometry args={[2.1, 0.12, 0.02]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, -0.1, 0.06]}>
        <planeGeometry args={[1.8, 0.9]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.15} />
      </mesh>
    </group>
  )
}

/** Mockup de teléfono */
function PhoneMockup({ color }: { color: string }) {
  return (
    <group scale={0.5} rotation={[0.2, 0.5, 0]}>
      <RoundedBox args={[0.7, 1.4, 0.1]} radius={0.08} smoothness={4}>
        <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.2} />
      </RoundedBox>
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[0.58, 1.1]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} />
      </mesh>
    </group>
  )
}

/** Cubo con material distorsionado */
function GlossyCube({ color }: { color: string }) {
  const meshRef = useRef<Mesh>(null)
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.4
  })
  return (
    <mesh ref={meshRef} scale={0.45}>
      <boxGeometry args={[1, 1, 1]} />
      <MeshDistortMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.2}
        metalness={0.9}
        roughness={0.1}
        distort={0.25}
        speed={2}
      />
    </mesh>
  )
}

/** Anillo toroidal brillante */
function GlossyRing({ color }: { color: string }) {
  const meshRef = useRef<Mesh>(null)
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.x += delta * 0.5
  })
  return (
    <mesh ref={meshRef} scale={0.5}>
      <torusGeometry args={[0.8, 0.22, 16, 48]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        metalness={1}
        roughness={0.1}
      />
    </mesh>
  )
}

/** Escena 3D lateral con productos cayendo */
function SideScene({ side }: { side: 'left' | 'right' }) {
  const xBase = side === 'left' ? -3.5 : 3.5
  const products = useMemo(
    () =>
      [
        { shape: 'browser' as const, y: 4, z: 0, color: '#22d3ee', speed: 0.5 },
        { shape: 'phone' as const, y: 1, z: -1, color: '#a78bfa', speed: 0.65 },
        { shape: 'cube' as const, y: -2, z: 0.5, color: '#38bdf8', speed: 0.55 },
        { shape: 'ring' as const, y: 6, z: -0.5, color: '#f472b6', speed: 0.45 },
        { shape: 'browser' as const, y: -5, z: -0.8, color: '#34d399', speed: 0.7 },
      ].map((p, i) => ({
        ...p,
        position: [xBase + (i % 2) * 0.6, p.y, p.z] as [number, number, number],
      })),
    [xBase],
  )

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[xBase, 5, 4]} intensity={1.2} color="#22d3ee" />
      <pointLight position={[xBase, -3, 2]} intensity={0.6} color="#a78bfa" />
      {products.map((p, i) => (
        <FloatingProduct
          key={`${side}-${i}`}
          position={p.position}
          shape={p.shape}
          color={p.color}
          speed={p.speed}
          side={side}
        />
      ))}
    </>
  )
}

type FallingProductsProps = {
  side: 'left' | 'right'
  className?: string
}

/**
 * Canvas 3D en los laterales del hero — productos digitales en caída perpetua
 */
export function FallingProducts({ side, className }: FallingProductsProps) {
  return (
    <div className={className} aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <SideScene side={side} />
        </Suspense>
      </Canvas>
    </div>
  )
}
