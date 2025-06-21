import { createContext } from "react";
import { AppState } from "../interfaces/appStateInterface";
import { ActionTypes } from "../types/actionsTypes";
import { RefObject } from "react"; // 👈 asegúrate de importar esto

export interface AppContextProps {
  appState: AppState;
  dispatch: React.Dispatch<ActionTypes>;
  scrollRef?: RefObject<HTMLDivElement | null>;

}

export const AppContext = createContext<AppContextProps | null>(null);
