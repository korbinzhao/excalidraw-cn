import React, { useEffect, useRef, useState } from "react";
import { t } from "../i18n";
import { AppState, BinaryFiles } from "../types";
import "./ExportDialog.scss";
import { ActionManager } from "../actions/manager";
import { Dialog } from "./Dialog";
import { STORAGE_KEYS } from "../excalidraw-app/app_constants";

export const SwitchSceneDialog = ({
  appState,
  setAppState,
}: {
  appState: AppState;
  setAppState: React.Component<any, AppState>["setState"];
  actionManager: ActionManager;
}) => {
  const handleClose = React.useCallback(() => {
    setAppState({ openDialog: null });
  }, [setAppState]);

  const sceneList = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_SCENE_LIST) || "[]",
  );

  const currentSceneName = localStorage.getItem(
    STORAGE_KEYS.LOCAL_STORAGE_CURRENT_SCENE_NAME,
  );

  return (
    <>
      {appState.openDialog === "switchScene" && (
        <Dialog onCloseRequest={handleClose} title={t("buttons.switchScene")}>
          <div>
            {sceneList?.map((scene: string) => {
              return (
                <p
                  key={scene}
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      scene === currentSceneName ? "lightblue" : "#fff",
                  }}
                  onClick={() => {
                    localStorage.setItem(
                      STORAGE_KEYS.LOCAL_STORAGE_CURRENT_SCENE_NAME,
                      scene,
                    );
                    // TODO: appState 变化，会触发 Excalidraw 的 onChange 事件，导致画布变动会自动存储到 localStorage，从而造成多画布场景的数据污染
                    // TODO: 需要花力气把画布逻辑重构才能解决该问题
                    setAppState({ openDialog: null });

                  }}
                >
                  {scene}
                </p>
              );
            })}
          </div>
        </Dialog>
      )}
    </>
  );
};
