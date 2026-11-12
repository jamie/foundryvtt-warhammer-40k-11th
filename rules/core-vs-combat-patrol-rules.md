# Warhammer 40,000 11th Edition: Core Rules vs. Combat Patrol Core Rules

Sources (fetched 2026-11-11):

- **Core Rules:** https://wahapedia.ru/wh40k11ed/the-rules/core-rules/ (listed as "Warhammer 40,000 Core Rules", Rulebook, June 2026)
- **Combat Patrol Core Rules:** https://wahapedia.ru/wh40k11ed_cp/the-rules/core-rules/ (listed as "Warhammer 40,000: The App", v2.7.1, October 2026)

I diffed the full text of both pages (~270 KB each). The two rulesets are **almost identical**: same 24 sections, same phase structure, same attack sequence, same terrain, objective and keyword rules. The substantive differences are below.

## Summary

| Area | Core Rules | Combat Patrol |
|---|---|---|
| Core stratagems | 11 | 8 (no Explosives, Crushing Impact, Rapid Ingress) |
| Snap Shooting / Fire Overwatch hits | Hits are **not** critical hits | No such clause |
| Desperate Escape clarifications | Extra bullet and a second example | Shorter text |
| Ongoing Consolidation | Forces engaged enemy units to fight | No such clause |
| Rapid disembark (After Moving) | Cannot declare a charge that turn | Different text (see caveat) |
| Rules clarifications (FAQ/errata) | More | Fewer |

## Gameplay differences

### 1. Three core stratagems are missing from Combat Patrol

Core Rules have 11 core stratagems, numbered 15.02 to 15.12. Combat Patrol omits these three, so its list jumps from 15.04 to 15.08.

| Stratagem | Cost | Rule (Core Rules only) |
|---|---|---|
| **Explosives** (15.05) | 1CP | **When:** your Shooting phase. **Target:** one friendly unengaged EXPLOSIVES/GRENADES unit that is eligible to shoot and did not advance. **Effect:** pick one EXPLOSIVES/GRENADES model, then one unengaged enemy unit within 8" and visible to it. Roll six D6; each 4+ inflicts 1 mortal wound. (The old "Grenade" stratagem is the same as this.) |
| **Crushing Impact** (15.06) | 1CP | **When:** your Charge phase, just after a friendly MONSTER/VEHICLE ends a charge move. **Target:** that unit. **Effect:** pick an engaged enemy unit and one of your engaged models. Roll D6s equal to that model's Toughness. Each 1 inflicts a mortal wound on your unit. Each 5+ inflicts a mortal wound on the enemy (max 6 per unit). (The old "Tank Shock" stratagem is the same as this.) |
| **Rapid Ingress** (15.07) | 1CP | **When:** end of your opponent's Movement phase. **Target:** one friendly unit in strategic reserves (not AIRCRAFT). **Effect:** the unit makes an ingress move. **Restriction:** not usable in the first battle round. |

Both versions still have **Command Re-roll, Epic Challenge, Insane Bravery, Fire Overwatch, Snap Shooting, Smokescreen, Heroic Intervention and Counteroffensive**.

### 2. Snap Shooting and Fire Overwatch: no "not critical hits" clause in Combat Patrol

Both rules say each attack only hits on an unmodified 6.

- **Core Rules** add: *"Those hits are not critical hits."*
- **Combat Patrol** has no such sentence, so those 6s are not stated to be non-critical.

### 3. Desperate Escape: Core Rules are more detailed

The mechanics are the same. In both versions a unit making a desperate escape fall-back that is not already battle-shocked must make a battle-shock roll. Hazard rolls are made per model. Modifiers to a "Desperate Escape test" apply to those hazard rolls.

Core Rules add three things:

- A third bullet, in the Desperate Escape test text, that the unit **must use the desperate escape mode** when it is selected to make a fall-back move.
- A second example: an ability that lets a unit re-roll Desperate Escape tests lets it re-roll hazard rolls made for desperate escape.
- Their Bane of Cowards example is labelled "Example 1".

### 4. Ongoing Consolidation

During a consolidation move, each model that started engaged must still be engaged with that enemy unit.

- **Core Rules** add: if enemy units engaged with your unit have not yet been selected to fight this phase, your opponent must select each of them, one at a time. Each becomes eligible to fight and is selected to fight (12.04).
- **Combat Patrol** has only the "must still be engaged" requirement.

### 5. Rapid disembark: "After Moving" text differs

- **Core Rules:** *"Your unit is not eligible to declare a charge until the end of the turn."*
- **Combat Patrol:** the text is the full Ongoing Consolidation wording (engaged models must stay engaged, and engaged enemy units must be selected to fight).

Caveat: the Combat Patrol wording reads like a copy/paste slip from the Consolidation rule rather than an intended change. I'd confirm it in the official Combat Patrol app/rules before relying on it.

## Clarifications and glossary entries only in Core Rules

These are FAQ/errata or glossary additions in the Core Rules that Combat Patrol does not carry. They clarify existing rules rather than add new ones.

- **01.02.12 Replacing One Model with Another:** mark the point beneath the centre of the base (or central axis for FRAME units) and place the new model centred over it. If that would overlap another model or overhang the battlefield edge, place it as close as possible.
- **01.04.06 Drawing a Line:** unless stated otherwise, a drawn line has no thickness and must be straight.
- **Duration FAQ:** if an effect lasts "until the end of" a phase or turn, it is still in effect at the end of that phase or turn (for example +1 OC until end of turn still applies at the end of the turn).
- **Battlefield-edge overhang and visibility:** the controlling player can draw line of sight from any part of the model not overhanging the edge. The opponent can draw line of sight to any part of it.
- **Warlord CP:** you do not gain "at the start of the battle round, if this model is your WARLORD, gain 1CP" while your Warlord is destroyed.
- **Objective control FAQs:** one model's OC can count towards more than one objective in range. A unit can control more than one objective at once.
- **Attached units FAQ:** a rule on "this/that unit" applies to all models in an attached unit. A rule on one model (for example Feel No Pain or Lone Operative) applies only to that model.
- **Firing Deck FAQ:** abilities and upgrades that affected weapons while another unit had them equipped do not carry over when a TRANSPORT equips them through Firing Deck. The example is Flash Gitz in a Trukk.
- **Heroic Intervention FAQ:** a unit that used rapid disembark this turn cannot be targeted by Heroic Intervention.
- **Core-only example datasheet entry:** the Supa-snazz Dakka upgrade (Flash Gitz) appears in the Core Rules abilities examples.

## Differences only in Combat Patrol

- **Level of Control (14.02):** the full text appears a second time in the Combat Patrol page's objectives section, with one extra FAQ ("Is being within range of a terrain objective the same as being within range of an objective marker?" Answer: yes). The rule itself is the same as in Core Rules.
- **Combat Patrol FAQ coverage:** the Combat Patrol page is a slightly trimmed copy of the Core Rules, so its FAQs are a subset of the Core Rules FAQs.

## Presentation-only differences

These have no rules effect:

- Section ordering of "Desperate Escape" and "Desperate Escape Test" is swapped in Combat Patrol, and Combat Patrol puts "Lone Operative" before "Rapid Fire" in the abilities list.
- The Core Rules attached-units introduction (section 19) has a flavour paragraph that Combat Patrol lacks. Combat Patrol's Leader ability flavour text differs from Core's ("Mighty heroes fight at the forefront of battle" vs. the Support ability's "Specialist combatants..."). The mechanical text is identical.
- Combat Patrol links unit names in examples (for example `%000035877Bloodletters%` markup), which shows up as raw ids in the text.

## Method note

I downloaded both pages, converted the HTML to text, and diffed them (about 325 lines of diff). I confirmed the stratagem lists, Desperate Escape text, Snap Shooting/Overwatch clauses and rapid disembark text by reading each version directly. The FAQ items come from the diff.
