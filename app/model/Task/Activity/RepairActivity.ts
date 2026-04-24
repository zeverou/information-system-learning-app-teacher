import type { IActivity } from "./IActivity";
import type { Component } from "../../Component";
import { componentMatchesDefault, evaluateComponentContainsConstraints, type ComponentContainsConstraint, type ComponentDomSnapshot } from "./ComponentContainsCheck";

export class RepairActivity implements IActivity {
    public isCompleted?: boolean
    public substituteAfterActivity: boolean = false

    constructor(
        public description: string,
        public activityComponents: Component[],
        public label?: string,
        public checkRepair: boolean = false,
        public repairChecks: ComponentContainsConstraint[] = [],
    ) { }  

    check(input: any): void {
        const components = Array.isArray(input?.components) ? input.components as Component[] : []
        const defaultComponents = Array.isArray(input?.defaultComponents) ? input.defaultComponents as Component[] : []
        const domSnapshots = Array.isArray(input?.domSnapshots) ? input.domSnapshots as ComponentDomSnapshot[] : []

        console.log('[RepairActivity.check] checking components:', components, '| defaultComponents:', defaultComponents);

        if (!components.length) {
            this.isCompleted = Boolean(input?.componentsRepaired)
            console.log(`[RepairActivity.check] no components, using fallback. isCompleted: ${this.isCompleted ? '🟢' : '🔴'}`, this.isCompleted);
            return
        }

        const repaired = components.every(component => {
            const defaultComponent = defaultComponents.find(item => String(item.id) === String(component.id))
            const matches = defaultComponent ? componentMatchesDefault(component, defaultComponent) : false;
            console.log(`[RepairActivity.check] component ${component.id} matches default: ${matches ? '🟢' : '🔴'}`, matches);
            return matches;
        })

        console.log(`[RepairActivity.check] components fully repaired: ${repaired ? '🟢' : '🔴'}`, repaired);

        if (!repaired) {
            this.isCompleted = false
            return
        }

        if (this.checkRepair && this.repairChecks.length) {
            this.isCompleted = evaluateComponentContainsConstraints(this.repairChecks, domSnapshots)
            console.log(`[RepairActivity.check] constraints evaluated. isCompleted: ${this.isCompleted ? '🟢' : '🔴'}`, this.isCompleted);
            return
        }

        this.isCompleted = repaired
    }
}
