import { HAND_WRITE_FONTS } from "../constants";

export const getFontFamily = () => {
  // 1-based in case we ever do `if(element.fontFamily)`
  const fontFamily: { [key: string]: number } = {
    Helvetica: 2,
    Cascadia: 3,
    Cangnanshoujiti: 4,
  };

  const defaultCount = Object.keys(fontFamily).length;

  fontFamily[HAND_WRITE_FONTS] = 1;

  const customFonts = localStorage.getItem("custom_fonts")?.split(",");

  customFonts?.forEach((fontName, index) => {
    fontFamily[fontName] = index + defaultCount;
  });

  return fontFamily;
};
