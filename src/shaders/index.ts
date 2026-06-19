// Nebula vertex shader
export const nebulaVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Nebula fragment shader — volumetric cloud feel
export const nebulaFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  varying vec2 vUv;
  varying vec3 vPosition;

  // Simple hash
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  // 2D noise
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

  // Fractal Brownian Motion
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv - 0.5;
    float dist = length(uv);

    // Animated noise
    vec2 animUv = uv + uTime * 0.02;
    float n1 = fbm(animUv * 2.0);
    float n2 = fbm(animUv * 3.0 + vec2(5.2, 1.3));

    float nebula = fbm(uv * 2.0 + vec2(n1, n2));

    // Color mix: deep blue → purple → slight teal
    vec3 color1 = vec3(0.05, 0.05, 0.3);   // deep blue
    vec3 color2 = vec3(0.2, 0.0, 0.4);     // purple
    vec3 color3 = vec3(0.0, 0.1, 0.25);    // teal dark
    vec3 color4 = vec3(0.4, 0.1, 0.5);     // violet bright

    vec3 col = mix(color1, color2, nebula);
    col = mix(col, color3, n1 * 0.5);
    col = mix(col, color4, n2 * nebula * 0.3);

    // Edge fade
    float edge = 1.0 - smoothstep(0.3, 0.5, dist);
    float alpha = nebula * edge * uOpacity * 0.7;

    gl_FragColor = vec4(col, alpha);
  }
`;

// Black hole accretion disk shader
export const blackHoleVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying float vAngle;

  void main() {
    vUv = uv;
    vAngle = atan(position.y, position.x);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const blackHoleFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  varying vec2 vUv;
  varying float vAngle;

  void main() {
    vec2 uv = vUv - 0.5;
    float dist = length(uv);

    // Swirling disk
    float angle = atan(uv.y, uv.x) + uTime * 0.5;
    float swirl = sin(angle * 8.0 + dist * 20.0 - uTime * 3.0) * 0.5 + 0.5;

    // Ring shape
    float ring = smoothstep(0.25, 0.28, dist) * (1.0 - smoothstep(0.42, 0.48, dist));

    // Color: orange → yellow → white hot
    vec3 outer = vec3(0.8, 0.3, 0.0);
    vec3 inner = vec3(1.0, 0.9, 0.5);
    vec3 col = mix(outer, inner, swirl);

    float alpha = ring * swirl * uOpacity;
    gl_FragColor = vec4(col, alpha);
  }
`;

// Planet surface shader (generic, customized per planet via uniforms)
export const planetVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const planetFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uGlowColor;
  uniform float uGlowStrength;

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

  void main() {
    // Surface texture
    float n = noise(vUv * 5.0 + uTime * 0.05);
    vec3 surfaceColor = mix(uColor * 0.6, uColor, n);

    // Fresnel edge glow
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);
    vec3 glow = uGlowColor * fresnel * uGlowStrength;

    // Fake lighting
    vec3 lightDir = normalize(vec3(1.0, 1.0, 0.5));
    float diff = max(dot(vNormal, lightDir), 0.0) * 0.7 + 0.3;

    vec3 finalColor = surfaceColor * diff + glow;
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
