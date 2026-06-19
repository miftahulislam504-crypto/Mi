// Universe cluster core glow shader
export const universeVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const universeFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uPulse;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv - 0.5;
    float dist = length(uv);

    // Animated nebula pattern
    float n = fbm(uv * 3.0 + uTime * 0.08);
    float n2 = fbm(uv * 5.0 - uTime * 0.05 + 1.5);

    // Core brightness with pulse
    float core = exp(-dist * 3.5) * (0.8 + uPulse * 0.2);

    // Soft cloud shell
    float cloud = (1.0 - smoothstep(0.1, 0.5, dist)) * n * 0.6;

    // Edge haze
    float haze = (1.0 - smoothstep(0.3, 0.55, dist)) * n2 * 0.3;

    float brightness = core + cloud + haze;

    // Color: base + bright highlight at center
    vec3 col = uColor * brightness;
    col += vec3(1.0) * core * 0.3; // white hot center

    float alpha = brightness * uOpacity;
    alpha = clamp(alpha, 0.0, 0.95);

    gl_FragColor = vec4(col, alpha);
  }
`;

// Connection line between universes — animated energy flow
export const connectionVertexShader = /* glsl */ `
  attribute float lineProgress;
  varying float vProgress;
  varying float vLineProgress;

  void main() {
    vProgress = lineProgress;
    vLineProgress = lineProgress;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const connectionFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;

  varying float vProgress;

  void main() {
    // Animated energy pulse along the line
    float pulse = sin(vProgress * 12.0 - uTime * 3.0) * 0.5 + 0.5;
    float glow = smoothstep(0.0, 0.3, vProgress) * smoothstep(1.0, 0.7, vProgress);

    vec3 col = uColor * (0.4 + pulse * 0.6);
    float alpha = glow * (0.3 + pulse * 0.4) * uOpacity;

    gl_FragColor = vec4(col, alpha);
  }
`;

// Orbit ring shader — faint glowing orbit path
export const orbitRingVertexShader = /* glsl */ `
  attribute float angle;
  varying float vAngle;

  void main() {
    vAngle = angle;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const orbitRingFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;

  varying float vAngle;

  void main() {
    // Subtle shimmer along the orbit
    float shimmer = sin(vAngle * 8.0 - uTime * 1.5) * 0.5 + 0.5;
    float alpha = (0.08 + shimmer * 0.06) * uOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`;
