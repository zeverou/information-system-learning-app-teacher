import { EnLanguage } from "./EnLanguage";
import { type Mapping } from "./Mapping";

export class MappingEn implements Mapping {

    language = new EnLanguage();

participants = "participants";
    meals = "meals";
    sessions = "sessions";
    allergens = "allergens";
    supervisors = "supervisors";
    participants_allergens = "participants_allergens";
    meals_participants = "meals_participants";
    meals_supervisors = "meals_supervisors";
    sessions_participants = "sessions_participants";
    allergens_meals = "allergens_meals";
    supervisors_allergens = "supervisors_allergens";
    sessions_supervisors = "sessions_supervisors";
    meals_book = "meals_book";

    participant_id = "participant_id";
    supervisor_id = "supervisor_id";
    name = "name";
    email = "email";
    personal_number = "personal_number";
    phone = "phone";
    address = "address";
    age = "age";
    meal_id = "meal_id";
    when_served = "when_served";
    date_served = "date_served";
    session_id = "session_id";
    from_date = "from_date";
    to_date = "to_date";
    capacity = "capacity";
    allergen_id = "allergen_id";
    date = "date";
}
