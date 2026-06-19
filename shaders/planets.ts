// ─── Saturn Ring Planet ───────────────────────────────────────────────────────
export const saturnRingVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying float vDist;
  void main() {
    vUv = uv;
    vDist = length(position.xy);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
export const saturnRingFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3  uColor;
  uniform float uOpacity;
  varying vec2  vUv;
  varying float vDist;
  void main() {
    float ring  = smoothstep(1.3,1.35,vDist) * (1.0-smoothstep(2.2,2.25,vDist));
    float bands = sin(vDist*18.0 - uTime*0.3)*0.5+0.5;
    vec3  col   = mix(uColor*0.4, uColor, bands);
    float alpha = ring * bands * uOpacity;
    gl_FragColor = vec4(col, alpha);
  }
`;

// ─── Crystal Planet ───────────────────────────────────────────────────────────
export const crystalVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPos    = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
export const crystalFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3  uColor;
  varying vec3  vNormal;
  varying vec3  vPos;
  void main() {
    // Faceted shimmer
    float facet  = abs(sin(dot(vNormal, vec3(1.0,1.0,0.0))*8.0 + uTime*0.5));
    float shine  = pow(max(dot(vNormal, normalize(vec3(1.0,1.5,0.5))),0.0),6.0);
    vec3  base   = mix(uColor*0.3, uColor*1.4, facet);
    base        += vec3(1.0)*shine*0.8;
    float alpha  = 0.92;
    gl_FragColor = vec4(base, alpha);
  }
`;

// ─── Gas Giant ────────────────────────────────────────────────────────────────
export const gasGiantVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv    = uv;
    vNormal= normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
export const gasGiantFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3  uColor;
  varying vec2  vUv;
  varying vec3  vNormal;

  float hash(float n){ return fract(sin(n)*43758.5453); }
  float noise(vec2 p){
    vec2 i=floor(p); vec2 f=fract(p);
    f=f*f*(3.0-2.0*f);
    return mix(mix(hash(i.x+i.y*57.0),hash(i.x+1.0+i.y*57.0),f.x),
               mix(hash(i.x+(i.y+1.0)*57.0),hash(i.x+1.0+(i.y+1.0)*57.0),f.x),f.y);
  }
  void main() {
    // Horizontal bands
    float band  = sin(vUv.y*12.0 + uTime*0.15)*0.5+0.5;
    float turb  = noise(vec2(vUv.x*4.0+uTime*0.05, vUv.y*8.0))*0.25;
    float stripe= smoothstep(0.35,0.65, band+turb);
    vec3  col1  = uColor;
    vec3  col2  = uColor*0.4 + vec3(0.05,0.05,0.15);
    vec3  col   = mix(col1,col2,stripe);
    // Storm spot
    vec2  spot  = vUv - vec2(0.35, 0.48);
    float storm = 1.0-smoothstep(0.0,0.08,length(spot));
    col        += vec3(0.9,0.6,0.1)*storm*0.6;
    // Fresnel
    vec3  view  = normalize(cameraPosition - vec3(0.0));
    float fres  = pow(1.0-max(dot(vNormal,view),0.0),2.5);
    col        += uColor*fres*0.5;
    gl_FragColor = vec4(col,1.0);
  }
`;

// ─── Rocky Planet ─────────────────────────────────────────────────────────────
export const rockyVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv    = uv;
    vNormal= normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
export const rockyFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3  uColor;
  varying vec2  vUv;
  varying vec3  vNormal;

  float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
  float noise(vec2 p){
    vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }
  float fbm(vec2 p){ float v=0.0,a=0.5; for(int i=0;i<4;i++){v+=a*noise(p);p*=2.0;a*=0.5;} return v; }

  void main() {
    float n   = fbm(vUv*5.0);
    float crat= smoothstep(0.62,0.7,noise(vUv*12.0));
    vec3  col = mix(uColor*0.5, uColor, n);
    col       = mix(col, vec3(0.15,0.08,0.05), crat*0.8);
    float diff= max(dot(vNormal, normalize(vec3(1.0,1.0,0.5))),0.0)*0.7+0.3;
    col      *= diff;
    gl_FragColor = vec4(col,1.0);
  }
`;

// ─── Golden Planet ────────────────────────────────────────────────────────────
export const goldenVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPos    = (modelMatrix * vec4(position,1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
export const goldenFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3  uColor;
  varying vec3  vNormal;
  varying vec3  vPos;
  void main() {
    vec3  light = normalize(vec3(1.0,1.5,0.8));
    float diff  = max(dot(vNormal,light),0.0);
    float spec  = pow(max(dot(reflect(-light,vNormal),normalize(vec3(0,0,1))),0.0),32.0);
    float pulse = sin(uTime*1.8)*0.08+0.92;
    vec3  gold  = vec3(1.0,0.75,0.1)*uColor*2.0;
    vec3  col   = gold*(diff*0.8+0.2)*pulse + vec3(1.0,0.95,0.7)*spec*0.9;
    gl_FragColor = vec4(col,1.0);
  }
`;

// ─── Moon-System (Documentation) ─────────────────────────────────────────────
export const moonSystemVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec2 vUv;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
export const moonSystemFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3  uColor;
  varying vec3  vNormal;
  varying vec2  vUv;

  float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
  float noise(vec2 p){
    vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }
  void main() {
    float n    = noise(vUv*8.0)*0.5 + noise(vUv*16.0)*0.25;
    float crat = smoothstep(0.6,0.68,noise(vUv*14.0+0.5));
    vec3  col  = mix(vec3(0.55,0.55,0.6), vec3(0.85,0.85,0.9), n);
    col        = mix(col, vec3(0.3,0.3,0.35), crat);
    float diff = max(dot(vNormal,normalize(vec3(1.0,1.0,0.3))),0.0)*0.75+0.25;
    col       *= diff;
    gl_FragColor = vec4(col,1.0);
  }
`;

// ─── Orbit trail particle shader ──────────────────────────────────────────────
export const orbitTrailVertexShader = /* glsl */ `
  attribute float aProgress;
  attribute float aSize;
  varying   float vProgress;
  void main() {
    vProgress   = aProgress;
    vec4 mvPos  = modelViewMatrix * vec4(position,1.0);
    gl_PointSize= aSize * (200.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
  }
`;
export const orbitTrailFragmentShader = /* glsl */ `
  uniform vec3  uColor;
  uniform float uTime;
  varying float vProgress;
  void main() {
    float d     = length(gl_PointCoord - 0.5)*2.0;
    float circle= 1.0-smoothstep(0.5,1.0,d);
    float fade  = pow(vProgress, 0.5);          // bright at head, dim at tail
    float alpha = circle * fade * 0.55;
    gl_FragColor= vec4(uColor, alpha);
  }
`;
