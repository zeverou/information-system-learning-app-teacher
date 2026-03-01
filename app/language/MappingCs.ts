import { CsLanguage } from "./CsLangauge";
import { type Mapping } from "./Mapping";

export class MappingCs implements Mapping {

    language = new CsLanguage();

    participants = "účastníci";
    meals = "jídla";
    sessions = "turnusy";
    allergens = "alergeny";
    supervisors = "vedoucí";
    participants_allergens = "účastníci_alergeny";
    meals_participants = "účastníci_jídla";
    meals_supervisors = "jídla_vedoucí";
    sessions_participants = "turnusy_účastníci";
    allergens_meals = "jídla_alergeny";
    supervisors_allergens = "vedoucí_alergeny";
    sessions_supervisors = "vedoucí_turnusy";
    meals_book = "kniha_jídel";

    participant_id = "id_účastníka";
    supervisor_id = "id_vedoucího";
    name = "jméno";
    email = "email";
    personal_number = "rodné_číslo";
    phone = "telefon";
    address = "adresa";
    age = "věk";
    meal_id = "id_jídla";
    when_served = "kdy_se_podává";
    date_served = "datum_podávání";
    session_id = "id_turnusu";
    from_date = "od_data";
    to_date = "do_data";
    capacity = "kapacita";
    allergen_id = "id_alergenu";
    date = "datum";
}