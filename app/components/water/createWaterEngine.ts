import {
  beachById,
  beachCrossfadeMs,
  defaultBeachId,
  isBeachId,
  reefWater,
  type BeachId,
  type BeachMotion,
} from "@/content/beaches";
import { drawShader, simShader, vertexShader } from "./shaders";

export type WaterEngine = {
  addDrop: (nx: number, ny: number, amount: number) => void;
  render: () => void;
  start: () => void;
  stop: () => void;
  destroy: () => void;
};

type Vec3 = readonly [number, number, number];

type WaterTheme = {
  sky1: Vec3;
  sky2: Vec3;
  sun: Vec3;
  top: Vec3;
  bot: Vec3;
  line: Vec3;
  streak: Vec3;
  glow: number;
  sunY: number;
};

const THEMES: Record<"sunrise" | "sunset", WaterTheme> = {
  sunrise: {
    sky1: [0.99, 0.86, 0.74],
    sky2: [0.98, 0.74, 0.62],
    sun: [1, 0.95, 0.82],
    top: [0.47, 0.76, 0.76],
    bot: [0.13, 0.38, 0.44],
    line: [0.86, 0.97, 0.94],
    streak: [1, 0.86, 0.68],
    glow: 0.8,
    sunY: 0.55,
  },
  sunset: {
    sky1: [0.12, 0.16, 0.32],
    sky2: [0.98, 0.58, 0.24],
    sun: [1, 0.84, 0.45],
    top: [0.3, 0.3, 0.46],
    bot: [0.07, 0.09, 0.2],
    line: [1, 0.78, 0.52],
    streak: [1, 0.7, 0.3],
    glow: 1,
    sunY: 0.22,
  },
};

function themeName(): "sunrise" | "sunset" {
  return document.documentElement.dataset.theme === "sunset"
    ? "sunset"
    : "sunrise";
}

function beachId(): BeachId {
  const value = document.documentElement.dataset.beach;
  return isBeachId(value) ? value : defaultBeachId;
}

function motionOf(id: BeachId): BeachMotion {
  const beach = beachById(id);
  return {
    slope: beach.slope,
    gap: beach.gap,
    peel: beach.peel,
    tint: beach.tint,
  };
}

function mix(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

function mixColor(from: Vec3, to: Vec3, amount: number): Vec3 {
  return [
    mix(from[0], to[0], amount),
    mix(from[1], to[1], amount),
    mix(from[2], to[2], amount),
  ];
}

function createBeachBlend(reducedMotion: boolean) {
  let id = beachId();
  let from = motionOf(id);
  let to = motionOf(id);
  let started = 0;

  function sample(): BeachMotion {
    const next = beachId();
    const now = performance.now();
    if (next !== id) {
      const elapsed = Math.min(1, (now - started) / beachCrossfadeMs);
      const eased = elapsed * elapsed * (3 - 2 * elapsed);
      from = {
        slope: mix(from.slope, to.slope, eased),
        gap: mix(from.gap, to.gap, eased),
        peel: mix(from.peel, to.peel, eased),
        tint: mix(from.tint, to.tint, eased),
      };
      to = motionOf(next);
      started = now;
      id = next;
      if (reducedMotion) from = to;
    }
    const elapsed = reducedMotion
      ? 1
      : Math.min(1, (now - started) / beachCrossfadeMs);
    const eased = elapsed * elapsed * (3 - 2 * elapsed);
    return {
      slope: mix(from.slope, to.slope, eased),
      gap: mix(from.gap, to.gap, eased),
      peel: mix(from.peel, to.peel, eased),
      tint: mix(from.tint, to.tint, eased),
    };
  }

  function paint(theme: WaterTheme) {
    const beach = sample();
    const reef = reefWater[themeName()];
    const amount = beach.tint * 0.75;
    return {
      ...theme,
      top: mixColor(theme.top, reef.top, amount),
      bot: mixColor(theme.bot, reef.bot, amount),
      slope: beach.slope,
      gap: beach.gap,
      peel: beach.peel,
    };
  }

  return { paint };
}

function pixelRatio() {
  return Math.min(window.devicePixelRatio || 1, 2);
}

function compile(
  gl: WebGL2RenderingContext,
  type: number,
  source: string
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Could not create shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) ?? "Shader compile failed";
    gl.deleteShader(shader);
    throw new Error(log);
  }
  return shader;
}

function linkProgram(
  gl: WebGL2RenderingContext,
  vertex: WebGLShader,
  fragmentSource: string
): WebGLProgram {
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!program) throw new Error("Could not create program");
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.bindAttribLocation(program, 0, "p");
  gl.linkProgram(program);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) ?? "Program link failed";
    gl.deleteProgram(program);
    throw new Error(log);
  }
  return program;
}

function supportsFloatRipples(): boolean {
  const probe = document.createElement("canvas");
  const gl = probe.getContext("webgl2");
  if (!gl) return false;

  let ok = false;
  try {
    if (!gl.getExtension("EXT_color_buffer_float")) return false;
    const vertex = compile(gl, gl.VERTEX_SHADER, vertexShader);
    const sim = linkProgram(gl, vertex, simShader);
    const draw = linkProgram(gl, vertex, drawShader);
    gl.deleteShader(vertex);
    gl.deleteProgram(sim);
    gl.deleteProgram(draw);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RG16F,
      4,
      4,
      0,
      gl.RG,
      gl.HALF_FLOAT,
      null
    );
    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0
    );
    ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.deleteFramebuffer(framebuffer);
    gl.deleteTexture(texture);
  } catch {
    ok = false;
  } finally {
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
  return ok;
}

function createWebGLWater(
  canvas: HTMLCanvasElement,
  reducedMotion: boolean
): WaterEngine {
  const maybeGl = canvas.getContext("webgl2", {
    antialias: false,
    premultipliedAlpha: false,
    alpha: true,
  });
  if (!maybeGl || !maybeGl.getExtension("EXT_color_buffer_float")) {
    throw new Error("WebGL2 float buffers are unavailable");
  }
  const gl: WebGL2RenderingContext = maybeGl;

  const vertex = compile(gl, gl.VERTEX_SHADER, vertexShader);
  const sim = linkProgram(gl, vertex, simShader);
  const draw = linkProgram(gl, vertex, drawShader);
  gl.deleteShader(vertex);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const simPx = gl.getUniformLocation(sim, "px");
  const simDrop = gl.getUniformLocation(sim, "drop");
  const simAspect = gl.getUniformLocation(sim, "aspect");
  const drawPx = gl.getUniformLocation(draw, "px");
  const drawT = gl.getUniformLocation(draw, "t");
  const drawAspect = gl.getUniformLocation(draw, "aspect");
  const drawGlow = gl.getUniformLocation(draw, "glow");
  const drawRingK = gl.getUniformLocation(draw, "ringK");
  const drawSunY = gl.getUniformLocation(draw, "sunY");
  const drawSlope = gl.getUniformLocation(draw, "slope");
  const drawGap = gl.getUniformLocation(draw, "gap");
  const drawPeel = gl.getUniformLocation(draw, "peel");
  const blend = createBeachBlend(reducedMotion);
  const drawVecs = {
    top: gl.getUniformLocation(draw, "top"),
    bot: gl.getUniformLocation(draw, "bot"),
    sun: gl.getUniformLocation(draw, "sun"),
    line: gl.getUniformLocation(draw, "line"),
    sky1: gl.getUniformLocation(draw, "sky1"),
    sky2: gl.getUniformLocation(draw, "sky2"),
    streak: gl.getUniformLocation(draw, "streak"),
  } as const;

  let simW = 0;
  let simH = 0;
  let viewW = 1;
  let viewH = 1;
  const textures: WebGLTexture[] = [];
  const framebuffers: WebGLFramebuffer[] = [];
  let current = 0;
  const drops: Array<[number, number, number]> = [];
  let time = 0;
  let raf = 0;
  let running = false;

  function isSmall() {
    return canvas.clientWidth < 640;
  }

  function bindGeometry() {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  }

  function makeTargets() {
    textures.forEach((texture) => gl.deleteTexture(texture));
    framebuffers.forEach((framebuffer) => gl.deleteFramebuffer(framebuffer));
    textures.length = 0;
    framebuffers.length = 0;

    for (let index = 0; index < 2; index += 1) {
      const texture = gl.createTexture();
      if (!texture) throw new Error("Could not create ripple texture");
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RG16F,
        simW,
        simH,
        0,
        gl.RG,
        gl.HALF_FLOAT,
        null
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      const framebuffer = gl.createFramebuffer();
      if (!framebuffer) throw new Error("Could not create framebuffer");
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0
      );
      gl.viewport(0, 0, simW, simH);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      textures.push(texture);
      framebuffers.push(framebuffer);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  function resize() {
    const ratio = pixelRatio();
    const rect = canvas.getBoundingClientRect();
    const cssW = Math.max(1, rect.width);
    const cssH = Math.max(1, rect.height);
    const nextW = Math.round(cssW * ratio);
    const nextH = Math.round(cssH * ratio);
    if (canvas.width !== nextW || canvas.height !== nextH) {
      canvas.width = nextW;
      canvas.height = nextH;
    }
    viewW = nextW;
    viewH = nextH;
    const nextSimW = Math.max(2, Math.round(cssW * 0.5));
    const nextSimH = Math.max(2, Math.round(cssH * 0.5));
    if (nextSimW !== simW || nextSimH !== simH) {
      simW = nextSimW;
      simH = nextSimH;
      makeTargets();
    }
    bindGeometry();
  }

  function step() {
    const drop = drops.shift() ?? [0, 0, 0];
    bindGeometry();
    gl.useProgram(sim);
    gl.viewport(0, 0, simW, simH);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[1 - current]);
    gl.bindTexture(gl.TEXTURE_2D, textures[current]);
    gl.uniform2f(simPx, 1 / simW, 1 / simH);
    gl.uniform3f(simDrop, drop[0], drop[1], drop[2]);
    gl.uniform1f(simAspect, simW / simH);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    current = 1 - current;
  }

  function render() {
    if (simW === 0) resize();
    const theme = blend.paint(THEMES[themeName()]);
    bindGeometry();
    gl.useProgram(draw);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, viewW, viewH);
    gl.bindTexture(gl.TEXTURE_2D, textures[current]);
    gl.uniform2f(drawPx, 1 / simW, 1 / simH);
    gl.uniform1f(drawT, time);
    gl.uniform1f(drawAspect, viewW / viewH);
    gl.uniform1f(drawGlow, theme.glow);
    gl.uniform1f(drawRingK, isSmall() ? 11 : 24);
    gl.uniform1f(drawSunY, theme.sunY);
    gl.uniform1f(drawSlope, theme.slope);
    gl.uniform1f(drawGap, theme.gap);
    gl.uniform1f(drawPeel, theme.peel);
    (Object.keys(drawVecs) as Array<keyof typeof drawVecs>).forEach((key) => {
      const value = theme[key];
      gl.uniform3f(drawVecs[key], value[0], value[1], value[2]);
    });
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  function frame() {
    raf = 0;
    if (!running) return;
    time += 1 / 60;
    step();
    step();
    const ambientChance = isSmall() ? 0.006 : 0.012;
    if (Math.random() < ambientChance) {
      addDrop(Math.random(), 0.4 + Math.random() * 0.55, 0.004);
    }
    render();
    raf = window.requestAnimationFrame(frame);
  }

  function addDrop(nx: number, ny: number, amount: number) {
    if (reducedMotion || drops.length >= 16) return;
    drops.push([nx, 1 - ny, amount]);
  }

  function start() {
    if (reducedMotion || running) return;
    running = true;
    raf = window.requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (raf) window.cancelAnimationFrame(raf);
    raf = 0;
  }

  const resizeObserver = new ResizeObserver(() => {
    resize();
    if (!running) render();
  });
  resizeObserver.observe(canvas);
  resize();
  render();

  return {
    addDrop,
    render,
    start,
    stop,
    destroy() {
      stop();
      resizeObserver.disconnect();
      gl.deleteProgram(sim);
      gl.deleteProgram(draw);
      gl.deleteBuffer(buffer);
      textures.forEach((texture) => gl.deleteTexture(texture));
      framebuffers.forEach((framebuffer) => gl.deleteFramebuffer(framebuffer));
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}

type Ripple = {
  x: number;
  y: number;
  radius: number;
  max: number;
  alpha: number;
};

function createCanvas2DWater(
  canvas: HTMLCanvasElement,
  reducedMotion: boolean
): WaterEngine {
  const maybeContext = canvas.getContext("2d");
  if (!maybeContext) {
    return {
      addDrop() {},
      render() {},
      start() {},
      stop() {},
      destroy() {},
    };
  }
  const context: CanvasRenderingContext2D = maybeContext;

  let cssW = 1;
  let cssH = 1;
  let time = 0;
  let raf = 0;
  let running = false;
  const ripples: Ripple[] = [];
  let themeSeen = "";
  let sunset = false;
  let wave1 = "#3a8a9a";
  let wave2 = "#1e5f6b";
  let wave3 = "#0f3a44";

  function readTheme() {
    const next = themeName();
    if (next === themeSeen) return;
    themeSeen = next;
    sunset = next === "sunset";
    const style = getComputedStyle(document.documentElement);
    wave1 = style.getPropertyValue("--wave1").trim() || wave1;
    wave2 = style.getPropertyValue("--wave2").trim() || wave2;
    wave3 = style.getPropertyValue("--wave3").trim() || wave3;
  }

  function isSmall() {
    return canvas.clientWidth < 640;
  }

  function resize() {
    const ratio = pixelRatio();
    const rect = canvas.getBoundingClientRect();
    cssW = Math.max(1, rect.width);
    cssH = Math.max(1, rect.height);
    const nextW = Math.round(cssW * ratio);
    const nextH = Math.round(cssH * ratio);
    if (canvas.width !== nextW || canvas.height !== nextH) {
      canvas.width = nextW;
      canvas.height = nextH;
    }
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function rippleOffset(x: number, y: number) {
    let dy = 0;
    for (const ripple of ripples) {
      const distance = Math.hypot(x - ripple.x, y - ripple.y);
      if (distance < ripple.radius && ripple.radius > 1) {
        dy +=
          Math.sin((ripple.radius - distance) * 0.18) *
          ripple.alpha *
          16 *
          (1 - distance / ripple.radius);
      }
    }
    return dy;
  }

  function render() {
    readTheme();
    context.setTransform(pixelRatio(), 0, 0, pixelRatio(), 0, 0);
    const gradient = context.createLinearGradient(0, 0, 0, cssH);
    gradient.addColorStop(0, wave1);
    gradient.addColorStop(0.45, wave2);
    gradient.addColorStop(1, wave3);
    context.fillStyle = gradient;
    context.fillRect(0, 0, cssW, cssH);

    const sunX = cssW * 0.72;
    const sunY = cssH * (sunset ? 0.35 : 0.2);
    const sun = context.createRadialGradient(
      sunX,
      sunY,
      6,
      sunX,
      sunY,
      sunset ? 100 : 70
    );
    sun.addColorStop(
      0,
      sunset ? "rgba(255,160,80,0.85)" : "rgba(255,236,200,0.7)"
    );
    sun.addColorStop(1, "transparent");
    context.fillStyle = sun;
    context.fillRect(0, 0, cssW, cssH);

    for (let layer = 0; layer < 4; layer += 1) {
      context.beginPath();
      const baseY = cssH * 0.45 + layer * 28;
      const amp = 12 - layer * 1.5;
      const speed = 0.75 + layer * 0.12;
      context.moveTo(0, cssH);
      for (let x = 0; x <= cssW; x += 3) {
        let y =
          baseY +
          Math.sin(x * 0.013 + time * speed + layer) * amp +
          Math.sin(x * 0.027 - time * 0.55 + layer * 2) * (amp * 0.4);
        y += rippleOffset(x, baseY);
        context.lineTo(x, y);
      }
      context.lineTo(cssW, cssH);
      context.closePath();
      if (sunset) {
        context.fillStyle =
          layer % 2 === 0
            ? `rgba(255,180,120,${0.12 - layer * 0.015})`
            : `rgba(20,8,24,${0.35 + layer * 0.1})`;
      } else {
        context.fillStyle =
          layer % 2 === 0
            ? `rgba(255,255,255,${0.16 - layer * 0.02})`
            : `rgba(14,74,86,${0.28 + layer * 0.1})`;
      }
      context.fill();
    }

    const small = isSmall();
    for (let index = ripples.length - 1; index >= 0; index -= 1) {
      const ripple = ripples[index];
      ripple.radius += small ? 1.6 : 2.4;
      ripple.alpha *= 0.96;
      context.beginPath();
      context.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      context.strokeStyle = sunset
        ? `rgba(255,200,150,${ripple.alpha * 0.75})`
        : `rgba(255,255,255,${ripple.alpha * 0.7})`;
      context.lineWidth = small ? 1.25 : 2;
      context.stroke();
      if (!small) {
        context.beginPath();
        context.arc(ripple.x, ripple.y, ripple.radius * 0.55, 0, Math.PI * 2);
        context.strokeStyle = `rgba(224,122,95,${ripple.alpha * 0.4})`;
        context.lineWidth = 1.5;
        context.stroke();
      }
      if (ripple.radius > ripple.max || ripple.alpha < 0.02) {
        ripples.splice(index, 1);
      }
    }
  }

  function frame() {
    raf = 0;
    if (!running) return;
    time += 0.018;
    render();
    raf = window.requestAnimationFrame(frame);
  }

  function addDrop(nx: number, ny: number, amount: number) {
    if (reducedMotion) return;
    const small = isSmall();
    const strong = amount >= 0.2;
    const cap = small ? 6 : 12;
    if (!strong && ripples.length >= cap) return;
    const soften = small ? 0.75 : 1;
    ripples.push({
      x: nx * cssW,
      y: ny * cssH,
      radius: strong ? 8 : 5,
      max: strong ? (small ? 110 : 150) : small ? 72 : 100,
      alpha: (strong ? 0.65 : 0.5) * soften,
    });
  }

  function start() {
    if (reducedMotion || running) return;
    running = true;
    raf = window.requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (raf) window.cancelAnimationFrame(raf);
    raf = 0;
  }

  const resizeObserver = new ResizeObserver(() => {
    resize();
    if (!running) render();
  });
  resizeObserver.observe(canvas);
  resize();
  if (reducedMotion) ripples.length = 0;
  render();

  return {
    addDrop,
    render,
    start,
    stop,
    destroy() {
      stop();
      resizeObserver.disconnect();
    },
  };
}

export function createWaterEngine(
  canvas: HTMLCanvasElement,
  reducedMotion: boolean
): WaterEngine {
  if (supportsFloatRipples()) {
    try {
      return createWebGLWater(canvas, reducedMotion);
    } catch (error) {
      console.warn("Using the canvas water fallback.", error);
    }
  }
  return createCanvas2DWater(canvas, reducedMotion);
}
