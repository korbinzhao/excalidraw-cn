import { useAtom } from "jotai";
import React, { useState } from "react";
import { langCodeAtom } from "..";
import * as i18n from "../../i18n";
import { languages } from "../../i18n";
import "../index.scss"; // 引入样式文件

export const LanguageList = ({ style }: { style?: React.CSSProperties }) => {
  const [langCode, setLangCode] = useAtom(langCodeAtom);

  return (
    <select
      className="dropdown-select dropdown-select__language"
      onChange={({ target }) => setLangCode(target.value)}
      value={langCode}
      aria-label={i18n.t("buttons.selectLanguage")}
      style={style}
    >
      <option key={i18n.defaultLang.code} value={i18n.defaultLang.code}>
        {i18n.defaultLang.label}
      </option>
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
};

export const UploadLocalData = ({ style }: { style?: React.CSSProperties }) => {
  const [inputValue, setInputValue] = useState("");

  const fetchData = async (data: any, path: any = inputValue) => {
    const headers = new Headers();

    const requestOptions: RequestInit = {
      method: "PUT",
      headers,
      body: data, // Replace with your data to send
    };
    
    try {
      await fetch(
        `${
          process.env.REACT_APP_SYSTEM_WEBDAV_REMOTE_URL
            ? process.env.REACT_APP_SYSTEM_WEBDAV_REMOTE_URL
            : process.env.REACT_APP_WEBDAV_REMOTE_URL
        }${path}`,
        requestOptions,
      );
      alert("上传成功");
      // Process the response as needed
    } catch (error) {
      // Handle error
      console.error("Error fetching data:", error);
    }
  };

  const getData = async (path: any) => {
    if (
      window.location.search &&
      window.location.search.startsWith("?sharePath=")
    ) {
      path = window.location.search.slice(7);
    }
    console.log(inputValue, path);
    const sharePath = typeof path === "string";
    const storgePath = sharePath ? path : inputValue;

    if (!storgePath) {
      alert("请输入远程路径！！！");
      return;
    }

    const headers = new Headers();
    // headers.append('Authorization', 'Basic ' + window.btoa(inputValue)); // Replace with your actual token

    const requestOptions: RequestInit = {
      method: "GET",
      headers,
    };

    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_SYSTEM_WEBDAV_REMOTE_URL
            ? process.env.REACT_APP_SYSTEM_WEBDAV_REMOTE_URL
            : process.env.REACT_APP_WEBDAV_REMOTE_URL
        }${storgePath}`,
        requestOptions,
      );
      console.log(response);
      const responseBody = await response.text(); // Convert response body to text
      console.log(responseBody); // Process the response body as needed
      const drawData = JSON.parse(responseBody);
      // backup
      const currentLocalData = window.localStorage;
      // Filter and store backup data
      const filteredData: { [key: string]: any } = {};
      for (const key in currentLocalData) {
        if (currentLocalData.hasOwnProperty(key) && key.startsWith("backup")) {
          // 过滤掉以 "backup" 开头的键
          continue;
        }
        filteredData[key] = currentLocalData[key];
      }

      const backupKeys = Object.keys(currentLocalData).filter((key) =>
        key.startsWith("backup"),
      );
      // 删除之前备份数据
      for (const key of backupKeys) {
        currentLocalData.removeItem(key);
      }
      // 存储新的 "backup" 数据
      const newBackupKey = `backup${new Date().getTime()}`;
      currentLocalData.setItem(newBackupKey, JSON.stringify(filteredData));
      // 上传到远程
      fetchData(JSON.stringify(filteredData), `backup/${newBackupKey}`);
      console.log("Backup saved:", newBackupKey);
      if (sharePath) {
        // 分享单文件 追加
        console.log(currentLocalData.excalidraw_container_list);
        const currentDrawkey = Object.keys(drawData)[0];
        const excalidraw_container_list =
          currentLocalData.excalidraw_container_list;
        let excalidraw_container = new Set();
        if (excalidraw_container_list) {
          console.log(excalidraw_container_list);

          excalidraw_container = new Set(JSON.parse(excalidraw_container_list));
        }
        excalidraw_container.add(currentDrawkey);
        console.log(typeof excalidraw_container, excalidraw_container);
        currentLocalData.setItem(
          "excalidraw_container_list",
          JSON.stringify(Array.from(excalidraw_container)),
        );
      } else {
        window.localStorage.clear();
      }
      for (const item in drawData) {
        window.localStorage.setItem(item, drawData[item]);
      }
      window.localStorage.setItem(
        "excalidraw_container_name",
        "default_canvas",
      );
      alert(
        "本地数据已备份远程路径" +
          `backup/${newBackupKey}` +
          "，同步远程数据成功，请切换画布查看效果！！",
      );

      // Process the response as needed
    } catch (error) {
      // Handle error
      console.error("Error fetching data:", error);
    }
  };

  const handleUploadClick = () => {
    if (!inputValue) {
      alert("请输入远程路径！！！");
      return;
    }
    const data = window.localStorage;
    fetchData(JSON.stringify(data)); // Call the fetchData function to make the request
  };

  const handleCurUploadClick = () => {
    if (!inputValue) {
      alert("请输入远程路径！！！");
      return;
    }
    const data = window.localStorage;
    const excalidraw_container_name = data.excalidraw_container_name;
    const excalidraw_container_data = data[excalidraw_container_name];
    const reqData: { [key: string]: any } = {};
    reqData[excalidraw_container_name] = excalidraw_container_data;
    fetchData(JSON.stringify(reqData));
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div>
      <button onClick={handleUploadClick} className="button">
        上传
      </button>
      <button onClick={getData} className="button">
        同步
      </button>
      <button onClick={handleCurUploadClick} className="button">
        分享
      </button>
      <input
        placeholder="远程路径"
        value={inputValue}
        onChange={handleInputChange}
        className="input"
      />
    </div>
  );
};
