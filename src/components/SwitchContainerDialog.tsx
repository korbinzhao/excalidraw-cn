import React from "react";
import { t } from "../i18n";
import { AppState } from "../types";
import "./ExportDialog.scss";
import { ActionManager } from "../actions/manager";
import { Dialog } from "./Dialog";
import {
  getContainerListFromStorage,
  getContainerNameFromStorage,
  setContainerNameToStorage,
  removeContainerFromStorage,
} from "../excalidraw-app/data/localStorage";
import { List, Popconfirm } from "antd";
import { CheckSquareOutlined, CloseCircleOutlined } from "@ant-design/icons";

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
          <List>
            {containerList?.map((scene: string) => {
              return (
                <List.Item
                  key={scene}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 10,
                    borderBottom: `1px solid #e2e2e2`,
                  }}
                >
                  <span
                    style={{
                      flex: "auto",
                      cursor: "pointer",
                      color: `${
                        currentContainerName === scene ? "green" : "#333"
                      }`,
                    }}
                    onClick={() => {
                      setContainerNameToStorage(scene);

                      window.location.reload();
                    }}
                  >
                    {currentContainerName === scene ? (
                      <CheckSquareOutlined
                        style={{ marginRight: 10, color: "green" }}
                      />
                    ) : null}
                    {scene}
                  </span>
                  <Popconfirm
                    title={`确定删除 ${scene} 吗?`}
                    onConfirm={() => {
                      removeContainerFromStorage(scene);
                      if (currentContainerName === scene) {
                        setContainerNameToStorage(containerList[0]);
                      }
                      window.location.reload();
                    }}
                  >
                    <CloseCircleOutlined
                      style={{ display: "block", flex: 0, width: 20 }}
                    />
                  </Popconfirm>
                </List.Item>
              );
            })}
          </List>
        </Dialog>
      )}
    </>
  );
};
