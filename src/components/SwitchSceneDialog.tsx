import React, { useEffect, useRef, useState } from "react";
import { t } from "../i18n";
import { AppState, BinaryFiles } from "../types";
import "./ExportDialog.scss";
import { ActionManager } from "../actions/manager";
import { Dialog } from "./Dialog";
import { STORAGE_KEYS } from "../excalidraw-app/app_constants";
import {
  getContainerListFromStorage,
  getContainerNameFromStorage,
} from "../excalidraw-app/data/localStorage";

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

  const containerList = getContainerListFromStorage();

  const currentContainerName = getContainerNameFromStorage();

  return (
    <>
      {appState.openDialog === "switchScene" && (
        <Dialog onCloseRequest={handleClose} title={t("buttons.switchScene")}>
          <div>
            {containerList?.map((scene: string) => {
              return (
                <p
                  key={scene}
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      scene === currentContainerName ? "lightblue" : "#fff",
                  }}
                  onClick={() => {
                    localStorage.setItem(currentContainerName, scene);
                    // TODO: appState 变化，会触发 Excalidraw 的 onChange 事件，导致画布变动会自动存储到 localStorage，从而造成多画布场景的数据污染
                    // TODO: 需要花力气把画布逻辑重构才能解决该问题，每次切换画布，需要实现画布的重新渲染，才可比较好的解决该问题
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
