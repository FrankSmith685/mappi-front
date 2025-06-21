// import { User } from "../../interfaces/appStateInterface";
import { ArchiveByService, ArchiveByServiceResena, ArchiveByUser, deleteIDsArchives, documentService, videoService } from "../../interfaces/Archive";
import { RegisterData } from "../../interfaces/auth";
import { Category } from "../../interfaces/categories";
import { Company } from "../../interfaces/company";
import { GetPlanes } from "../../interfaces/planes";
import { Service } from "../../interfaces/service";
import { CurrentLocationService, CurrentPositionService } from "../../interfaces/serviceLocation";
import { PublishServiceType, ServicePublishStep } from "../../interfaces/servicePublish";
import { SubCategory } from "../../interfaces/subcategory";
import { dataUbigeo, LocationData } from "../../interfaces/ubigeo";
import { User } from "../../interfaces/user";
import {
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
  SET_COMPANY,
  SET_MODIFIEDCOMPANY,
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
  SET_ROL, 
} from "../../types/actionsTypes";

export const setRegisterUser = (registerUser: RegisterData | null) => ({
  type: SET_REGISTERUSER,
  payload: registerUser,
});

export const setUser = (user: User | null) => ({
  type: SET_USER,
  payload: user,
});

export const setModifiedUser = (modifiedUser: User | null) => ({
  type: SET_MODIFIEDUSER,
  payload: modifiedUser,
});

export const setToken = (token: string | null) => ({
  type: SET_TOKEN,
  payload: token,
});

export const setIsSidebarCollapsed = (isSidebarCollapsed: boolean) => ({
  type: SET_ISSIDEBARCOLLAPSED,
  payload: isSidebarCollapsed,
});

export const setLoading = (isLoading: boolean) => ({
  type: SET_LOADING,
  payload: isLoading,
});

export const setModal = (modal: boolean) => ({
  type: SET_MODAL,
  payload: modal,
});

export const setServicePublishStep = (servicePublishStep: ServicePublishStep) => ({
  type: SET_SERVICE_PUBLISH_TYPE,
  payload: servicePublishStep,
});

export const setServicePublishType = (servicePublishType: PublishServiceType) => ({
  type: SET_PUBLISH_SERVICE_TYPE,
  payload: servicePublishType,
});

export const setDepartmentsAll = (departmentsAll: dataUbigeo[]) => ({
  type: SET_DEPARTMENTS_ALL,
  payload: departmentsAll,
});

export const setDistrictsAll = (districtsAll: dataUbigeo[]) => ({
  type: SET_DISTRICTS_ALL,
  payload: districtsAll,
});

export const setCurrentLocation = (currentLocation: LocationData) => ({
  type: SET_CURRENT_LOCATION,
  payload: currentLocation,
});

export const setCurrentLocationAux = (currentLocationAux: LocationData) => ({
  type: SET_CURRENT_LOCATION_AUX,
  payload: currentLocationAux,
});

export const setCompany = (company: Company | null) => ({
  type: SET_COMPANY,
  payload: company,
});

export const setModifiedCompany = (modifiedCompany: Company | null) => ({
  type: SET_MODIFIEDCOMPANY,
  payload: modifiedCompany,
});

export const setArchiveByUser = (archiveByUser: ArchiveByUser | null) => ({
  type: SET_ARCHIVEBYUSER,
  payload: archiveByUser,
});

export const setCategory = (category: Category[]) => ({
  type: SET_CATEGORY,
  payload: category,
});

export const setSubCategory = (subCategory: SubCategory[]) => ({
  type: SET_SUBCATEGORY,
  payload: subCategory,
});

export const setService = (service: Service | null) => ({
  type: SET_SERVICE,
  payload: service,
});

export const setModifiedService = (modifiedService: Service | null) => ({
  type: SET_MODIFIEDSERVICE,
  payload: modifiedService,
});

export const setServiceList = (serviceList: Service[] | null) => ({
  type: SET_SERVICELIST,
  payload: serviceList,
});

export const setPlanes = (planes: GetPlanes | null) => ({
  type: SET_PLANES,
  payload: planes,
});

export const setIsActiveCompany = (isActiveCompany: boolean) => ({
  type: SET_ISACTIVECOMPANY,
  payload: isActiveCompany,
});

export const setDeleteIdsArchive = (deleteIdsArchive: deleteIDsArchives | null) => ({
  type: SET_DELETEIDSARCHIVES,
  payload: deleteIdsArchive,
});

export const setArchiveByService = (archiveByService: ArchiveByService | null) => ({
  type: SET_ARCHIVEBYSERVICE,
  payload: archiveByService,
});

export const setMovieService = (movieService: videoService | null) => ({
  type: SET_MOVIE_SERVICE,
  payload: movieService,
});

export const setLetterService = (letterService: documentService | null) => ({
  type: SET_LETTER_SERVICE,
  payload: letterService,
});

export const setDeleteMovieService = (deleteMovieService: number) => ({
  type: SET_DELETE_MOVIE_SERVICE,
  payload: deleteMovieService,
});

export const setDeleteLetterService = (deleteLetterService: number) => ({
  type: SET_DELETE_LETTER_SERVICE,
  payload: deleteLetterService,
});

export const setIsSidebarCollapsedService = (isSidebarCollapsedService: boolean) => ({
  type: SET_ISSIDEBARCOLLAPSEDSERVICE,
  payload: isSidebarCollapsedService,
});

export const setCurrentLocationService = (currentLocationService: CurrentLocationService) => ({
  type: SET_CURRENT_LOCATION_SERVICE,
  payload: currentLocationService,
});

export const setCurrentPositionService = (currentPositionService: CurrentPositionService) => ({
  type: SET_CURRENT_POSITION_SERVICE,
  payload: currentPositionService,
});

export const setSearchService = (searchService: string | null) => ({
  type: SET_SEARCH_SERVICE,
  payload: searchService,
});

export const setServiceAll = (serviceAll: Service[]) => ({
  type: SET_SERVICE_ALL,
  payload: serviceAll,
});

export const setServiceNearAll = (serviceNearAll: Service[]) => ({
  type: SET_SERVICE_NEAR_ALL,
  payload: serviceNearAll,
});

export const setSelectedService = (selectedService: Service) => ({
  type: SET_SELECTED_SERVICE,
  payload: selectedService,
});

export const setServiceExpanded = (serviceExpanded: boolean) => ({
  type: SET_SERVICE_EXPANDED,
  payload: serviceExpanded,
});

export const setServiceActive = (serviceActive: boolean) => ({
  type: SET_SERVICE_ACTIVE,
  payload: serviceActive,
});

export const setArchiveByServiceResena = (archiveByServiceResena: ArchiveByServiceResena | null) => ({
  type: SET_ARCHIVEBYSERVICERESENA,
  payload: archiveByServiceResena,
});

export const setActiveModalOPtionSession = (activeModalOPtionSession: boolean) => ({
  type: SET_ACTIVEMODALOPTIONSESSION,
  payload: activeModalOPtionSession,
});

export const setActiveModalOPtion = (activeModalOPtion: boolean) => ({
  type: SET_ACTIVEMODALOPTION,
  payload: activeModalOPtion,
});

export const setNavigateService = (navigateService: string | null) => ({
  type: SET_NAVIGATE_SERVICE,
  payload: navigateService,
});

export const setActiveHuariquePublic = (activeHuariquePublic: boolean) => ({
  type: SET_ACTIVEHUARIQUEPUBLIC,
  payload: activeHuariquePublic,
});

export const setNavigateCurrentService = (navigateCurrentService: string | null) => ({
  type: SET_NAVIGATE_CURRENT_SERVICE,
  payload: navigateCurrentService,
});

export const setEmailRecoverPassword = (emailRecoverPassword: string | null) => ({
  type: SET_EMAIL_RECOVER_PASSWORD,
  payload: emailRecoverPassword,
});

export const setRol = (rol: string | null) => ({
  type: SET_ROL,
  payload: rol,
});











