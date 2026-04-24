export type FinishEvaluationContext = {
    activityCompleted?: boolean;
}

export interface IFinish {
    description?: string;
    label?: string;
    isComplete: boolean;
    evaluate(input?: unknown, context?: FinishEvaluationContext): boolean | Promise<boolean>;
}
