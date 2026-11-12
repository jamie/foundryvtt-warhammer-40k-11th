import { WarhammerItem } from "./items/item.js";
import { WarhammerActor } from "./actors/actor.js";
import { WarhammerModelSheet } from "./actors/actor-sheet.js";
import { getBaseToBaseDist, mmToInch, SYSTEM_ID } from "./constants.js";
import { preloadHandlebarsTemplates } from "./templates.js";
import { WarhammerModelData } from "./actors/warhammerModelData.js";
import { WeaponData } from "./items/weaponData.js";
import { WeaponTagData } from "./items/weaponTagData.js";
import { AbilityData } from "./items/abilityData.js";
import { WarhammerAbilitySheet } from "./items/warhammer-ability-sheet.js";
import { WarhammerWeaponSheet } from "./items/warhammer-weapon-sheet.js";
import { WarhammerWTagSheet } from "./items/warhammer-wtag-sheet.js";
import { WarhammerRuler } from "./warhammerRuler.js";
import { WarhammerToken, WarhammerTokenDocument } from "./token.js";
import "../libs/awesomplete/awesomplete.js"
import { WarhammerObjectiveData } from "./actors/warhammerObjectiveData.js";
import { WarhammerObjectiveSheet } from "./actors/objective-sheet.js";
import { WarhammerCombat } from "./combat.js";
import { WarhammerCombatTracker } from "./combat-tracker.js";
/* -------------------------------------------- */
/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */
console.log("Warhammer 40k | System Module Loading... REFRESHED");
/**
 * Init hook.
 */
Hooks.once('init', function () {

    // Add utility classes to the global game object so that they're more easily
    // accessible in global contexts.
    game.warhammer = {
        WarhammerActor,
        WarhammerItem,
    };

    // Add custom constants for configuration.
    CONFIG.WARHAMMER = {};

    //define data models
    CONFIG.Actor.dataModels.model = WarhammerModelData;
    CONFIG.Actor.dataModels.objective = WarhammerObjectiveData;
    CONFIG.Item.dataModels.ability = AbilityData;
    CONFIG.Item.dataModels.weapon = WeaponData;
    CONFIG.Item.dataModels.wtag = WeaponTagData;

    // Define custom Document classes
    CONFIG.Actor.documentClass = WarhammerActor;
    CONFIG.Item.documentClass = WarhammerItem;
    CONFIG.Token.documentClass = WarhammerTokenDocument;
    CONFIG.Combat.documentClass = WarhammerCombat;
    CONFIG.ui.combat = WarhammerCombatTracker;
    game.settings.register(SYSTEM_ID, "baseSizes", {
        name: "Base Sizes",
        scope: "world",
        config: false,
        type: Object,
        default: {}
    });

    CONFIG.statusEffects = [
        {
            id: "battleshocked",
            name: "Battleshocked",
            img: "icons/svg/skull.svg"
        },
        {
            id: "suppressed",
            name: "Suppressed",
            img: "icons/svg/downgrade.svg"
        },
        {
            id: "stealth",
            name: "Stealth",
            img: "icons/svg/blind.svg"
        },
        {
            id: "cover",
            name: "Benefit of Cover",
            img: "icons/svg/shield.svg"
        },
        {
            id: "advance",
            name: "Advanced",
            img: "icons/svg/up.svg"
        },
        {
            id: "fallback",
            name: "Fell Back",
            img: "icons/svg/cowled.svg"
        }
    ];

    CONFIG.Combat.initiative = {
        formula: '1d6',
        decimals: 2,
    };
    // Register sheet application classes
    const DocumentSheetConfig = foundry.applications.apps.DocumentSheetConfig;
    DocumentSheetConfig.unregisterSheet(Actor, "core", foundry.appv1.sheets.ActorSheet);
    DocumentSheetConfig.registerSheet(Actor, SYSTEM_ID, WarhammerModelSheet, { types: ["model"], makeDefault: true, label: "Model" });
    DocumentSheetConfig.registerSheet(Actor, SYSTEM_ID, WarhammerObjectiveSheet, { types: ["objective"], makeDefault: true, label: "Objective" });
    DocumentSheetConfig.unregisterSheet(Item, "core", foundry.appv1.sheets.ItemSheet);
    DocumentSheetConfig.registerSheet(Item, SYSTEM_ID, WarhammerAbilitySheet, { types: ["ability"], makeDefault: true, label: "Ability" });
    DocumentSheetConfig.registerSheet(Item, SYSTEM_ID, WarhammerWeaponSheet, { types: ["weapon"], makeDefault: true, label: "Weapon" });
    DocumentSheetConfig.registerSheet(Item, SYSTEM_ID, WarhammerWTagSheet, { types: ["wtag"], makeDefault: true, label: "Weapon Tag" });

    // DocumentSheetConfig.registerSheet(TokenDocument, SYSTEM_ID, WarhammerTokenConfig, { makeDefault: true });

    game.settings.register(SYSTEM_ID, 'melee_generosity', {
        name: 'Melee Generosity',
        hint: "extra reach granted to melee weapons in inches",
        scope: 'world',     // "world" = sync to db, "client" = local storage
        config: true,       // false if you dont want it to show in module config
        type: Number,       // Number, Boolean, String, Object
        default: 0.1,
    });
    game.settings.register(SYSTEM_ID, "lastToggleState", {
        scope: "client",
        config: false,
        type: Boolean,
        default: true,
    });
    window.tokenRuler = {
        active: game.settings.get(SYSTEM_ID, "lastToggleState"),
        getBaseToBaseDist,
    };
    CONFIG.Canvas.rulerClass = WarhammerRuler;
    CONFIG.Token.objectClass = WarhammerToken;

    return preloadHandlebarsTemplates();
});

//turn tag string into array of tags
Hooks.on('preUpdateActor', function (actor, change, options, userid) {
    if (change?.system?.baseSize) {
        if (!change.prototypeToken) {
            change.prototypeToken = { height: 0, width: 0 }
        }
        change.prototypeToken.height = mmToInch(change.system.baseSize) //convert mm to inches
        change.prototypeToken.width = mmToInch(change.system.baseSize)
    }
})
Hooks.on('preCreateActor', function (actor, data, options, userid) {
    actor.updateSource({
        prototypeToken: {
            height: mmToInch(actor.system.baseSize),
            width: mmToInch(actor.system.baseSize),
        }
    })
    if (actor.type === "objective") {
        actor.updateSource({
            img: "icons/svg/target.svg",
            prototypeToken: {
                displayName: CONST.TOKEN_DISPLAY_MODES.ALWAYS,
                texture: {
                    src: "icons/svg/target.svg",
                    tint: "#000000",
                }
            }
        })
    }
})
//stolen from https://gitlab.com/tposney/midi-qol/-/blob/v11/src/module/chatMessageHandling.ts
Hooks.on('renderChatMessageHTML', function (message, html, messageData) {
    let _highlighted = null;

    let _onTargetHover = (event) => {
        event.preventDefault();
        if (!canvas?.scene?.active) return;
        const token = canvas?.tokens?.get(event.currentTarget.id);
        if (token?.isVisible) {
            if (!token?._controlled) token._onHoverIn(event);
            _highlighted = token;
        }
    }

    /* -------------------------------------------- */

    /**
     * Handle mouse-unhover events for a combatant in the chat card
     * @private
     */
    let _onTargetHoverOut = (event) => {
        event.preventDefault();
        if (!canvas?.scene?.active) return;
        if (_highlighted) _highlighted._onHoverOut(event);
        _highlighted = null;
    }

    let _onTargetSelect = (event) => {
        event.preventDefault();
        if (!canvas?.scene?.active) return;
        const token = canvas.tokens?.get(event.currentTarget.id);
        token?.control({ multiSelect: false, releaseOthers: true });
    };

    for (const el of html.querySelectorAll(".selectable-target-name")) {
        el.addEventListener("mouseenter", _onTargetHover);
        el.addEventListener("mouseleave", _onTargetHoverOut);
        el.addEventListener("click", _onTargetSelect);
    }
})


// Inject Terrain Ruler into the scene control buttons
Hooks.on("getSceneControlButtons", controls => {
    const tokenControl = controls.tokens;
    if (!tokenControl) return;

    tokenControl.tools.tokenRuler = {
        name: "tokenRuler",
        title: "measure base-to-base",
        icon: "fa-solid fa-circle-nodes",
        order: Object.keys(tokenControl.tools).length,
        toggle: true,
        active: tokenRuler?.active,
        onChange: (event, active) => updateTokenRulerState(active),
        visible: true,
    };
})

function updateTokenRulerState(newState) {
    tokenRuler.active = newState;
    game.settings.set(SYSTEM_ID, "lastToggleState", newState);
}

Hooks.on("renderActiveEffectConfig", function (application, html, data) {
    const system = application.document.parent?.system;
    if (!system) return;
    const list = Object.keys(foundry.utils.flattenObject(system)).map(s => "system." + s);
    const inputs = html.querySelectorAll('input[name^="changes."][name$=".key"], input[name^="system.changes."][name$=".key"]');
    for (const input of inputs) {
        if (input.closest(".awesomplete")) continue;
        new Awesomplete(input, { list });
    }
})

Hooks.on("renderTokenConfig", function (config, html, data) {
    const flags = (config.document ?? config.token)?.flags?.[SYSTEM_ID];
    const offX = flags?.offX ? `value="${flags.offX}"` : "";
    const offY = flags?.offY ? `value="${flags.offY}"` : "";
    const template = document.createElement("template");
    template.innerHTML = `
            <div class="form-group slim">
            <label>Art Offset</label>
            <div class="form-fields">
                <label>X</label>
                <input type="number" step="1" name="flags.${SYSTEM_ID}.offX" placeholder="px" ${offX}>
                <label>Y</label>
                <input type="number" step="1" name="flags.${SYSTEM_ID}.offY" placeholder="px" ${offY}>
            </div>
        </div>
`
    if (html.querySelector(`[name="flags.${SYSTEM_ID}.offX"]`)) return;
    html.querySelector("[name=width]")?.closest(".form-group")?.after(template.content);
})

let updateObjectives = foundry.utils.debounce(() => {
    let objectives = canvas.tokens.placeables.filter(x => x.actor?.type === "objective")
    objectives.map(x => x.actor.updateObjective(x))
}, 50
)
Hooks.on("refreshToken", (token, flags) => {
    if (flags.refreshBar || flags.refreshPosition)
        updateObjectives()
})


Hooks.once("dragRuler.ready", (SpeedProvider) => {
    class WarhammerSpeedProvider extends SpeedProvider {
        get colors() {
            return [
                { id: "move", default: 0x00FF00, name: "NORMAL MOVE" },
            ]
        }

        getRanges(token) {
            if (token.actor.type === "objective")
                return []

            const baseSpeed = token.actor.system.stats.move

            return [
                { range: baseSpeed, color: "move" },
            ]
        }
    }

    dragRuler.registerSystem(SYSTEM_ID, WarhammerSpeedProvider)
})

Hooks.on('renderActorDirectory', (app, html, data) => {

    //return early if user isn't a gm (and thus can't create folders, which the importer does)
    if (!game.user.isGM) return

    // Avoid duplicate buttons if the hook fires multiple times
    if (html.querySelector(".import-roster")) return;

    let actions = html.querySelector(".header-actions");

    // Fallback: directory header itself if we really can't find the buttons area
    if (!actions) {
        actions = document.createElement("div");
        actions.className = "header-actions action-buttons flexrow";
        const header = html.querySelector(":scope > header, .directory-header");
        if (!header) {
            console.error("Warhammer 40k | Failed to find OR create a container to inject Import Roster button");
            return;
        }
        header.append(actions);
    }

    const importBtn = document.createElement("button");
    importBtn.type = "button";
    importBtn.className = "import-roster";
    importBtn.innerHTML = `<i class="fas fa-file-import"></i> Import Roster`;
    importBtn.addEventListener("click", ev => {
        ev.preventDefault();
        renderImportDialog();
    });

    const updateBtn = document.createElement("button");
    updateBtn.type = "button";
    updateBtn.className = "update-sizes";
    updateBtn.innerHTML = `<i class="fas fa-ruler-combined"></i> Update Base Sizes`;
    updateBtn.addEventListener("click", async ev => {
        ev.preventDefault();
        const confirmed = await foundry.applications.api.DialogV2.confirm({
            window: { title: "Update All Base Sizes" },
            content: "<p>This will iterate through <strong>ALL</strong> actors in your world and attempt to update their prototype token sizes based on their name using Wahapedia data.<br><br>Are you sure you want to continue?</p>",
            rejectClose: false,
            modal: true,
        });
        if (!confirmed) return;
        const { RosterImporter } = await import("./importer.js");
        RosterImporter.updateAllBaseSizes();
    });

    actions.append(importBtn, updateBtn);
});





function renderImportDialog() {
    foundry.applications.api.DialogV2.wait({
        window: { title: "Roster Import" },
        content: "<p class=\"notes\">You may import a roster in the .ros format</p>\n" +
            "<div class=\"form-group\">\n" +
            "    <label for=\"data\">Roster File</label>\n" +
            "    <input type=\"file\" name=\"data\" accept='.ros,.json'/>\n" +
            "</div>\n",
        buttons: [
            {
                action: "updateSizes",
                icon: "fa-solid fa-ruler-combined",
                label: "Update Base Sizes",
                callback: async () => {
                    const { RosterImporter } = await import("./importer.js");
                    await RosterImporter.fetchBaseSizes();
                    ui.notifications.info("Base sizes updated from Wahapedia");
                }
            },
            {
                action: "import",
                icon: "fa-solid fa-file-import",
                label: "Import",
                default: true,
                callback: async (event, button, dialog) => {
                    const files = button.form.elements.data.files;
                    if (!files.length) return ui.notifications.error("You did not upload a data file!");
                    const { RosterImporter } = await import("./importer.js");
                    const content = await foundry.utils.readTextFromFile(files[0]);
                    RosterImporter.import(content);
                }
            },
            {
                action: "no",
                icon: "fa-solid fa-xmark",
                label: "Cancel"
            }
        ],
        rejectClose: false,
    });
}

// Phase HUD Integration
Hooks.on("getFolderContextOptions", (app, options) => {
    if (!(app instanceof foundry.applications.sidebar.tabs.ActorDirectory)) return;
    options.push({
        label: "Add Army to Combat",
        icon: "fa-solid fa-swords",
        visible: () => game.user.isGM,
        onClick: async (event, header) => {
            const el = header.closest("[data-uuid], [data-folder-id]");
            const folder = el?.dataset.uuid ? fromUuidSync(el.dataset.uuid) : game.folders.get(el?.dataset.folderId);

            if (!folder) return;

            const actorIds = new Set(folder.contents.map(a => a.id));
            const tokens = canvas.tokens.placeables.filter(t => actorIds.has(t.actor?.id));

            if (tokens.length === 0) {
                ui.notifications.warn(`No tokens found on scene for army: ${folder.name}`);
                return;
            }

            // Get or Create Combat
            let combat = game.combat;
            if (!combat) {
                if (game.combats.size === 0) {
                    combat = await Combat.create({ scene: canvas.scene.id });
                } else {
                    combat = game.combats.first();
                }
            }
            await combat.activate();

            // Add Tokens
            const existingIds = new Set(combat.combatants.map(c => c.tokenId));
            const newTokens = tokens.filter(t => !existingIds.has(t.id));

            if (newTokens.length === 0) {
                ui.notifications.info("All tokens from this army are already in combat.");
                return;
            }

            await combat.createEmbeddedDocuments("Combatant", newTokens.map(t => ({ tokenId: t.id })));
            ui.notifications.info(`Added ${newTokens.length} units from ${folder.name} to combat.`);
        }
    });
});

Hooks.once("ready", async () => {
    // Dynamically import the class to avoid circular dependencies if any
    const { PhaseHUD } = await import("./apps/phase-hud.js");
    game.phaseHUD = new PhaseHUD();

    // Hook to show/hide
    Hooks.on("controlToken", (token, controlled) => {
        if (controlled) {
            // Only show if we have permission
            if (token.actor && token.actor.testUserPermission(game.user, "OWNER")) {
                game.phaseHUD.setToken(token);
            }
        } else {
            // If we deselected, check if we have ANY controlled tokens
            const supervised = canvas.tokens.controlled.filter(t => t.actor && t.actor.testUserPermission(game.user, "OWNER"));
            if (supervised.length > 0) {
                game.phaseHUD.setToken(supervised[0]);
            } else {
                game.phaseHUD.setToken(null);
            }
        }
    });

    // Hook updates to refresh if open
    Hooks.on("updateActor", (actor) => {
        if (game.phaseHUD.token && game.phaseHUD.token.actor === actor) game.phaseHUD.render(false);
    });

    // Chat Message Listeners
    Hooks.on("renderChatMessageHTML", (message, html, data) => {
        const onClick = (selector, handler) => {
            for (const el of html.querySelectorAll(selector)) el.addEventListener("click", handler);
        };

        // Roll Attacks Listener
        onClick(".roll-attacks", async (ev) => {
            ev.preventDefault();
            const btn = ev.currentTarget.dataset;
            const attacksFormula = btn.attacks;
            const skill = parseInt(btn.skill) || 6;
            const strength = btn.strength;
            const ap = btn.ap;
            const damage = btn.damage;
            const weaponName = btn.weapon;

            // 1. Determine Number of Attacks
            let numAttacks = 1;
            try {
                let attacksRoll = new Roll(attacksFormula);
                await attacksRoll.evaluate();
                numAttacks = attacksRoll.total;
            } catch (e) {
                console.warn("Failed to parse attacks:", attacksFormula);
            }

            // 2. Roll Hit Dice
            let hitRoll = new Roll(`${numAttacks}d6`);
            await hitRoll.evaluate();

            // 3. Count Hits and Format Dice
            let hits = 0;
            let crits = 0;
            let diceHtml = '<div class="dice-row" style="display: flex; flex-wrap: wrap; gap: 4px; justify-content: center; margin-bottom: 5px;">';

            const dice = hitRoll.terms.find(t => t.faces === 6);
            if (dice) {
                dice.results.forEach(r => {
                    const isCrit = r.result === 6;
                    const isHit = r.result >= skill || isCrit;

                    if (isHit) hits++;
                    if (isCrit) crits++;

                    const color = isCrit ? 'darkorange' : (isHit ? 'green' : '#777');
                    const weight = isHit ? 'bold' : 'normal';
                    const border = isHit ? '1px solid ' + color : '1px solid #ccc';

                    diceHtml += `<span style="
                        display: inline-block;
                        width: 24px;
                        height: 24px;
                        line-height: 24px;
                        text-align: center;
                        border-radius: 4px;
                        background: #f0f0f0;
                        border: ${border};
                        color: ${color};
                        font-weight: ${weight};
                    ">${r.result}</span>`;
                });
            }
            diceHtml += '</div>';

            // 4. Post Hit Result Card
            const woundBtn = hits > 0 ? `
                <button class="roll-wounds" 
                    data-hits="${hits}" 
                    data-strength="${strength}" 
                    data-ap="${ap}" 
                    data-damage="${damage}"
                    data-weapon="${weaponName}">
                    Roll Wounds <i class="fas fa-dice"></i>
                </button>` : '';

            ChatMessage.create({
                speaker: ChatMessage.getSpeaker({ actor: message.speaker.actor }),
                content: `
                <div class="warhammer-roll">
                    <h3>${weaponName}: Attack Roll</h3>
                    <div class="stats">
                        <span><strong>Attacks:</strong> ${numAttacks}</span>
                        <span><strong>Skill:</strong> ${skill}+</span>
                    </div>
                    <hr>
                     <div class="roll-summary" style="font-size: 1.2em; text-align: center; margin-top: 5px; margin-bottom: 5px;">
                        <span style="color: green; font-weight: bold;">${hits} Hits</span>
                        ${crits > 0 ? `<span style="color: darkorange; font-size: 0.8em;">(${crits} Crits)</span>` : ''}
                    </div>
                    ${diceHtml}
                    ${woundBtn}
                </div>`
            });
        });

        // Roll Wounds Listener
        onClick(".roll-wounds", async (ev) => {
            ev.preventDefault();
            const btn = ev.currentTarget.dataset;
            const hits = parseInt(btn.hits);
            const strength = parseInt(btn.strength);
            const ap = btn.ap;
            const damage = btn.damage;
            const weaponName = btn.weapon;

            // 1. Get Target Stats (Toughness & Save)
            let toughness = 4;
            let save = 7; // Default bad save if none found
            let invuln = null; // Nullable
            let targetName = "Target";
            let targetUuid = null;
            const targets = game.user.targets;
            if (targets.size > 0) {
                const target = targets.first();
                const stats = target.actor?.system?.stats;
                toughness = parseInt(stats?.toughness) || 4;
                save = parseInt(stats?.save) || 7;
                invuln = parseInt(target.actor?.system?.invulnsave) || null;
                targetName = target.name;
                targetUuid = target.document.uuid;
            } else {
                // Ask for toughness (fallback)
                // We won't ask for Save here to keep it simple, straightforward flow is better
                const tInput = await foundry.applications.api.DialogV2.prompt({
                    window: { title: "Target Toughness" },
                    content: `<div class="form-group"><label>Toughness:</label><input type="number" name="toughness" value="4" autofocus></div>`,
                    ok: { label: "Roll", callback: (event, button) => button.form.elements.toughness.value },
                    rejectClose: false,
                });
                toughness = parseInt(tInput) || 4;
            }

            // 2. Calculate To Wound Target
            let targetNum = 4;
            if (strength >= toughness * 2) targetNum = 2;
            else if (strength > toughness) targetNum = 3;
            else if (strength == toughness) targetNum = 4;
            else if (strength <= toughness / 2) targetNum = 6;
            else if (strength < toughness) targetNum = 5;

            // 3. Roll Dice
            const roll = await new Roll(`${hits}d6`).evaluate();
            let wounds = 0;
            roll.terms.find(t => t.faces === 6).results.forEach(r => {
                if (r.result >= targetNum) wounds++;
            });

            // 4. Post Message
            const isVariableDamage = /[dD]/.test(damage);
            let buttons = "";

            // Variable Damage Button
            if (isVariableDamage) {
                buttons += `
                <button class="roll-damage" data-damage="${damage}" data-weapon="${weaponName}">
                    Roll Damage (${damage}) <i class="fas fa-dice"></i>
                </button>`;
            }

            // Save Roll Button (if wounds > 0, and we have a target)
            if (wounds > 0 && targetUuid) {
                buttons += `
                <button class="roll-saves" 
                    data-wounds="${wounds}" 
                    data-save="${save}" 
                    data-invuln="${invuln || ''}" 
                    data-ap="${ap}" 
                    data-damage="${damage}"
                    data-name="${targetName}"
                    data-uuid="${targetUuid}">
                    Roll Saves vs ${targetName} <i class="fas fa-shield-alt"></i>
                </button>`;
            } else if (wounds > 0) {
                buttons += `<div style="font-size:0.8em; color: orange;">Select a target to enable Save Rolls</div>`;
            }

            ChatMessage.create({
                speaker: ChatMessage.getSpeaker({ actor: message.speaker.actor }), // Use same speaker
                content: `
                    <div class="warhammer-roll">
                        <h3>Wound Roll vs ${targetName}</h3>
                        <div class="stats">
                            <span><strong>Weapon:</strong> ${weaponName}</span>
                            <span><strong>S:</strong> ${strength} vs <strong>T:</strong> ${toughness}</span>
                            <span><strong>Target:</strong> ${targetNum}+</span>
                        </div>
                        <hr>
                        <div class="roll-summary" style="font-size: 1.2em; text-align: center; margin-top: 5px;">
                            <span style="color: red; font-weight: bold;">${wounds} Wounds</span>
                            <span style="color: #555; font-size: 0.8em; margin-left: 5px;">(Dmg: ${damage})</span>
                        </div>
                        <div class="damage-info" style="margin-top: 5px; font-size: 0.9em; border-top: 1px solid #ccc; padding-top: 2px;">
                            <strong>AP:</strong> ${ap}
                        </div>
                         <div class="dice-tooltip" style="margin-top:5px; font-size:0.8em; color:#666;">
                            Rolling ${hits}d6: ${roll.result}
                        </div>
                        ${buttons}
                    </div>
                `
            });
        });

        // Roll Damage Listener
        onClick(".roll-damage", async (ev) => {
            ev.preventDefault();
            const btn = ev.currentTarget.dataset;
            const damageFormula = btn.damage;
            const weaponName = btn.weapon;

            const roll = await new Roll(damageFormula).evaluate();

            roll.toMessage({
                speaker: ChatMessage.getSpeaker({ actor: message.speaker.actor }),
                flavor: `<strong>${weaponName}</strong> - Damage Roll (${damageFormula})`,
            });
        });

        // Roll Saves Listener
        onClick(".roll-saves", async (ev) => {
            ev.preventDefault();
            const btn = ev.currentTarget.dataset;
            const numWounds = parseInt(btn.wounds);
            const sv = parseInt(btn.save);
            const invulnData = btn.invuln;
            const invuln = invulnData === "" ? null : parseInt(invulnData);
            const ap = parseInt(btn.ap) || 0; // AP is usually negative e.g. -1
            const damage = btn.damage;
            const targetName = btn.name;
            const targetUuid = btn.uuid;

            // Logic: Target Number = Sv - AP. (e.g. 3+ minus -1 AP = 4+).
            // If Invuln is better (lower), use Invuln. Invuln is NOT modified by AP.

            let modifiedSave = sv - ap;
            let bestSave = modifiedSave;
            let usedInvuln = false;

            if (invuln !== null && invuln < bestSave) {
                bestSave = invuln;
                usedInvuln = true;
            }

            // Cap save at 6+? (A roll of 1 always fails). 
            // In 10th, an unmodified 1 fails. Modified rolls can succeed if target is met.

            // Roll Saves
            const saveRoll = new Roll(`${numWounds}d6`);
            await saveRoll.evaluate();

            let failed = 0;
            let saved = 0;
            let diceHtml = '<div class="dice-row" style="display: flex; flex-wrap: wrap; gap: 4px; justify-content: center; margin-bottom: 5px;">';

            saveRoll.terms.find(t => t.faces === 6).results.forEach(r => {
                const success = r.result >= bestSave; // Meet or beat
                if (success && r.result > 1) { // 1 always fails? Yes, usually.
                    saved++;
                } else {
                    failed++;
                }
                const color = (success && r.result > 1) ? 'green' : 'red';
                const border = '1px solid ' + color;

                diceHtml += `<span style="
                        display: inline-block;
                        width: 24px;
                        height: 24px;
                        line-height: 24px;
                        text-align: center;
                        border-radius: 4px;
                        background: #f0f0f0;
                        border: ${border};
                        color: ${color};
                        font-weight: bold;
                    ">${r.result}</span>`;
            });
            diceHtml += '</div>';

            const damageBtn = failed > 0 ? `
                <button class="apply-damage" 
                    data-uuid="${targetUuid}" 
                    data-damage="${damage}" 
                    data-failed="${failed}"
                    data-name="${targetName}">
                    Apply Damage <i class="fas fa-skull"></i>
                </button>` : '';

            ChatMessage.create({
                speaker: ChatMessage.getSpeaker({ actor: message.speaker.actor }),
                content: `
                    <div class="warhammer-roll">
                        <h3>Save Roll: ${targetName}</h3>
                        <div class="stats">
                             <span><strong>Sv:</strong> ${sv}+</span>
                             <span><strong>AP:</strong> ${ap}</span>
                             <span>${usedInvuln ? `<strong>Invuln:</strong> ${invuln}+ (Used)` : `<strong>Mod Sv:</strong> ${modifiedSave}+`}</span>
                        </div>
                        <hr>
                        <div class="roll-summary" style="font-size: 1.2em; text-align: center; margin-top: 5px;">
                            <span style="color: red; font-weight: bold;">${failed} FAILED</span>
                            <span style="color: green; font-size: 0.8em; margin-left: 10px;">(${saved} Saved)</span>
                        </div>
                        <div class="damage-total" style="text-align: center; margin-top: 5px; font-weight: bold;">
                             ${targetName} takes ${failed} x ${damage} Damage!
                        </div>
                        ${diceHtml}
                        ${damageBtn}
                    </div>
                `
            });
        });

        // Apply Damage Listener
        onClick(".apply-damage", async (ev) => {
            ev.preventDefault();
            const btn = ev.currentTarget.dataset;
            const targetUuid = btn.uuid;
            const damageFormula = btn.damage;
            const failed = parseInt(btn.failed);
            const targetName = btn.name;

            const tokenDocument = await fromUuid(targetUuid);
            const actor = tokenDocument?.actor || tokenDocument;

            if (!actor) {
                return ui.notifications.error("Target actor not found.");
            }

            let totalDamage = 0;
            let rollDetails = "";

            // Check if damage is variable
            if (/[dD]/.test(damageFormula)) {
                // Roll for EACH failed save
                let formula = `${failed}*(${damageFormula})`; // e.g. 3 * (1d6)
                // Actually in 40k it's technically sum of N rolls.
                // 3d6 is effectively the same distrib as 1d6+1d6+1d6 for sum, so we can just roll `${failed}${damageFormula}`?
                // Wait `31d6` vs `3 * 1D6`.
                // If Dmg is "D6", we want `3d6`.
                // If Dmg is "D3+1", we want `3d3 + 3`.
                // Safe way: Loop

                let rolls = [];
                for (let i = 0; i < failed; i++) {
                    let r = await new Roll(damageFormula).evaluate();
                    totalDamage += r.total;
                    rolls.push(r.total);
                }
                rollDetails = `Rolled: [${rolls.join(", ")}]`;

            } else {
                // Fixed damage
                const dmgPer = parseInt(damageFormula) || 1;
                totalDamage = failed * dmgPer;
            }

            // Apply Damage
            const currentWounds = actor.system.stats.wounds.value;
            const newWounds = Math.max(0, currentWounds - totalDamage);

            await actor.update({ "system.stats.wounds.value": newWounds });

            ChatMessage.create({
                speaker: ChatMessage.getSpeaker({ actor: actor }),
                content: `
                    <div class="warhammer-roll">
                        <h3>Damage Applied to ${targetName}</h3>
                         <div class="roll-summary" style="font-size: 1.2em; text-align: center; margin-top: 5px;">
                            <span style="color: red; font-weight: bold;">-${totalDamage} HP</span>
                        </div>
                        <div style="text-align: center; font-size: 0.9em; color: #555;">
                            ${rollDetails}<br>
                            Health: ${currentWounds} -> <strong>${newWounds}</strong>
                        </div>
                    </div>
                `
            });
        });
    });
});