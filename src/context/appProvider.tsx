import { ReactNode, useReducer, useRef } from "react";
import { AppContext } from "./appContext";
import { appReducer } from "./appReducer";
import { AppState } from "../interfaces/appStateInterface";
import { ImagePreloaderProvider } from "../hooks/useImageHooks/imagePreloaderProvider";

interface Props {
  children: ReactNode;
}

const initialState: AppState = {
  registerUser: null,
  user: null,
  modifiedUser: null,
  token: localStorage.getItem("token") || null,
  isSidebarCollapsed: false,
  isLoading: false,
  modal: false,
  servicePublishStep: "typeSelection",
  servicePublishType: "independiente",
  departmentsAll: JSON.parse(localStorage.getItem("departmentsAll") || "[]"),
  districtsAll: JSON.parse(localStorage.getItem("districtsAll") || "[]"),
  currentLocation: JSON.parse(localStorage.getItem("currentLocation") || JSON.stringify({
  address: "",
  department: { value: 0, label: '', quantity: 0 },
  district: { label: '', quantity: 0, value: 0 },
  districtbydepartment: [],
  idUbigeo: "",
  latitude: 0,
  longitude: 0
})),

  currentLocationAux:{
    address: "",
    department: { value: 0, label: '', quantity: 0 },
    district: { label: '', quantity: 0, value: 0 },
    districtbydepartment: [],
    idUbigeo: "",
    latitude: 0,
    longitude: 0
  },
  company: null,
  modifiedCompany:null,
  archiveByUser:{
    company: {
      isLoading:true,
      logo:null,
      portada:null
    },
    independent: {
      isLoading:true,
      logo:null,
      portada:null
    }
  },
  category: JSON.parse(localStorage.getItem("category") || "[]"),
  subCategory: JSON.parse(localStorage.getItem("subCategory") || "[]"),
  service:null,
  modifiedService:null,
  serviceList:[],
  planes: null,
  isActiveCompany:false,
  deleteIdsArchive:{
    services: [],
    resena:[],
    company: {
      logo: null,
      portada:null
    },
    independent: {
      logo:null,
      portada:null
    }
  },
  archiveByService:{
    service: [],
    id: 0,
    isLoading:true
  },
  movieService:null,
  letterService:null,
  deleteMovieService:0,
  deleteLetterService:0,
  isSidebarCollapsedService: false,
  currentLocationService:{
    m:'map',
    d:'MTM5Mg==',
    s:null,
    services:[],
    loading:true,
    servicesNear:[],
    servicesText: null,
    servicesNearText: null,
  },
  currentPositionService:{
    latitud:null,
    longitud:null,
  },
  searchService: '',
  serviceAll:[],
  serviceNearAll:[],
  selectedService:{},
  serviceExpanded:false,
  serviceActive: false,
  archiveByServiceResena: {
    resena:[],
    id: 0,
    isLoading:true
  },
  activeModalOptionSession: false,
  activeModalOption: false,
  navigateService: null,
  activeHuariquePublic: false,
  navigateCurrentService: null,
  emailRecoverPassword: null,
  rol: null,
};

export const AppProvider = ({ children }: Props) => {
  const [appState, dispatch] = useReducer(appReducer, initialState);

  const scrollRef = useRef<HTMLDivElement | null>(null);


  return (
    <AppContext.Provider value={{ appState, dispatch, scrollRef  }}>
      <ImagePreloaderProvider>{children}</ImagePreloaderProvider>
    </AppContext.Provider>
  );
};
