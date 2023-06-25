import { ExcalidrawElement } from "../../element/types";
import { AppState } from "../../types";
import {
  clearAppStateForLocalStorage,
  getDefaultAppState,
} from "../../appState";
import { clearElementsForLocalStorage } from "../../element";
import { STORAGE_KEYS } from "../app_constants";
import { ImportedDataState } from "../../data/types";

export const saveUsernameToLocalStorage = (username: string) => {
  try {
    localStorage.setItem(
      STORAGE_KEYS.LOCAL_STORAGE_COLLAB,
      JSON.stringify({ username }),
    );
  } catch (error: any) {
    // Unable to access window.localStorage
    console.error(error);
  }
};

export const importUsernameFromLocalStorage = (): string | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_COLLAB);
    if (data) {
      return JSON.parse(data).username;
    }
  } catch (error: any) {
    // Unable to access localStorage
    console.error(error);
  }

  return null;
};

export const importFromLocalStorage = () => {
  let savedElements = null;
  let savedState = null;

  const currentContainerName = getContainerNameFromStorage();

  try {
    // savedElements = localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_ELEMENTS);
    savedElements = localStorage.getItem(currentContainerName);
    savedState = localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_APP_STATE);
  } catch (error: any) {
    // Unable to access localStorage
    console.error(error);
  }

  let elements: ExcalidrawElement[] = [];
  if (savedElements) {
    try {
      elements = clearElementsForLocalStorage(JSON.parse(savedElements));
    } catch (error: any) {
      console.error(error);
      // Do nothing because elements array is already empty
    }
  }

  let appState = null;
  if (savedState) {
    try {
      appState = {
        ...getDefaultAppState(),
        ...clearAppStateForLocalStorage(
          JSON.parse(savedState) as Partial<AppState>,
        ),
      };
    } catch (error: any) {
      console.error(error);
      // Do nothing because appState is already null
    }
  }
  return { elements, appState };
};

export const getElementsStorageSize = () => {
  try {
    const currentContainerName = getContainerNameFromStorage();
    // const elements = localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_ELEMENTS);
    const elements = localStorage.getItem(currentContainerName);
    const elementsSize = elements?.length || 0;
    return elementsSize;
  } catch (error: any) {
    console.error(error);
    return 0;
  }
};

export const getTotalStorageSize = () => {
  try {
    const appState = localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_APP_STATE);
    const collab = localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_COLLAB);
    const library = localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_LIBRARY);

    const appStateSize = appState?.length || 0;
    const collabSize = collab?.length || 0;
    const librarySize = library?.length || 0;

    return appStateSize + collabSize + librarySize + getElementsStorageSize();
  } catch (error: any) {
    console.error(error);
    return 0;
  }
};

export const getLibraryItemsFromStorage = () => {
  try {
    const libraryItems: ImportedDataState["libraryItems"] = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_LIBRARY) as string,
    );

    return libraryItems || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const setContainerIdToStorage = (id: string) => {
  if (id) {
    localStorage.setItem(STORAGE_KEYS.LOCAL_STORAGE_CONTAINER_ID, id);
  }
};

export const setContainerNameToStorage = (name: string) => {
  if (name) {
    localStorage.setItem(STORAGE_KEYS.LOCAL_STORAGE_CONTAINER_NAME, name);
  }
};

export const getContainerIdFromStorage = () => {
  localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_CONTAINER_ID);
};

export const getContainerNameFromStorage = () => {
  return (
    localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_CONTAINER_NAME) ||
    STORAGE_KEYS.LOCAL_STORAGE_DEFAULT_CONTAINER_NAME
  );
};

export const getContainerListFromStorage = (): string[] => {
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_CONTAINER_LIST) ||
        `["${STORAGE_KEYS.LOCAL_STORAGE_DEFAULT_CONTAINER_NAME}"]`,
    );
  } catch (err) {
    console.error("localStorage getContainerList error", err);
    return [STORAGE_KEYS.LOCAL_STORAGE_DEFAULT_CONTAINER_NAME];
  }
};

export const setContainerListToStorage = (list: string[] = []) => {
  localStorage.setItem(
    STORAGE_KEYS.LOCAL_STORAGE_CONTAINER_LIST,
    JSON.stringify(list),
  );
};

export const getElementsFromStorage = (
  containerName?: string,
): ExcalidrawElement[] => {
  const currentContainerName = getContainerNameFromStorage();

  return JSON.parse(
    localStorage.getItem(containerName || currentContainerName) || "[]",
  );
};

export const setElementsToStorage = (elements: ExcalidrawElement[] = []) => {
  const currentContainerName = getContainerNameFromStorage();

  localStorage.setItem(currentContainerName, JSON.stringify(elements));
};

export const renameContainerNameToStorage = (
  oldName: string,
  newName: string,
) => {
  if (!(oldName && newName)) {
    console.warn(
      `oldName: ${oldName}, newName: ${newName} 不同时存在，无法重命名`,
    );
  }

  const elements = getElementsFromStorage();

  setContainerNameToStorage(newName);

  setElementsToStorage(elements);

  localStorage.removeItem(oldName);

  const containerList = getContainerListFromStorage();

  const newContainerList = containerList.map((name: string) => {
    if (name === oldName) {
      return newName;
    }
    return name;
  });

  setContainerListToStorage(newContainerList);
};

export const removeContainerFromStorage = (containerName: string) => {
  localStorage.removeItem(containerName);

  const containerList = getContainerListFromStorage();

  const newContainerList = containerList.filter((name: string) => {
    return name !== containerName;
  });

  setContainerListToStorage(newContainerList);
};

export const getAllContainerListElementsFromStorage = () => {
  const containerList = getContainerListFromStorage();

  return containerList.reduce((prevElements, containerName) => {
    const _elements = getElementsFromStorage(containerName);

    return [...prevElements, ..._elements];
  }, [] as ExcalidrawElement[]);
};
