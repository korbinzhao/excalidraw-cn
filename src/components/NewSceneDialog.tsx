import React, { useEffect, useRef, useState } from "react";
import { t } from "../i18n";
import { AppState, BinaryFiles } from "../types";
import { Dialog } from "./Dialog";
import "./ExportDialog.scss";
import { ActionManager } from "../actions/manager";
import { Button } from "./Button";
import { STORAGE_KEYS } from "../excalidraw-app/app_constants";

export const NewSceneDialog = ({
  // elements,
  appState,
  setAppState,
}: // files,
// exportPadding = DEFAULT_EXPORT_PADDING,
// actionManager,
{
  appState: AppState;
  setAppState: React.Component<any, AppState>["setState"];
  // elements: readonly NonDeletedExcalidrawElement[];
  // files: BinaryFiles;
  // exportPadding?: number;
  actionManager: ActionManager;
}) => {
  const handleClose = React.useCallback(() => {
    setAppState({ openDialog: null });
  }, [setAppState]);

  const [newSceneName, setNewSceneName] = useState(`new_scene_${Date.now()}`);

  return (
    <>
      {appState.openDialog === "newScene" && (
        <Dialog onCloseRequest={handleClose} title={t("buttons.newScene")}>
          <input
            type="text"
            placeholder={t("labels.inputNewSceneName")}
            style={{ minWidth: 500 }}
            defaultValue={newSceneName}
            onChange={(e) => {
              setNewSceneName(e.target.value);
            }}
          />
          <Button
            style={{
              whiteSpace: "nowrap",
              padding: "0 20px",
              marginTop: 10,
              width: 70,
              backgroundColor: "#6965db",
              color: "#fff",
            }}
            onSelect={() => {
              const sceneList: string[] = JSON.parse(
                localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_SCENE_LIST) ||
                  `["${STORAGE_KEYS.LOCAL_STORAGE_DEFAULT_SCENE_NAME}"]`,
              );

              if (sceneList.includes(newSceneName)) {
                alert(`画布 ${newSceneName} 已存在，无需重复创建`);
                return;
              }

              setAppState({
                openDialog: null,
              });

              localStorage.setItem(
                STORAGE_KEYS.LOCAL_STORAGE_CURRENT_SCENE_NAME,
                newSceneName,
              );

              localStorage.setItem(
                STORAGE_KEYS.LOCAL_STORAGE_SCENE_LIST,
                JSON.stringify([...sceneList, newSceneName]),
              );
            }}
          >
            {t("buttons.confirm")}
          </Button>
        </Dialog>
      )}
    </>
  );
};
