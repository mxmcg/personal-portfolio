export const vertexShader = `#version 300 es
in vec2 p;
out vec2 uv;
void main() {
  uv = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}
`;

export const simShader = `#version 300 es
precision highp float;
in vec2 uv;
out vec4 o;
uniform sampler2D s;
uniform vec2 px;
uniform vec3 drop;
uniform float aspect;
void main() {
  vec2 c = texture(s, uv).rg;
  float avg = (
    texture(s, uv + vec2(px.x, 0.0)).r +
    texture(s, uv - vec2(px.x, 0.0)).r +
    texture(s, uv + vec2(0.0, px.y)).r +
    texture(s, uv - vec2(0.0, px.y)).r
  ) * 0.5;
  float h = (avg - c.g) * 0.992;
  vec2 d = (uv - drop.xy) * vec2(aspect, 1.0);
  h += drop.z * exp(-dot(d, d) * 9000.0);
  o = vec4(h, c.r, 0.0, 1.0);
}
`;

export const drawShader = `#version 300 es
precision highp float;
in vec2 uv;
out vec4 o;
uniform sampler2D s;
uniform vec2 px;
uniform float t;
uniform float aspect;
uniform float glow;
uniform float sunY;
uniform vec3 top;
uniform vec3 bot;
uniform vec3 sun;
uniform vec3 line;
uniform vec3 sky1;
uniform vec3 sky2;
uniform vec3 streak;
uniform float ringK;
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
void main() {
  float hz = 0.30;
  float h = texture(s, uv).r;
  float hx = texture(s, uv + vec2(px.x, 0.0)).r - texture(s, uv - vec2(px.x, 0.0)).r;
  float hy = texture(s, uv + vec2(0.0, px.y)).r - texture(s, uv - vec2(0.0, px.y)).r;
  vec2 r = uv + vec2(hx, hy) * 0.28;
  float y = 1.0 - r.y;
  float aa = fwidth(y) * 1.2;
  vec2 sp = vec2(0.70, hz - sunY * 0.35);
  vec3 col;
  float y0 = 1.0 - uv.y;
  if (y0 < hz) {
    r = uv;
    y = y0;
    float q = floor((y / hz) * 4.0) / 3.0;
    col = mix(sky1, sky2, q);
    vec2 d = (vec2(r.x, y) - sp) * vec2(aspect, 1.0);
    float dist = length(d);
    col = mix(col, mix(col, sun, 0.35), 1.0 - smoothstep(0.10, 0.10 + aa, dist));
    col = mix(col, sun, 1.0 - smoothstep(0.06, 0.06 + aa, dist));
  } else {
    float wy = (y - hz) / (1.0 - hz);
    float q = floor(wy * 5.0) / 4.0;
    col = mix(top, bot, q);
    float sx = abs(r.x - sp.x) * aspect;
    float width = 0.022 + wy * 0.07;
    float dash = step(0.45, fract(wy * 14.0 - t * 0.25 + sin(r.x * 40.0) * 0.15));
    float sk = (1.0 - smoothstep(width - aa * 2.0, width, sx + (1.0 - dash) * 0.06)) * (1.0 - wy * 0.55);
    col = mix(col, streak, sk * 0.7 * glow);
    for (int i = 0; i < 5; i++) {
      float fi = float(i);
      float base = hz + 0.07 + fi * 0.13 + fi * fi * 0.012;
      float ly = base
        + sin(r.x * aspect * 4.0 + t * (0.4 + fi * 0.07) + fi * 1.9) * 0.010
        + sin(r.x * aspect * 9.0 - t * 0.3 + fi) * 0.004;
      float len = step(0.25, fract(r.x * (1.6 + fi * 0.4) + fi * 0.37 + t * 0.01));
      col = mix(col, line, (1.0 - smoothstep(0.0, aa * 0.9, abs(y - ly))) * len * 0.55);
    }
    float fw = max(fwidth(h), 0.00001) * 1.0;
    float ring = 1.0 - smoothstep(0.0, fw, abs(h - 0.016));
    ring += (ringK > 20.0 ? 1.0 : 0.0) * (1.0 - smoothstep(0.0, fw, abs(h - 0.045))) * 0.7;
    col = mix(col, line, ring * 0.6);
    vec2 cell = floor(vec2(r.x * aspect, y) * vec2(26.0, 40.0));
    float hsh = hash(cell);
    vec2 f = fract(vec2(r.x * aspect, y) * vec2(26.0, 40.0)) - 0.5;
    float tw = 0.5 + 0.5 * sin(t * 1.6 + hsh * 40.0);
    float star = max(0.0, 1.0 - length(f * vec2(1.0, 3.0)) * 3.0)
      + max(0.0, 1.0 - length(f * vec2(3.0, 1.0)) * 3.0);
    float g = step(0.965, hsh) * star * tw * (1.0 - smoothstep(0.05, 0.45, sx)) * (1.0 - wy * 0.6);
    col = mix(col, vec3(1.0, 0.97, 0.9), clamp(g, 0.0, 1.0) * 0.8);
  }
  col += (hash(uv * vec2(913.0, 577.0) + fract(t * 3.0)) - 0.5) * 0.045;
  o = vec4(col, 1.0);
}
`;
