import type { Language } from "./Language";

export interface Mapping {
    language: Language;

    participants: string;
    meals: string;
    sessions: string;
    allergens: string;
    supervisors: string;
    participants_allergens: string;
    meals_participants: string;
    meals_supervisors: string;
    sessions_participants: string;
    allergens_meals: string;
    supervisors_allergens: string;
    sessions_supervisors: string;
    meals_book: string;

    participant_id: string;
    supervisor_id: string;
    name: string;
    email: string;
    personal_number: string;
    phone: string;
    address: string;
    age: string;
    meal_id: string;
    when_served: string;
    date_served: string;
    session_id: string;
    from_date: string;
    to_date: string;
    capacity: string;
    allergen_id: string;
    date: string;
}
