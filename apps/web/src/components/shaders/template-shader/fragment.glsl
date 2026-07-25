precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse; // world-space offset of the main drop (springed in JS)

float t;
vec3 b1, b2, b3, b4;
float r1, r2, r3, r4;

// Polynomial smooth-min — the surface-tension neck between drops.
// Small k keeps drops spherical until they actually touch.
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float w(vec3 p) {
  float d1 = length(p - b1) - r1;
  float d2 = length(p - b2) - r2;
  float d3 = length(p - b3) - r3;
  float d4 = length(p - b4) - r4;
  return smin(smin(d1, d2, 0.35), smin(d3, d4, 0.35), 0.35);
}

// Tetrahedral normals — tighter eps than before, kills faceting.
vec3 wn(vec3 p) {
  vec2 e = vec2(0.0008, -0.0008);
  return normalize(
    e.xyy * w(p + e.xyy) +
    e.yyx * w(p + e.yyx) +
    e.yxy * w(p + e.yxy) +
    e.xxx * w(p + e.xxx)
  );
}

// Hash for blue-noise dithering (kills gradient banding).
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

/* -----------------------------------------------------------------
   Studio environment — what the mercury mirrors.

   Real chrome drops show a dark floor, a graphite gradient wall and
   a few elongated softbox bars. Bars are gaussians in R.y (vertical
   falloff) windowed by azimuth, so reflections read as soft
   rectangles — not the harsh pow() dots of the old version.
   ----------------------------------------------------------------- */
float bar(vec3 R, float yCenter, float yWidth, float azCenter, float azWidth) {
  float az = atan(R.z, R.x);
  // wrap azimuth distance
  float dAz = abs(mod(az - azCenter + 3.14159265, 6.2831853) - 3.14159265);
  float vert = exp(-pow((R.y - yCenter) / yWidth, 2.0));
  float horiz = smoothstep(azWidth, azWidth * 0.35, dAz);
  return vert * horiz;
}

vec3 studioEnv(vec3 R) {
  // base room: velvet floor -> graphite wall -> dim ceiling
  vec3 room = mix(
    vec3(0.010, 0.010, 0.012),
    vec3(0.34, 0.35, 0.38),
    smoothstep(-1.0, 1.0, R.y)
  );
  // faint cool ceiling sheen
  room += vec3(0.05, 0.055, 0.06) * smoothstep(0.35, 1.0, R.y);

  // key softbox — big, bright, upper left
  float key = bar(R, 0.62, 0.20, 2.35, 1.10);
  room += vec3(3.4, 3.42, 3.48) * key;

  // fill softbox — dimmer, lower right
  float fill = bar(R, 0.18, 0.30, -0.55, 0.85);
  room += vec3(0.55, 0.57, 0.60) * fill;

  // rim strip — thin bright line just above the horizon, behind
  float rim = bar(R, 0.06, 0.045, 3.14159265, 1.6);
  room += vec3(1.15, 1.16, 1.20) * rim;

  // floor bounce — wide soft lift under the key side
  float bounce = bar(R, -0.55, 0.35, 2.2, 1.4);
  room += vec3(0.10, 0.10, 0.105) * bounce;

  return room;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;

  t = mod(uTime, 628.31853); // 100 turns of 2*PI, no precision loss

  /* --- Drop kinematics -------------------------------------------------
     One main drop: slow lissajous drift + JS-driven mouse offset.
     Three satellites orbit at different radii/speeds — they periodically
     approach the main drop and merge (smin does the surface-tension neck),
     then detach again. High surface tension = spheres stay round. */
  float p = t * 0.22;

  // Push the drop cluster to the right on wide screens so the hero
  // text (left half) never covers it. Portrait keeps it centered.
  float aspect = uResolution.x / uResolution.y;
  // world half-width at the drop plane (focal 1.65, camera z 6.2)
  float halfW = aspect * (0.5 / 1.65) * 6.2;
  // wide screens: push the cluster to the right-zone center (~58% of
  // half-width). Portrait fades the shift out and keeps it centered.
  // hug the right edge as far as possible without window-cropping —
  // r1 (1.58) + margin = the max offset before the drop exits frame
  float side = clamp((aspect - 1.05) * 4.0, 0.0, 1.0) * (halfW - 1.62);

  vec3 mainPos = vec3(
    sin(p * 0.9) * 0.15 + side,
    sin(p * 1.3) * 0.08 + sin(t * 1.1) * 0.02,
    cos(p * 0.7) * 0.18
  );
  b1 = mainPos + vec3(uMouse, 0.0);
  // breathing — surface tension settling, very subtle
  r1 = 1.58 * (1.0 + 0.015 * sin(t * 2.1) + 0.010 * sin(t * 3.7));

  float o1 = t * 0.35;
  b2 = mainPos + vec3(cos(o1) * 2.40, sin(o1 * 0.8) * 1.30, sin(o1) * 1.35);
  r2 = 0.50;

  float o2 = -t * 0.27 + 2.2;
  b3 = mainPos + vec3(cos(o2) * 2.00, cos(o2 * 1.1) * 1.10, sin(o2) * 1.20);
  r3 = 0.38;

  float o3 = t * 0.5 + 4.4;
  b4 = mainPos + vec3(cos(o3 * 0.8) * 2.65, sin(o3) * 1.40, cos(o3 * 1.2) * 1.10);
  r4 = 0.27;

  /* --- Camera: fixed, premium still-life framing --------------------- */
  vec3 O = vec3(0.0, 0.05, 6.2);
  vec3 at = vec3(0.0, 0.0, 0.0);
  vec3 Z = normalize(O - at);
  vec3 X = normalize(cross(vec3(0.0, 1.0, 0.0), Z));
  vec3 Y = cross(Z, X);
  vec3 D = mat3(X, Y, Z) * normalize(vec3(uv, -1.65));

  /* --- Raymarch ------------------------------------------------------ */
  float L = 50.0;
  float l = 0.0;
  float minDist = 1e5;
  bool hit = false;
  float pixelSize = 1.0 / uResolution.y;

  for (int i = 0; i < 64; ++i) {
    vec3 pos = O + D * l;
    float d = w(pos);
    minDist = min(minDist, d / (l * pixelSize + 1e-4));
    if (d < 0.0006 * l) { hit = true; break; }
    l += d;
    if (l > L) break;
  }

  // edge AA: partial coverage from closest approach
  float edgeAlpha = clamp(1.0 - (minDist - 0.5) / 1.5, 0.0, 1.0);
  // dither the threshold — no hard AA staircase, no banding
  edgeAlpha = clamp(edgeAlpha + (hash(gl_FragCoord.xy) - 0.5) * 0.06, 0.0, 1.0);

  if (!hit && edgeAlpha <= 0.0) {
    gl_FragColor = vec4(0.0);
    return;
  }

  /* --- Mercury material ---------------------------------------------- */
  vec3 P = O + D * l;
  vec3 N = wn(P);

  // micro-wobble — the surface oscillation a real drop keeps after a
  // satellite merges. Tiny amplitude, horizontal bands, fades with time.
  float wob = 0.007 * (1.0 + 0.5 * sin(t * 0.9));
  N = normalize(N + wob * vec3(
    sin(P.y * 7.0 + t * 3.1),
    sin(P.x * 6.0 - t * 2.3) * 0.5,
    sin(P.z * 5.0 + t * 2.7)
  ));

  vec3 R = reflect(D, N);
  vec3 env = studioEnv(R);

  // Schlick fresnel — mercury F0 ≈ 0.7 (a near-perfect mirror even
  // face-on), rising to a mirror rim at grazing angles.
  float NdotV = clamp(dot(N, -D), 0.0, 1.0);
  float fresnel = 0.70 + 0.30 * pow(1.0 - NdotV, 5.0);

  // neutral silver, faintly cool at grazing (thin-film on the rim)
  vec3 tint = mix(vec3(0.97, 0.98, 1.00), vec3(0.91, 0.94, 1.02), pow(1.0 - NdotV, 2.0));

  vec3 color = env * tint * fresnel;

  // density gradient — the lower hemisphere of a real drop reads darker
  // (mirror of the velvet floor + light absorbed in the metal's depth)
  float under = smoothstep(0.2, -0.7, N.y);
  color *= 1.0 - under * 0.50;

  // filmic-ish soft shoulder instead of hard clip on the key bar
  color = color / (1.0 + 0.08 * color);

  // gamma
  color = pow(color, vec3(1.0 / 2.2));

  // final dither against gradient banding
  color += (hash(gl_FragCoord.xy + 0.5) - 0.5) / 255.0;

  gl_FragColor = vec4(color, edgeAlpha);
}
