import React, { useEffect, useRef, useState } from "react";
import { t } from "../i18n";
import { AppState, BinaryFiles } from "../types";
import { Dialog } from "./Dialog";
import "./ExportDialog.scss";
import { ActionManager } from "../actions/manager";
import { Button } from "./Button";
import {
  getContainerListFromStorage,
  setContainerNameToStorage,
  setContainerListToStorage,
} from "../excalidraw-app/data/localStorage";
import moment from 'moment';

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

  const [newContainerName, setNewContainerName] = useState(
    `new_scene_${moment().format('YYYY-MM-DD')}`,
  );

  return (
    <>
      {appState.openDialog === "newScene" && (
        <Dialog onCloseRequest={handleClose} title={t("buttons.newScene")}>
          <input
            type="text"
            placeholder={t("labels.inputNewContainerName")}
            style={{ minWidth: 500 }}
            defaultValue={newContainerName}
            onChange={(e) => {
              setNewContainerName(e.target.value);
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
              const containerList: string[] = getContainerListFromStorage();

              if (containerList.includes(newContainerName)) {
                alert(`画布 ${newContainerName} 已存在，无需重复创建`);
                return;
              }

              setAppState({
                openDialog: null,
              });

              setContainerNameToStorage(newContainerName);
              setContainerListToStorage([...containerList, newContainerName]);
            }}
          >
            {t("buttons.confirm")}
          </Button>
        </Dialog>
      )}
    </>
  );
};
