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
  stripping 1530 (rechecked by Denis, v202; was 1350), die-cutting 1690, infeed panel (feeder screen) 950. Windows: delivery 1000 x 420 (bottom edge level with the bottom chain),
  stripping 1440 x 1000 (two panes), die-cutting 1480 x 320 (centred on the bottom chain (v199), button panel above it in the dark band),
  infeed double doors 2000 x 2000 (dark glass upper part, white lower part, fixed panel above). Covers keep true size; guillotine (x 605) at the
  end-panel/delivery joint, so covers run x -14.2 .. 709.8 (overhang past the platform end at 640). PNL_MM / U() in the code.
  v200: black-grey painted band (Denis) across delivery, HMI column, stripping and die-cutting panels, from about 1.1 m below the top down to the lower panel line; windows cut out of it.
  v201: HMI column touch screen 320 x 220 mm (Denis), grey bezel.
  v203: recessed dark channels between the sections, 40 mm wide x 30 mm deep, light tubes in four of them (green x3, blue at the infeed joint).
  v204: infeed operator screen 480 x 290 mm (Denis), button panel below it.
  v205: infeed table with suction belts 420 mm along the feed (Denis; was ~305), from the front stop back.
  v206: gripper bar pitch 1550 mm (Denis): PIT=1550*VS; delivery station stays at x 617 (SD), stripping SS, die-cutting SC, infeed SI one pitch apart (455, 292, 130). Chain sprocket radius 440 mm, bottom run CHL. Infeed parts drawn with XOF=DI offset, prefeeder shifted by DI, platform extended at the infeed. Labels and zoom presets moved.
  v207: covers positioned from Denis: at 0° the stripping gripper bar (x SS 455) sits right after the stripping window (delivery side). XE=744, covers x 20..744; end panel starts at 640 = platform end. Windows: delivery 525-630, stripping 302-453, die-cutting 131-286.
  v208: guillotine position confirmed (set per job). Platens as long as the die-cutting window (1480 mm, PX0..PXR). Front-waste bar on the return run stops at x SF 520 (start of the delivery window, Denis); this fixes the bottom run CHL, return run still 880 mm up, tight corners. Front waste drop, ejector and front waste belt (300 mm wide) moved there (DF); glass window above the belt in the delivery panel.
  v209: chain shape from Denis's sketch (CHN, chainPt follows a polyline): delivery wheel at the TOP (x ~683, return run leaves over it), infeed wheel at the BOTTOM (x 118, bottom run starts under it), guides with sharp bends between. Delivery wheel x and the return-run end (x ~182, where the guide bends down to the infeed wheel) are solved so 8 bars x 1550 mm fit with the stations and the front-waste bar at SF 520. Wheels drawn red.
  v220: wheels 450 mm across (Denis), gripper bars drawn 120 mm wide. With the bigger wheels the return run ends at x 182 (T fixed) and the infeed wheel x is solved instead (~126, just before the infeed station) so 8 bars x 1550 still fit.
  v221: smooth guide curves (quadratic curves instead of sharp bends) at both ends; infeed wheel fixed just before the infeed station (SI-4), the return-run end T solved (~304) so the chain is exactly 8 x 1550.
  v222: exit photocells (delivery, stripping, die-cut, sheet transfer) sit over the middle of the gripper bar at 0° (PCB = 60 mm past the station). Checks still at the same distances from the sheet front edge.
  v223: chain wheels drawn behind the gripper bars and photocells (the infeed bar and the sheet-transfer photocells sit over the infeed wheel at 0° and were hidden). Moving the infeed wheel behind the station is not possible: the chain would be ~38 px too long for 8 x 1550.
  (stripping window x 282-433 vs stripping tool 352-462).
- Platform (v214, from Denis's marked photo; railings left out for now), depths from the machine face:
  floor 3600 deep from the delivery end to the back stairs; a 4000 mm wide part reaching 5200 out (1600 beyond the floor) in front of
  delivery/stripping; behind it 2000 = 1000 floor + 1000 back stairs. The stairs are 1600 wide (outer band 2000..3600), run with the machine
  and end level with the back edge of the infeed doors (v215: whole layout moved 2000 = door width toward the infeed end); inside them a 2000 deep walkway continues along the stairs and the infeed door. PLAT holds the coordinates.
  v217: the 3600 floor runs to the end of the covers (after the delivery); past that it goes on 1000 mm, only 2000 deep (2000 + 1600 = 3600). The lower landing beyond the machine end is not drawn.
  v218: no flooring under the machine: the platform stops at the machine face (zM).
  v219: front stairs at the delivery end, same as the back stairs (1000 long, 1600 wide, outer band beside the 2000-deep floor past the covers, going down away from the delivery).

## Prefeeder
- True size, 3000 mm high. Belts 2100 wide. Stores board so the infeed does not run out during stack change.
- Belt moves the stack forward; pneumatic pusher below/behind aligns it; two small pneumatic side align plates
  (260 × 650 mm) cycle every 3 s; separating knife plate ~900 × 450 mm with hangers.
- Overhead pusher redrawn from Denis's photo: dark grey columns, white box beam with rack, geared motor, carriage, hanging push plate.

- v224 prefeeder position (Denis): one inclined belt; its main (fixed-length) frame is 3000 long and starts 1500 behind the infeed panel (the
  one with the HMI); the adjustable part runs from there to the board at the infeed. Tilted by 2 support cylinders 1200 behind the infeed doors.
  Knife: one sheet length (along the feed) + 20 mm in front of the transfer (delivery) belt; stored board between them. Transfer belt 1500,
  lifting bed, pusher and waiting stack moved with the fixed frame (PFD shift, ~1700 mm further back). Belt slope recomputed so the tail
  height stays the same. Prefeeder logic unchanged (checked: same phases and amounts as before).
  v226: both hold: fixed frame 3000 from 1500 behind the infeed panel; the back group (transfer belt, lifting-bed frame, pusher, waiting stack) moved forward (PFB = PFD + 820) so the belt tail runs under the transfer belt and ends 300 mm from the lifting-bed frame. Knife follows the transfer belt.
  v227: the two cylinders ARE the supports (Denis): big hydraulic cylinders on both sides (body ~170 mm, rod ~76 mm) from the floor up to the belt frame, 1200 behind the infeed doors; the old column + diagonal strut removed.
  v228: belt head (adjustable part) ends 50 mm behind the back of the infeed stack instead of over the sheets; slope recomputed.
  v229: solid covers drawn last (after the prefeeder) so nothing shows through except the windows; labels of inside parts hide in solid mode.
  v230: bar pitch = 1550 gap + 120 bar = 1670 mm (Denis); chain 8 x 1670 = 13360. Stations 1670 apart (delivery stays at x 617); return run ends just past die-cutting, infeed wheel solved (only ~50 mm behind the infeed station: all extra chain goes into the wider station spacing). Moving the back wheel further back costs 2 mm of chain per mm.
  v231: return run stays straight until ~760 mm before the infeed wheel, then curves down (Denis); wheel position solved (now right at the infeed station).
  v232: infeed front stops 700 mm from the end of the infeed panel (door joint) (Denis). Stack, stops, suction table, back stop, front-lays photocell and the prefeeder belt head move with DIF; the feed now travels ~100 mm from the stops into the grippers (was ~500).
  v234: bar pitch 1640 mm (Denis, was 1650 in v233). Delivery bar (SD 617) is the reference; stripping, die-cutting and infeed stations, their photocells, covers (anchored to the stripping bar) and the infeed follow. Chain 8 x 1650 = 13200; front stops still 700 from the door joint.
  v235-236: chain at 0° moved 30 mm forward (SD = 617 + 30 mm): all bars, front-waste bar, photocells, guillotine and the delivery forks (with the piles on them) move with the chain (offset SD-617). Covers are fixed (v234 place) and no longer follow the chain; front stops, platform, prefeeder stay with the covers.
  v237: infeed wheel 380 mm across (CWRI), delivery wheel stays 450 (CWR).
  v238: bar pitch 1630 mm (Denis); reference = guillotine / delivery bar (unchanged). Covers fixed.
  v239: infeed stops placed from the infeed wheel: their rail 20 mm from the wheel edge (plates 58 mm); stops now 651 mm from the door joint (was 700).
  v240: guillotine half as high (blade bottom unchanged); upper stripping tool 60% lower in height (pin tips unchanged).
  v241: front-waste window (above the delivery window) 300 wide x 380 high (Denis). v242: it is a real see-through opening like the other windows.
  v245: front-waste ejector moved 60 mm backward (toward the infeed) from its v242 place.
  v246: front waste lands ~90 mm further toward the infeed on the front-waste belt (Denis).

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
  10% slower on request.
  v210 (Denis): the drum has a belt at the bottom AND at the top; it clamps from both sides (bottom belt lifts the stack while the top belt
  comes down, stack clamped in the middle of the drum), turns, then both belts open fully (bottom back to line level) before the stack may leave. A turned stack is drawn darker brown and its outline mirrored; printed underside then shows on top.
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
