import { useContext } from "react";
import { AppContext } from "../context/appContext";
import { RegisterData } from "../interfaces/auth";

import { 
  setRegisterUser,
  setUser,
  setModifiedUser,
  setToken,
  setIsSidebarCollapsed,
  setModal,
  setServicePublishStep,
  setServicePublishType,
  setDepartmentsAll,
  setDistrictsAll,
  setCurrentLocation,
  setCurrentLocationAux,
  setCompany,
  setModifiedCompany,
  setArchiveByUser,
  setCategory,
  setSubCategory,
  setService,
  setModifiedService,
  setServiceList,
  setPlanes,
  setIsActiveCompany,
  setDeleteIdsArchive,
  setArchiveByService,
  setMovieService,
  setLetterService,
  setDeleteMovieService,
  setDeleteLetterService,
  setIsSidebarCollapsedService,
  setCurrentLocationService,
  setCurrentPositionService,
  setSearchService,
  setServiceAll,
  setServiceNearAll,
  setSelectedService,
  setServiceExpanded,
  setServiceActive,
  setArchiveByServiceResena,
  setActiveModalOPtionSession,
  setActiveModalOPtion,
  setNavigateService,
  setActiveHuariquePublic,
  setNavigateCurrentService,
  setEmailRecoverPassword,
  setRol
} from "../context/actions/actions";
import { User } from "../interfaces/user";
import { PublishServiceType, ServicePublishStep } from "../interfaces/servicePublish";
import { dataUbigeo, LocationData } from "../interfaces/ubigeo";
import { Company } from "../interfaces/company";
import { ArchiveByService, ArchiveByServiceResena, ArchiveByUser, deleteIDsArchives, documentService, videoService } from "../interfaces/Archive";
import { Category } from "../interfaces/categories";
import { SubCategory } from "../interfaces/subcategory";
import { Service } from "../interfaces/service";
import { GetPlanes } from "../interfaces/planes";
import { CurrentLocationService, CurrentPositionService } from "../interfaces/serviceLocation";

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState debe ser usado dentro de un AppProvider");
  }

  const { appState, dispatch,scrollRef } = context;

  return {
    ...appState,
    setRegisterUser: (registerUser: RegisterData | null) => dispatch(setRegisterUser(registerUser)),
    setToken: (token: string | null) => dispatch(setToken(token)),
    setUser: (user: User | null) => dispatch(setUser(user)),
    setModifiedUser: (modifiedUser: User | null) => dispatch(setModifiedUser(modifiedUser)),
    setIsSidebarCollapsed: (isSidebarCollapsed: boolean) => dispatch(setIsSidebarCollapsed(isSidebarCollapsed)),
    setModal: (modal: boolean) => dispatch(setModal(modal)),
    setServicePublishStep: (servicePublishStep: ServicePublishStep) => dispatch(setServicePublishStep(servicePublishStep)),
    setServicePublishType: (servicePublishType: PublishServiceType) => dispatch(setServicePublishType(servicePublishType)),
    setDepartmentsAll: (departmentsAll: dataUbigeo[]) => dispatch(setDepartmentsAll(departmentsAll)),
    setDistrictsAll: (districtsAll: dataUbigeo[]) => dispatch(setDistrictsAll(districtsAll)),
    setCurrentLocation: (currentLocation: LocationData) => dispatch(setCurrentLocation(currentLocation)),
    setCurrentLocationAux: (currentLocationAux: LocationData) => dispatch(setCurrentLocationAux(currentLocationAux)),
    setCompany: (company: Company | null) => dispatch(setCompany(company)),
    setModifiedCompany: (modifiedCompany: Company | null) => dispatch(setModifiedCompany(modifiedCompany)),
    setArchiveByUser: (archiveByUser: ArchiveByUser | null) => dispatch(setArchiveByUser(archiveByUser)),
    setCategory: (category: Category[]) => dispatch(setCategory(category)),
    setSubCategory: (subCategory: SubCategory[]) => dispatch(setSubCategory(subCategory)),
    setService: (service: Service | null) => dispatch(setService(service)),
    setModifiedService: (modifiedService: Service | null) => dispatch(setModifiedService(modifiedService)),
    setServiceList: (serviceList: Service[] | null) => dispatch(setServiceList(serviceList)),
    setPlanes: (planes: GetPlanes | null) => dispatch(setPlanes(planes)),
    setIsActiveCompany: (isActiveCompany: boolean) => dispatch(setIsActiveCompany(isActiveCompany)),
    setDeleteIdsArchive: (deleteIdsArchive: deleteIDsArchives | null) => dispatch(setDeleteIdsArchive(deleteIdsArchive)),
    setArchiveByService: (archiveByService: ArchiveByService | null) => dispatch(setArchiveByService(archiveByService)),
    setMovieService: (movieService: videoService | null) => dispatch(setMovieService(movieService)),
    setLetterService: (letterService: documentService | null) => dispatch(setLetterService(letterService)),
    setDeleteMovieService: (deleteMovieService: number) => dispatch(setDeleteMovieService(deleteMovieService)),
    setDeleteLetterService: (deleteLetterService: number) => dispatch(setDeleteLetterService(deleteLetterService)),
    setIsSidebarCollapsedService: (isSidebarCollapsedService: boolean) => dispatch(setIsSidebarCollapsedService(isSidebarCollapsedService)),
    setCurrentLocationService: (currentLocationService: CurrentLocationService) => dispatch(setCurrentLocationService(currentLocationService)),
    setCurrentPositionService: (currentPositionService: CurrentPositionService) => dispatch(setCurrentPositionService(currentPositionService)),
    setSearchService: (searchService: string | null) => dispatch(setSearchService(searchService)),
    setServiceAll: (serviceAll: Service[]) => dispatch(setServiceAll(serviceAll)),
    setServiceNearAll: (serviceNearAll: Service[]) => dispatch(setServiceNearAll(serviceNearAll)),
    setSelectedService: (selectedService: Service) => dispatch(setSelectedService(selectedService)),
    setServiceExpanded: (serviceExpanded: boolean) => dispatch(setServiceExpanded(serviceExpanded)),
    setServiceActive: (serviceActive: boolean) => dispatch(setServiceActive(serviceActive)),
    setArchiveByServiceResena: (archiveByServiceResena: ArchiveByServiceResena | null) => dispatch(setArchiveByServiceResena(archiveByServiceResena)),
    setActiveModalOPtionSession: (activeModalOptionSession: boolean) => dispatch(setActiveModalOPtionSession(activeModalOptionSession)),
    setActiveModalOPtion: (activeModalOption: boolean) => dispatch(setActiveModalOPtion(activeModalOption)),
    setNavigateService: (navigateService: string | null) => dispatch(setNavigateService(navigateService)),
    setActiveHuariquePublic: (activeHuariquePublic: boolean) => dispatch(setActiveHuariquePublic(activeHuariquePublic)),
    setNavigateCurrentService: (navigateCurrentService: string | null) => dispatch(setNavigateCurrentService(navigateCurrentService)),
    setEmailRecoverPassword: (emailRecoverPassword: string | null) => dispatch(setEmailRecoverPassword(emailRecoverPassword)),
    setRol: (rol: string | null) => dispatch(setRol(rol)),
    scrollRef
  };
};
