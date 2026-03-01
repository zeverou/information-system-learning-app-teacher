import { Component } from "~/model/Component";

// Dashboard Components
import { statsMealsComponent as createStatsMealsComponent } from "~/model/SystemComponents/dashboard/StatsMealsComponent";
import { statsParticipantsComponent as createStatsParticipantsComponent } from "~/model/SystemComponents/dashboard/StatsParticipantsComponent";
import { statsSessionsComponent as createStatsSessionsComponent } from "~/model/SystemComponents/dashboard/StatsSessionsComponent";
import { statsSupervisorsComponent as createStatsSupervisorsComponent } from "~/model/SystemComponents/dashboard/StatsSupervisorsComponent";
import { tableCountBadgeComponent as tableCountBadgeComponentDefinition } from "~/model/SystemComponents/dashboard/TableCountBadgeComponent";
import { participantsCapacityCountComponentAll as createParticipantsCapacityCountComponentAll } from "~/model/SystemComponents/dashboard/ParticipantsCapacityCountAllComponent";

// Sessions Components
import { sessionDayCountBadgeComponent as createSessionDayCountBadgeComponent } from "~/model/SystemComponents/sessions/SessionDayCountBadgeComponent";
import { sessionDateRangeComponent as createSessionDateRangeComponent } from "~/model/SystemComponents/sessions/SessionDateRangeComponent";
import { sessionCapacitySectionComponent as createSessionCapacitySectionComponent } from "~/model/SystemComponents/sessions/SessionCapacitySectionComponent";
import { sessionParticipantsSectionComponent as createSessionParticipantsSectionComponent } from "~/model/SystemComponents/sessions/SessionParticipantsSectionComponent";
import { sessionSupervisorsSectionComponent as createSessionSupervisorsSectionComponent } from "~/model/SystemComponents/sessions/SessionSupervisorsSectionComponent";
import { sessionParticipantsListComponent as createSessionParticipantsListComponent } from "~/model/SystemComponents/sessions/SessionParticipantsListComponent";
import { sessionSupervisorsListComponent as createSessionSupervisorsListComponent } from "~/model/SystemComponents/sessions/SessionSupervisorsListComponent";
import { sessionParticipantsCountComponent as createSessionParticipantsCountComponent } from "~/model/SystemComponents/sessions/SessionParticipantsCountComponent";
import { sessionSupervisorsCountComponent as createSessionSupervisorsCountComponent } from "~/model/SystemComponents/sessions/SessionSupervisorsCountComponent";
import { sessionDeleteButtonComponent as createSessionDeleteButtonComponent } from "~/model/SystemComponents/sessions/SessionDeleteButtonComponent";
import { sessionStatusBadgeComponent as createSessionStatusBadgeComponent } from "~/model/SystemComponents/sessions/SessionStatusBadgeComponent";
import { sessionsCountComponent as createSessionsCountComponent } from "~/model/SystemComponents/sessions/SessionsCountComponent";
import { sessionsListComponent as createSessionsListComponent } from "~/model/SystemComponents/sessions/SessionsListComponent";
import { sessionParticipantInsertComponent as createSessionParticipantInsertComponent } from "~/model/SystemComponents/sessions/SessionParticipantInsertComponent";
import { sessionParticipantDeleteComponent as createSessionParticipantDeleteComponent } from "~/model/SystemComponents/sessions/SessionParticipantDeleteComponent";
import { sessionSupervisorInsertComponent as createSessionSupervisorInsertComponent } from "~/model/SystemComponents/sessions/SessionSupervisorInsertComponent";
import { sessionSupervisorDeleteComponent as createSessionSupervisorDeleteComponent } from "~/model/SystemComponents/sessions/SessionSupervisorDeleteComponent";

// Participants Components
import { participantsCapacityCountComponent as createParticipantsCapacityCountComponent } from "~/model/SystemComponents/participants/ParticipantsCapacityCountComponent";
import { participantsCapacityCountSessionComponent as createParticipantsCapacityCountSessionComponent } from "~/model/SystemComponents/participants/ParticipantsCapacityCountSessionComponent";
import { participantsCapacityPercentageComponent as participantsCapacityPercentageComponentDefinition } from "~/model/SystemComponents/participants/ParticipantsCapacityPercentageComponent";
import { participantsPageCount1Component as participantsPageCount1ComponentDefinition } from "~/model/SystemComponents/participants/ParticipantsPageCount1Component";
import { participantsPageCount2Component as participantsPageCount2ComponentDefinition } from "~/model/SystemComponents/participants/ParticipantsPageCount2Component";
import { participantsFilterResetComponent as participantsFilterResetComponentDefinition } from "~/model/SystemComponents/participants/ParticipantsFilterResetComponent";
import { participantsFilterInputComponent as participantsFilterInputComponentDefinition } from "~/model/SystemComponents/participants/ParticipantsFilterInputComponent";
import { participantsAddNameComponent as participantsAddNameComponentDefinition } from "~/model/SystemComponents/participants/ParticipantsAddNameComponent";
import { participantsAddEmailComponent as participantsAddEmailComponentDefinition } from "~/model/SystemComponents/participants/ParticipantsAddEmailComponent";
import { participantsAddPersonalNumberComponent as participantsAddPersonalNumberComponentDefinition } from "~/model/SystemComponents/participants/ParticipantsAddPersonalNumberComponent";
import { participantsAddPhoneComponent as participantsAddPhoneComponentDefinition } from "~/model/SystemComponents/participants/ParticipantsAddPhoneComponent";
import { participantsAddAddressComponent as participantsAddAddressComponentDefinition } from "~/model/SystemComponents/participants/ParticipantsAddAddressComponent";
import { participantsAddAgeComponent as participantsAddAgeComponentDefinition } from "~/model/SystemComponents/participants/ParticipantsAddAgeComponent";
import { participantsAddSessionComponent as participantsAddSessionComponentDefinition } from "~/model/SystemComponents/participants/ParticipantsAddSessionComponent";
import { participantsAddAllergensComponent as participantsAddAllergensComponentDefinition } from "~/model/SystemComponents/participants/ParticipantsAddAllergensComponent";
import { participantsCardComponent as participantsCardComponentDefinition } from "~/model/SystemComponents/participants/ParticipantsCardComponent";
import { participantsDeleteButtonComponent as participantsDeleteButtonComponentDefinition } from "~/model/SystemComponents/participants/ParticipantsDeleteButtonComponent";
import { participantsEditNameComponent as participantsEditNameComponentDefinition } from "~/model/SystemComponents/participants/ParticipantsEditNameComponent";
import { participantsEditEmailComponent as participantsEditEmailComponentDefinition } from "~/model/SystemComponents/participants/ParticipantsEditEmailComponent";
import { participantsEditPersonalNumberComponent as participantsEditPersonalNumberComponentDefinition } from "~/model/SystemComponents/participants/ParticipantsEditPersonalNumberComponent";
import { participantsEditPhoneComponent as participantsEditPhoneComponentDefinition } from "~/model/SystemComponents/participants/ParticipantsEditPhoneComponent";
import { participantsEditAddressComponent as participantsEditAddressComponentDefinition } from "~/model/SystemComponents/participants/ParticipantsEditAddressComponent";
import { participantsEditAgeComponent as participantsEditAgeComponentDefinition } from "~/model/SystemComponents/participants/ParticipantsEditAgeComponent";
import { participantsEditAllergensComponent as participantsEditAllergensComponentDefinition } from "~/model/SystemComponents/participants/ParticipantsEditAllergensComponent";
import { participantsEditSessionsComponent as participantsEditSessionsComponentDefinition } from "~/model/SystemComponents/participants/ParticipantsEditSessionsComponent";
import { participantsSessionMenuComponent as participantsSessionMenuComponentDefinition } from "~/model/SystemComponents/participants/ParticipantsSessionMenuComponent";
import { participantsAllergenOptionsComponent as createParticipantsAllergenOptionsComponent } from "~/model/SystemComponents/participants/ParticipantsAllergenOptionsComponent";
import { participantsSampleComponent as createParticipantsSampleComponent } from "~/model/SystemComponents/participants/ParticipantsSampleComponent";
import { participantsCountComponent as createParticipantsCountComponent } from "~/model/SystemComponents/participants/ParticipantsCountComponent";
import { participantsBadgeComponent as createParticipantsBadgeComponent } from "~/model/SystemComponents/participants/ParticipantsBadgeComponent";
import { participantsAllergensComponent as createParticipantsAllergensComponent } from "~/model/SystemComponents/participants/ParticipantsAllergensComponent";
import { participantsSessionsComponent as createParticipantsSessionsComponent } from "~/model/SystemComponents/participants/ParticipantsSessionsComponent";
import { participantsListComponent as createParticipantsListComponent } from "~/model/SystemComponents/participants/ParticipantsListComponent";
import { participantInsertComponent as createParticipantInsertComponent } from "~/model/SystemComponents/participants/ParticipantInsertComponent";
import { participantUpdateComponent as createParticipantUpdateComponent } from "~/model/SystemComponents/participants/ParticipantUpdateComponent";
import { participantDeleteComponent as createParticipantDeleteComponent } from "~/model/SystemComponents/participants/ParticipantDeleteComponent";
import { participantAllergenCountComponent as createParticipantAllergenCountComponent } from "~/model/SystemComponents/participants/ParticipantAllergenCountComponent";
import { participantGetIdComponent as createParticipantGetIdComponent } from "~/model/SystemComponents/participants/ParticipantGetIdComponent";
import { participantAllergenIdsComponent as createParticipantAllergenIdsComponent } from "~/model/SystemComponents/participants/ParticipantAllergenIdsComponent";
import { participantAllergenInsertComponent as createParticipantAllergenInsertComponent } from "~/model/SystemComponents/participants/ParticipantAllergenInsertComponent";
import { participantAllergenDeleteComponent as createParticipantAllergenDeleteComponent } from "~/model/SystemComponents/participants/ParticipantAllergenDeleteComponent";

// Supervisors Components
import { supervisorsCapacityCountComponent as createSupervisorsCapacityCountComponent } from "~/model/SystemComponents/supervisors/SupervisorsCapacityCountComponent";
import { supervisorsCapacityCountSessionComponent as createSupervisorsCapacityCountSessionComponent } from "~/model/SystemComponents/supervisors/SupervisorsCapacityCountSessionComponent";
import { supervisorsCapacityPercentageComponent as supervisorsCapacityPercentageComponentDefinition } from "~/model/SystemComponents/supervisors/SupervisorsCapacityPercentageComponent";
import { supervisorsPageCount1Component as supervisorsPageCount1ComponentDefinition } from "~/model/SystemComponents/supervisors/SupervisorsPageCount1Component";
import { supervisorsPageCount2Component as supervisorsPageCount2ComponentDefinition } from "~/model/SystemComponents/supervisors/SupervisorsPageCount2Component";
import { supervisorsFilterResetComponent as supervisorsFilterResetComponentDefinition } from "~/model/SystemComponents/supervisors/SupervisorsFilterResetComponent";
import { supervisorsFilterInputComponent as supervisorsFilterInputComponentDefinition } from "~/model/SystemComponents/supervisors/SupervisorsFilterInputComponent";
import { supervisorsSessionMenuComponent as supervisorsSessionMenuComponentDefinition } from "~/model/SystemComponents/supervisors/SupervisorsSessionMenuComponent";
import { supervisorAllergenCountComponent as createSupervisorAllergenCountComponent } from "~/model/SystemComponents/supervisors/SupervisorAllergenCountComponent";
import { supervisorsAllergenOptionsComponent as createSupervisorsAllergenOptionsComponent } from "~/model/SystemComponents/supervisors/SupervisorsAllergenOptionsComponent";
import { supervisorsCountComponent as createSupervisorsCountComponent } from "~/model/SystemComponents/supervisors/SupervisorsCountComponent";
import { supervisorsBadgeComponent as createSupervisorsBadgeComponent } from "~/model/SystemComponents/supervisors/SupervisorsBadgeComponent";
import { supervisorsSampleComponent as createSupervisorsSampleComponent } from "~/model/SystemComponents/supervisors/SupervisorsSampleComponent";
import { supervisorsAllergensComponent as createSupervisorsAllergensComponent } from "~/model/SystemComponents/supervisors/SupervisorsAllergensComponent";
import { supervisorsSessionsComponent as createSupervisorsSessionsComponent } from "~/model/SystemComponents/supervisors/SupervisorsSessionsComponent";
import { supervisorsListComponent as createSupervisorsListComponent } from "~/model/SystemComponents/supervisors/SupervisorsListComponent";
import { supervisorInsertComponent as createSupervisorInsertComponent } from "~/model/SystemComponents/supervisors/SupervisorInsertComponent";
import { supervisorGetIdComponent as createSupervisorGetIdComponent } from "~/model/SystemComponents/supervisors/SupervisorGetIdComponent";
import { supervisorUpdateComponent as createSupervisorUpdateComponent } from "~/model/SystemComponents/supervisors/SupervisorUpdateComponent";
import { supervisorDeleteComponent as createSupervisorDeleteComponent } from "~/model/SystemComponents/supervisors/SupervisorDeleteComponent";
import { supervisorAllergenIdsComponent as createSupervisorAllergenIdsComponent } from "~/model/SystemComponents/supervisors/SupervisorAllergenIdsComponent";
import { supervisorAllergenInsertComponent as createSupervisorAllergenInsertComponent } from "~/model/SystemComponents/supervisors/SupervisorAllergenInsertComponent";
import { supervisorAllergenDeleteComponent as createSupervisorAllergenDeleteComponent } from "~/model/SystemComponents/supervisors/SupervisorAllergenDeleteComponent";

// Meals Components
import { mealsComponent as createMealsComponent } from "~/model/SystemComponents/meals/MealsComponent";
import { deleteMealButtonComponent as createDeleteMealButtonComponent } from "~/model/SystemComponents/meals/DeleteMealButtonComponent";
import { mealCountBadgeComponent as createMealCountBadgeComponent } from "~/model/SystemComponents/meals/MealCountBadgeComponent";
import { mealsAllergensComponent as createMealsAllergensComponent } from "~/model/SystemComponents/meals/MealsAllergensComponent";
import { addMealComponent as createAddMealComponent } from "~/model/SystemComponents/meals/AddMealComponent";
import { editMealComponent as createEditMealComponent } from "~/model/SystemComponents/meals/EditMealComponent";
import { whenServedComponent as createWhenServedComponent } from "~/model/SystemComponents/meals/WhenServedComponent";
import { mealPlanComponent as createMealPlanComponent } from "~/model/SystemComponents/meals/MealPlanComponent";
import { mealListComponent as createMealListComponent } from "~/model/SystemComponents/meals/MealListComponent";
import { mealPlanParticipantAllergensComponent as createMealPlanParticipantAllergensComponent } from "~/model/SystemComponents/meals/MealPlanParticipantAllergensComponent";
import { mealPlanSupervisorAllergensComponent as createMealPlanSupervisorAllergensComponent } from "~/model/SystemComponents/meals/MealPlanSupervisorAllergensComponent";
import { mealParticipantDeleteComponent as createMealParticipantDeleteComponent } from "~/model/SystemComponents/meals/MealParticipantDeleteComponent";
import { mealSupervisorDeleteComponent as createMealSupervisorDeleteComponent } from "~/model/SystemComponents/meals/MealSupervisorDeleteComponent";
import { addParticipantToMealSelectComponent as createAddParticipantToMealSelectComponent } from "~/model/SystemComponents/meals/AddParticipantToMealSelectComponent";
import { addParticipantToMealMealsComponent as createAddParticipantToMealMealsComponent } from "~/model/SystemComponents/meals/AddParticipantToMealMealsComponent";
import { addParticipantToMealInsertComponent as createAddParticipantToMealInsertComponent } from "~/model/SystemComponents/meals/AddParticipantToMealInsertComponent";
import { addSupervisorToMealSelectComponent as createAddSupervisorToMealSelectComponent } from "~/model/SystemComponents/meals/AddSupervisorToMealSelectComponent";
import { addSupervisorToMealMealsComponent as createAddSupervisorToMealMealsComponent } from "~/model/SystemComponents/meals/AddSupervisorToMealMealsComponent";
import { addSupervisorToMealInsertComponent as createAddSupervisorToMealInsertComponent } from "~/model/SystemComponents/meals/AddSupervisorToMealInsertComponent";
import { addParticipantToMealDateComponent as addParticipantToMealDateComponentDefinition } from "~/model/SystemComponents/meals/AddParticipantToMealDateComponent";
import { addSupervisorToMealDateComponent as addSupervisorToMealDateComponentDefinition } from "~/model/SystemComponents/meals/AddSupervisorToMealDateComponent";

// Validation Components
import { validationNameComponent as validationNameComponentDefinition } from "~/model/SystemComponents/validation/ValidationNameComponent";
import { validationEmailComponent as validationEmailComponentDefinition } from "~/model/SystemComponents/validation/ValidationEmailComponent";
import { validationPersonalNumberComponent as validationPersonalNumberComponentDefinition } from "~/model/SystemComponents/validation/ValidationPersonalNumberComponent";
import { validationPhoneComponent as validationPhoneComponentDefinition } from "~/model/SystemComponents/validation/ValidationPhoneComponent";
import { validationDateRangeComponent as validationDateRangeComponentDefinition } from "~/model/SystemComponents/validation/ValidationDateRangeComponent";


/**
 * Class encapsulating the management of components in the system. 
 */
export class ComponentManager {
  public static initializeComponents() {

    console.log("Initializing components...");
    const componentCodeStore = useComponentCodeStore()
    const selectedSystemStore = useSelectedSystemStore();

    // Component maps are now part of the InformationSystem object, no need to load separately

    // if (!selectedSystemStore.selectedSystem?.db) {
    //   console.warn("Cannot initialize components: Database not ready");
    //   return;
    // }

    // New instances created from the existing code above
    const statsMealsComponent = createStatsMealsComponent(selectedSystemStore);
    const statsParticipantsComponent = createStatsParticipantsComponent(selectedSystemStore);
    const statsSessionsComponent = createStatsSessionsComponent(selectedSystemStore);
    const statsSupervisorsComponent = createStatsSupervisorsComponent(selectedSystemStore);
    const participantsCapacityCountComponentAll = createParticipantsCapacityCountComponentAll(selectedSystemStore);


    const tableCountBadgeComponent = tableCountBadgeComponentDefinition;
    const sessionDayCountBadgeComponent = createSessionDayCountBadgeComponent(selectedSystemStore);
    const mealCountBadgeComponent = createMealCountBadgeComponent(selectedSystemStore);
    const sessionDateRangeComponent = createSessionDateRangeComponent(selectedSystemStore);
    const sessionCapacitySectionComponent = createSessionCapacitySectionComponent(selectedSystemStore);
    const sessionParticipantsSectionComponent = createSessionParticipantsSectionComponent(selectedSystemStore);
    const sessionParticipantsListComponent = createSessionParticipantsListComponent(selectedSystemStore);
    const sessionParticipantsCountComponent = createSessionParticipantsCountComponent(selectedSystemStore);
    const sessionSupervisorsSectionComponent = createSessionSupervisorsSectionComponent(selectedSystemStore);
    const sessionSupervisorsListComponent = createSessionSupervisorsListComponent(selectedSystemStore);
    const sessionSupervisorsCountComponent = createSessionSupervisorsCountComponent(selectedSystemStore);
    const sessionDeleteButtonComponent = createSessionDeleteButtonComponent(selectedSystemStore);



    const sessionStatusBadgeComponent = createSessionStatusBadgeComponent(selectedSystemStore);

    // Participants page components
    const participantsCapacityCountComponent = createParticipantsCapacityCountComponent(selectedSystemStore);
    const participantsCapacityCountSessionComponent = createParticipantsCapacityCountSessionComponent(selectedSystemStore);
    const participantsCapacityPercentageComponent = participantsCapacityPercentageComponentDefinition;
    const participantsPageCount1Component = participantsPageCount1ComponentDefinition;
    const participantsPageCount2Component = participantsPageCount2ComponentDefinition;
    const participantsFilterResetComponent = participantsFilterResetComponentDefinition;
    const participantsFilterInputComponent = participantsFilterInputComponentDefinition;
    const participantsAddNameComponent = participantsAddNameComponentDefinition;
    const participantsAddEmailComponent = participantsAddEmailComponentDefinition;
    const participantsAddPersonalNumberComponent = participantsAddPersonalNumberComponentDefinition;
    const participantsAddPhoneComponent = participantsAddPhoneComponentDefinition;
    const participantsAddAddressComponent = participantsAddAddressComponentDefinition;
    const participantsAddAgeComponent = participantsAddAgeComponentDefinition;
    const participantsAddSessionComponent = participantsAddSessionComponentDefinition;
    const participantsAddAllergensComponent = participantsAddAllergensComponentDefinition;
    const participantsCardComponent = participantsCardComponentDefinition;
    const participantsDeleteButtonComponent = participantsDeleteButtonComponentDefinition;
    const participantsEditNameComponent = participantsEditNameComponentDefinition;
    const participantsEditEmailComponent = participantsEditEmailComponentDefinition;
    const participantsEditPersonalNumberComponent = participantsEditPersonalNumberComponentDefinition;
    const participantsEditPhoneComponent = participantsEditPhoneComponentDefinition;
    const participantsEditAddressComponent = participantsEditAddressComponentDefinition;
    const participantsEditAgeComponent = participantsEditAgeComponentDefinition;
    const participantsEditAllergensComponent = participantsEditAllergensComponentDefinition;
    const participantsEditSessionsComponent = participantsEditSessionsComponentDefinition;
    const participantsSessionMenuComponent = participantsSessionMenuComponentDefinition;

    // SQL Components for participants.vue
    const participantsAllergenOptionsComponent = createParticipantsAllergenOptionsComponent(selectedSystemStore);
    const participantsCountComponent = createParticipantsCountComponent(selectedSystemStore);
    const sessionsCountComponent = createSessionsCountComponent(selectedSystemStore);
    const participantsSampleComponent = createParticipantsSampleComponent(selectedSystemStore);
    const participantsBadgeComponent = createParticipantsBadgeComponent(selectedSystemStore);
    const participantsAllergensComponent = createParticipantsAllergensComponent(selectedSystemStore);
    const participantAllergenCountComponent = createParticipantAllergenCountComponent(selectedSystemStore);
    const participantsSessionsComponent = createParticipantsSessionsComponent(selectedSystemStore);
    const sessionsListComponent = createSessionsListComponent(selectedSystemStore);
    const participantInsertComponent = createParticipantInsertComponent(selectedSystemStore);
    const participantsListComponent = createParticipantsListComponent(selectedSystemStore);
    const participantGetIdComponent = createParticipantGetIdComponent(selectedSystemStore);
    const participantUpdateComponent = createParticipantUpdateComponent(selectedSystemStore);
    const participantDeleteComponent = createParticipantDeleteComponent(selectedSystemStore);
    const sessionParticipantInsertComponent = createSessionParticipantInsertComponent(selectedSystemStore);
    const sessionParticipantDeleteComponent = createSessionParticipantDeleteComponent(selectedSystemStore);
    const participantAllergenIdsComponent = createParticipantAllergenIdsComponent(selectedSystemStore);
    const participantAllergenInsertComponent = createParticipantAllergenInsertComponent(selectedSystemStore);
    const participantAllergenDeleteComponent = createParticipantAllergenDeleteComponent(selectedSystemStore);

    const validationNameComponent = validationNameComponentDefinition;
    const validationEmailComponent = validationEmailComponentDefinition;
    const validationPersonalNumberComponent = validationPersonalNumberComponentDefinition;
    const validationPhoneComponent = validationPhoneComponentDefinition;
    const validationDateRangeComponent = validationDateRangeComponentDefinition;

    // Supervisors page components
    const supervisorsCapacityCountComponent = createSupervisorsCapacityCountComponent(selectedSystemStore);
    const supervisorsCapacityCountSessionComponent = createSupervisorsCapacityCountSessionComponent(selectedSystemStore);
    const supervisorsCapacityPercentageComponent = supervisorsCapacityPercentageComponentDefinition;
    const supervisorsPageCount1Component = supervisorsPageCount1ComponentDefinition;
    const supervisorsPageCount2Component = supervisorsPageCount2ComponentDefinition;
    const supervisorsFilterResetComponent = supervisorsFilterResetComponentDefinition;
    const supervisorsFilterInputComponent = supervisorsFilterInputComponentDefinition;
    const supervisorsSessionMenuComponent = supervisorsSessionMenuComponentDefinition;
    const supervisorAllergenCountComponent = createSupervisorAllergenCountComponent(selectedSystemStore);
    const supervisorsAllergenOptionsComponent = createSupervisorsAllergenOptionsComponent(selectedSystemStore);
    const supervisorsCountComponent = createSupervisorsCountComponent(selectedSystemStore);
    const supervisorsSampleComponent = createSupervisorsSampleComponent(selectedSystemStore);
    const supervisorsBadgeComponent = createSupervisorsBadgeComponent(selectedSystemStore);
    const supervisorsAllergensComponent = createSupervisorsAllergensComponent(selectedSystemStore);
    const supervisorsSessionsComponent = createSupervisorsSessionsComponent(selectedSystemStore);
    const supervisorInsertComponent = createSupervisorInsertComponent(selectedSystemStore);
    const supervisorsListComponent = createSupervisorsListComponent(selectedSystemStore);
    const supervisorGetIdComponent = createSupervisorGetIdComponent(selectedSystemStore);
    const supervisorUpdateComponent = createSupervisorUpdateComponent(selectedSystemStore);
    const supervisorDeleteComponent = createSupervisorDeleteComponent(selectedSystemStore);
    const sessionSupervisorInsertComponent = createSessionSupervisorInsertComponent(selectedSystemStore);
    const sessionSupervisorDeleteComponent = createSessionSupervisorDeleteComponent(selectedSystemStore);
    const supervisorAllergenIdsComponent = createSupervisorAllergenIdsComponent(selectedSystemStore);
    const supervisorAllergenInsertComponent = createSupervisorAllergenInsertComponent(selectedSystemStore);
    const supervisorAllergenDeleteComponent = createSupervisorAllergenDeleteComponent(selectedSystemStore);

    // Meals components
    const mealsComponent = createMealsComponent(selectedSystemStore);
    const mealsAllergensComponent = createMealsAllergensComponent(selectedSystemStore);
    const deleteMealButtonComponent = createDeleteMealButtonComponent(selectedSystemStore);
    const addMealComponent = createAddMealComponent(selectedSystemStore);
    const editMealComponent = createEditMealComponent(selectedSystemStore);
    const whenServedComponent = createWhenServedComponent(selectedSystemStore);
    const mealPlanComponent = createMealPlanComponent(selectedSystemStore);
    const mealListComponent = createMealListComponent(selectedSystemStore);
    const mealPlanParticipantAllergensComponent = createMealPlanParticipantAllergensComponent(selectedSystemStore);
    const mealPlanSupervisorAllergensComponent = createMealPlanSupervisorAllergensComponent(selectedSystemStore);
    const mealParticipantDeleteComponent = createMealParticipantDeleteComponent(selectedSystemStore);
    const mealSupervisorDeleteComponent = createMealSupervisorDeleteComponent(selectedSystemStore);
    const addParticipantToMealSelectComponent = createAddParticipantToMealSelectComponent(selectedSystemStore);
    const addParticipantToMealMealsComponent = createAddParticipantToMealMealsComponent(selectedSystemStore);
    const addParticipantToMealInsertComponent = createAddParticipantToMealInsertComponent(selectedSystemStore);
    const addSupervisorToMealSelectComponent = createAddSupervisorToMealSelectComponent(selectedSystemStore);
    const addSupervisorToMealMealsComponent = createAddSupervisorToMealMealsComponent(selectedSystemStore);
    const addSupervisorToMealInsertComponent = createAddSupervisorToMealInsertComponent(selectedSystemStore);
    const addParticipantToMealDateComponent = addParticipantToMealDateComponentDefinition;
    const addSupervisorToMealDateComponent = addSupervisorToMealDateComponentDefinition;




    // Store the instances into the store
    componentCodeStore.updateDefaultComponent(mealListComponent);

    componentCodeStore.updateDefaultComponent(statsMealsComponent);
    componentCodeStore.updateDefaultComponent(statsParticipantsComponent);
    componentCodeStore.updateDefaultComponent(statsSessionsComponent);
    componentCodeStore.updateDefaultComponent(statsSupervisorsComponent);
    componentCodeStore.updateDefaultComponent(participantsCapacityCountComponentAll);
    componentCodeStore.updateDefaultComponent(tableCountBadgeComponent);
    componentCodeStore.updateDefaultComponent(sessionDayCountBadgeComponent);
    componentCodeStore.updateDefaultComponent(sessionDateRangeComponent);
    componentCodeStore.updateDefaultComponent(sessionCapacitySectionComponent);
    componentCodeStore.updateDefaultComponent(sessionParticipantsSectionComponent);
    componentCodeStore.updateDefaultComponent(sessionSupervisorsSectionComponent);
    componentCodeStore.updateDefaultComponent(sessionDeleteButtonComponent);
    componentCodeStore.updateDefaultComponent(sessionStatusBadgeComponent);
    componentCodeStore.updateDefaultComponent(participantsCapacityCountComponent);
    componentCodeStore.updateDefaultComponent(participantsCapacityCountSessionComponent);
    componentCodeStore.updateDefaultComponent(participantsCapacityPercentageComponent);
    componentCodeStore.updateDefaultComponent(participantsPageCount1Component);
    componentCodeStore.updateDefaultComponent(participantsPageCount2Component);
    componentCodeStore.updateDefaultComponent(participantsFilterResetComponent);
    componentCodeStore.updateDefaultComponent(participantsFilterInputComponent);
    componentCodeStore.updateDefaultComponent(participantsAddNameComponent);
    componentCodeStore.updateDefaultComponent(participantsAddEmailComponent);
    componentCodeStore.updateDefaultComponent(participantsAddPersonalNumberComponent);
    componentCodeStore.updateDefaultComponent(participantsAddPhoneComponent);
    componentCodeStore.updateDefaultComponent(participantsAddAddressComponent);
    componentCodeStore.updateDefaultComponent(participantsAddAgeComponent);
    componentCodeStore.updateDefaultComponent(participantsAddSessionComponent);
    componentCodeStore.updateDefaultComponent(participantsAddAllergensComponent);
    componentCodeStore.updateDefaultComponent(participantsCardComponent);
    componentCodeStore.updateDefaultComponent(participantsDeleteButtonComponent);
    componentCodeStore.updateDefaultComponent(participantsEditNameComponent);
    componentCodeStore.updateDefaultComponent(participantsEditEmailComponent);
    componentCodeStore.updateDefaultComponent(participantsEditPersonalNumberComponent);
    componentCodeStore.updateDefaultComponent(participantsEditPhoneComponent);
    componentCodeStore.updateDefaultComponent(participantsEditAddressComponent);
    componentCodeStore.updateDefaultComponent(participantsEditAgeComponent);
    componentCodeStore.updateDefaultComponent(participantsEditAllergensComponent);
    componentCodeStore.updateDefaultComponent(participantsEditSessionsComponent);
    componentCodeStore.updateDefaultComponent(participantsSessionMenuComponent);
    componentCodeStore.updateDefaultComponent(participantsAllergenOptionsComponent);
    componentCodeStore.updateDefaultComponent(participantsCountComponent);
    componentCodeStore.updateDefaultComponent(sessionsCountComponent);
    componentCodeStore.updateDefaultComponent(participantsSampleComponent);
    componentCodeStore.updateDefaultComponent(participantsBadgeComponent);
    componentCodeStore.updateDefaultComponent(participantsAllergensComponent);
    componentCodeStore.updateDefaultComponent(participantsSessionsComponent);
    componentCodeStore.updateDefaultComponent(sessionsListComponent);
    componentCodeStore.updateDefaultComponent(participantInsertComponent);
    componentCodeStore.updateDefaultComponent(participantsListComponent);
    componentCodeStore.updateDefaultComponent(participantGetIdComponent);
    componentCodeStore.updateDefaultComponent(participantUpdateComponent);
    componentCodeStore.updateDefaultComponent(participantDeleteComponent);
    componentCodeStore.updateDefaultComponent(sessionParticipantInsertComponent);
    componentCodeStore.updateDefaultComponent(sessionParticipantDeleteComponent);
    componentCodeStore.updateDefaultComponent(participantAllergenIdsComponent);
    componentCodeStore.updateDefaultComponent(participantAllergenInsertComponent);
    componentCodeStore.updateDefaultComponent(participantAllergenDeleteComponent);
    componentCodeStore.updateDefaultComponent(participantAllergenCountComponent);
    componentCodeStore.updateActualComponent(participantAllergenCountComponent);
    componentCodeStore.updateDefaultComponent(validationNameComponent);
    componentCodeStore.updateDefaultComponent(validationEmailComponent);
    componentCodeStore.updateDefaultComponent(validationPersonalNumberComponent);
    componentCodeStore.updateDefaultComponent(validationPhoneComponent);
    componentCodeStore.updateDefaultComponent(validationDateRangeComponent);
    componentCodeStore.updateDefaultComponent(sessionParticipantsCountComponent);

    // Register defaults for supervisors
    componentCodeStore.updateDefaultComponent(supervisorsCapacityCountComponent);
    componentCodeStore.updateDefaultComponent(supervisorsCapacityCountSessionComponent);
    componentCodeStore.updateDefaultComponent(supervisorsCapacityPercentageComponent);
    componentCodeStore.updateDefaultComponent(supervisorsPageCount1Component);
    componentCodeStore.updateDefaultComponent(supervisorsPageCount2Component);
    componentCodeStore.updateDefaultComponent(supervisorsFilterResetComponent);
    componentCodeStore.updateDefaultComponent(supervisorsFilterInputComponent);
    componentCodeStore.updateDefaultComponent(supervisorsSessionMenuComponent);
    componentCodeStore.updateDefaultComponent(supervisorAllergenCountComponent);
    componentCodeStore.updateDefaultComponent(supervisorsAllergenOptionsComponent);
    componentCodeStore.updateDefaultComponent(supervisorsCountComponent);
    componentCodeStore.updateDefaultComponent(supervisorsSampleComponent);
    componentCodeStore.updateDefaultComponent(supervisorsBadgeComponent);
    componentCodeStore.updateDefaultComponent(supervisorsAllergensComponent);
    componentCodeStore.updateDefaultComponent(supervisorsSessionsComponent);
    componentCodeStore.updateDefaultComponent(supervisorInsertComponent);
    componentCodeStore.updateDefaultComponent(supervisorsListComponent);
    componentCodeStore.updateDefaultComponent(supervisorGetIdComponent);
    componentCodeStore.updateDefaultComponent(supervisorUpdateComponent);
    componentCodeStore.updateDefaultComponent(supervisorDeleteComponent);
    componentCodeStore.updateDefaultComponent(sessionSupervisorInsertComponent);
    componentCodeStore.updateDefaultComponent(sessionSupervisorDeleteComponent);
    componentCodeStore.updateDefaultComponent(supervisorAllergenIdsComponent);
    componentCodeStore.updateDefaultComponent(supervisorAllergenInsertComponent);
    componentCodeStore.updateDefaultComponent(supervisorAllergenDeleteComponent);
    componentCodeStore.updateDefaultComponent(mealsComponent);
    componentCodeStore.updateDefaultComponent(mealsAllergensComponent);
    componentCodeStore.updateDefaultComponent(deleteMealButtonComponent);
    componentCodeStore.updateDefaultComponent(addMealComponent);
    componentCodeStore.updateDefaultComponent(editMealComponent);
    componentCodeStore.updateDefaultComponent(whenServedComponent);
    componentCodeStore.updateDefaultComponent(mealPlanComponent);
    componentCodeStore.updateDefaultComponent(mealPlanParticipantAllergensComponent);
    componentCodeStore.updateDefaultComponent(mealPlanSupervisorAllergensComponent);
    componentCodeStore.updateDefaultComponent(mealParticipantDeleteComponent);
    componentCodeStore.updateDefaultComponent(mealSupervisorDeleteComponent);
    componentCodeStore.updateDefaultComponent(addParticipantToMealSelectComponent);
    componentCodeStore.updateDefaultComponent(addParticipantToMealMealsComponent);
    componentCodeStore.updateDefaultComponent(addParticipantToMealInsertComponent);
    componentCodeStore.updateDefaultComponent(addSupervisorToMealSelectComponent);
    componentCodeStore.updateDefaultComponent(addSupervisorToMealMealsComponent);
    componentCodeStore.updateDefaultComponent(addSupervisorToMealInsertComponent);
    componentCodeStore.updateDefaultComponent(addParticipantToMealDateComponent);
    componentCodeStore.updateDefaultComponent(addSupervisorToMealDateComponent);
    componentCodeStore.updateDefaultComponent(sessionParticipantsListComponent);
    componentCodeStore.updateDefaultComponent(sessionSupervisorsListComponent);
    componentCodeStore.updateDefaultComponent(sessionSupervisorsCountComponent);
    componentCodeStore.updateDefaultComponent(mealCountBadgeComponent);



    // Reset to defaults so they are available
    componentCodeStore.resetComponent("supervisors-capacity-count");
    componentCodeStore.resetComponent("supervisors-capacity-count-session");
    componentCodeStore.resetComponent("supervisors-capacity-percentage");
    componentCodeStore.resetComponent("supervisors-page-count-1");
    componentCodeStore.resetComponent("supervisors-page-count-2");
    componentCodeStore.resetComponent("supervisors-filter-reset");
    componentCodeStore.resetComponent("supervisors-filter-input");
    componentCodeStore.resetComponent("supervisors-session-menu");
    componentCodeStore.resetComponent("supervisor-allergen-count");
    componentCodeStore.resetComponent("supervisors-allergen-options");
    componentCodeStore.resetComponent("supervisors-count");
    componentCodeStore.resetComponent("supervisors-sample");
    componentCodeStore.resetComponent("supervisors-badge");
    componentCodeStore.resetComponent("supervisors-allergens");
    componentCodeStore.resetComponent("supervisors-sessions");
    componentCodeStore.resetComponent("supervisor-insert");
    componentCodeStore.resetComponent("supervisors-list");
    componentCodeStore.resetComponent("supervisor-get-id");
    componentCodeStore.resetComponent("supervisor-update");
    componentCodeStore.resetComponent("supervisor-delete");
    componentCodeStore.resetComponent("session-supervisor-insert");
    componentCodeStore.resetComponent("session-supervisor-delete");
    componentCodeStore.resetComponent("supervisor-allergen-ids");
    componentCodeStore.resetComponent("supervisor-allergen-insert");
    componentCodeStore.resetComponent("supervisor-allergen-delete");
    componentCodeStore.resetComponent("stats-meals");
    componentCodeStore.resetComponent("stats-participants");
    componentCodeStore.resetComponent("stats-sessions");
    componentCodeStore.resetComponent("stats-supervisors");
    componentCodeStore.resetComponent("participants-capacity-count-all");
    componentCodeStore.resetComponent("participants-capacity-count");
    componentCodeStore.resetComponent("participants-capacity-count-session");
    componentCodeStore.resetComponent("dashboard-table-count-badge");
    componentCodeStore.resetComponent("session-day-count-badge");
    componentCodeStore.resetComponent("meals-count-badge");
    componentCodeStore.resetComponent("session-date-range");
    componentCodeStore.resetComponent("session-capacity-section");
    componentCodeStore.resetComponent("session-participants-section");
    componentCodeStore.resetComponent("session-supervisors-section");
    componentCodeStore.resetComponent("session-delete-button");
    componentCodeStore.resetComponent("session-status-badge");
    componentCodeStore.resetComponent("participants-capacity-percentage");
    componentCodeStore.resetComponent("participants-page-count-1");
    componentCodeStore.resetComponent("participants-page-count-2");
    componentCodeStore.resetComponent("participants-filter-reset");
    componentCodeStore.resetComponent("participants-filter-input");
    componentCodeStore.resetComponent("participants-add-name");
    componentCodeStore.resetComponent("participants-add-email");
    componentCodeStore.resetComponent("participants-add-personal_number");
    componentCodeStore.resetComponent("participants-add-phone");
    componentCodeStore.resetComponent("participants-add-address");
    componentCodeStore.resetComponent("participants-add-age");
    componentCodeStore.resetComponent("participants-add-session");
    componentCodeStore.resetComponent("participants-add-allergens");
    componentCodeStore.resetComponent("participants-card");
    componentCodeStore.resetComponent("participants-delete-button");
    componentCodeStore.resetComponent("participants-edit-name");
    componentCodeStore.resetComponent("participants-edit-email");
    componentCodeStore.resetComponent("participants-edit-personal_number");
    componentCodeStore.resetComponent("participants-edit-phone");
    componentCodeStore.resetComponent("participants-edit-address");
    componentCodeStore.resetComponent("participants-edit-age");
    componentCodeStore.resetComponent("participants-edit-allergens");
    componentCodeStore.resetComponent("participants-edit-sessions");
    componentCodeStore.resetComponent("participants-session-menu");
    componentCodeStore.resetComponent("participants-allergen-options");
    componentCodeStore.resetComponent("participants-count");
    componentCodeStore.resetComponent("sessions-count");
    componentCodeStore.resetComponent("participants-sample");
    componentCodeStore.resetComponent("participants-badge");
    componentCodeStore.resetComponent("participants-allergens");
    componentCodeStore.resetComponent("participants-sessions");
    componentCodeStore.resetComponent("sessions-list");
    componentCodeStore.resetComponent("participant-insert");
    componentCodeStore.resetComponent("participants-list");
    componentCodeStore.resetComponent("participant-get-id");
    componentCodeStore.resetComponent("participant-update");
    componentCodeStore.resetComponent("participant-delete");
    componentCodeStore.resetComponent("session-participant-insert");
    componentCodeStore.resetComponent("session-participant-delete");
    componentCodeStore.resetComponent("participant-allergen-ids");
    componentCodeStore.resetComponent("participant-allergen-insert");
    componentCodeStore.resetComponent("participant-allergen-delete");
    componentCodeStore.resetComponent("participant-allergen-count");
    componentCodeStore.resetComponent("validation-name");
    componentCodeStore.resetComponent("validation-email");
    componentCodeStore.resetComponent("validation-personal-number");
    componentCodeStore.resetComponent("validation-phone");
    componentCodeStore.resetComponent("validation-date-range");
    componentCodeStore.resetComponent("meals");
    componentCodeStore.resetComponent("meals-allergens");
    componentCodeStore.resetComponent("meals-delete");
    componentCodeStore.resetComponent("meals-add");
    componentCodeStore.resetComponent("meals-edit");
    componentCodeStore.resetComponent("meals-when-served");
    componentCodeStore.resetComponent("meal-plan-list");
    componentCodeStore.resetComponent("meal-plan-participant-allergen-list");
    componentCodeStore.resetComponent("meal-plan-supervisor-allergen-list");
    componentCodeStore.resetComponent("meal-participant-delete");
    componentCodeStore.resetComponent("meal-supervisor-delete");
    componentCodeStore.resetComponent("add-participant-to-meal-select");
    componentCodeStore.resetComponent("add-participant-to-meal-meals");
    componentCodeStore.resetComponent("add-participant-to-meal-insert");
    componentCodeStore.resetComponent("add-supervisor-to-meal-select");
    componentCodeStore.resetComponent("add-supervisor-to-meal-meals");
    componentCodeStore.resetComponent("add-supervisor-to-meal-insert");
    componentCodeStore.resetComponent("add-participant-to-meal-date");
    componentCodeStore.resetComponent("add-supervisor-to-meal-date");
    componentCodeStore.resetComponent("session-participants-count");
    componentCodeStore.resetComponent("session-participants-list");
    componentCodeStore.resetComponent("session-supervisors-list");
    componentCodeStore.resetComponent("session-supervisors-count");
    componentCodeStore.resetComponent("meal-plan-meal-allergen-list");
  }

  public static areComponentsInitialized(): boolean {
    const selectedSystemStore = useSelectedSystemStore();
    return (selectedSystemStore.selectedSystem?.defaultComponentMap?.length ?? 0) > 0;
  }


}