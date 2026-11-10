# Die-Cutter Simulator – handover notes

Training simulator for operators at Logatec: Göpfert G-Cut 13/21 flatbed die-cutter, the prefeeder before it,
and the downstream separator / palletizer line (Corrpal-style). Built by the trainer with Claude.

- Live page: https://denisgaming01-dk.github.io/Simulator/ (this repo, `index.html`, GitHub Pages from `main` / root)
- Claude artifact (source of truth, single HTML file): https://claude.ai/artifact/YCgCwqpTsrtDnSBvuCeHGz (version 167; the header badge shows the version)
- `Simulator-Launcher.html`: tiny file given to colleagues once; it fetches the newest `index.html` from
  github.io, falling back to `cdn.jsdelivr.net/gh/denisgaming01-dk/Simulator@main/index.html` (fallback only works if the repo is public).
- Work PCs block github.io and data.jsdelivr.com but allow cdn.jsdelivr.net. The launcher (send once) loads `loader.js` from
  cdn.jsdelivr.net @main with a ?t= cache-buster; loader.js loads index.html the same way. Change loading logic in loader.js, never in the launcher.
  The workflow `purge-cdn.yml` purges jsDelivr after each push and logs which version it serves. Raise the badge (`class="ver"`) each update.
- After every change: update the artifact AND push `index.html` here. Delete `.github/workflows/main.yml` (accidental, always fails).

## Working rules (from the trainer)
- All UI text in English.
- Change only what is asked; real-machine measurements from the trainer always win over guesses.
- Ask before a big rebuild if the request is ambiguous.
- Colleagues must open it in a plain browser: no Claude app, no downloads (restricted at work). GitHub may be blocked at work.
- Do not put brand names / logos on machine drawings.

## Scale and geometry
- One true height scale: `VS = 110/1050` px per mm (same as `KU`). Lengths and heights are true to scale.
- G-Cut: frame 3000 mm high, operator platform 650 mm with railing and stairs; no railing on the roof.
- Line level (G-Cut exit, separator line belts): 880 mm above floor (`YEX`). Palletizer belts (stacking + bottom-sheet): 350 mm above floor.
- Machine width ~2230 mm for the 2100 mm max format; max sheet 2100 across × 1300 along the feed.
- Gripper chain: 8 bars (fixed number), 12 grippers per bar, top chain 880 mm above bottom chain.
  Known open point: platform-to-bottom-chain is 1125 mm in the sim, the trainer measured 1180 mm.
- Delivery: delivery belt at 565 mm; big forks level with the belt at 565; small forks 200 mm above big forks; gripper bar 330 mm above big forks.
- Grippers hold the sheet 10 mm from the front edge (inside the 15 mm front waste).
- Waste: front 15 mm, back and sides 10 mm each (piece 800 × 1500 → sheet must be bigger than 820 × 1525).
- Sheets travelling through the machine are drawn at real board thickness (E 1.5, B 2.7, C 4.0 …).
- Infeed stack full level 60 mm. Stacks count in sheets (B-flute 2.7 mm: 1600 mm ≈ 590 sheets).
- Delivery batch max 400 mm high; always fits the rotation drum.

- Look of the G-Cut (v186, from the Safety-screen 3D views): wooden platform deck and stair treads, dark steel railings (hand rail, knee rail, toe board) and stair stringers, see-through light grey guard doors with a blue door switch and a yellow-ringed reset button per section, dark lower panels at stripping/die-cutting, white roof covers. Backup before this: v185 (revert if the trainer does not like it).
- v187: "Covers" button above the 3D view toggles see-through / solid. Solid = operator side drawn after the photo of the real G-Cut (white panels, dark frames round the delivery window and the two die-cutting windows, small control column with screen, buttons and e-stop, button panel, feeder screen, green/blue light strips, white roof); the machine runs visibly through the window openings. From the drive side, solid shows a closed wall. v189: delivery window smaller, its bottom edge level with the bottom chain (sheet line), as on the real machine. v191: solid covers true size, only shifted (shift, not resize): guillotine (x 605) at the delivery-side edge of the delivery window, covers x 60-700; no panels after the feeder operator screen (feeder open). Not drawn yet: the black arms/tables in front of the feeder section.

- v192 infeed from the photos: white traverse beam with ballscrew and carriage over the stack, rail across the machine, two narrow stainless front-stop plates with angled flaps leaning back over the stack, a wide stainless plate with a bent lip at the drive side, blue photocells on the stop holders, white back stop (floor column, arm, plate against the back of the stack). Positions across are estimates until the trainer measures.
- the trainer will measure at work: gripper bar spacing (sim assumes ~1385 mm = 145 px), operator-side panel widths, window sizes, guillotine to delivery window edge. Then rescale sections and covers together (stripping windows should match the stripping section).

- v194: solid mode: feeder section solid again (HMI screen, buttons); infeed guarding from x 60 back to x -40 (XH) from the photo: corner posts (dark edge on operator side), white top beam/rails, open roof and open end for the prefeeder, guard door with big glass window (dark frame, blue light, handle) and white lower half; the stack and back stop show through the glass. Drive-side wall runs to x -40, light inside (dark mode).
- v196: v195 infeed end wall removed on the request (back to the v194 drawing).
- Infeed plan (for later): he will photograph the EMPTY infeed; build the infeed structure first without board, then add the board on top.
  The prefeeder is also in the wrong position relative to the G-Cut and its infeed; fix that together with the infeed.
  Infeed work is on hold until the photos and measurements arrive.
- v197: runs in the background. Machine logic is in simStep(dt); simCatchUp() runs it for all real time passed (100 ms steps, max 8 h). frame() calls it while visible; while the tab is hidden a Web Worker clock (250 ms, setInterval fallback) calls it, and it catches up again when the tab becomes visible. Drawing only happens while visible.
- v198, measured by the trainer (operator side, mm, from the delivery end): panel after the guillotine 1000, delivery 1190, HMI column 550,
  stripping 1530 (rechecked by the trainer, v202; was 1350), die-cutting 1690, infeed panel (feeder screen) 950. Windows: delivery 1000 x 420 (bottom edge level with the bottom chain),
  stripping 1440 x 1000 (two panes), die-cutting 1480 x 320 (centred on the bottom chain (v199), button panel above it in the dark band),
  infeed double doors 2000 x 2000 (dark glass upper part, white lower part, fixed panel above). Covers keep true size; guillotine (x 605) at the
  end-panel/delivery joint, so covers run x -14.2 .. 709.8 (overhang past the platform end at 640). PNL_MM / U() in the code.
  v200: black-grey painted band across delivery, HMI column, stripping and die-cutting panels, from about 1.1 m below the top down to the lower panel line; windows cut out of it.
  v201: HMI column touch screen 320 x 220 mm, grey bezel.
  v203: recessed dark channels between the sections, 40 mm wide x 30 mm deep, light tubes in four of them (green x3, blue at the infeed joint).
  v204: infeed operator screen 480 x 290 mm, button panel below it.
  v205: infeed table with suction belts 420 mm along the feed (was ~305), from the front stop back.
  v206: gripper bar pitch 1550 mm: PIT=1550*VS; delivery station stays at x 617 (SD), stripping SS, die-cutting SC, infeed SI one pitch apart (455, 292, 130). Chain sprocket radius 440 mm, bottom run CHL. Infeed parts drawn with XOF=DI offset, prefeeder shifted by DI, platform extended at the infeed. Labels and zoom presets moved.
  v207: covers positioned from the trainer: at 0° the stripping gripper bar (x SS 455) sits right after the stripping window (delivery side). XE=744, covers x 20..744; end panel starts at 640 = platform end. Windows: delivery 525-630, stripping 302-453, die-cutting 131-286.
  v208: guillotine position confirmed (set per job). Platens as long as the die-cutting window (1480 mm, PX0..PXR). Front-waste bar on the return run stops at x SF 520 (start of the delivery window, the trainer); this fixes the bottom run CHL, return run still 880 mm up, tight corners. Front waste drop, ejector and front waste belt (300 mm wide) moved there (DF); glass window above the belt in the delivery panel.
  v209: chain shape from the sketch (CHN, chainPt follows a polyline): delivery wheel at the TOP (x ~683, return run leaves over it), infeed wheel at the BOTTOM (x 118, bottom run starts under it), guides with sharp bends between. Delivery wheel x and the return-run end (x ~182, where the guide bends down to the infeed wheel) are solved so 8 bars x 1550 mm fit with the stations and the front-waste bar at SF 520. Wheels drawn red.
  v220: wheels 450 mm across, gripper bars drawn 120 mm wide. With the bigger wheels the return run ends at x 182 (T fixed) and the infeed wheel x is solved instead (~126, just before the infeed station) so 8 bars x 1550 still fit.
  v221: smooth guide curves (quadratic curves instead of sharp bends) at both ends; infeed wheel fixed just before the infeed station (SI-4), the return-run end T solved (~304) so the chain is exactly 8 x 1550.
  v222: exit photocells (delivery, stripping, die-cut, sheet transfer) sit over the middle of the gripper bar at 0° (PCB = 60 mm past the station). Checks still at the same distances from the sheet front edge.
  v223: chain wheels drawn behind the gripper bars and photocells (the infeed bar and the sheet-transfer photocells sit over the infeed wheel at 0° and were hidden). Moving the infeed wheel behind the station is not possible: the chain would be ~38 px too long for 8 x 1550.
  (stripping window x 282-433 vs stripping tool 352-462).
- Platform (v214, from the marked photo; railings left out for now), depths from the machine face:
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
- Overhead pusher redrawn from the photo: dark grey columns, white box beam with rack, geared motor, carriage, hanging push plate.

- v224 prefeeder position: one inclined belt; its main (fixed-length) frame is 3000 long and starts 1500 behind the infeed panel (the
  one with the HMI); the adjustable part runs from there to the board at the infeed. Tilted by 2 support cylinders 1200 behind the infeed doors.
  Knife: one sheet length (along the feed) + 20 mm in front of the transfer (delivery) belt; stored board between them. Transfer belt 1500,
  lifting bed, pusher and waiting stack moved with the fixed frame (PFD shift, ~1700 mm further back). Belt slope recomputed so the tail
  height stays the same. Prefeeder logic unchanged (checked: same phases and amounts as before).
  v226: both hold: fixed frame 3000 from 1500 behind the infeed panel; the back group (transfer belt, lifting-bed frame, pusher, waiting stack) moved forward (PFB = PFD + 820) so the belt tail runs under the transfer belt and ends 300 mm from the lifting-bed frame. Knife follows the transfer belt.
  v227: the two cylinders ARE the supports: big hydraulic cylinders on both sides (body ~170 mm, rod ~76 mm) from the floor up to the belt frame, 1200 behind the infeed doors; the old column + diagonal strut removed.
  v228: belt head (adjustable part) ends 50 mm behind the back of the infeed stack instead of over the sheets; slope recomputed.
  v229: solid covers drawn last (after the prefeeder) so nothing shows through except the windows; labels of inside parts hide in solid mode.
  v230: bar pitch = 1550 gap + 120 bar = 1670 mm; chain 8 x 1670 = 13360. Stations 1670 apart (delivery stays at x 617); return run ends just past die-cutting, infeed wheel solved (only ~50 mm behind the infeed station: all extra chain goes into the wider station spacing). Moving the back wheel further back costs 2 mm of chain per mm.
  v231: return run stays straight until ~760 mm before the infeed wheel, then curves down; wheel position solved (now right at the infeed station).
  v232: infeed front stops 700 mm from the end of the infeed panel (door joint). Stack, stops, suction table, back stop, front-lays photocell and the prefeeder belt head move with DIF; the feed now travels ~100 mm from the stops into the grippers (was ~500).
  v234: bar pitch 1640 mm (was 1650 in v233). Delivery bar (SD 617) is the reference; stripping, die-cutting and infeed stations, their photocells, covers (anchored to the stripping bar) and the infeed follow. Chain 8 x 1650 = 13200; front stops still 700 from the door joint.
  v235-236: chain at 0° moved 30 mm forward (SD = 617 + 30 mm): all bars, front-waste bar, photocells, guillotine and the delivery forks (with the piles on them) move with the chain (offset SD-617). Covers are fixed (v234 place) and no longer follow the chain; front stops, platform, prefeeder stay with the covers.
  v237: infeed wheel 380 mm across (CWRI), delivery wheel stays 450 (CWR).
  v238: bar pitch 1630 mm; reference = guillotine / delivery bar (unchanged). Covers fixed.
  v239: infeed stops placed from the infeed wheel: their rail 20 mm from the wheel edge (plates 58 mm); stops now 651 mm from the door joint (was 700).
  v240: guillotine half as high (blade bottom unchanged); upper stripping tool 60% lower in height (pin tips unchanged).
  v241: front-waste window (above the delivery window) 300 wide x 380 high. v242: it is a real see-through opening like the other windows.
  v245: front-waste ejector moved 60 mm backward (toward the infeed) from its v242 place.
  v246: front waste lands ~90 mm further toward the infeed on the front-waste belt.
  v247: delivery end face (solid mode, seen when turned toward the delivery end): dark grey panel, window 2000 x 500 starting 1150 mm above the platform (v248), dark ledge under it, two switches and a blue button above (photo). v249: open below 450 mm above the exit belt (stacks drive out).
  v250: view can pan further right (BX1 1340 -> 1800) so the prefeeder waiting stack is visible; Prefeeder zoom preset widened.
  v251: the platform is one solid (outline polygon extruded deck to floor; only side faces turned to the camera, far to near) instead of 4 overlapping boxes, so no seams or clipping when the camera turns.
  v252: both staircases are one solid each (stairs(): step profile extruded across the stair width, faces to the camera only, far to near) instead of 4 overlapping boxes.
  v253: platform + both staircases in one group (LP), all side/stair faces depth-sorted together, deck on top; LP is always drawn first (ground). Prefeeder: transfer belt always drawn after the inclined belt (its tail runs under it); cylinders and tail leg drawn before the belt.
  v254: infeed rebuilt from the empty-infeed photo: red suction belt strips with blue chain edges on a white table (420), two front stops with flaps near the middle, two side tampers (stainless plates with bent lead-in, white holders) at the sheet edges, beam with two ballscrews and a centre bearing/photocell. Platform outline split at the back-stair end so the wall behind the stairs sorts correctly.
  v255: "Board: shown / hidden" button above the 3D view (NOBOARD): sheets, stacks, waste, blanks, prefeeder board and line stacks are not drawn; the simulation keeps running.
  v256: Infeed guarding (corner posts, top beam, 2000 x 2000 door) also drawn in see-through mode as light glass, so the infeed panel shows without solid covers. Clipping still open (not reproduced).
  v257: Infeed corner posts and top rails moved in front of the cover plane (ZN-12..ZN-10), so they no longer cut through the covers. Beam clipping reported again: checking which beam.
  v258: Back panel behind the infeed guides, full width and height (x 137), so the chain is hidden behind it from the stack side. The chain bars and dashed centre line can still draw in front (layer order), open.
  v259: With solid covers the chain centre line (dashed, drawn over everything) is hidden, so the chain is not visible through the covers.
  v260: With solid covers the infeed is closed: roof over the infeed, end wall, far wall and an opaque panel behind the doors and guides, so nothing of the stack or chain shows from any side.
  v261: With solid covers the infeed corner posts are removed (inside the closed infeed); the infeed end and far wall that stuck out past the covers are removed.
  v262: Reverted the infeed roof and the opaque panel behind the doors (they made the windows solid and hid the infeed). The door glass is see-through again; the infeed corner post stays removed with solid covers.
  v263: Infeed front guides lowered so their bottom sits almost on the belt (lifted for flute thickness), per the trainer photo.
  v264: With solid covers the infeed gets a roof and a solid back cover panel (floor to roof, far side), like the rest of the machine. Door glass stays see-through.
  v265: Removed the roof over the infeed (not asked for); the solid back cover panel with solid covers stays.
  v266: Removed the stray panel that stood outside the machine at the infeed (back wall at the far side). The solid back panel inside the machine, behind the guides, stays.
  v267: Infeed back panel now runs from the belts up to the roof (x 131-134, full infeed length). Front guides and side align plates sit on it. Open: the infeed chain wheel (x 85-125) is still in front of the panel, so it shows.
  v268: With solid covers the infeed chain wheel is not drawn (hidden inside the closed infeed). Everything behind solid covers is hidden; windows stay see-through.
  v269: Infeed back panel is drawn only with solid covers, so it disappears with covers see-through.
  v270: Infeed front guides, side align plates and the infeed sheet stack are drawn in a top layer, so they show with covers on and off from every angle. Back panel stays solid-only.
  v271: Infeed back cover is drawn in the same top layer as the guides when covers are solid, so it no longer drops out at low camera angles.
  v272: Fixed v271 (the back cover was overwritten and never drawn). Infeed back cover now in the infeed top layer with solid covers, drawn behind or in front of stack and guides depending on camera side; visible at every angle.
  v273: Die layout panel (title, legend Cut/Crease/Waste, feed direction), delivery pile / batches counters, cam-angle scale and the "Layout when cut / always" buttons hidden (display:none, code kept). the trainer may want them back later as a tab.
  v274: orderWorld() was showing the die layout inset and scale again at turn 0; now they stay hidden at every angle.
  v275: Line stacks: the blank outline of a bundle is now centred on its real outer edges (lOutC), not on its grid cell in the die. Barcaffe blanks sat ~35 mm off centre, so layers turned 180 deg looked offset left/right on the pallet. Logic positions were already straight.
  v276: Camera freedom: pan/zoom limits now follow the drawn scene (updBounds from #world bbox + 15% margin, recalculated on every tilt/turn), so the whole machine and line can be reached at any angle. Zoom-in limit 110 -> 40, turn slider in 1 deg steps.
  v277: Infeed suction table (white frame, red belts, blue edges) moved into the infeed top layer (INFTAB), drawn first under the stack, so the belts are no longer hidden behind the machine body at some angles.
  v278: Palletizer forks travel exactly as far as the stack (LCOL - block centre), so the stack front stays at the fork tips the whole stroke (was LPITCH, forks overshot ~500 mm). Blue belt strips raised to cy so they are level with the fork tops.
  v279: Palletizer: when the pallet is full after a bundle (count or max height), the carriage goes straight from open/xopen to clear (pallet release) instead of lowering to 0 first. full() helper shared with back.
  v280: White belt bodies (lbody) under transfer belt 1, the shift belt and both turntables, from the trainer photo: apron panel under the belt frame, narrower cabinet set in down to the floor on 4 feet, 2 handles on the operator side, vent grille.
  v281: Turntable turning top (white grid) ends 250 mm before each end of the belt (HT=H-250), so it can turn without going over the neighbouring belts.
  v282: Belt body moved from transfer belt 1 (under the G-Cut exit) to transfer belt 2 (right before separator 1), as the trainer meant.
  v283: Turntable turning top has a closed frame (two 80 mm end pieces, two side rails) so the spokes end in it; frame outer edge stays 250 mm inside the belt ends.
  v284: Reverted the v283 frame. Turntable top has no cross bar at the ends: the spokes end bare, as on the real turntable.
  v285: Turntable top open on all 4 sides: outer edge spokes removed too, every spoke ends bare.
  v286: Turntable spokes clipped to one circle (radius min(H-250, LHW-10) = 800 mm): outer spokes shorter, so no spoke tip pokes over the belt edge at any turn angle.
  v287: Turntable spoke circle radius = min(H,LHW)-150 = 900 mm: spoke tips 150 mm from the belt edge at any turn angle.
  v288: Turntable grid no longer jumps back after a turn: drawn angle = gbase + rot, gbase accumulates each turn (mod 360) when the grid lowers.
  v289: "Full screen" button next to Reset view: browser full screen of the view card when allowed, otherwise the card covers the window (class fsOn, Esc leaves). Buttons and legend stay, section text under the view is hidden, drawing fills the rest.
  v290: "Cinematic" button: camera turns 1 deg every 170 ms (about one round a minute) via the Turn slider; stops on the button, on touching the Turn slider or on Reset view; paused while the tab is hidden.
  v291: Cinematic mode smooth: turns every animation frame by elapsed time (6 deg/s, fractional yaw via setCam), and fits the view to the whole drawn scene each frame (fitAll from #world bbox) so the whole machine and line stay centred.
  v292: Line drawing order fixed for cameras on the far side: lineSVG now always back+mid+front (belts/bodies under stacks, overhead parts over), only the far-side frames (separator and press frames, palletizer column) move with the camera side ("far"). With solid covers belt 1 is drawn from the machine end cover on, so it no longer shows through the delivery end.
  v293: Infeed stack no longer wiped by camera changes: buildStatic (called on every tilt/turn, so every cinematic frame) wrote the infeed top layer without the stack. Last drawn stack kept in INFSTK and reused.
  v294: Full-model render pass (survey every 30 deg, tilt 30/60, solid and see-through). Cover masks (setMasks/mkFit): with solid covers the infeed top layer and the prefeeder are masked by every camera-facing solid face (operator side with door glass at 40 %, drive side, roof over the infeed, delivery end), so they no longer draw over the machine from the far side or the delivery end. Mask area follows the visible view (cheap). Delivery chain wheel hidden with solid covers.
  v295: Real depth sorting for the line and the prefeeder: while LCAP is set every lbox becomes a piece with its 3D box (lAdd/lGrp), lSortSVG orders pieces whose screen outlines overlap (convex hull SAT) by a separating axis (along line, across, height), else the axis of least overlap; topological sort. Turntable belt+grid+hub grouped, robots grouped, each drum ring its own piece. Belt 1 inside the machine and the batches on it drawn in a machine layer (linIn) with solid covers, so the exit belt shows under the delivery end again. Platform drawn last when seen from the operator side (it is wholly on that side), first from the drive side.
  v296: Shingle stream on the prefeeder belt was hidden under the belt (sort put the bigger sloping belt over it). Sort fixes: an axis where one box lies (nearly) inside the other is no meeting side; if all are, the smaller box goes on top; loops are broken by dropping one guessed order inside the loop (wk list) instead of picking a random piece. Sloping belt frame + belt + shingle grouped (lGrp).
  v297: Solid covers: inside face of the far side wall drawn first (L0), so the end and side windows no longer look through the machine at the floor. Delivery lift post is a real thin box ending on the exit belt (was a flat strip through the belt). Second palletizer pillar + carriage side beam on the operator side. Four legs (lLegs) under belt 1, both separators, align table and rotation press.
  v298: Cinematic camera smooth through +-90: turns about the fixed middle of the whole scene (prefeeder to bottom-sheet belt), and the view is fitted each frame from the projected 3D corners of the scene (smooth in the angle) instead of the SVG bbox (which jumped when parts switched draw order), eased in over 0.9 s and low-pass filtered.
  v299: Infeed side align plates run from 20 mm behind the front guides to the back end of the suction belts (420 mm table), was 540 mm. Same change in 3d.html.
  v300: See-through covers: at the infeed only the red suction belts (and the board) are drawn; table frame, blue edges, support roller, traverse beam, ballscrews, stops, align plates and back stop only with solid covers. Same in 3d.html.
  v301: Grippers stick out 50 mm in front of the gripper bar (square ends) and bite 10 mm, so the bar runs 40 mm ahead of the sheet edge (GOUT/GOFF); photocells moved with it (PCB 100 mm). Same in 3d.html.
  v302: Undo the v301 bar shift: gripper bar back in its old place, photocells back (PCB 60 mm); the grippers now reach 50 mm out in front of the bar.
  v303: Grippers hold the 15 mm front waste at their tips: sheets are drawn 40 mm behind the bar (SHO), and everything matched to the sheet moves with them (die rules and creases, stripping tools, infeed feed end, front waste drop, delivery pile, photocell position on the sheet). Bar, photocells and covers unchanged. Same in 3d.html.
  v304: Bottom guillotine knife 30 mm wide along the feed (was 162 mm), centred under the upper part. Same in 3d.html.
  v305: The whole bottom guillotine knife is now 30 mm wide, the tall part too (it was 59 mm). Its cutting edge stays where it was. It is drawn after the lifting belt, which used to cover it, so you can see it now. Same in 3d.html.
  v306: Bottom guillotine knife moved 20 mm forward, toward the delivery end. Same in 3d.html.
  v307: The 3D view is now the main version. index.html opens in 3D, and the "View: 3D / classic" button switches back to the classic drawing. Browsers without WebGL 2 start in classic. 3d.html is the same file. Restore point for the last classic-only version: branch svg-v306.
  v308: Removed the blue door switches and the yellow-ring reset buttons from the see-through guard doors.
  v309: Drive side modelled from the trainer's photos. The drive-side wall now goes down to the floor and has the stripping window (1450 x 500) and the small delivery window (600 x 340, 1200 from the delivery end), both with the bottom edge at the bottom chain. Also added the grille panel and double door at die-cutting, the stripping-window platform (deck 1150 above the floor, with a steep ladder), the front-waste column with its slide into the floor conveyor, the control box on its stand, the delivery platform with stairs, and the waste extraction (cyclone with filter and bin, fan, hydraulic unit). Sizes not measured are estimates, kept together in DSM in the code.
  v310: The guessed drive-side delivery platform is replaced by the walkway across the front of the machine (delivery end): 1000 wide, 2600 long, centred on the machine, deck 800 above the G-Cut flooring. Stairs at the drive-side end: 3 grating treads 800 x 200, 200 apart. The flooring strip in front of the machine runs on under the stairs, with a short stair down to the hall floor (estimated).
  v311: The same 3-step stairs at the operator-side end of the front walkway, down onto the operator platform.
  v312: Both walkway stairs now reach 700 mm out from the walkway in all (3 treads 200 deep, 200 apart in height).
  v313: Drive-side platform, 800 wide and 2750 long, along the machine from the end of the walkway stairs, at the level of the operator platform. Railing on the outer side and at the far end, and a stair down to the hall floor at the front end (estimated). It replaces the guessed flooring strip.
  v314: The front walkway now ends 450 mm short of the drive side (measured) instead of being centred on the machine, so it reaches past the operator side.
  v315: Operator side measured: the panels stand 300 mm out from the chain (cables and mechanism behind them), and the windows sit 210 mm back from the panel face, with reveals round each opening. The operator platform, delivery end face and infeed guarding move out with the panels. The front walkway's operator-side end is 300 mm short of the operator-side panels.
  v316: Drive side measured: the panels stand 500 mm out from the chain (was about 300). The drive-side wall, roof, infeed guarding and everything modelled on the drive side move out with it.
  v317: Operator-side panels 350 mm out from the chain. Machine 3120 mm wide over the panels: the 2000 mm front window is 500 from the operator-side panel and 620 from the drive-side panel (measured), which puts the drive-side panels about 550 mm out from the chain.
  v318: Front window measured 2130 wide (not 2000): the machine is now 3250 mm wide over the panels (500 + 2130 + 620), so the drive-side panels stand about 680 mm out from the chain.
  v319: Front window 550 from the operator-side panel (not 500): the machine is 3300 mm wide over the panels (550 + 2130 + 620).
  v320: Front window 650 from the drive-side panel (not 620): the machine is 3330 mm wide over the panels (550 + 2130 + 650).
  v321: Gripper chains 2300 mm apart, centre to centre (measured; was an estimate of 2217), still centred on the sheet. Operator-side panels 450 mm out from the chain (measured). With 3330 mm over the panels the drive-side panels come 580 mm out from the chain.
  v323: Front waste grinder raised: its head now sits at the front-waste belt, about 2350 mm above the floor, with the motor on top and a longer slide down to the floor conveyor.
  v324: Front waste grinder redrawn after the photo: open cream stand on castors, grinder housing at the height of the front-waste belt and centred on it (green slide from the machine into the housing), upright gear motor on top, yellow cap on the delivery-side face, white chute running down toward the feeder into the floor conveyor, control box with push buttons, small box under it and beacon hanging on the delivery side of the stand.
  v325: The grinder's control box (and the small box under it) now sits under the grinder housing on the outer face of the stand, as on the machine; the beacon is on the housing and the chute leaves from the feeder side of the housing.
  v326: The grinder chute now starts right under the grinder housing and runs steeply down, leaning slightly toward the feeder, beside the control box, into the floor conveyor.
  v327: Stripping-window platform: the deck corner at the delivery end of the outer edge is cut off at 45 degrees to clear the grinder chute (skirt and railing follow the cut), and the ladder is now straight (vertical) on the outer edge.
  v328: Front waste grinder stands 300 mm out from the machine and about 400 mm further toward the feeder; the green slide runs from the front-waste belt over to it and the chute now passes the cut corner of the stripping platform.
  v329: The stripping-platform ladder moves to the feeder-side end of the platform, at the outer edge, still vertical; the end railing beside it is 400 mm lower (700 instead of 1100).
  v330: Front waste grinder pushed toward the delivery until its control box is against the end railing of the drive-side platform.
  v331: Walkway stairs: the outer hand rail now carries straight on from the walkway railing. 300 x 200 opening in the drive-side wall where the 300 wide front-waste belt comes out.
  v332: The drive-side platform now stands 150 mm off the machine instead of against it.
  v333: Front-waste belt and front-waste ejector moved 100 mm back toward the feeder (the waste now lands 100 mm further back, and the wall opening and window moved with the belt). The grinder housing has an inlet opening on the side toward the machine, and the green slide runs into it.
  v334: Waste extraction (cyclone with filter and bin, fan and its ducts) moved 1000 mm toward the feeder; the hydraulic unit stays.
  v335: Grinder housing made taller: the bottom of its inlet opening is now 20 mm below the bottom of the front-waste belt, so the green slide falls slightly into it.
  v336: The front-waste belt now runs straight out through the wall into the grinder inlet (no green slide); the inlet sits at the delivery-side edge of the housing, lined up with the belt, with only a strip of wall left beside it.
  v337: Front walkway legs: the middle legs that stood over the belt are gone; the walkway now stands only on legs at its very ends, clear of the exit belt and the line.
  v338: The Covers button is now "Machine: full / inside". Full shows the solid covers plus the grinder, waste extraction (cyclone, filter, fan) and hydraulic unit; Inside shows the see-through covers without that equipment (platforms, walkway and stairs stay in both). In Inside the front-waste belt stops at the machine side.
  v339: Removed the floor conveyor pit under the grinder chute. Rotation drum rings drawn as real round tubes in 3D (no more teeth on the edge). Cinematic turns 10% slower (5.4 degrees a second). Legs under the interleave board table.
  v340: Exit turntable after the palletizer (after the photo): the full pallet now drives across the line from the stacking belt over transfer rollers onto a round turntable with three belts (400 wide, 15 mm apart, the middle one 2200 long, side ones 1900 estimated). It turns -90 degrees, drives the pallet out over rollers onto an exit belt, and turns back +90. The next pallet waits until the turntable is back.
  v341: The exit turntable takes 5 s for each turn (was 2 s).
  v342: Stacking belt and bottom-sheet belt are now blue modular belts with yellow edges, like the exit turntable; the exit belt got yellow edges too.
  v343: The front walkway with its stairs, the drive-side platform and the stripping-window platform now also hide with "Machine: inside" and show with "Machine: full".
  v344: The infeed guarding (2000 x 2000 infeed door, corner posts and top rails) now also hides with "Machine: inside".
  v345: The operator-side stripping window is drawn as one 1440 x 1000 opening with a 20 mm black bar across the middle where its two sashes meet (one opens up, one down), instead of two separate windows.
  v346: Smoother 3D, especially in Cinematic: the drum rings and the exit turntable's plate, rollers and exit belt are drawn once into the static 3D scene instead of every frame; while Cinematic runs, the camera is redrawn every frame but the moving parts are rebuilt about 30 times a second, and the 3D picture is drawn at a slightly lower resolution on high-resolution screens.
  v347: The panelling on both sides is drawn 300 mm thick: inner faces with the same openings, window and opening tunnels through the thickness and closed end faces, so no gaps show at the edges. Align table: the front plate now comes back up only once the whole stack has passed it.
  v348: Interleave boards now turn with their stacks (on the exit turntable they used to stay pointing the old way).
  v349: The "View: 3D / classic" button is removed: the simulator always shows the 3D view. (A browser without WebGL 2 still falls back to the flat drawing so the page works.) The last version with the button is v348; branch svg-v306 keeps the last classic-only version.
  v350: Camera presets reworked for 3D: each tab now frames its part of the machine or line (the whole height and both panel sides) at the current tilt and turn, instead of the old classic screen rectangles that zoomed in too far. Die layout frames the die-cutting section. Exit turntable stands on a round base and the exit belt on a closed frame, like the palletizer belts.
  v351: Push-button panel under the G-Cut screen, copied from the machine: G-Cut plate (emergency stop, control voltage, master reset, suction fan, main drive with 0/180 selector, start, jog and stop, drive-lock key, side-guide centring, feeder 0/1) and Prefeeder plate (12 buttons and selectors). Emergency stop, master reset, start, stop (at 0 or 180 by the selector), jog and feeder 0/1 work like the side controls and their lamps follow the machine; the other buttons only change state and say what they are for, until their function is added.
  v352: Panel symbols redrawn closer to the machine (thin lines): blower housing with fan wheel, ribbed drive motor, side lays moving to the centre, feeder suction head over the feed table. 0° / 180° labels over the selector and the green button, rotation arrows round the jog button, 0 / 1 labels over the red and green lamps, and the selector levers drawn like the real ones.
  v353: Panel selectors stand in the middle and spring back: click the left or right half to turn them. Main drive selector: left stops at 0°, right stops at 180°. Feeder selector: left (0) stops feeding, right (1) feeds again. The prefeeder selectors turn the same way but are not simulated yet.
  v354: Panel buttons wired as on the machine: white button switches the infeed suction on/off (lamp lit while on; with it off no sheets are fed). Infeed selector: left to 0 stops feeding and stays there, red lamp lit, the infeed cannot be started; flick right to 1 to start feeding (green lamp). Green button starts the machine and is lit while it runs. Black button: hold to jog at 250 sheets/h, let go and the machine stops where it is. Red STOP stops the main motor and the machine and glows while the motor runs.
  v355: Panel red STOP is an instant stop: the machine stops where it is (no slow-down), the main motor shuts down and the feeder stops; start again with the green button.

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
  v210: the drum has a belt at the bottom AND at the top; it clamps from both sides (bottom belt lifts the stack while the top belt
  comes down, stack clamped in the middle of the drum), turns, then both belts open fully (bottom back to line level) before the stack may leave. A turned stack is drawn darker brown and its outline mirrored; printed underside then shows on top.
- Palletizer: blue belt strips on the carriage with steel forks between them; align plates are 3 white perforated panels per side.
  Sequence per batch: carriage to 200 mm above the stack → forks extend → lower until forks are 20 mm above the stack →
  align plates square the batch → forks pull out (batch drops) → plates open → carriage returns. Speed slowed 5% on request.
  "Additional alignment" batches (green numbers on 2400): after delivery the carriage goes 150 mm lower and squares again.
- Stacking belt plain; pallet drives out along the line.

## HMI (separator line screen)
- Copy of the Siemens line screen. Left column (icons copied from the photo): file cabinet = jobs menu, arrows = nothing yet,
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
- G-Cut control panel above the line panel, built in English from the photos (no brand logo). Production page done: current job, messages (last 3 log lines),
  status lamps, nav (Production, Settings, Machine, Jobs, Alerts, Safety), job data + Save correction, piece count (total / current stack, editable with pencil),
  speed −/+ (100 per step) and set field wired to the machine speed, output, functions (toggles visual only; empty cycles wired), stripping values (static),
  machine sketch (tap a section = zoom the 3D view; its settings menu comes later). Jobs page loads a job; Alerts shows the log. Settings = sheet delivery page on the photo (batch field works, the rest static); Machine waits for photos. Safety: 3D photo of the doors/covers with safety switches; the camera button (bottom left) turns the view operator side / machine side; Control on / Safety OK lamps live, Reintegration and Stop processes buttons static. The one red door icon (operator side) was recoloured blue on request. The photocell monitor moved into the G-Cut screen: tap the photocell drawn left of the delivery in the sketch. Stripping-exit photocell positions are set on Settings → Stripping station (AS top field, BS left field, ↙↗ 10 mm, link moves both). Settings → Platen press: photo only. Feeder: infeed stack height (top white field, 30–150 mm, default 60, saved with the job; grey = height now). After standby the infeed restarts above 40 mm, or at the set height if that is below 40. Settings order: photocells, exit / transport, delivery, stripping, platen press, feeder. Exit / transport is drawn (photo too blurred): lifting belt position (mm above the exit belts) and hold ↓ ↑ to move it by hand, also while running (a correction kept until the next stack change; not during the stack change); the rest static.

## Jobs
- Job dropdown in the header; changing job restarts the simulator.
- Incom 3P: 3 pieces 950 × 360, B-flute, batch 50, sheet 975 × 1100.
- Incom 6P: 6 pieces 1150 × 330, B-flute, batch 100, batch height 300, sheet 1175 × 2000; TT1 turns 90°, shift waits for 3 bundles, stack 6 high, interleave on 2 and 5.
- Atlantic Barcaffe: die drawing 1630 across × 1221 along (front edge 1650 incl. waste), 4 nested blanks (right pair turned against the left),
  one piece 610.5 × 883; B-flute, batch 50, print on the bottom side. Line breaks all 4 pieces (sep 1 610.5 / 610.5, TT1 90°, sep 2 815 / 815)
  and palletizes one per layer. the trainer sets up the rest (rotation, turning) himself. Blank outlines are simplified (no locking tabs / slits).
  Open: the trainer said "cutting tool and cutout design don't match" – not yet located; ask him for a screenshot.

- Tray 3P 590: 3 tray blanks 590 × 880 (1770 across), BC-flute (6.5 mm), batch 50 (325 mm, batch height 355, 5 bar), speed 6000 sheets/h,
  shift waits for 2 bundles, 6 layers high, interleave boards on 2, 4, 5 (board 1180 × 880), palletizer 1180 × 880. Outline simplified (no hand holes).
- Photocell second check point defaults to min(950, sheet length − 100) so short sheets do not trip.

## Still to do (asked to keep for later)
- Delivery settings: belt speed (default 50 %) and lifting-belt lower/raise time (default 0.5 s).
- Line-full photocell that stops the infeed when covered.
- Move the stripping-exit photocell left/right setting to its proper HMI menu (will send photos).
- Manual operation of sections (hand icon).
- Pallet turntable 8410 behaviour.
- MP4 videos (1000 / 3000 / 6500 sheets/h) for PowerPoint – on hold.
- Real stack-change timings from machine data (current estimates OK).

## 3D view (WebGL) – main view since v307 (index.html and 3d.html are the same file)
- Restore points: branch svg-v298 = the classic version before any 3D work; branch svg-v306 = the last classic-only version.
- 3d.html = v298 plus a "View: classic / 3D (new)" button. The model code is unchanged: while CAP is set, PJ returns the 3D point packed into
  its two numbers (x, round(z*1000)*1e7 + y + 5e6), f1 keeps full precision, and back-face culling is skipped. The world groups do not write to
  the page in 3D mode: their innerHTML setters keep the strings (GLV.STR), which are parsed into triangles (ear clipping), thick lines and
  even-odd hole polygons (stencil) and drawn with WebGL 2 and a depth buffer. Static scene is built twice (camera on each side) so both side walls exist.
- Coplanar cover decals keep their SVG order with a tiny depth bias (attribute od, groups L3/L5).
- Camera, tilt, turn, pan, zoom, cinematic are the same as classic; in 3D mode a camera move does not rebuild the scene.
- Preview 2: parsed elements cached by their text (ECACHE), no depth sort of line/prefeeder in 3D mode: a frame costs ~4 ms strings + ~4 ms parse/draw in the test browser (was ~22 ms). Right-drag or Shift+drag turns and tilts the camera round the middle of the view.
- Preview 3: die platen, stripping tools and lower tools move again in 3D (their group transform translate(0,ty) is applied as a 3D offset ty/c per group, MOVERS). Edge line depth bias cut to 4e-5 so inside edges no longer show through the covers. See-through parts 40 % lighter, flatter shading closer to the classic colours.
- Preview 4: SVG lines 3 or more wide (support roller, rods, forks, ejector axle) are drawn as real round tubes (10 sides, end caps) instead of flat screen ribbons.
- Open: text labels are the classic ones.
