# Warhammer 40,000: 10th → 11th Edition Upgrade Guide

Purpose: a change list for updating the FoundryVTT 10e module to 11e core rules.

Sources: the local copies in `rules/`. These are `10e-core-rules.md` (Core Rules Updates v1.8, Balance Dataslate v3.4) and `11e-core-rules.md` (June 2026). Both were converted from Wahapedia. Combat Patrol differences are in `core-vs-combat-patrol-rules.md`.

Each item is tagged by what it likely means for the module:

- **[DATA]**: a characteristic, keyword, status, ability or item definition changes or is added.
- **[LOGIC]**: roll, eligibility, timing or sequencing automation changes.
- **[UI]**: a prompt, choice or tracker the player needs to see.
- **[TEXT]**: reference or description text only.

The tags come from reading the module source in `foundryvtt-warhammer-40k-11th/`. Section 23 maps each change onto the actual files and lists problems already in the module.

## Caveats on the source text

- The popup (tooltip) bodies on the Wahapedia page are now included at the end of `rules/11e-core-rules.md` and `rules/11e-combat-patrol-core-rules.md`, under "Appendix: sub-rule text". This pass used them for sub-rules that were previously only titles.
- Some references still have no body anywhere on the page. In particular, **02.02.01 Modifiers** is cited by 01.05.03, 02.02.06 and 05.04.02, but its text is not on the page. So these 10e rules are still "not found" in 11e, not "removed":
  - The ±1 cap on the total modifier to hit, wound and save rolls. The module enforces it in code (`item.js`), so keep it until the rule is confirmed.
  - The 1 CP per round cap on other CP gains.
- Characteristic floors and caps are now found. See section 2.
- The 10e text has no rule numbers. The 11e text numbers every rule (`01.02.12`). Use those numbers as stable IDs in the module.
- I didn't compare the missions, since 11e's core page has no missions section. 10e's page included "Only War" and the "Muster Your Army" section.

## Top changes (highest impact for automation)

1. **Attack resolution is reworked.**
   - Attacks are now "attack dice" gathered per weapon, with "identical attacks" pooled.
   - Save allocation uses allocation groups, ordered, with saves rolled before any damage is applied.
   - Wounded models and CHARACTER ordering are handled by the group order, not by per-attack allocation.
2. **Cover now worsens the attacker's BS by 1**, not +1 to the save. This also covers Stealth, Smokescreen, Indirect Fire and Go to Ground.
3. **Engagement range is 2" horizontally and 5" vertically** (was 1" and 5"). Coherency is also new.
4. **The Fight phase is restructured.**
   - There is a separate Pile In step for everyone first, then a Fight step, then a Consolidate step for everyone.
   - Pile-in and consolidation used to happen per unit, around its attacks.
5. **Moves, shooting and fighting now have "types" with "modes"**, each with Eligible If / Before / While / After blocks. A unit may now be required to pick a mode, for example fall-back mode or consolidation mode.
6. **Battle-shock is different.**
   - It is a battle-shock roll made by the active player for every battle-shocked unit and every unit at or below half strength.
   - A unit stays shocked until it passes.
   - OC becomes "-" (not 0).
   - A shocked unit can't start actions.
7. **The core stratagem list has changed.** Go to Ground is gone. Grenade is now Explosives and Tank Shock is now Crushing Impact. Fire Overwatch, Heroic Intervention, Smokescreen, Counteroffensive and Epic Challenge have new timing, targeting or effects.
8. **Terrain is rebuilt.**
   - 10e had per-feature rules (Ruins, Woods, Barricades, Craters, Hills and so on).
   - 11e has terrain areas with three categories (Exposed, Light, Dense) and shared rules: Benefit of Cover, Hidden, Obscuring, Solid, Plunging Fire.
9. **Reserves are now only Strategic Reserves, arriving by "ingress move".**
   - The reserve cap is 50% (was 25%).
   - Arrival distances are 8" (was 9").
   - Units that haven't arrived by the end of round 3 are destroyed.
   - AIRCRAFT always start in strategic reserves.
10. **Army building changes to Detachment Points (DP).** Incursion and Strike Force only (no Onslaught), with different unit and enhancement limits and multiple detachments.

---

## 1. Core concepts (10e "Core Concepts" → 11e 01)

| Topic | 10e | 11e | Tag |
|---|---|---|---|
| Engagement range | Within 1" H / 5" V | Within **2" H / 5" V** (03.04). Models are "engaged" / "unengaged" | LOGIC, TEXT |
| Coherency | 2" H / 5" V of one other model (2–6 models), or of two others (7+ models) | Within 2" H / 5" V of at least one other model **and** within **9" H / 5" V of every other model** (03.03). Must be one contiguous group. Checked at the End of Turn step | LOGIC |
| Unmodified dice / auto-success | Defined under "Re-rolls" | 01.05.01: an automatic success skips the roll, triggers nothing that depends on a roll result, and is **not a critical hit or critical wound** | LOGIC |
| Re-rolls | Re-roll before modifiers | 01.05.02: same, and a re-rolled die still counts as a dice roll for triggers. Multi-dice sums are re-rolled in full | LOGIC |
| Highest / lowest die | Not covered | 01.05.07: on a tie the active player picks which die counts | LOGIC |
| Treated as / set to | Not covered | 01.05.08: a value "treated as" or "set to" X triggers rules as if X had been rolled, even above 6 | LOGIC |
| Leadership roll | Leadership test: 2D6 ≥ best Ld in unit | Leadership roll: 2D6 ≥ one or more Ld in unit. "Leadership test" is an alias (01.06) | LOGIC |
| Battle-shock | Test for units below half strength; shocked until your next Command phase | See section 4 | LOGIC, DATA |
| Visibility | True line of sight | Line of sight = a 1 mm straight line between any parts of the models. "Visible" / "fully visible" kept (06.01) | LOGIC |
| Edge of battlefield overhang | Not covered | FAQ: the controlling player draws line of sight from any non-overhanging part | TEXT |
| Distance measure | Closest point of base; "within" means ≤ | Same. Plus **FRAME** keyword: measure to the closest point of the model, not its base (17.02) | DATA, LOGIC |
| Replacing a model | Not covered | 01.02.12: place the new model centred on the old model's position | TEXT |

## 2. Datasheets (02)

| Topic | 10e | 11e | Tag |
|---|---|---|---|
| Invulnerable save | Listed as an ability on the datasheet | **A profile characteristic, InSv** (02.02) | DATA |
| OC characteristic | Number; battle-shocked units have OC 0 | Number or "-"; battle-shocked units have OC **'-'** (02.02, 01.07) | DATA, LOGIC |
| Move "-" | Can't move | Can be set up on the battlefield but otherwise can't move | DATA |
| Characteristic floors and caps | M ≥ 1", T ≥ 1, Sv not 1+, Ld between 5+ and 8+ (using the 10e limits), OC ≥ 0, A ≥ 1, and so on | Found in "When Modifying Characteristics" (02.02.06). After modifiers: M ≥ 1", T ≥ 1, Sv and InSv not 1+, **Ld not 4+ or 9+**, OC ≥ 0 (never '-'), Range ≥ 1", A ≥ 1, WS/BS not 1+ or 7+, S ≥ 1, AP not worse than 0, D ≥ 1. '-', '*' and 'N/A' can never be modified. A WS/BS modifier applies to every weapon the model has. Worsening AP is capped at 0 | DATA, LOGIC |
| Healing | Not covered in this doc | 02.02.04: regain wounds on a wounded model first; if all models are full, **revive** one destroyed non-CHARACTER model with 1 wound, never above starting wounds | LOGIC |
| Random characteristics | Per unit for Move; per model or weapon otherwise | 02.02.03: random **M** is rolled once for the whole unit when selected to move; random **A** is rolled when generating attacks, per weapon, then pooled; random **D** is rolled **when the defender has chosen the model** the attack is allocated to | LOGIC |
| Weapon ability syntax | `[RAPID FIRE X]` and so on | Same, plus **keyword-restricted** abilities, for example `[LETHAL HITS: VEHICLE]`, `[SUSTAINED HITS 1: INFANTRY/BEASTS]` (24.01) | DATA |
| Duplicate abilities | Not stated | Not cumulative; the controlling player picks one instance each time attacks are made (24.02) | LOGIC |
| Unit composition | n/a | A datasheet's attach lists can be overridden by the Munitorium Field Manual (FAQ) | TEXT |
| Keywords | Singular and plural are equivalent | Same. Multi-word keywords do not match their component words (FAQ) | DATA |
| Aura, Psychic, Wargear, Faction abilities | In "Datasheets" | Moved to section 22 | TEXT |
| **Damaged X** | Per-datasheet text (large vehicle damage tables) | New core ability: while wounds ≤ X, **-1 to hit rolls** (24.39) | DATA |

## 3. Attacks (04, 05, 06)

### 3.1 Shooting and fighting sequence

10e: select the unit, select targets, then resolve each attack one at a time (or with "fast dice rolling").

11e (04, 05):

1. **Select Weapons.** Per model: ranged, any number while shooting; melee, exactly one while fighting.
2. **Select Targets.**
   - Shooting: each target must be visible, in range and **unengaged**, unless a shooting type says otherwise.
   - Fighting: one or more engaged enemy units, up to the weapon's A.
3. **Resolve Attacks.**
   - Select an enemy unit.
   - **Gather attack dice**: A dice per weapon. **Identical attacks** pool together.
   - Run the attack sequence for the pool, then loop.

Identical attacks must share BS/WS, S, AP and D **and** be affected by the same applicable rules (04.03.01). Models whose target has cover against them are pooled separately from those whose target doesn't (FAQ).

Melee can split one weapon's attacks across targets, with at least one attack per target (04.03.02).

Tag: LOGIC, UI.

### 3.2 Attack sequence

| Step | 10e | 11e |
|---|---|---|
| Hit | 1 fails, 6 critical and always hits | Same: unmodified 1 fails, unmodified 6 is a critical hit; otherwise ≥ BS/WS hits. [TORRENT] auto-hits |
| Wound | Same S vs T table (2+/3+/4+/5+/6+) | Same table. Unmodified 1 fails, unmodified 6 is a critical wound |
| Allocation | Per attack, to a model of the defender's choice; must go to an already-wounded model | **Allocation groups** (see below) |
| Save | Rolled one at a time after allocation | One save roll per wounding attack, rolled together after the order is declared |
| Inflict damage | Per attack | Per save roll, **lowest result first**. Each is allocated to a model in the **current allocation group** (a wounded model if possible) |

**Allocation groups (05.03)** [LOGIC, UI]:

- One group per CHARACTER model.
- One group for all other models sharing the same W, Sv and InSv.
- The defender declares the order. A non-CHARACTER group with a wounded model goes first, and no CHARACTER group can be ahead of a non-CHARACTER group.
- Among CHARACTER groups, those with a wounded model come before unwounded ones.

**Inflict damage check order (05.04):**

1. An unmodified save roll of 1 always inflicts damage.
2. Invulnerable save: if the group has an InSv and the roll is ≥ it, the attack fails.
3. Sv modified by AP: if the modified roll is ≥ Sv, the attack fails.
4. Otherwise the attack inflicts damage.

**Attack pools after modification (05.03.02)** [LOGIC]: if hit or wound rolls change an attack (for example a critical hit turning into something else), split it into a new pool with its own profile. The active player picks which pool resolves first.

Feel No Pain: rolled in the Resolve Damage step (FAQ 05.04).

### 3.3 Mortal wounds and hazard rolls (06.02, 06.03)

| Topic | 10e | 11e |
|---|---|---|
| Mortal wound allocation | As for attacks | Select a model: wounded non-CHARACTER first, then other non-CHARACTER, then wounded CHARACTER, then any CHARACTER. Each loses 1 wound |
| Spillover | Spill unless the source is [HAZARDOUS] or [DEVASTATING WOUNDS] | Spill, except [DEVASTATING WOUNDS], which affects one model per critical wound (24.10) |
| Normal damage vs mortal wounds | Normal damage first | Normal damage first, then mortal wounds (same) |
| Hazardous test | Roll D6 per hazardous weapon after the unit attacks; a 1 gives **3 mortal wounds to a selected model with that weapon** | **Hazard roll** (06.03): D6, **a 1-2 fails**; the failing unit suffers **1 mortal wound** (**3 if every model is MONSTER/VEHICLE**). The unit makes one hazard roll per [HAZARDOUS] weapon selected (24.15). Mortal wounds go to the unit, not the bearer (FAQ) |
| Used by | [HAZARDOUS] | [HAZARDOUS], Desperate Escape, Combat Disembark, Emergency Disembark |

### 3.4 Visibility and terrain effects on attacks

See section 11.

## 4. Command phase and battle-shock (08, 01.07)

| Topic | 10e | 11e |
|---|---|---|
| Structure | 1. Command, 2. Battle-shock | 1. Start of Command Phase, 2. Gain Core CP, 3. Battle-shock step, 4. Command abilities, 5. End of Command Phase |
| CP gain | Both players gain 1 CP. Other CP gains capped at 1 per battle round | Both players gain 1 Core CP. The cap on other CP gains was not found in the captured text |
| Who rolls | Test for each of your units below half strength | **Active player** makes a battle-shock roll for each unit that is **battle-shocked** or **at or below half strength** |
| Roll | 2D6 ≥ best Ld | Leadership roll: 2D6 ≥ any Ld in the unit |
| Result | Failed: unit is battle-shocked until your next Command phase | **Fail: the unit and each model in it is battle-shocked.** A shocked unit that passes is no longer shocked. There is no timer; the status ends only on a pass |
| Effects of shock | OC 0; Desperate Escape when falling back; can't be targeted by stratagems | **OC '-'**; can't be targeted by stratagems; **not eligible to start an action** and an action in progress can't complete (01.07); forces Desperate Escape fall-back mode (09.07) |
| Half strength | "Below Half-strength": fewer than half the starting models | "At or below half-strength" (08.03) |
| Mission scoring | Not in this section | End of Command phase: non-mission rules first, then missions (08.05) |
| Multiple rolls | n/a | 08.03.01: a unit makes at most one battle-shock roll in this step, even if it is both shocked and at or below half-strength, unless a rule says otherwise |

Insane Bravery now makes that battle-shock roll automatically successful, and a shocked unit can't be targeted by it (FAQ 15).

Tag: LOGIC, DATA (status effects and OC "-"), UI.

## 5. Battle round structure (07)

| Topic | 10e | 11e | Tag |
|---|---|---|---|
| Turn parts | Five phases | Start of Turn step, five phases, End of Turn step (07.02). Each phase has its own Start and End steps | LOGIC |
| End of round | Not described | Step 3: non-mission rules, then missions (07.03) | LOGIC |
| Coherency check | End of every turn | End of Turn step | LOGIC |
| Warlord CP | Not stated | If a model's rule gives 1 CP at the start of the battle round "if this is your WARLORD", you don't gain it while the Warlord is destroyed (07.01, errata) | LOGIC |
| Out-of-phase rules | Described under "Out-of-Phase Rules" | 07.02.01: no other "phase-locked" rule can be used during an out-of-phase action (for example Fire Overwatch in the opponent's Movement phase doesn't trigger "in your Shooting phase" abilities) | LOGIC |
| Persisting effects | Described | 01.02.02: when a unit is placed in strategic reserves or embarks, note the effect and its duration. If it is set up again, effects still within their duration apply | LOGIC |

## 6. Movement phase (09)

10e had two steps (Move Units, Reinforcements). 11e has three: **Start of Movement Phase, Move Units Step, End of Movement Phase** (09). The reinforcements step is gone because reserves are now moves in the Move Units step.

### 6.1 Move selection

- Active player selects units one at a time. Units in strategic reserves and embarked units can be selected.
- Every unit must be selected before the phase ends, even if it just remains stationary (09.02).
- A unit then picks a move type: Remain Stationary, Normal, Advance, Fall-back, Disembark or Ingress. Tag: LOGIC, UI.

### 6.2 Move types

| Move | 10e | 11e |
|---|---|---|
| Remain Stationary | No models move | Same. Doesn't trigger rules for starting or ending a move |
| Normal | Up to M", can't end in engagement range | Up to M". **Must be unengaged after moving.** At most one per phase |
| Advance | Roll D6 and add to M. Can't shoot or charge | **Before moving, roll D6** (advance roll). After moving: unengaged, and **until end of turn not eligible to declare a charge or start an action** (shooting is handled by shooting types: only [ASSAULT] weapons) |
| Fall back | Can move through enemies; Desperate Escape tests per model that crosses an enemy | Choose a **mode** (09.07): **Ordered Retreat** (if not battle-shocked) or **Desperate Escape** (mandatory if battle-shocked). See below |
| Ingress | n/a (Reserves rules) | See section 13 |
| Surge | Out of phase; one per phase; can't when shocked or engaged | See section 7 |
| Pivot cost | Pivot value (1" or 2" for some models) | **No pivot cost** (03.01) |
| Moving through models | Friendly models yes. MONSTER/VEHICLE models can't be moved through other friendly MONSTER/VEHICLE models | Friendly models yes, enemy models no. MONSTER/VEHICLE models can move through non-MONSTER/VEHICLE models on normal or advance moves (17.01) |
| Terrain | Models can cross terrain 2" or lower freely, otherwise climb | See sections 7 and 11 |

**Fall-back modes** (09.07) [LOGIC, UI]:

- **Ordered Retreat:** no special effects. After moving: unengaged, and **until end of turn not eligible to shoot or declare a charge or start an action**.
- **Desperate Escape:**
  - Before moving, make a hazard roll for **each model in the unit**.
  - Models can be moved through enemy models.
  - After moving, if the unit isn't already battle-shocked, it must make a battle-shock roll.
- The old "Desperate Escape test" is now equivalent to those hazard rolls. Modifiers to the test apply to the hazard rolls (09.07.01).
- Unlike 10e, a Desperate Escape failure inflicts mortal wounds on the unit, not direct model removal. Models that FLY or are TITANIC are no longer exempt in the text I read.

**Modes in general (09.02.02)** [UI]: modes are mutually exclusive and checked in the order presented. A mode may be mandatory (consolidation) or optional (ordered retreat). Conditions on a move type labelled with a mode name apply only if that mode was chosen.

### 6.3 Flying (21.03)

| 10e | 11e |
|---|---|
| FLY models move over enemies on normal, advance and fall-back moves. Distance is measured through the air when starting or ending on a terrain feature | **Take to the skies:** declared before a FLYING unit makes a normal, advance, fall-back or **charge** move. Subtract 2" from the maximum distance. In exchange, ignore vertical distance, move through all models and all terrain categories |
| n/a | **Hover** (24.17): don't subtract 2" when taking to the skies. This replaces the 10e AIRCRAFT hover mode |

### 6.4 Monsters and Vehicles (17)

- Movement through other models: see 6.2.
- 10e "Big Guns Never Tire" is replaced by close-quarters shooting (section 7) plus 17.03. Engaged MONSTER/VEHICLE units can be targeted in the Shooting phase with **-1 to hit** (except [CLOSE-QUARTERS] attacks by models in a unit engaged with the target), and [BLAST] weapons can't target them (errata 17.03).

## 7. Shooting phase (10)

10e rules: a unit is eligible unless it Advanced or Fell Back; units within engagement range can't shoot except MONSTER/VEHICLE and [PISTOL].

11e: units pick a **shooting type**.

| Type | Eligible if | Effects |
|---|---|---|
| **Normal** (10.04) | Unengaged, didn't advance | Shoots normally |
| **Assault** (10.05) | Unengaged, advanced this turn, has [ASSAULT] weapons | Only [ASSAULT] weapons |
| **Close-quarters** (10.06) | Engaged, didn't advance, has [CLOSE-QUARTERS] weapons or is MONSTER/VEHICLE | May target engaged enemy units. MONSTER/VEHICLE models get -1 to hit unless using a [CLOSE-QUARTERS] weapon on a unit they're engaged with; [BLAST] can't target an engaged unit. Non-MONSTER/VEHICLE models may only use [CLOSE-QUARTERS] weapons against engaged enemies |
| **Indirect** (10.07) | Unengaged, didn't advance, has [INDIRECT FIRE] weapons | Targets not visible. Benefit of cover. No hit re-rolls. Unmodified 1-5 fails (1-3 if the unit remained stationary and the target is visible to a friendly unit) |
| **Snap shooting** (15.09) | Given by Fire Overwatch or another rule | One visible enemy within 24"; hits only on unmodified 6, those hits are not critical hits; no re-rolls |

After any shooting type, the unit can't start an action this phase.

Other notes:

- A unit can be "selected to shoot" even without ranged weapons: it just makes no attacks (FAQ). A unit with no valid target can't pick a shooting type that needs one.
- **Lone Operative** (24.24) no longer limits ranged targeting only. The unit is **not visible** to enemies unless they're within 12" (or the X" value), and can't be targeted by [INDIRECT FIRE] outside that range.
- 10e's "locked in combat" rule (can't shoot at units engaged with friendly units) is not found as a separate rule in 11e; close-quarters shooting handles it.

Tag: LOGIC, UI.

## 8. Charge phase (11)

| Topic | 10e | 11e |
|---|---|---|
| Structure | Select unit → targets → charge roll → charge move | Start / **Charge Step** / End. Sequence: declare charge → charge roll → attempt charge |
| Eligibility | Within 12" of an enemy; didn't advance or fall back; unengaged; not AIRCRAFT | Same restrictions (11.02) |
| Targets | Chosen **before** the roll, within 12", no visibility required | **Chosen at the start of the move** (after the roll): enemy units within 12" **and within the maximum distance** of the roll (11.04) |
| Success | Roll must reach engagement range of every target | After moving: engaged with **all** charge targets and not engaged with non-targets |
| Movement rules | Each model closer to a target; base contact if possible | Each model must end closer to a charge target; **within 1" of a target if possible**; engaged with a target if possible |
| Charge bonus | Fights First for the turn | **Fights First** until end of turn (11.04) |
| Rolling a 2 | Not mentioned | Never enough to complete a charge (can't be within 2" engagement range from outside) |
| Charging a model on terrain | Specific terrain rules | Governed by the terrain category movement rules (section 11) |
| Modifiers | n/a | Modifiers to the charge roll change the maximum distance used when picking targets (FAQ 02) |

Tag: LOGIC, UI.

## 9. Fight phase (12)

This is the biggest structural change. 10e: Fights First step, then Remaining Combats step. Each unit piles in, attacks, then consolidates.

11e steps: **Start of Fight Phase, Pile In, Fight, Consolidate, End of Fight Phase.**

| Part | 10e | 11e |
|---|---|---|
| Pile In | Per unit, right before it attacks | **Step 2**: every eligible unit piles in, turn player first. Max 3" |
| Who piles in | Models not in base contact with an enemy | Unit is eligible if engaged, charged this turn, or selected for an overrun fight. Pile-in must end engaged, and models in base contact don't move (12.03) |
| Targets | "Closer to the closest enemy model" | Select pile-in targets: all engaged units, or any enemy within 5" |
| Fight order | Fights First step, then remaining; **non-active player picks first** | **Turn player picks first**; alternate. Fights First units must be picked first; resolve Remaining Combats once none remain (12.04) |
| Who fights | A unit within engagement range or that charged | Engaged, or was engaged at the start of the step, or charged (12.04) |
| Fight types | One | **Normal fight** (engaged) or **Overrun fight** (unengaged, or became unengaged in the phase): one extra pile-in, then fights (12.05, 12.06) |
| Which models fight | In engagement range, or base-to-base chain | A model fights if the targets are **engaged** with it; the melee weapon targets must be engaged with the model (04.02) |
| Consolidation | Per unit right after attacking | **Step 4**: every unit that was eligible to fight can consolidate, turn player first (12.07) |
| Consolidation modes | One (toward enemy, else toward objective) | **Ongoing**, **Engaging** or **Objective** consolidation, chosen in that order (12.08) |
| Engaging / ongoing consolidation consequences | n/a | After the move, each engaged enemy unit that hasn't been selected to fight gets selected by your opponent; it becomes eligible to fight (errata to 12.08) |
| Pile-in / consolidation distance modifiers | n/a | A rule that says "can move up to 6"" changes the maximum distance to 6" (FAQ) |
| Counteroffensive | 2 CP; the unit fights next | See section 12 |

Tag: LOGIC, UI.

## 10. Datasheet abilities and weapon abilities (24)

### 10.1 New or changed

| Ability | 10e | 11e |
|---|---|---|
| [ANTI-X Y+] | Same | Same, plus **ANTI-NON-<keyword>** (FAQ) |
| [ASSAULT] | Shoot after Advance, only Assault weapons | Allows **assault shooting** (10.05) |
| [BLAST] | Adds 1 attack per 5 models; can't target engaged units | Same, now adds **attack dice**. New **[BLAST X]** form adds X per 5 models |
| **[CLEAVE X]** | n/a | New. If you target one unit only, add X attack dice per 5 models |
| [CLOSE-QUARTERS] | n/a | New. Replaces [PISTOL] for rules purposes. [PISTOL] is an alias and will be phased out (24.27) |
| [DEVASTATING WOUNDS] | Critical wound inflicts mortal wounds = D, no saves | Critical wound ends the attack sequence, target suffers mortal wounds = D, applied after normal damage, **damages at most one model per critical wound** (rest lost) |
| [EXTRA ATTACKS] | Attacks with this weapon plus one other melee weapon | Same. Select all [EXTRA ATTACKS] weapons plus one other if possible |
| [HAZARDOUS] | 3 mortal wounds to a model per failed test | One hazard roll per hazardous weapon selected (see 3.3) |
| [HEAVY] | +1 to hit if the unit remained stationary | +1 to hit if the unit is **unengaged, wasn't set up this turn, and no model moved more than 3"** (24.16) |
| [IGNORES COVER] | Target can't have cover | Same, including cover from rules like Stealth (24.18) |
| [INDIRECT FIRE] | -1 hit, 1-3 fails, target gets cover | Allows **indirect shooting** (10.07) |
| [LANCE] | +1 wound if charged | Same |
| [LETHAL HITS] | Critical hit auto-wounds | **Optional**: you may choose to roll to wound instead (so a critical wound is still possible) (24.23) |
| [MELTA X] | Within half range, +X damage | Same, applies until the unit's attacks are resolved |
| [ONE SHOT] | n/a | New. Once per battle |
| [PISTOL] | Shoot while engaged; can't be shot with other weapons | Identical to [CLOSE-QUARTERS] (24.27) |
| [PRECISION] | Allocate to a visible CHARACTER of an attached unit | At the start of the Allocation Order step, pick one allocation group containing a visible CHARACTER; that group becomes the current group. [PRECISION] + [DEVASTATING WOUNDS]: mortal wounds hit that group first (24.28) |
| **[PSYCHIC]** | Tag only | Weapon ability: ignore modifiers to BS/WS and to the hit roll; attacks are psychic attacks (24.29) |
| [RAPID FIRE X] | +X attacks within half range | Same, adds attack dice |
| [SUSTAINED HITS X] | Same | Same |
| [TORRENT] | Auto-hits | Same. Can't have [INDIRECT FIRE] or [PRECISION] |
| [TWIN-LINKED] | Re-roll wound | Same |
| Stealth | -1 to hit | **Benefit of cover** against ranged attacks (24.33) |
| Lone Operative | Can only be targeted by ranged attacks within 12" | Not visible to enemies beyond 12" (or X"); can't be targeted by [INDIRECT FIRE] beyond that. Variable-range form **Lone Operative X"** (24.24) |
| Deadly Demise | D6 on 6 before removal; before embarked units disembark | **After embarked units make their emergency disembark moves**, D6 on 6 (24.08) |
| Deep Strike | Set up in Reinforcements, more than 9" away | Part of ingress move: **more than 8" from all enemy units, even in the enemy deployment zone** (24.09) |
| Infiltrators | More than 9" from enemy deployment zone and enemy models | **More than 8"** (24.20) |
| Scouts X" | Normal move before turn 1 | Part of the pre-battle step. Strategic reserves scouts may deploy anywhere in your deployment zone; otherwise a **scout move** of X". Must end more than 8" from enemies (24.31, 24.32). DEDICATED TRANSPORT rules as before |
| Fights First | Fights First step | Fights First unit: every model in the unit must have it (24.13) |
| Firing Deck X | Select up to X embarked models | Same, ranged weapons excluding [ONE SHOT]; embarked units can't shoot this turn (24.14) |
| Feel No Pain | Same | Same |
| Leader | One Leader per bodyguard unit | **Leader and Support** (see section 14) |
| **Super-Heavy Walker** | n/a | New. Move through models (not TITANIC) and through terrain 4" or lower; can gain MOBILE for the move, and rolls D6 after it: 1 = battle-shocked (24.35) |
| **Damaged X** | n/a (datasheet text) | New core ability. See section 2 |
| Hover | AIRCRAFT hover mode | See 6.3 |

Tag: DATA (ability list), LOGIC (those that change rolls).

### 10.2 Other rules sections

| Topic | 10e | 11e |
|---|---|---|
| Aura abilities | Same | 22.01. Own model always in range |
| Faction abilities | n/a | 22.02. Apply only if the army faction matches |
| Psychic abilities | Same | 22.03. Wounds are "psychic attacks" |
| Wargear abilities | Same | 22.04 |
| Plunging Fire | Ruins only; improve AP by 1 if shooter is 6"+ high and all targets on ground | **Everywhere**: improve **BS** by 1 if the attacker is on a terrain section **3" or more** high, or is TOWERING and the target is within 12". Target must have a model at ground level (22.05). No effect for AIRCRAFT |

## 11. Terrain (13)

10e had per-feature rules: Craters and Rubble, Barricades and Fuel Pipes, Battlefield Debris and Statuary, Hills / Industrial Structures / Sealed Buildings / Armoured Containers, Woods, Ruins. 11e replaces them with **terrain areas**.

### 11.1 Placing terrain (13.01)

- A terrain area is the boundary of a base or mat, a single feature, or the boundary jointly defined by several features.
- Missions may define the area and which categories to include.
- A model on a higher floor still counts as in the terrain area (FAQ).

### 11.2 Categories (13.02 to 13.05)

| Category | Examples | Effect |
|---|---|---|
| **Exposed** | Craters, razorwire, scattered debris | No movement or visibility effects |
| **Light** | Barricades, low walls, statuary | Cover; doesn't block movement |
| **Dense** | Buildings, ruins, armoured containers, woods | Blocks sight and movement for larger models; has the **Solid** rule |

### 11.3 Movement through terrain (13.06)

- **Exposed and Light:** all models can move horizontally and vertically through them.
- **Dense:**
  - INFANTRY, BEASTS, SWARM or MOBILE models move horizontally through it. INFANTRY, BEASTS and SWARM also move vertically.
  - Other models can pass only through sections 2" or lower, and otherwise must climb (ascend/descend, not through floors or ceilings, can't end mid-surface).
- **Vertical movement:** stay within 1/2" of the terrain feature. Vertical distance counts toward the move.
- **Setting up or ending on a terrain surface** (not ground level): INFANTRY, BEASTS, SWARM, FLY or MONSTER; stable; no base overhang.
- **Solid terrain:** a model can't end a move with any part through an enclosed section of a Solid feature 3" or less from ground, even through doors or windows.

### 11.4 Terrain and visibility (13.07 to 13.11)

| Rule | Text |
|---|---|
| **Benefit of cover** (13.08) | Unit has cover against a ranged attack if **every model** in it is INFANTRY/BEASTS/SWARM in a terrain area, **or** not fully visible because of terrain or an obscuring area. Effect: **worsen BS by 1** (not +1 to the save as in 10e). 10e's "Sv 3+ or better gets no cover against AP 0" exception was not found in 11e |
| **Hidden** (13.09) | INFANTRY/BEASTS/SWARM in a terrain area with light or dense features, whose unit didn't make ranged attacks this or last turn. Only visible to enemies within the **detection range** (15" by default) |
| **Obscuring** (13.10) | A terrain area with one or more light or dense features. If every line of sight between two models crosses such an area (not counting areas either model is in), they aren't visible to each other |
| **Solid** (13.11) | Dense features. Line of sight can't be drawn across enclosed gaps 3" or lower from ground |
| **Gone to ground** (13.11.01) | A hidden model not fully visible because of dense terrain whose unit hasn't fired this or last turn: -3" to its detection range |
| Hidden / first turn (13.09.01) | On the first turn, "didn't happen last turn" conditions count as true |

Tag: DATA (terrain categories on scene regions or tiles, if the module has them), LOGIC (cover and visibility), UI.

## 12. Stratagems (15)

### 12.1 General rules

| Topic | 10e | 11e |
|---|---|---|
| Use limits | Same stratagem once per phase | Same, **plus each player can't target the same unit with more than one stratagem per phase** (unless stated) |
| Sequence | Pay CP, resolve | Select targets, pay CP (including optional +CP sections), resolve (15.01) |
| Optional CP | n/a | Some stratagems have +CP options (for example Heroic Intervention). The base cost is the original cost; extra CP is not a modifier (FAQ) |
| Increased CP cost | Not covered | If the opponent can't pay the increased cost, no CP are spent and no effect, but the stratagem still counts as used this phase (FAQ) |
| Categories | Battle Tactic, Epic Deed, Strategic Ploy, Wargear | **Not used.** Each core stratagem is just "Core Stratagem" |
| Timing icon | Either / your / opponent's turn | Same ("Used in") |
| 10e errata blocks | Many (closer set-up range, AP worsening, CP modifiers and so on) | Not carried over. They were 10e-era patches |

### 12.2 Core stratagem comparison

| Stratagem | 10e | 11e |
|---|---|---|
| **Command Re-roll** (1 CP) | After an Advance roll, Charge roll, Desperate Escape test, Hazardous test, or a hit, wound, damage roll or save for a model. "Fast dice rolling" note | Rolls: advance, charge, damage, hazard, hit, save, wound, number of attacks. If rolling several dice together, select one to re-roll (**charge rolls re-roll in full**) |
| **Counteroffensive** (2 CP) | Fight phase, after an enemy fights. Unit within engagement range that hasn't been selected fights next | Fight step of the opponent's phase after an enemy unit resolves attacks; target any friendly unit **eligible to fight**; **gains Fights First** and **must be selected next** |
| **Epic Challenge** (1 CP) | When a CHARACTER unit within engagement range of an **Attached** unit is selected to fight | Just after **any friendly CHARACTER unit** is selected to fight; one CHARACTER model's melee weapons gain [PRECISION] |
| **Insane Bravery** (1 CP) | Before a battle-shock **test** | Before a battle-shock **roll**; it auto-succeeds. Once per battle (same) |
| **Grenade** → **Explosives** (1 CP) | Your Shooting phase. A GRENADES unit that didn't advance, fall back or shoot, unengaged. 8" visible target, 6D6 on 4+ = mortal wound | Your Shooting phase. A friendly **unengaged EXPLOSIVES/GRENADES** unit that is eligible to shoot and didn't advance. Same 8" and 6D6 on 4+. "Grenade" is an alias (errata) |
| **Tank Shock** → **Crushing Impact** (1 CP) | After a **VEHICLE** ends a charge move. Roll D6 equal to T; 5+ = mortal wound (max 6) | After a **MONSTER/VEHICLE** ends a charge move. Roll D6 equal to T of the selected model; **each 1 = a mortal wound to your unit**, each 5+ = a mortal wound to the enemy (max 6 per unit). "Tank Shock" is an alias |
| **Rapid Ingress** (1 CP) | End of opponent's Movement phase; Reserves unit arrives as in Reinforcements | Same timing; a unit in **strategic reserves** (not AIRCRAFT) makes an **ingress move**. Not in the first battle round |
| **Fire Overwatch** (1 CP) | Opponent's Movement **or** Charge phase, when an enemy is set up or starts or ends a move or declares a charge. Unit within 24"; if visible, it shoots; hits only on 6; once per turn; not TITANIC | **End of opponent's Movement phase** only. One friendly **unengaged** non-TITANIC unit shoots using **snap shooting** (24" visible target, hits on 6 but not critical, no re-rolls) |
| **Go to Ground** (1 CP) | INFANTRY unit gets a 6+ invulnerable save and cover | **Removed** |
| **Smokescreen** (1 CP) | After an enemy selects targets; SMOKE unit has cover and Stealth | **Start of opponent's Shooting phase**; SMOKE unit: attacks targeting it, or targeting a unit not fully visible because of models in the SMOKE unit, give the target cover |
| **Heroic Intervention** (1 CP, +1 CP option) | Just after an enemy ends a Charge move; unit within 6" declares a charge against that enemy | **End of opponent's Charge phase.** Target: unengaged unit within 12" of enemies (a VEHICLE only if CHARACTER or WALKER). Resolve a charge with a mode: **Leap to Defend** (charge targets are enemy units that made a charge move this phase and are in range) or **Into the Fray** (**+1 CP**; charge roll capped at 6; targets any enemy within 6" of your unit and in range) |

Tag: DATA (the stratagem list and costs), LOGIC (timing and targeting), UI.

## 13. Reserves, ingress and aircraft (20, 23)

### 13.1 Reserves

| Topic | 10e | 11e |
|---|---|---|
| Terms | Reserves and Strategic Reserves | **Strategic reserves** only (20) |
| Cap before battle | **25%** of points (250 / 500 / 750 for Incursion / Strike Force / Onslaught) | **50%** of your points limit (20.01) |
| Cap after battle starts | n/a | Doesn't apply during the battle (FAQ) |
| When they arrive | Reinforcements step of Movement phase, from round 2 | An **ingress move** during the Move Units step, from round 2 (20.03) |
| Set-up location | Round 2: wholly within 6" of any edge, not in the enemy deployment zone. Round 3+: wholly within 6" of an edge. More than 9" from enemies | **Wholly within 6"** of one or more battlefield edges and **more than 8" from all enemy units**. Before the third battle round, not within the opponent's deployment zone (20.04) |
| After arrival | Counts as having made a Normal move | **Until the start of the next Charge phase, can't make any other type of move.** Can still shoot and charge in the normal way |
| Units that haven't arrived | Destroyed at the end of the battle | **Destroyed at the end of the third battle round** unless they've made an ingress move (exceptions: units embarked in a transport that has made one, and repositioned units) (20.04); destroyed at the end of the battle in any case (20.01.02) |
| Repositioned units | n/a | New. Units removed from the battlefield into strategic reserves mid-battle (20.02). Some rules, such as effects with durations, persist |
| Deep Strike | Separate Reserves rule | Part of ingress move (see 10.1) |

### 13.2 Aircraft (23)

| Topic | 10e | 11e |
|---|---|---|
| Deployment | Start in Reserves | Must be placed in strategic reserves (23.01) |
| Movement | Normal move only, 20" minimum, move straight, pivot up to 90°, no Advance/Fall Back/Remain Stationary. Off the table = placed in Strategic Reserves | **Only ingress moves** (23.02). At the end of the opponent's turn, all AIRCRAFT on the battlefield return to strategic reserves |
| Engagement | Normal move allowed even if engaged. Other units can pass over them | Units can move through AIRCRAFT; engagement solely with AIRCRAFT doesn't block normal or advance moves; AIRCRAFT are ignored when selecting enemy units for pile-in, consolidation or surge unless the mover can FLY (23.02) |
| Shooting | n/a | Plunging Fire has no effect on or from AIRCRAFT (23.03) |
| Charge / fight | AIRCRAFT can't charge; only FLY units can charge them or fight them | Same (23.04) |
| Hover | Mode declared during Declare Battle Formations | Replaced by the Hover ability (6.3) |

Tag: LOGIC, DATA.

## 14. Transports (18)

| Topic | 10e | 11e |
|---|---|---|
| Embark | After a normal, advance or fall-back move if every model is within 3" | Same, plus: unit wasn't set up this turn, is eligible to embark per the datasheet, and the TRANSPORT has capacity (18.02) |
| Capacity | Declared before set-up | Several units can be embarked; declared in Declare Battle Formations (18.01) |
| Dedicated transports | Must start with a unit embarked or count as destroyed in round 1 | Each DEDICATED TRANSPORT without an embarked unit at the end of Declare Battle Formations is destroyed (no destruction triggers) |
| Disembark | One type, 3" | **Disembark move with modes** (18.04) |
| Destroyed transport | Disembark, D6 per model (1 = mortal wound), unit battle-shocked | Emergency disembark move (18.05) |
| Other disembark moves | n/a | Assault Disembark (18.06), Shock Disembark (18.07) |

**Disembark modes** (18.04) [LOGIC, UI]:

| Mode | When | Set-up | After |
|---|---|---|---|
| **Rapid** | The TRANSPORT made a normal or ingress move | Within 3". If the TRANSPORT made an ingress move, the models follow the same restrictions | Not eligible to declare a charge |
| **Tactical** | The TRANSPORT remained stationary or hasn't been selected to move yet | Within 3" | The unit can make a normal or advance move |
| **Combat** | Otherwise (for example the TRANSPORT is engaged) | Within **6"**, can be set up engaged with units the TRANSPORT is engaged with. **Hazard roll per model before moving** | The unit is **battle-shocked** and can't declare a charge |

**Emergency disembark** (18.05) [LOGIC]:

- Triggered when the TRANSPORT is destroyed, before it is removed.
- The set-up distance is 6". Make a hazard roll per model first.
- Set up unengaged if possible, else engaged.
- Models that can't be set up are destroyed.
- The unit is battle-shocked and can't declare a charge this turn.

**Other transport rules:**

- A disembarking unit can't have embarked this phase, and the TRANSPORT must not have advanced or fallen back.
- Embarked units are "not on the battlefield" (01.02.04). Abilities needing measurement or visibility can't work (FAQ).
- Firing Deck weapons don't keep other models' abilities (FAQ 24).

## 15. Attached units (19)

| Topic | 10e | 11e |
|---|---|---|
| Joining | **Leader** ability: one Leader per bodyguard unit | **Leader** and **Support**: one of each per bodyguard unit unless stated (19.01). Support units **must** be attached when mustering (25.04) |
| Toughness | Use the bodyguard's T | Highest T among bodyguard models (or highest among leader/support if no bodyguard remains) (19.02) |
| Allocation to CHARACTERs | Attacks can't be allocated to CHARACTER models while the bodyguard survives | **Replaced by allocation groups** (CHARACTER groups last) and [PRECISION] (section 3.2, 10.1) |
| Keywords | Attached unit "treated as a single unit" | **Has all keywords of its component units**; individual models don't gain keywords (19.03). Destroyed models stop contributing (FAQ) |
| Abilities | Not detailed | Rules on a single model stay on that model. Unit-wide abilities apply to the whole attached unit until their source dies (19.04 table) |
| Destruction triggers | Per component unit | Triggered when the **last model that started the battle in the attached unit** is destroyed (19.02) |
| Starting strength | Sum of both units | 01.02.01: the models in the attached unit at the start of the first battle round. A unit **at half-strength** has exactly half; **below** half-strength has fewer. For a 1-model unit, compare wounds to W. A model or unit that can't be halved evenly can't be *at* half-strength, only below it |

## 16. Objectives (14)

| Topic | 10e | 11e |
|---|---|---|
| Objective markers | 40 mm marker; within 3" H / 5" V | **Terrain objectives** (a terrain area is the objective, range = within the area) or **objective markers** (when the point isn't in a terrain area) (14.01) |
| Control | Highest OC total at end of any phase or turn wins; tie is "contested" | Same, but a tie leaves the objective **not controlled by either player** unless **secured** (14.02). Control is determined first thing at the end of each phase and turn (14.02.01) |
| Models | "Can't end a move on top of a marker" | Markers can be moved through and ended on top of (14.01.01) |
| Unit controlling | n/a | A unit is "controlling" an objective you control if it's in range with at least one OC ≥ 1 model (14.02) |
| Secured objectives | n/a | A secured objective stays yours until the opponent has a higher level of control at the end of a phase (14.03) |
| FAQ | n/a | A model's OC counts toward every objective in range; a unit can control more than one objective |
| 'Objective marker' in rules | Used everywhere | Means "objective" outside the Core Rules (FAQ) |

## 17. Actions (16)

New in core. In 10e, actions came from mission packs.

- **Performing actions** (16.01): each action has Starts, Units, Use limit, Completes and Effect.
- **Eligible to start** (16.01): not off the battlefield, not AIRCRAFT/FORTIFICATION, not battle-shocked, OC > 0, not engaged (TITANIC exempt), no advance/fall-back this turn, no other action started this turn.
- **Starting an action:** until end of turn the unit isn't eligible to shoot (TITANIC exempt) or declare a charge.
- **Completing:** a move other than pile-in or consolidation, or leaving the battlefield, prevents completion. Becoming battle-shocked stops the action.

Tag: DATA, LOGIC, UI.

## 18. Surge moves (21.01, 21.02)

| 10e | 11e |
|---|---|
| Once per phase, can't when shocked or engaged | Not battle-shocked, **unengaged**, **hasn't moved this phase**. Moves toward the **closest enemy unit** (surge target), ending engaged if possible. Can't end engaged with non-targets; can't move again this phase |

## 19. Muster your army (25)

| Topic | 10e | 11e |
|---|---|---|
| Battle sizes | Incursion 1000, Strike Force 2000, **Onslaught 3000** | Incursion 1000, Strike Force 2000. **Onslaught is not listed** |
| Detachments | One | **Detachment Points (DP)**: Incursion 2, Strike Force 3. Select multiple detachments, none twice; an Incursion player may pick a 3 DP detachment as their only one |
| Enhancements | Up to 3 total, max one per unit, must be unique | Limit per battle size: **Incursion 2, Strike Force 4**. Max one per unit (including attached units); each enhancement unique |
| Unit limit | 3 per datasheet; **6** for BATTLELINE or DEDICATED TRANSPORT | Incursion **2**, Strike Force **3**; BATTLELINE and DEDICATED TRANSPORT units **double**; every EPIC HERO is **1** |
| Upgrades | n/a | A kind of enhancement. Can go on non-CHARACTER units. Up to 3 of the same Upgrade; the 2nd and 3rd don't count toward the enhancement limit but still cost points |
| Warlord | Select one CHARACTER model | Select a CHARACTER **unit** that has the army faction keyword, then a CHARACTER model in it. A rule saying a model "cannot be your WARLORD" takes precedence over one saying it "must be" |
| Attach leaders | During Declare Battle Formations | During roster building (25.04). In battle, "Muster Armies step" |
| Faction keyword | Same | Same. Units must be available to the army faction |
| Support unit rule | n/a | Each support unit must be attached to a bodyguard unit |

Tag: DATA, UI.

## 20. Rules concepts that were added without a 10e equivalent

- Rule numbering (all rules).
- Move, shooting and fight **types** and **modes** (03, 09, 10, 12, 18).
- **Core CP** terminology (08.02).
- **Terrain areas** and **terrain objectives**.
- **Hidden / detection range / gone to ground.**
- **Plunging Fire** as a universal rule.
- **Take to the skies.**
- **Actions** in core.
- **Repositioned units.**
- **Allocation groups** and **attack pools**.
- **Hazard rolls** as a general mechanic.
- **FRAME** keyword.

## 21. Things removed or no longer in the core text

- Go to Ground stratagem.
- Pivot value table.
- "Big Guns Never Tire" as a named rule.
- AIRCRAFT Hover mode and 20" minimum aircraft move.
- Reinforcements step and the "Reserves unit" concept.
- Per-feature terrain rules and Battlezone-specific terrain guidance.
- Stratagem categories.
- Onslaught battle size (not in the 11e core muster table).
- The 10e stratagem errata block.
- The Hints and Tips sections (dice-rolling and model-handling advice).
- Missions, including Only War (11e's core page has no missions section).

## 22. Suggested module work order

1. **Data model (DATA):**
   - InSv as a stat, OC "-", keyword additions.
   - Weapon and core ability list from section 10.
   - Battle-shocked and hidden statuses.
   - Terrain category tags.
2. **Core roll pipeline (LOGIC):**
   - Attack dice pooling.
   - Allocation groups.
   - Cover as a BS modifier.
   - Hazard rolls.
   - Mortal wound allocation.
3. **Phase flow (LOGIC, UI):**
   - Start and End steps.
   - Pile In and Consolidate as separate steps.
   - Move, shoot and fight type or mode pickers.
4. **Battle-shock (LOGIC):** the new roll, OC "-" and action restrictions.
5. **Stratagems (DATA, LOGIC):** update the list, costs and timings from section 12.
6. **Reserves and transports (LOGIC):** ingress, disembark modes, emergency disembark, aircraft.
7. **Muster rules (DATA, UI):** DP, enhancement and unit limits.
8. **Terrain and visibility (LOGIC):** Hidden, Obscuring, Solid, Plunging Fire, detection range.
9. **Reference text (TEXT):** descriptions, tooltips and any rule numbers shown to players.

## 23. Mapping onto the module

The module in `foundryvtt-warhammer-40k-11th/` is a 10e implementation that has been partly renamed. It works at the model level: there are no units, turns, army, CP/VP rules or reserves. The attack automation is the large piece to change. Paths below are relative to that folder.

### 23.1 Fix first: the rename is incomplete

- `system.json` has `id: warhammer-40k-11th`, but `module/constants.js:1` still has `SYSTEM_ID = "warhammer-40k-10th"`. Settings, flags, sheet registration, `dragRuler.registerSystem` and the chat template path (`systems/${SYSTEM_ID}/...`) all use it. The id must match the folder name Foundry installs it under.
- `module/apps/phase-hud.js:10` hard-codes `systems/warhammer-40k-10th/templates/apps/phase-hud.hbs`. Use `SYSTEM_ID`.
- `README.md` and the comments in `importer.js` still say 10th. [TEXT]
- Existing worlds saved under the 10th id won't carry over. Decide whether that matters.

### 23.2 Files and what changes

| File | What it does now | 11e change | Sections |
|---|---|---|---|
| `module/items/item.js` `fullAttack`, `_singleAttackRoll` | Per model, per attack: hit, wound, save, damage, one at a time. Name-matches weapon tags | **Rewrite** around attack-dice pools and allocation groups (3.1, 3.2). Most of the other rows below plug into this | 3, 10 |
| `item.js` `_calcSaveTarget` | Cover gives +1 save (not if Sv ≤ 3+ and AP 0). Invuln used when better | Remove the save bonus and the 3+/AP0 exception. Apply cover as **BS worsened by 1** on the hit roll. Invuln check order per 05.04: unmodified 1 fails, then InSv, then Sv with AP | 2, 3.2, 11 |
| `item.js` hit roll | Modifier clamped to ±1. Unmodified 1 fails. Crit is 6 or a modifier-supplied threshold | Keep the clamp until 02.02.01 is confirmed. Cover now enters here as a BS penalty. Add auto-hit rules from 01.05.01: auto-hits are not critical | 3.2 |
| `item.js` hazardous | One D6 per model after attacking: 1 means 3 mortal wounds (CHARACTER/MONSTER/VEHICLE) or "unit destroyed" | **Hazard roll**: D6, 1-2 fails. One roll per [HAZARDOUS] weapon. 1 mortal wound to the unit, or 3 if every model is MONSTER/VEHICLE | 3.3 |
| `item.js` devastating wounds | Critical wound skips the save and deals full damage | Ends the attack sequence. Mortal wounds equal to D, applied **after normal damage**, at most one model per critical wound | 10.1 |
| `item.js` lethal hits | Critical hit auto-wounds | Optional: the player may roll to wound instead | 10.1 |
| `item.js` heavy | +1 to hit, applied always when the tag is present | Only if unengaged, not set up this turn, and no model moved more than 3" | 10.1 |
| `item.js` indirect fire | -1 to hit, cover for the target, chosen by LOS | Indirect shooting type: no hit re-rolls, unmodified 1-5 fails (1-3 if stationary and the target is visible to a friendly unit); benefit of cover | 7 |
| `item.js` rapid fire, blast, melta | Name matching; blast adds `floor(targets/5)`; melta and rapid fire use half range | Same rules, but they add attack **dice**. Add [BLAST X], [CLEAVE X], [CLOSE-QUARTERS] / [PISTOL], [ONE SHOT], [PSYCHIC] | 10.1 |
| `item.js` anti-X | Adds the threshold to the crit list | Add ANTI-NON-<keyword> | 10.1 |
| `item.js` `_inMeleeRange` | Within 1", or base-to-base chain, with a `melee_generosity` setting | **2" engagement range**. A model fights if the targets are engaged with it (04.02) | 1, 9 |
| `item.js` `_inRange` | Lone Operative fixed at 12" via the `loneOperative` boolean | Lone Operative is a visibility rule with an optional X". Boolean is not enough if X varies | 10.1 |
| `module/actors/warhammerModelData.js` | Move, T, Sv, W, Ld, OC as non-null numbers. `invulnsave`, `feelnopain`, `loneOperative`. Modifiers for hit, wound and cover | OC must allow "-" (battle-shock). Ld range is 5+ to 8+. InSv is already a field, so make sure the importer keeps filling it. `cover` becomes a BS modifier. Add the floors from section 2 | 2 |
| `module/warhammer.js` `CONFIG.statusEffects` | battleshocked, suppressed, stealth, cover, advance, fallback | Keep battleshocked, cover, advance, fallback. Add **hidden**. Stealth is now just benefit of cover. "Suppressed" has no 11e core meaning. Battle-shocked now also means OC "-" and no actions | 4, 11 |
| `module/warhammer.js` legacy chat buttons (`.roll-attacks`, `.roll-wounds`, `.roll-saves`, `.apply-damage`) | A separate, simpler attack flow. It ignores cover, hit modifiers, tags and mortal wounds | Decide whether to delete it or bring it in line. It has its own copy of the wound table and save logic | 3 |
| `module/combat.js` | Phases `command, movement, shooting, charge, fight` as a flag; the active army gains 1 CP at the start of its Command phase | Add Start / End steps and the Fight sub-steps (Pile In, Fight, Consolidate). **Both players gain 1 Core CP each turn** (08.02), not only the active one. CP cannot be spent yet, since stratagems aren't implemented | 4, 5, 9 |
| `module/apps/phase-hud.js` | Advance, charge, fall back, pile-in, consolidate buttons that post chat messages | Advance roll is before moving (matches). Fall back needs a mode (Ordered Retreat / Desperate Escape). Consolidate needs modes (Ongoing / Engaging / Objective). Charge roll is made before targets are chosen. Show shooting-type and fight-type pickers | 6, 7, 8, 9 |
| `module/actors/warhammerObjectiveData.js` | `captureRange` default 3" | Objective marker range unchanged. Add the terrain objective variant, where the range is the terrain area itself, and secured objectives. Battle-shocked OC '-' counts as 0 for control | 16 |
| `module/actors/actor.js` `updateObjective` | Highest OC wins; a tie is "Contested" | A tie means **neither player controls it** unless it is secured. Captured status is determined at the end of every phase and turn | 16 |
| `module/actors/actor.js` `_applymodifiers` | Merges `grants` modifiers | Existing bug: `dest[key].concat(src[key])` discards its result, so array-type grants (re-rolls, crits) are never merged. Fix it before relying on grants for 11e abilities | none |
| `module/importer.js` | Imports a roster (.roz / BattleScribe) into actors; reads Invulnerable Save and Lone Operative abilities | 11e datasheets list InSv as a characteristic and may add Damaged X, Leader/Support, keyword-restricted weapon abilities. Re-check against the 11e data files. It has no army-building checks, so DP and unit limits need no work unless you add them | 2, 19 |
| `templates/attackdialog.hbs` | Fire Overwatch checkbox with a hit-on-N value, "has cover?" checkbox, hit/wound modifier fields | Overwatch becomes **snap shooting**: 24" range, hits only on 6, not critical, no re-rolls. Rename the cover checkbox or keep it as the trigger for the BS penalty | 7, 12 |

### 23.3 Things the module does not implement, so the doc's changes there are not needed yet

The README lists these as not implemented: units, auras, conditional active effects, and automatic cover from line of sight. It also lists turns and CP/VP tracking, but `combat.js` now has a basic version of both (a phase flag and per-army CP/VP counters). That means most of sections 4 to 9 and 12 to 19 only matter if you want to add them. The ones that change something the module already does are in 23.2.

If scope is limited, the minimum set that makes attacks correct for 11e is: engagement range 2", cover as a BS penalty, hazard rolls, devastating wounds, lethal hits (optional), heavy, snap shooting, and the weapon ability additions.
