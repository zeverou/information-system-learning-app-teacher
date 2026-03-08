import type { VariableType } from "./types/VariableType";

export class ComponentVariables {
    public generalVariables: Record<string, VariableType | VariableType[]> | undefined;
    public sqlVariables: Record<string, VariableType | VariableType[]> | undefined;
    public jsVariables: Record<string, VariableType | VariableType[]> | undefined;
}