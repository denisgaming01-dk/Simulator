# Die-Cutter Simulator – handover notes

Training simulator for operators at Logatec: Göpfert G-Cut 13/21 flatbed die-cutter, the prefeeder before it,
and the downstream separator / palletizer line (Corrpal-style). Built by Denis with Claude.

- Live page: https://denisgaming01-dk.github.io/Simulator/ (this repo, `index.html`, GitHub Pages from `main` / root)
- Claude artifact (source of truth, single HTML file): https://claude.ai/artifact/YCgCwqpTsrtDnSBvuCeHGz (version 167; the header badge shows the version)
- `Simulator-Launcher.html`: tiny file given to colleagues once; it fetches the newest `index.html` from
  github.io, falling back to `cdn.jsdelivr.net/gh/denisgaming01-dk/Simulator@main/index.html` (fallback only works if the repo is public).
- Work PCs block github.io and data.jsdelivr.com but allow cdn.jsdelivr.net. The launcher (send once) loads `loader.js` from
  cdn.jsdelivr.net @main with a ?t= cache-buster; loader.js loads index.html the same way. Change loading logic in loader.js, never in the launcher.
  The workflow `purge-cdn.yml` purges jsDelivr after each push and logs which version it serves. Raise the badge (`class="ver"`) each update.
- After every change: update the artifact AND push `index.html` here. Delete `.github/workflows/main.yml` (accidental, always fails).

## Working rules (from Denis)
- All UI text in English.
- Change only what is asked; real-machine measurements from Denis always win over guesses.
- Ask before a big rebuild if the request is ambiguous.
- Colleagues must open it in a plain browser: no Claude app, no downloads (restricted at work). GitHub may be blocked at work.
- Do not put brand names / logos on machine drawings.

## Scale and geometry
- One true height scale: `VS = 110/1050` px per mm (same as `KU`). Lengths and heights are true to scale.
- G-Cut: frame 3000 mm high, operator platform 650 mm with railing and stairs; no railing on the roof.
- Line level (G-Cut exit, separator line belts): 880 mm above floor (`YEX`). Palletizer belts (stacking + bottom-sheet): 350 mm above floor.
- Machine width ~2230 mm for the 2100 mm max format; max sheet 2100 across × 1300 along the feed.
- Gripper chain: 8 bars (fixed number), 12 grippers per bar, top chain 880 mm above bottom chain.
  Known open point: platform-to-bottom-chain is 1125 mm in the sim, Denis measured 1180 mm.
- Delivery: delivery belt at 565 mm; big forks level with the belt at 565; small forks 200 mm above big forks; gripper bar 330 mm above big forks.
- Grippers hold the sheet 10 mm from the front edge (inside the 15 mm front waste).
- Waste: front 15 mm, back and sides 10 mm each (piece 800 × 1500 → sheet must be bigger than 820 × 1525).
- Sheets travelling through the machine are drawn at real board thickness (E 1.5, B 2.7, C 4.0 …).
- Infeed stack full level 60 mm. Stacks count in sheets (B-flute 2.7 mm: 1600 mm ≈ 590 sheets).
- Delivery batch max 400 mm high; always fits the rotation drum.

- Look of the G-Cut (v186, from the Safety-screen 3D views): wooden platform deck and stair treads, dark steel railings (hand rail, knee rail, toe board) and stair stringers, see-through light grey guard doors with a blue door switch and a yellow-ringed reset button per section, dark lower panels at stripping/die-cutting, white roof covers. Backup before this: v185 (revert if Denis does not like it).
- v187: "Covers" button above the 3D view toggles see-through / solid. Solid = operator side drawn after Denis's photo of the real G-Cut (white panels, dark frames round the delivery window and the two die-cutting windows, small control column with screen, buttons and e-stop, button panel, feeder screen, green/blue light strips, white roof); the machine runs visibly through the window openings. From the drive side, solid shows a closed wall. v189: delivery window smaller, its bottom edge level with the bottom chain (sheet line), as on the real machine. v191: solid covers true size, only shifted (Denis: shift, not resize): guillotine (x 605) at the delivery-side edge of the delivery window, covers x 60-700; no panels after the feeder operator screen (feeder open). Not drawn yet: the black arms/tables in front of the feeder section.

- v192 infeed from Denis's photos: white traverse beam with ballscrew and carriage over the stack, rail across the machine, two narrow stainless front-stop plates with angled flaps leaning back over the stack, a wide stainless plate with a bent lip at the drive side, blue photocells on the stop holders, white back stop (floor column, arm, plate against the back of the stack). Positions across are estimates until Denis measures.
- Denis will measure at work: gripper bar spacing (sim assumes ~1385 mm = 145 px), operator-side panel widths, window sizes, guillotine to delivery window edge. Then rescale sections and covers together (stripping windows should match the stripping section).

- v194: solid mode: feeder section solid again (HMI screen, buttons); infeed guarding from x 60 back to x -40 (XH) from Denis's photo: corner posts (dark edge on operator side), white top beam/rails, open roof and open end for the prefeeder, guard door with big glass window (dark frame, blue light, handle) and white lower half; the stack and back stop show through the glass. Drive-side wall runs to x -40, light inside (dark mode).
- v196: v195 infeed end wall removed on Denis's request (back to the v194 drawing).
- Infeed plan (Denis, for later): he will photograph the EMPTY infeed; build the infeed structure first without board, then add the board on top.
  The prefeeder is also in the wrong position relative to the G-Cut and its infeed; fix that together with the infeed.
  Infeed work is on hold until the photos and measurements arrive.
- v197: runs in the background. Machine logic is in simStep(dt); simCatchUp() runs it for all real time passed (100 ms steps, max 8 h). frame() calls it while visible; while the tab is hidden a Web Worker clock (250 ms, setInterval fallback) calls it, and it catches up again when the tab becomes visible. Drawing only happens while visible.
- v198, measured by Denis (operator side, mm, from the delivery end): panel after the guillotine 1000, delivery 1190, HMI column 550,
  stripping 1350, die-cutting 1690, infeed panel (feeder screen) 950. Windows: delivery 1000 x 420 (bottom edge level with the bottom chain),
  stripping 1440 x 1000 (two panes), die-cutting 1480 x 320 (centred on the bottom chain (v199), button panel above it in the dark band),
  infeed double doors 2000 x 2000 (dark glass upper part, white lower part, fixed panel above). Covers keep true size; guillotine (x 605) at the
  end-panel/delivery joint, so covers run x 4.7 .. 709.8 (overhang past the platform end at 640). PNL_MM / U() in the code.
  v200: black-grey painted band (Denis) across delivery, HMI column, stripping and die-cutting panels, from about 1.1 m below the top down to the lower panel line; windows cut out of it.
  Still open: gripper bar spacing (sim station pitch 145 px ~ 1385 mm); internals do not yet line up with the measured panels
  (stripping window x 282-433 vs stripping tool 352-462).

## Prefeeder
- True size, 3000 mm high. Belts 2100 wide. Stores board so the infeed does not run out during stack change.
- Belt moves the stack forward; pneumatic pusher below/behind aligns it; two small pneumatic side align plates
  (260 × 650 mm) cycle every 3 s; separating knife plate ~900 × 450 mm with hangers.
- Overhead pusher redrawn from Denis's photo: dark grey columns, white box beam with rack, geared motor, carriage, hanging push plate.

## Line (order and sizes)
Order: transfer belt 1 → transfer belt 2 → separator 1 → turntable 1 → separator 2 → shift belt → turntable 2 → align table → rotation drum → palletizer.
Station numbers (yellow on HMI): 1010 transfer, 1310 sep 1, 1710 TT1, 1320 sep 2, 1410 shift, 1720 TT2, 1510 align,
2210 robot 3 (interleave boards), 2030 rotation drum, 2400 palletizer, 8210 stacking belt, 8410 pallet turntable, 6290 bottom-sheet belt, 6610 bottom-sheet robot.
- Separator belts 2100 × 700; pressing device 2100 × 400 (wooden plate 400 mm along); turntables 2100 × 2100; gaps between belts 50 mm.
- Turntable lift 40 mm.
- Separator: back press lifts first, then front; each lift 1.26 s (slowed 5% on request). Batch height = stack height + 30 mm clearance.
  Default pressure 4.5 bar breaks a 270 mm bundle; press time 2.5 s default.
- Separators can break along the line between blanks (stack turned 90°) or between rows of blanks (not turned) – needed for 4-piece jobs.
- Rotation drum: turns the stack over 180° forward/backward (axis across the line), opening 432 mm, takes up to 2100 × 1300,
  10% slower on request. A turned stack is drawn darker brown and its outline mirrored; printed underside then shows on top.
- Palletizer: blue belt strips on the carriage with steel forks between them; align plates are 3 white perforated panels per side.
  Sequence per batch: carriage to 200 mm above the stack → forks extend → lower until forks are 20 mm above the stack →
  align plates square the batch → forks pull out (batch drops) → plates open → carriage returns. Speed slowed 5% on request.
  "Additional alignment" batches (green numbers on 2400): after delivery the carriage goes 150 mm lower and squares again.
- Stacking belt plain; pallet drives out along the line.

## HMI (separator line screen)
- Copy of the Siemens line screen. Left column (icons copied from Denis's photo): file cabinet = jobs menu, arrows = nothing yet,
  hand = manual section operation (skipped for now), speed gauge = line speed 33/66/99 %, Save button.
  Top left: cabinet icon with "D" + loaded job name.
- Sequences on TT1, shift, TT2, align: red box = number of sequences (1–10), orange box = sequence being done NOW (type to pick/edit),
  each sequence has its own Wait + command (turn angle / stop position / shift mm / belt run). Advances when the batch leaves the belt; loops 1-2-3-1…
- Station hands on the line screen open SMALL menus. Palletizer, robot 3 and drum hands open the big number grid (1–30; X closes):
  palletizer 0 / 1-24, robot 3 0 / 1-24 + board size, drum 2,4,6 / 1,3,5 / Off. Robot 5 keeps its bottom-sheet menu.
- Job setup (file cabinet → select job → Edit): 9 screens drawn on photos of the real screens, in this order:
  1310·1320 batch height + pieces grid (columns = pieces along the line = separator 1, rows = across = separator 2, pressures),
  1710 TT1, 1410 shift, 1720 TT2, 1510 align, 2210 interleave, 2030 drum, 2400 palletizer, 6610 bottom sheets.
  Left arrow = forward, right arrow = back; last screen has Save. These photo screens are ONLY in the job setup.
- Green counters (stacks through per station, bundles on the pallet, pallets out on 8410) can be typed to correct them.
- Save (header "Save job" or the blue Save button) stores EVERY setting of the G-Cut and the line into the loaded job
  (stack size, board, speed, empty cycles, prefeeder, photocells, all line settings). Saved in the browser (localStorage), per person.

## G-Cut HMI (in progress)
- G-Cut control panel above the line panel, built in English from Denis's photos (no brand logo). Production page done: current job, messages (last 3 log lines),
  status lamps, nav (Production, Settings, Machine, Jobs, Alerts, Safety), job data + Save correction, piece count (total / current stack, editable with pencil),
  speed −/+ (100 per step) and set field wired to the machine speed, output, functions (toggles visual only; empty cycles wired), stripping values (static),
  machine sketch (tap a section = zoom the 3D view; its settings menu comes later). Jobs page loads a job; Alerts shows the log. Settings = sheet delivery page on the photo (batch field works, the rest static); Machine waits for photos. Safety: 3D photo of the doors/covers with safety switches; the camera button (bottom left) turns the view operator side / machine side; Control on / Safety OK lamps live, Reintegration and Stop processes buttons static. The one red door icon (operator side) was recoloured blue on request. The photocell monitor moved into the G-Cut screen: tap the photocell drawn left of the delivery in the sketch. Stripping-exit photocell positions are set on Settings → Stripping station (AS top field, BS left field, ↙↗ 10 mm, link moves both). Settings → Platen press: photo only. Feeder: infeed stack height (top white field, 30–150 mm, default 60, saved with the job; grey = height now). After standby the infeed restarts above 40 mm, or at the set height if that is below 40. Settings order: photocells, exit / transport, delivery, stripping, platen press, feeder. Exit / transport is drawn (photo too blurred): lifting belt position (mm above the exit belts) and hold ↓ ↑ to move it by hand, also while running (a correction kept until the next stack change; not during the stack change); the rest static.

## Jobs
- Job dropdown in the header; changing job restarts the simulator.
- Incom 3P: 3 pieces 950 × 360, B-flute, batch 50, sheet 975 × 1100.
- Incom 6P: 6 pieces 1150 × 330, B-flute, batch 100, batch height 300, sheet 1175 × 2000; TT1 turns 90°, shift waits for 3 bundles, stack 6 high, interleave on 2 and 5.
- Atlantic Barcaffe: die drawing 1630 across × 1221 along (front edge 1650 incl. waste), 4 nested blanks (right pair turned against the left),
  one piece 610.5 × 883; B-flute, batch 50, print on the bottom side. Line breaks all 4 pieces (sep 1 610.5 / 610.5, TT1 90°, sep 2 815 / 815)
  and palletizes one per layer. Denis sets up the rest (rotation, turning) himself. Blank outlines are simplified (no locking tabs / slits).
  Open: Denis said "cutting tool and cutout design don't match" – not yet located; ask him for a screenshot.

- Tray 3P 590: 3 tray blanks 590 × 880 (1770 across), BC-flute (6.5 mm), batch 50 (325 mm, batch height 355, 5 bar), speed 6000 sheets/h,
  shift waits for 2 bundles, 6 layers high, interleave boards on 2, 4, 5 (board 1180 × 880), palletizer 1180 × 880. Outline simplified (no hand holes).
- Photocell second check point defaults to min(950, sheet length − 100) so short sheets do not trip.

## Still to do (Denis asked to keep for later)
- Delivery settings: belt speed (default 50 %) and lifting-belt lower/raise time (default 0.5 s).
- Line-full photocell that stops the infeed when covered.
- Move the stripping-exit photocell left/right setting to its proper HMI menu (Denis will send photos).
- Manual operation of sections (hand icon).
- Pallet turntable 8410 behaviour.
- MP4 videos (1000 / 3000 / 6500 sheets/h) for PowerPoint – on hold.
- Real stack-change timings from machine data (current estimates OK).
