import { ArchiveByService, ArchiveByServiceResena, ArchiveByUser, deleteIDsArchives, documentService, videoService } from "../interfaces/Archive";
import { RegisterData } from "../interfaces/auth";
import { Category } from "../interfaces/categories";
import { Company } from "../interfaces/company";
import { GetPlanes } from "../interfaces/planes";
import { Service } from "../interfaces/service";
import { CurrentLocationService, CurrentPositionService } from "../interfaces/serviceLocation";
import { PublishServiceType, ServicePublishStep } from "../interfaces/servicePublish";
import { SubCategory } from "../interfaces/subcategory";
import { dataUbigeo, LocationData } from "../interfaces/ubigeo";
import { User } from "../interfaces/user";

export const SET_REGISTERUSER = "SET_REGISTERUSER" as const;
export const SET_USER = "SET_USER" as const;
export const SET_MODIFIEDUSER = "SET_MODIFIEDUSER" as const;
export const SET_TOKEN = "SET_TOKEN" as const;
export const SET_ISSIDEBARCOLLAPSED = "SET_ISSIDEBARCOLLAPSED" as const;
export const SET_LOADING = "SET_LOADING" as const;
export const SET_MODAL = "SET_MODAL" as const;
export const SET_SERVICE_PUBLISH_TYPE = "SET_SERVICE_PUBLISH_TYPE" as const;
export const SET_PUBLISH_SERVICE_TYPE = "SET_PUBLISH_SERVICE_TYPE" as const;
export const SET_DEPARTMENTS_ALL = "SET_DEPARTMENTS_ALL" as const;
export const SET_DISTRICTS_ALL = "SET_DISTRICTS_ALL" as const;
export const SET_CURRENT_LOCATION = "SET_CURRENT_LOCATION" as const;
export const SET_CURRENT_LOCATION_AUX = "SET_CURRENT_LOCATION_AUX" as const;
export const SET_COMPANY = "SET_COMPANY" as const;
export const SET_MODIFIEDCOMPANY = "SET_MODIFIEDCOMPANY" as const;
export const SET_ARCHIVEBYUSER = "SET_ARCHIVEBYUSER" as const;
export const SET_CATEGORY = "SET_CATEGORY" as const;
export const SET_SUBCATEGORY = "SET_SUBCATEGORY" as const;
export const SET_SERVICE = "SET_SERVICE" as const;
export const SET_MODIFIEDSERVICE = "SET_MODIFIEDSERVICE" as const;
export const SET_SERVICELIST = "SET_SERVICELIST" as const;
export const SET_PLANES = "SET_PLANES" as const;
export const SET_ISACTIVECOMPANY = "SET_ISACTIVECOMPANY" as const;
export const SET_DELETEIDSARCHIVES = "SET_DELETEIDSARCHIVES" as const;
export const SET_ARCHIVEBYSERVICE = "SET_ARCHIVEBYSERVICE" as const;
export const SET_MOVIE_SERVICE = "SET_MOVIE_SERVICE" as const;
export const SET_LETTER_SERVICE = "SET_LETTER_SERVICE" as const;
export const SET_DELETE_MOVIE_SERVICE = "SET_DELETE_MOVIE_SERVICE" as const;
export const SET_DELETE_LETTER_SERVICE = "SET_DELETE_LETTER_SERVICE" as const;
export const SET_ISSIDEBARCOLLAPSEDSERVICE = "SET_ISSIDEBARCOLLAPSEDSERVICE" as const;
export const SET_CURRENT_LOCATION_SERVICE = "SET_CURRENT_LOCATION_SERVICE" as const;
export const SET_CURRENT_POSITION_SERVICE = "SET_CURRENT_POSITION_SERVICE" as const;
export const SET_SEARCH_SERVICE = "SET_SEARCH_SERVICE" as const;
export const SET_SERVICE_ALL = "SET_SERVICE_ALL" as const;
export const SET_SERVICE_NEAR_ALL = "SET_SERVICE_NEAR_ALL" as const;
export const SET_SELECTED_SERVICE = "SET_SELECTED_SERVICE" as const;
export const SET_SERVICE_EXPANDED = "SET_SERVICE_EXPANDED" as const;
export const SET_SERVICE_ACTIVE = "SET_SERVICE_ACTIVE" as const;
export const SET_ARCHIVEBYSERVICERESENA="SET_ARCHIVEBYSERVICERESENA" as const;
export const SET_ACTIVEMODALOPTIONSESSION="SET_ACTIVEMODALOPTIONSESSION" as const;
export const SET_ACTIVEMODALOPTION="SET_ACTIVEMODALOPTION" as const;
export const SET_NAVIGATE_SERVICE="SET_NAVIGATE_SERVICE" as const;
export const SET_ACTIVEHUARIQUEPUBLIC="SET_ACTIVEHUARIQUEPUBLIC" as const;
export const SET_NAVIGATE_CURRENT_SERVICE="SET_NAVIGATE_CURRENT_SERVICE" as const;
export const SET_EMAIL_RECOVER_PASSWORD="SET_EMAIL_RECOVER_PASSWORD" as const;
export const SET_ROL="SET_ROL" as const;


export type ActionTypes =
  | { type: typeof SET_REGISTERUSER; payload: RegisterData | null }
  | { type: typeof SET_USER; payload: User | null }
  | { type: typeof SET_MODIFIEDUSER; payload: User | null }
  | { type: typeof SET_TOKEN; payload: string | null}
  | { type: typeof SET_ISSIDEBARCOLLAPSED; payload: boolean }
  | { type: typeof SET_LOADING; payload: boolean }
  | { type: typeof SET_MODAL; payload: boolean }
  | { type: typeof SET_SERVICE_PUBLISH_TYPE; payload: ServicePublishStep }
  | { type: typeof SET_PUBLISH_SERVICE_TYPE; payload: PublishServiceType }
  | { type: typeof SET_DEPARTMENTS_ALL; payload: dataUbigeo[] }
  | { type: typeof SET_DISTRICTS_ALL; payload: dataUbigeo[] }
  | { type: typeof SET_CURRENT_LOCATION; payload: LocationData  }
  | { type: typeof SET_CURRENT_LOCATION_AUX; payload: LocationData  }
  | { type: typeof SET_COMPANY; payload: Company | null  }
  | { type: typeof SET_MODIFIEDCOMPANY; payload: Company | null  }
  | { type: typeof SET_ARCHIVEBYUSER; payload: ArchiveByUser | null  }
  | { type: typeof SET_CATEGORY; payload: Category[] }
  | { type: typeof SET_SUBCATEGORY; payload: SubCategory[] }
  | { type: typeof SET_SERVICE; payload: Service | null  }
  | { type: typeof SET_MODIFIEDSERVICE; payload: Service | null  }
  | { type: typeof SET_SERVICELIST; payload: Service[] | null  }
  | { type: typeof SET_PLANES; payload: GetPlanes | null  }
  | { type: typeof SET_ISACTIVECOMPANY; payload: boolean  }
  | { type: typeof SET_DELETEIDSARCHIVES; payload: deleteIDsArchives | null  }
  | { type: typeof SET_ARCHIVEBYSERVICE; payload: ArchiveByService | null  }
  | { type: typeof SET_MOVIE_SERVICE; payload: videoService | null}
  | { type: typeof SET_LETTER_SERVICE; payload: documentService | null  }
  | { type: typeof SET_DELETE_MOVIE_SERVICE; payload: number }
  | { type: typeof SET_DELETE_LETTER_SERVICE; payload: number }
  | { type: typeof SET_ISSIDEBARCOLLAPSEDSERVICE; payload: boolean }
  | { type: typeof SET_CURRENT_LOCATION_SERVICE; payload: CurrentLocationService }
  | { type: typeof SET_CURRENT_POSITION_SERVICE; payload: CurrentPositionService }
  | { type: typeof SET_SEARCH_SERVICE; payload: string | null }
  | { type: typeof SET_SERVICE_ALL; payload: Service[] }
  | { type: typeof SET_SERVICE_NEAR_ALL; payload: Service[] }
  | { type: typeof SET_SELECTED_SERVICE; payload: Service }
  | { type: typeof SET_SERVICE_EXPANDED; payload: boolean }
  | { type: typeof SET_SERVICE_ACTIVE; payload: boolean }
  | { type: typeof SET_ARCHIVEBYSERVICERESENA; payload: ArchiveByServiceResena | null  }
  | { type: typeof SET_ACTIVEMODALOPTIONSESSION; payload: boolean}
  | { type: typeof SET_ACTIVEMODALOPTION; payload: boolean}
  | { type: typeof SET_NAVIGATE_SERVICE; payload: string | null}
  | { type: typeof SET_ACTIVEHUARIQUEPUBLIC; payload: boolean}
  | { type: typeof SET_NAVIGATE_CURRENT_SERVICE; payload: string | null}
  | { type: typeof SET_EMAIL_RECOVER_PASSWORD; payload: string | null}
  | { type: typeof SET_ROL; payload: string | null}


   