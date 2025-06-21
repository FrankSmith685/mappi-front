import { AppState } from "../interfaces/appStateInterface";
import { 
  ActionTypes,
  SET_REGISTERUSER,
  SET_USER,
  SET_MODIFIEDUSER,
  SET_TOKEN, 
  SET_ISSIDEBARCOLLAPSED, 
  SET_LOADING,
  SET_MODAL,
  SET_SERVICE_PUBLISH_TYPE,
  SET_PUBLISH_SERVICE_TYPE,  
  SET_DEPARTMENTS_ALL,
  SET_DISTRICTS_ALL,
  SET_CURRENT_LOCATION,
  SET_CURRENT_LOCATION_AUX,
  SET_MODIFIEDCOMPANY,
  SET_COMPANY,
  SET_ARCHIVEBYUSER,
  SET_CATEGORY,
  SET_SUBCATEGORY,
  SET_SERVICE,
  SET_MODIFIEDSERVICE,
  SET_SERVICELIST,
  SET_PLANES,
  SET_ISACTIVECOMPANY,
  SET_DELETEIDSARCHIVES,
  SET_ARCHIVEBYSERVICE,
  SET_MOVIE_SERVICE,
  SET_LETTER_SERVICE,
  SET_DELETE_MOVIE_SERVICE,
  SET_DELETE_LETTER_SERVICE,
  SET_ISSIDEBARCOLLAPSEDSERVICE,
  SET_CURRENT_LOCATION_SERVICE,
  SET_CURRENT_POSITION_SERVICE,
  SET_SEARCH_SERVICE,
  SET_SERVICE_ALL,
  SET_SELECTED_SERVICE,
  SET_SERVICE_EXPANDED,
  SET_SERVICE_NEAR_ALL,
  SET_SERVICE_ACTIVE,
  SET_ARCHIVEBYSERVICERESENA,  
  SET_ACTIVEMODALOPTIONSESSION,
  SET_ACTIVEMODALOPTION,
  SET_NAVIGATE_SERVICE,
  SET_ACTIVEHUARIQUEPUBLIC,
  SET_NAVIGATE_CURRENT_SERVICE,
  SET_EMAIL_RECOVER_PASSWORD,
  SET_ROL
  } from "../types/actionsTypes";

export const appReducer = (state: AppState, action: ActionTypes): AppState => {
  switch (action.type) {
    case SET_REGISTERUSER:
      return { ...state, registerUser: action.payload }; 
    case SET_USER:
      return { ...state, user: action.payload }; 
    case SET_MODIFIEDUSER:
      return { ...state, modifiedUser: action.payload };
    case SET_TOKEN:
      if (action.payload) {
        localStorage.setItem("token", action.payload);
      } else {
        localStorage.removeItem("token");
      }
      return { ...state, token: action.payload };
    case SET_ISSIDEBARCOLLAPSED:
      return { ...state, isSidebarCollapsed: !state.isSidebarCollapsed };
    case SET_LOADING:
      return { ...state, isLoading: action.payload };
    case SET_MODAL:
      return { ...state, modal: action.payload };
    case SET_SERVICE_PUBLISH_TYPE:
      return { ...state, servicePublishStep: action.payload };
    case SET_PUBLISH_SERVICE_TYPE:
      return { ...state, servicePublishType: action.payload };
    case SET_DEPARTMENTS_ALL:
      localStorage.setItem("departmentsAll", JSON.stringify(action.payload));
      return { ...state, departmentsAll: action.payload };
    case SET_DISTRICTS_ALL:
      localStorage.setItem("districtsAll", JSON.stringify(action.payload));
      return { ...state, districtsAll: action.payload };
    case SET_CURRENT_LOCATION: {
      const departmentDefault = state.departmentsAll.find(
        (department) => department.id === 1392
      );
      const districtbydepartmentDefault = state.districtsAll.filter(
        (district) => district.idPadre === departmentDefault?.id
      );
      const payload = action.payload || {};
      const hasDistricts =
        Array.isArray(payload.districtbydepartment) &&
        payload.districtbydepartment.length > 0;
    
      const newLocation = {
        address:
          payload.address !== ""
            ? payload.address
            : "XX34+CVP, BRT Metropolitano, Lima 15082, Peru",
        department:
          payload.department?.value && payload.department.value !== 0
            ? payload.department
            : {
                value: departmentDefault?.id || 1392,
                label: departmentDefault?.nombre || "Lima",
                quantity: departmentDefault?.cantidad || 0,
              },
        district:
          payload.district?.value && payload.district.value !== 0
            ? payload.district
            : {
                value: 1394,
                label: "Lima",
                quantity: 0,
              },
        districtbydepartment: hasDistricts
          ? payload.districtbydepartment
          : districtbydepartmentDefault,
        idUbigeo: payload.idUbigeo !== "" ? payload.idUbigeo : "1392",
        latitude: payload.latitude !== 0 ? payload.latitude : -12.0464,
        longitude: payload.longitude !== 0 ? payload.longitude : -77.0428,
      };
    
      // Guardar en localStorage
      localStorage.setItem("currentLocation", JSON.stringify(newLocation));
    
      return {
        ...state,
        currentLocation: newLocation,
      };
    }
      
      
    case SET_CURRENT_LOCATION_AUX:
      return { ...state, currentLocationAux: action.payload };
    case SET_COMPANY:
        return { ...state, company: action.payload };
    case SET_MODIFIEDCOMPANY:
      return { ...state, modifiedCompany: action.payload };
    case SET_ARCHIVEBYUSER:
      return { ...state, archiveByUser: action.payload };
    case SET_CATEGORY:
      return { ...state, category: action.payload };
    case SET_SUBCATEGORY:
      return { ...state, subCategory: action.payload };
    case SET_SERVICE:
      return { ...state, service: action.payload };
    case SET_MODIFIEDSERVICE:
      return { ...state, modifiedService: action.payload };
    case SET_SERVICELIST:
      return { ...state, serviceList: action.payload };
    case SET_PLANES:
      return { ...state, planes: action.payload };
    case SET_ISACTIVECOMPANY:
      return { ...state, isActiveCompany: action.payload };
    case SET_DELETEIDSARCHIVES:
    return { ...state, deleteIdsArchive: action.payload };
    case SET_ARCHIVEBYSERVICE:
        return { ...state, archiveByService: action.payload };
    case SET_MOVIE_SERVICE:
        return { ...state, movieService: action.payload };
    case SET_LETTER_SERVICE:
        return { ...state, letterService: action.payload };
    case SET_DELETE_MOVIE_SERVICE:
      return { ...state, deleteMovieService: action.payload };
    case SET_DELETE_LETTER_SERVICE:
      return { ...state, deleteLetterService: action.payload };
    case SET_ISSIDEBARCOLLAPSEDSERVICE:
      return { ...state, isSidebarCollapsedService: action.payload };
    case SET_CURRENT_LOCATION_SERVICE:
      return { ...state, currentLocationService: action.payload };
    case SET_CURRENT_POSITION_SERVICE:
      return { ...state, currentPositionService: action.payload };
    case SET_SEARCH_SERVICE:
      return { ...state, searchService: action.payload };
    case SET_SERVICE_ALL:
      return { ...state, serviceAll: action.payload };
    case SET_SERVICE_NEAR_ALL:
      return { ...state, serviceNearAll: action.payload };
    case SET_SELECTED_SERVICE:
      return { ...state, selectedService: action.payload };
    case SET_SERVICE_EXPANDED:
      return { ...state, serviceExpanded: action.payload };
    case SET_SERVICE_ACTIVE:
      return { ...state, serviceActive: action.payload };
    case SET_ARCHIVEBYSERVICERESENA:
      return {...state,archiveByServiceResena: action.payload};
    case SET_ACTIVEMODALOPTIONSESSION:
      return {...state,activeModalOptionSession: action.payload};
    case SET_ACTIVEMODALOPTION:
      return {...state,activeModalOption: action.payload};
    case SET_NAVIGATE_SERVICE:
      localStorage.setItem("navigateService", JSON.stringify(action.payload));
      return { ...state, navigateService: action.payload };
    case SET_ACTIVEHUARIQUEPUBLIC:
      return { ...state, activeHuariquePublic: action.payload };
    case SET_NAVIGATE_CURRENT_SERVICE:
      return { ...state, navigateCurrentService: action.payload };
    case SET_EMAIL_RECOVER_PASSWORD:
      return { ...state, emailRecoverPassword: action.payload };
    case SET_ROL:
      if (action.payload) {
        localStorage.setItem("rol", action.payload);
      } else {
        localStorage.removeItem("rol");
      }
      return { ...state, rol: action.payload };
    default:
      return state;
  }
};
