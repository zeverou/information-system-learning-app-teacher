import { useErrorComponentStore } from "#imports";
import { ComponentErrorDefinition } from "~/model/ComponentErrorDefinition";
import { useComponentCodeStore } from "#imports";
import { TaskQueue } from "~/composables/TaskQueue";
import { useSelectedTaskStore } from "#imports";

export class ComponentHandler {
    public static getComponentMap(round: number): ComponentErrorDefinition[] {
        const errorComponentStore = useErrorComponentStore();
        const componentCodeStore = useComponentCodeStore();

        const tasks = TaskQueue.getTasks(round);
        const notCompletedTasks = tasks.filter(task => !task.completed && task.round === round);

        console.log("|X| Adding error definitions except for not completed components:", notCompletedTasks);

        const errorDefinitions: ComponentErrorDefinition[] = [];
        for (const task of notCompletedTasks) {
            const errorComps = task.errorComponents ?? [];
            if (Array.isArray(errorComps) && errorComps.length > 0) {
                for (const comp of errorComps) {
                    const overrides: Record<string, string> = {};
                    if (comp.variables && typeof comp.variables === 'object') {
                        for (const [varName, varValue] of Object.entries(comp.variables)) {
                            overrides[varName] = varValue as string;
                        }
                    }
                    // Support both 'id' and 'name' for component identification
                    const componentId = comp.id || comp.name;
                    const def = new ComponentErrorDefinition(componentId, overrides);
                    errorDefinitions.push(def);

                    // if store does not already contain the definition add it
                    if (!errorComponentStore.errorComponents.some(existingComp => existingComp.componentId === def.componentId)) {
                        errorComponentStore.addErrorComponent(def);
                    }
                }
            }
        }

        console.log("|X| Updated error component store:", errorComponentStore.errorComponents);

        return errorDefinitions;
    }

    public static getVariableValue(componentFilename: string, variableName: string): string | undefined {
        const errorComponentStore = useErrorComponentStore();
        const componentErrors = errorComponentStore.errorComponents;
        console.log("ERROR COMPONENTS:", componentErrors)
        console.log("Filename: ", componentFilename, "| Variable: ", variableName)
        for (const component of componentErrors) {
            if (component.componentId === componentFilename) {
                console.log("Found component: ", component.componentId)
                return component.overrides[variableName];
            }
        }
        return undefined;
    }

    public static setVariableValue(componentFilename: string, variableName: string, variableValue: string) {
        const errorComponentStore = useErrorComponentStore();
        const componentCodeStore = useComponentCodeStore();
        const componentErrors = errorComponentStore.errorComponents;
        console.log("Setting new value. Filename: ", componentFilename, "| Variable: ", variableName)

        for (const component of componentErrors) {
            console.log("Checking component: ", component.componentId);
            if (component.componentId === componentFilename) {
                console.log("Found component: ", component.componentId);
                component.overrides[variableName] = variableValue;
                
                // Also update the component store with the new value
                if (variableName === 'html' || variableName === 'css' || variableName === 'js' || variableName === 'sql') {
                    componentCodeStore.updateComponentCodeByType(componentFilename, variableName as any, variableValue);
                }
            }
        }
    }

    public static isInErrorComponents(componentFilename: string): boolean {

        console.log("ID: ", componentFilename);

        // if the component was edited
        const componentCodeStore = useComponentCodeStore();
        const actualComponent = componentCodeStore.getActualComponent(componentFilename);
        if (actualComponent && actualComponent.edited) {
            console.log("Component was edited, consided in error components.");
            return false;
        }

        console.log("Component was NOT edited, checking error components.");

        // else
        const errorComponentStore = useErrorComponentStore();
        return errorComponentStore.errorComponents.some(ec => ec.componentId === componentFilename);
    }

    public static getComponentValue(componentId: string, key: string, defaultValue: string): string {
        
        
        if (ComponentHandler.isInErrorComponents(componentId)) {
            console.log(`Component ${componentId} is in error components. Getting variable ${key}.`);
            return ComponentHandler.getVariableValue(componentId, key) || defaultValue;
        }
        console.log(`Component ${componentId} is NOT in error components. Returning default value for variable ${key}.`);
        return defaultValue;
    }
}