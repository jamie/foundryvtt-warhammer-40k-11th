import { SYSTEM_ID } from "./constants.js";

const PHASES = {
    command: "Command",
    movement: "Movement",
    shooting: "Shooting",
    charge: "Charge",
    fight: "Fight"
};

/**
 * Core's CombatTracker is an ApplicationV2 (V1 hooks like getData / activateListeners are never called),
 * so we keep core's templates and rework the rendered DOM: the combatant list becomes a list of armies
 * with CP / VP counters, and the current phase is shown above it.
 */
export class WarhammerCombatTracker extends foundry.applications.sidebar.tabs.CombatTracker {
    static DEFAULT_OPTIONS = {
        actions: {
            resourceControl: WarhammerCombatTracker.#onResourceControl
        }
    };

    /** @inheritDoc */
    async _onRender(context, options) {
        await super._onRender(context, options);

        const combat = this.viewed;
        if (!combat) return;

        const list = this.element.querySelector(".directory-list, .combat-tracker");
        if (!list) return;

        this.element.querySelector(".warhammer-phase")?.remove();
        const phase = combat.getFlag(SYSTEM_ID, "phase") || "setup";
        const phaseDisplay = document.createElement("div");
        phaseDisplay.className = "warhammer-phase";
        phaseDisplay.style.cssText = "text-align: center; font-weight: bold; background: rgba(0,0,0,0.2); line-height: 24px;";
        phaseDisplay.textContent = `${PHASES[phase] ?? "Setup"} Phase`;
        list.before(phaseDisplay);

        list.replaceChildren(...this.#prepareArmies(combat).map(army => this.#buildArmyElement(army)));
    }

    /**
     * Collect the armies (grouped by actor folder) taking part in the combat, with their resources.
     * @param {Combat} combat
     * @returns {{id: string, name: string, active: boolean, cp: number, vp: number}[]}
     */
    #prepareArmies(combat) {
        let armies = combat.getFlag(SYSTEM_ID, "armies") || [];
        const cp = combat.getFlag(SYSTEM_ID, "cp") || {};
        const vp = combat.getFlag(SYSTEM_ID, "vp") || {};

        // Before combat starts there's no armies flag yet, so preview them from the combatants
        if (armies.length === 0 && combat.combatants.size > 0) {
            armies = Array.from(new Set(combat.combatants.map(c => c.actor?.folder?.id || "unassigned")));
        }

        return armies.map(folderId => {
            let name = "Unassigned";
            if (folderId !== "unassigned") name = game.folders.get(folderId)?.name ?? folderId;
            return {
                id: folderId,
                name,
                active: combat.combatant?.actor?.folder?.id === folderId,
                cp: cp[folderId] || 0,
                vp: vp[folderId] || 0,
            };
        });
    }

    /**
     * @param {{id: string, name: string, active: boolean, cp: number, vp: number}} army
     * @returns {HTMLLIElement}
     */
    #buildArmyElement(army) {
        const li = document.createElement("li");
        li.className = "combatant actor directory-item flexrow";
        li.classList.toggle("active", army.active);
        li.dataset.armyId = army.id;

        const nameBox = document.createElement("div");
        nameBox.className = "token-name flexcol";
        const title = document.createElement("h4");
        title.textContent = army.name;
        const resources = document.createElement("div");
        resources.className = "resources flexrow";
        resources.style.cssText = "font-size: 0.8em; justify-content: space-around;";
        resources.append(
            this.#buildResourceElement("cp", "CP", army),
            this.#buildResourceElement("vp", "VP", army)
        );
        nameBox.append(title, resources);
        li.append(nameBox);
        return li;
    }

    #buildResourceElement(resource, label, army) {
        const span = document.createElement("span");
        span.className = `${resource}-track flexrow`;
        span.style.cssText = "align-items: center; gap: 4px;";
        span.innerHTML = `<strong>${label}:</strong> ${army[resource]}`;
        for (const [delta, icon] of [[-1, "minus"], [1, "plus"]]) {
            const a = document.createElement("a");
            a.className = "resource-control";
            a.dataset.action = "resourceControl";
            a.dataset.army = army.id;
            a.dataset.resource = resource;
            a.dataset.delta = delta;
            a.innerHTML = `<i class="fas fa-${icon}"></i>`;
            span.append(a);
        }
        return span;
    }

    /**
     * Add or remove a point of CP / VP for an army.
     * @this {WarhammerCombatTracker}
     * @param {PointerEvent} event
     * @param {HTMLElement} target
     */
    static async #onResourceControl(event, target) {
        const combat = this.viewed;
        if (!combat) return;

        const { army, resource, delta } = target.dataset;
        const history = foundry.utils.deepClone(combat.getFlag(SYSTEM_ID, resource) || {});
        history[army] = Math.max(0, (history[army] || 0) + Number(delta));
        await combat.setFlag(SYSTEM_ID, resource, history);
    }
}
