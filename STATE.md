# Project State Log - v0-clone AI Elements Library

**Last Updated:** 2026-02-09
**Status:** 🟢 Active Development - AI Elements Library Expansion

---

## Current Session Summary (2026-02-09)

### ✅ Completed AI Elements

1. **Timeline Component** - TimelineJS3 Integration
2. **Maps Component** - MapLibre GL + Three.js 3D
3. **ThreeScene Component** - Pure Three.js viewer

### ⚠️ Current Issue

**Maps Not Rendering** - Shows marker but no map tiles
- Fixed re-rendering loop (dependency array)
- Added error handling
- Need to test different tile provider

---

## AI Elements Library

### 1. Timeline (TimelineJS3)
**Files:**
- `components/ai-elements/timeline.tsx` (429 lines)
- `components/ai-elements/timeline-client.tsx` (19 lines)
- `app/timeline-test/page.tsx` (test page)
- `types/knight-lab-timelinejs.d.ts` (type definitions)

**Package:** `@knight-lab/timelinejs@3.9.8`

**Status:** ✅ Working
- Client-only rendering (no SSR issues)
- Hydration mismatch fixed
- Test page: http://localhost:3002/timeline-test

**API:**
```tsx
<Timeline data={timelineData}>
  <TimelineHeader>
    <TimelineTitle />
    <TimelineActions>
      <TimelineCopyButton />
      <TimelineFullscreenButton />
    </TimelineActions>
  </TimelineHeader>
  <TimelineContent />
</Timeline>
```

**Commit:** `1b87d76` - feat: integrate official TimelineJS3 library

---

### 2. Maps (MapLibre GL + Three.js)
**Files:**
- `components/ai-elements/maps.tsx` (535 lines)
- `components/ai-elements/maps-client.tsx` (client exports)
- `app/maps-test/page.tsx` (test page)

**Packages:**
- `maplibre-gl@latest`
- `react-map-gl@latest`
- `three@0.182.0`
- `@types/three@latest`
- `@dvt3d/maplibre-three-plugin@1.3.0`

**Status:** ⚠️ In Progress - Markers render but map tiles don't load
- Re-rendering loop: FIXED (dependency array issue)
- Error handling: Added
- Default style: `https://demotiles.maplibre.org/style.json`
- Need to test alternative tile provider

**Features:**
- 2D interactive maps
- Custom markers with colors
- 3D object support (Three.js integration)
- Navigation controls
- Fullscreen mode

**API:**
```tsx
<Maps data={mapData} options={{ enable3D: true }}>
  <MapsHeader>
    <MapsTitle />
    <MapsActions>
      <MapsCopyButton />
      <MapsFullscreenButton />
    </MapsActions>
  </MapsHeader>
  <MapsContent />
</Maps>
```

**3D Objects:**
```tsx
{
  objects3D: [{
    coordinates: { longitude, latitude },
    object: threeMesh,
    scale: 1,
    rotation: { x, y, z }
  }]
}
```

---

### 3. ThreeScene (Pure Three.js)
**Files:**
- `components/ai-elements/threescene.tsx` (900+ lines)
- `components/ai-elements/threescene-client.tsx`
- `app/threescene-test/page.tsx`

**Package:** `three@0.182.0` (already installed)

**Status:** ✅ Should be working (not yet tested)
- OrbitControls for interaction
- Multiple light types (ambient, directional, point, spot, hemisphere)
- Grid and axes helpers
- Customizable camera

**Features:**
- Pure 3D scene viewer
- Multiple object support
- Interactive controls (rotate, pan, zoom)
- Auto-resize handling
- Animation loop

**API:**
```tsx
<ThreeScene data={sceneData} options={{ enableControls: true }}>
  <ThreeSceneHeader>
    <ThreeSceneTitle />
    <ThreeSceneActions>
      <ThreeSceneResetButton />
      <ThreeSceneCopyButton />
      <ThreeSceneFullscreenButton />
    </ThreeSceneActions>
  </ThreeSceneHeader>
  <ThreeSceneContent />
</ThreeScene>
```

**Test Page:** http://localhost:3002/threescene-test
- Green cube
- Orange torus
- Cyan sphere
- Yellow wireframe icosahedron

---

## Package Dependencies Added Today

```json
{
  "@knight-lab/timelinejs": "3.9.8",
  "maplibre-gl": "latest",
  "react-map-gl": "latest",
  "three": "0.182.0",
  "@types/three": "latest",
  "@dvt3d/maplibre-three-plugin": "1.3.0"
}
```

---

## Known Issues

### 🔴 CRITICAL: Maps Not Rendering Tiles
**Symptom:** Marker shows but no map background
**Possible Causes:**
1. Demo tiles URL not loading
2. CORS issue with tile server
3. Map style JSON format issue

**Investigation Steps:**
1. Check browser console for network errors
2. Test alternative tile providers:
   - OpenStreetMap direct
   - Maptiler free tier
   - Protomaps
3. Verify MapLibre GL CSS loaded

**Browser Console Logs:**
```
"Initializing map with ID: map-xxxxx"
Expected: "Map loaded successfully"
```

---

## Technical Decisions

### Timeline Component
**Decision:** Use official TimelineJS3 instead of custom implementation
**Rationale:**
- Maintained library with 3.9.8 recent release
- Rich feature set (eras, media, date formatting)
- Less code to maintain (700+ lines → 429 lines)

**Trade-offs:**
- External dependency
- Need type definitions (created custom)
- SSR complications (solved with client-only rendering)

---

### Maps Component
**Decision:** MapLibre GL instead of Leaflet or Google Maps
**Rationale:**
- Free and open source (no API key required)
- Vector tiles (modern, performant)
- Three.js integration available
- Good React ecosystem

**Trade-offs:**
- Less mature than Leaflet
- Fewer plugins than Leaflet
- Tile server dependency (need free provider)

---

### Three.js Integration
**Decision:** Support both map-based 3D and pure 3D scenes
**Rationale:**
- Maps with 3D objects = geographic visualization
- Pure ThreeScene = 3D model viewer, product viz, etc.
- Reuse Three.js across both components

---

## Architecture Patterns

All AI Elements follow the same composable pattern:

```tsx
<Component data={data} options={options}>
  <ComponentHeader>
    <ComponentTitle />
    <ComponentActions>
      <ComponentCopyButton />
      <ComponentFullscreenButton />
    </ComponentActions>
  </ComponentHeader>
  <ComponentContent />
</Component>
```

**Benefits:**
- Consistent API across all elements
- Flexible composition
- Easy to add custom headers/actions
- Similar to Vercel AI SDK UI components

---

## ⚠️ Critical: Avoiding Infinite Loops in useEffect

When creating AI elements with initialization logic in `useEffect`, be extremely careful with dependency arrays to prevent infinite re-rendering loops.

### The Problem

Objects, refs, and functions in dependency arrays are recreated on every render, causing the effect to run repeatedly:

```tsx
// ❌ BAD - Causes infinite loop
useEffect(() => {
  // Initialize component
}, [data, options, someRef, setError, instanceRef]);
// data and options are objects that change every render
// Effect runs → cleanup → re-render → effect runs again → LOOP!
```

### The Solution

Only include **stable primitive values** in the dependency array:

```tsx
// ✅ GOOD - Stable dependencies only
useEffect(() => {
  // Initialize component
  // data and options are captured in closure but don't trigger re-runs
}, [isMounted, componentId]);
// eslint-disable-next-line react-hooks/exhaustive-deps
```

### Best Practices

1. **Use stable primitives**: `isMounted` (boolean), component IDs (strings), `isInitialized` (boolean)
2. **Capture, don't depend**: Let `data`, `options`, `refs` be captured in the effect closure
3. **Add eslint-disable**: Acknowledge intentional dependency omission
4. **Test thoroughly**: Watch console for repeated initialization logs

### Real Examples from This Project

**Timeline Component (`timeline.tsx`):**
```tsx
// Only depends on isMounted and timelineId (both stable)
useEffect(() => {
  if (!containerRef.current || isInitialized) return;
  // ... initialization using data and options from closure
}, [isMounted, timelineId]);
// eslint-disable-next-line react-hooks/exhaustive-deps
```

**Maps Component (`maps.tsx`):**
```tsx
// Only depends on isMounted and mapContainerId (both stable)
useEffect(() => {
  if (!containerRef.current || isInitialized) return;
  // ... initialization using data and options from closure
}, [isMounted, mapContainerId]);
// eslint-disable-next-line react-hooks/exhaustive-deps
```

**ThreeScene Component (`threescene.tsx`):**
```tsx
// Only depends on isMounted and sceneContainerId (both stable)
useEffect(() => {
  if (!containerRef.current || isInitialized) return;
  // ... initialization using data and options from closure
}, [isMounted, sceneContainerId]);
// eslint-disable-next-line react-hooks/exhaustive-deps
```

### Warning Signs

- Console logs repeating rapidly
- "Too many active WebGL contexts" warnings
- Page flickering/flashing
- Browser becoming unresponsive

---

## File Structure

```
components/ai-elements/
├── timeline.tsx              # TimelineJS3 integration
├── timeline-client.tsx       # Client exports
├── maps.tsx                  # MapLibre GL + Three.js
├── maps-client.tsx          # Client exports
├── threescene.tsx           # Pure Three.js viewer
├── threescene-client.tsx    # Client exports
├── ... (other elements)

app/
├── timeline-test/
│   └── page.tsx             # Timeline test page
├── maps-test/
│   └── page.tsx             # Maps test page (⚠️ not rendering)
└── threescene-test/
    └── page.tsx             # ThreeScene test page

types/
└── knight-lab-timelinejs.d.ts  # Custom type definitions
```

---

## Development Environment

**Dev Server:** http://localhost:3002
**Port:** 3002 (3000 in use by another process)

**Test Pages:**
- Timeline: http://localhost:3002/timeline-test ✅
- Maps: http://localhost:3002/maps-test ⚠️
- ThreeScene: http://localhost:3002/threescene-test 🔄

---

## Git Status

**Branch:** `components`
**Last Commit:** `1b87d76` - feat: integrate official TimelineJS3 library
**Status:** 1 commit ahead of origin (pushed)

**Uncommitted:**
- Maps component (maps.tsx, maps-client.tsx)
- ThreeScene component (threescene.tsx, threescene-client.tsx)
- Test pages (maps-test, threescene-test)
- Package.json updates (map/3D dependencies)

---

## Next Steps

### 🔴 Immediate: Fix Maps Rendering

1. **Test Alternative Tile Provider**
   ```tsx
   // Try OpenStreetMap style
   style: {
     version: 8,
     sources: {
       osm: {
         type: 'raster',
         tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
         tileSize: 256,
       }
     },
     layers: [{
       id: 'osm',
       type: 'raster',
       source: 'osm'
     }]
   }
   ```

2. **Check Browser DevTools**
   - Network tab: Failed tile requests?
   - Console: MapLibre errors?
   - Elements: Canvas element exists?

3. **Verify MapLibre CSS**
   - Check if `maplibre-gl.css` loaded
   - Inspect map container styles

### 🟡 After Maps Fixed: Test ThreeScene

1. Visit http://localhost:3002/threescene-test
2. Verify OrbitControls work
3. Check all 4 objects render
4. Test reset button

### 🟢 When Both Work: Commit

```bash
git add .
git commit -m "feat: add Maps and ThreeScene AI elements

- Add MapLibre GL Maps component with 3D support
- Add pure Three.js Scene viewer
- Integrate @dvt3d/maplibre-three-plugin for 3D on maps
- Add test pages for both components
- Install maplibre-gl, three, and related packages"
```

---

## Memory Compression Notes

**Last Context:** 140k+ tokens used
**Session Focus:** AI Elements library expansion
**Components Worked On:** Timeline → Maps → ThreeScene

**Key Points for Next Session:**
1. Maps has re-rendering bug fixed but tiles not loading
2. Need to try alternative tile provider for Maps
3. ThreeScene created but not yet tested
4. All components follow same composable API pattern
5. Dev server on port 3002

---

## Resources

- **MapLibre GL:** https://maplibre.org/
- **TimelineJS3:** https://timeline.knightlab.com/
- **Three.js:** https://threejs.org/
- **maplibre-three-plugin:** https://github.com/dvt3d/maplibre-three-plugin
- **OrbitControls:** https://threejs.org/docs/#examples/en/controls/OrbitControls
