"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[404],{3404:(e,t,r)=>{r.r(t),r.d(t,{default:()=>j});var o=r(5155),n=r(2115),a=r(7650),i=r(5692),s=r(6275),l=r(5269),u=r(9842);let c=Math.PI/180,d=(e,t,r)=>{let o=l.cj9.clamp((r-e)/(t-e),0,1);return o*o*(3-2*o)},m=(e,t,r)=>new l.Pq0(r*Math.cos(e*c)*Math.cos(t*c),r*Math.sin(e*c),-r*Math.cos(e*c)*Math.sin(t*c)),v=`
varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
void main() {
  vUv = uv;
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorldPosition = world.xyz;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`,p=`
uniform sampler2D uDay;
uniform sampler2D uNight;
uniform sampler2D uClouds;
uniform sampler2D uLand;
uniform vec3 uSun;
uniform float uOpacity;
uniform float uCloudOffset;
varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
void main() {
  vec3 n = normalize(vWorldNormal);
  vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
  float sunlight = dot(n, uSun);
  float daylight = smoothstep(-0.065, 0.20, sunlight);
  float land = texture2D(uLand, vUv).r;
  vec3 base = texture2D(uDay, vUv).rgb;
  // Blue Marble albedo plus atmospheric in-scatter above very dark open ocean.
  base += vec3(0.0012, 0.0065, 0.022) * (1.0 - land);
  float cloudShadow = smoothstep(0.14, 0.90,
    texture2D(uClouds, vec2(vUv.x + uCloudOffset + 0.0015, vUv.y - 0.0008)).r);
  float diffuse = max(sunlight, 0.0);
  vec3 color = base * (0.013 + diffuse * 1.38) * (1.0 - cloudShadow * 0.31 * daylight);
  // Water-only glint. Land is matte, rather than a metallic globe.
  vec3 halfVector = normalize(uSun + viewDirection);
  float fresnel = 0.02 + 0.98 * pow(1.0 - max(dot(n, viewDirection), 0.0), 5.0);
  float oceanGlint = pow(max(dot(n, halfVector), 0.0), 90.0);
  color += vec3(1.0, 0.94, 0.82) * oceanGlint * (0.16 + fresnel * 0.5)
    * (1.0 - land) * daylight * (1.0 - cloudShadow * 0.8);
  // Historical VIIRS 2016 composite, not live city lighting.
  float cities = texture2D(uNight, vUv).r;
  float night = 1.0 - smoothstep(-0.20, 0.045, sunlight);
  color += vec3(1.0, 0.54, 0.20) * pow(cities, 1.65) * night * 1.3;
  float rim = pow(1.0 - max(dot(n, viewDirection), 0.0), 3.8);
  float airlight = smoothstep(-0.18, 0.48, sunlight);
  color += vec3(0.018, 0.13, 0.37) * rim * airlight * 0.7;
  gl_FragColor = vec4(color, uOpacity);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`,f=`
uniform sampler2D uClouds;
uniform vec3 uSun;
uniform float uOpacity;
uniform float uCloudOffset;
varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
void main() {
  vec2 coord = vec2(vUv.x + uCloudOffset, vUv.y);
  float density = texture2D(uClouds, coord).r;
  float opacity = smoothstep(0.10, 0.94, density);
  float sunlight = dot(normalize(vWorldNormal), uSun);
  float day = smoothstep(-0.07, 0.20, sunlight);
  float body = max(sunlight, 0.0);
  vec3 lit = mix(vec3(0.007, 0.011, 0.022), vec3(1.0, 0.98, 0.95) * (0.13 + body * 1.15), day);
  lit += vec3(0.23, 0.055, 0.012) * exp(-abs(sunlight) * 23.0) * opacity;
  gl_FragColor = vec4(lit, opacity * uOpacity * 0.94);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`,h=`
uniform vec3 uSun;
uniform float uOpacity;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
void main() {
  vec3 n = normalize(vWorldNormal);
  vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
  float tangent = abs(dot(n, viewDirection));
  float light = smoothstep(-0.32, 0.55, dot(n, uSun));
  float density = smoothstep(0.0, 0.24, tangent);
  vec3 blue = mix(vec3(0.024, 0.085, 0.23), vec3(0.11, 0.39, 0.88), light);
  gl_FragColor = vec4(blue, density * uOpacity * (0.12 + light * 0.88));
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;function g({motion:e,theme:t,reducedMotion:r,embedded:a=!1}){let{size:s,gl:y,invalidate:x}=(0,i.D)(),[b]=(0,n.useState)(()=>s.width<760||y.capabilities.maxTextureSize<4096),[M,w,j,S]=(0,i.H)(l.Tap,[(0,u.L)("/textures/earth-v2/"+(b?"day-2048.webp":"day-4096.webp")),(0,u.L)("/textures/earth-v2/night-2048.webp"),(0,u.L)("/textures/earth-v2/clouds-2048.webp"),(0,u.L)("/textures/earth-v2/land-mask-2048.png")]),C=(0,i.H)(l.Y9S,(0,u.L)("/data/oman.geojson")),O=(0,n.useMemo)(()=>{let e=JSON.parse(String(C)),t=[];for(let r of e.features)for(let e of"MultiPolygon"===r.geometry.type?r.geometry.coordinates:[r.geometry.coordinates])for(let r of e)for(let e=1;e<r.length;e++){let o=m(r[e-1][1],r[e-1][0],2.9232),n=m(r[e][1],r[e][0],2.9232);t.push(o.x,o.y,o.z,n.x,n.y,n.z)}return new Float32Array(t)},[C]),D=(0,n.useRef)(null),W=(0,n.useRef)(null),E=(0,n.useRef)(null),P=(0,n.useRef)(null),_=(0,n.useRef)(null),F=(0,n.useRef)(null),N=(0,n.useRef)(null),R=(0,n.useRef)(null),z=(0,n.useRef)(null),L=(0,n.useMemo)(()=>m(23.64305,58.17629,2.9260999999999995),[]),U=(0,n.useMemo)(()=>new l.PTz().setFromUnitVectors(new l.Pq0(0,0,1),L.clone().normalize()),[L]),k=(0,n.useMemo)(()=>new l.Pq0(-.73,.42,.57).normalize(),[]),A=(0,n.useMemo)(()=>({uDay:{value:M},uNight:{value:w},uClouds:{value:j},uLand:{value:S},uSun:{value:k},uOpacity:{value:1},uCloudOffset:{value:0}}),[M,w,j,S,k]),G=(0,n.useMemo)(()=>({uClouds:{value:j},uSun:{value:k},uOpacity:{value:1},uCloudOffset:{value:0}}),[j,k]),T=(0,n.useMemo)(()=>({uSun:{value:k},uOpacity:{value:.62}}),[k]);return(0,n.useEffect)(()=>{for(let e of(M.colorSpace=l.er$,[M,w,j,S]))e.wrapS=l.GJx,e.anisotropy=Math.min(4,y.capabilities.getMaxAnisotropy()),e.needsUpdate=!0;x()},[M,w,j,S,y,x]),(0,i.F)(()=>{if(!D.current||!W.current)return;let o=e.current.progress,n=1-d(.215,.305,o);if(D.current.visible=n>.001,!D.current.visible)return;let i=d(.075,.235,o),u=d(.205,.305,o),m=s.width<760;D.current.position.set(a||m?0:-2.55+.8*i,a?0:m?-1.65-.25*i:-.25,a?0:-(.6*i)),D.current.scale.setScalar(l.cj9.lerp(a?.82:m?.84:1,a?1.05:m?1.02:1.55,i)*(1+.9*u));let v=r?1:e.current.intro;W.current.rotation.set(23.64305*c,-(Math.PI/2+58.17629*c)+(1-i)*(.38-.2*v),0);let p=.0015*v;N.current&&(N.current.uniforms.uOpacity.value=n,N.current.uniforms.uCloudOffset.value=p),R.current&&(R.current.uniforms.uOpacity.value=n,R.current.uniforms.uCloudOffset.value=p),z.current&&(z.current.uniforms.uOpacity.value=n*("dark"===t?.6:.34)),P.current&&(P.current.opacity=n*d(.06,.18,o)*.76),E.current&&E.current.scale.setScalar(l.cj9.lerp(.86,.42,i)),_.current&&(_.current.opacity=n),F.current&&(F.current.opacity=.65*n)},-10),(0,o.jsx)("group",{ref:D,name:"NASA_Blue_Marble_Earth",children:(0,o.jsxs)("group",{ref:W,children:[(0,o.jsxs)("mesh",{renderOrder:0,children:[(0,o.jsx)("sphereGeometry",{args:[2.9,b?80:128,b?48:80]}),(0,o.jsx)("shaderMaterial",{ref:N,uniforms:A,vertexShader:v,fragmentShader:p,transparent:!0,depthWrite:!0})]}),(0,o.jsxs)("mesh",{scale:1.0045,renderOrder:1,children:[(0,o.jsx)("sphereGeometry",{args:[2.9,b?64:112,b?40:64]}),(0,o.jsx)("shaderMaterial",{ref:R,uniforms:G,vertexShader:v,fragmentShader:f,transparent:!0,depthWrite:!1})]}),(0,o.jsxs)("mesh",{scale:1.023,renderOrder:2,children:[(0,o.jsx)("sphereGeometry",{args:[2.9,80,48]}),(0,o.jsx)("shaderMaterial",{ref:z,uniforms:T,vertexShader:v,fragmentShader:h,side:l.hsX,transparent:!0,depthWrite:!1})]}),(0,o.jsxs)("lineSegments",{renderOrder:3,children:[(0,o.jsx)("bufferGeometry",{children:(0,o.jsx)("bufferAttribute",{attach:"attributes-position",args:[O,3]})}),(0,o.jsx)("lineBasicMaterial",{ref:P,color:"#f0cd89",transparent:!0,opacity:0,depthWrite:!1,toneMapped:!1})]}),(0,o.jsx)("group",{position:L,quaternion:U,renderOrder:4,children:(0,o.jsxs)("group",{ref:E,children:[(0,o.jsxs)("mesh",{"position-z":.025,children:[(0,o.jsx)("sphereGeometry",{args:[.027,16,12]}),(0,o.jsx)("meshBasicMaterial",{ref:_,color:"#fff0bd",transparent:!0,toneMapped:!1})]}),(0,o.jsxs)("mesh",{children:[(0,o.jsx)("ringGeometry",{args:[.071,.078,48]}),(0,o.jsx)("meshBasicMaterial",{ref:F,color:"#e8c58f",transparent:!0,side:l.$EB,depthWrite:!1,toneMapped:!1})]})]})})]})})}var y=r(3732),x=r(6472),b=r.n(x);class M extends n.Component{static getDerivedStateFromError(){return{failed:!0}}componentDidCatch(e,t){this.props.onFailure?.()}render(){return this.state.failed?null:this.props.children}constructor(...e){super(...e),this.state={failed:!1}}}function w(e){let t=(0,n.useRef)({progress:e.progress,intro:+!!e.reducedMotion,visible:!0}),r=(0,n.useRef)(!1),a=(0,n.useRef)(0),s=(0,n.useRef)(e);s.current=e,(0,n.useEffect)(()=>()=>cancelAnimationFrame(a.current),[]);let{camera:u,invalidate:c,size:d,gl:m}=(0,i.D)();return(0,n.useEffect)(()=>{c()},[e.progress,e.theme,e.reducedMotion,e.paused,e.embedded,d.width,d.height,c]),(0,n.useEffect)(()=>{let e=()=>{t.current.visible=!document.hidden,t.current.visible&&c()},r=e=>{e.preventDefault(),s.current.onFailure?.()};return document.addEventListener("visibilitychange",e),m.domElement.addEventListener("webglcontextlost",r),()=>{document.removeEventListener("visibilitychange",e),m.domElement.removeEventListener("webglcontextlost",r)}},[m,c]),(0,i.F)((o,n)=>{if(!t.current.visible)return;let i=Math.min(n,.05),m=l.cj9.clamp(e.progress,0,1),v=!e.reducedMotion&&!e.paused&&e.introTime.current<4.5&&m<.12;v?e.introTime.current+=i:(m>=.12||e.reducedMotion)&&(e.introTime.current=4.5),t.current.intro=l.cj9.smoothstep(e.introTime.current,0,4.5),e.reducedMotion||1===e.activeChapter?t.current.progress=m:e.paused||(t.current.progress=l.cj9.damp(t.current.progress,m,4.2,i)),e.embedded?(u.position.set(0,0,8.2/Math.min(1,d.width/d.height)),u.lookAt(0,0,0)):(u.position.set(0,0,d.width<760?11.2:10),u.lookAt(0,.6*(d.width<760),0)),!e.paused&&(v||Math.abs(t.current.progress-m)>1e-4)&&c(),r.current||(r.current=!0,a.current=requestAnimationFrame(()=>s.current.onReady?.()))},-30),(0,o.jsx)(g,{motion:t,theme:e.theme,reducedMotion:e.reducedMotion,embedded:e.embedded})}function j(e){let t=1===e.activeChapter,r=(0,y.YS)(t,!!e.paused,e.reducedMotion),i=(0,n.useRef)(0),[u,c]=(0,n.useState)(null);(0,n.useEffect)(()=>{let t=window.matchMedia("(max-width: 900px)"),r=()=>c(t.matches&&void 0!==e.activeChapter&&e.activeChapter<2?document.getElementById(0===e.activeChapter?"earth-mobile-slot":"geography-mobile-slot"):null);return r(),t.addEventListener("change",r),()=>t.removeEventListener("change",r)},[e.activeChapter]);let d=l.cj9.smootherstep(r,0,.45),m=t?.31*d:e.progress,v=(0,o.jsx)("div",{className:b().earthScene,"data-earth-embedded":!!u,children:(0,o.jsx)(M,{onFailure:e.onFailure,children:(0,o.jsx)(s.Hl,{frameloop:"demand",dpr:[1,1.5],camera:{position:[0,0,10],fov:40,near:.08,far:100},gl:{alpha:!0,antialias:!0,powerPreference:"high-performance",toneMapping:l.FV},style:{width:"100%",height:"100%",pointerEvents:"none"},children:(0,o.jsx)(n.Suspense,{fallback:null,children:(0,o.jsx)(w,{...e,embedded:!!u,introTime:i,progress:m})})})})});return(0,o.jsxs)(o.Fragment,{children:[u?(0,a.createPortal)(v,u):v,(0,o.jsx)(y.Ay,{active:t,stage:r})]})}}}]);