import { style } from "@vanilla-extract/css";

// Sections are NOT boxes: the whole panel is one elevated card (SidebarPanel),
// and each folder renders as a titled, spacious section divided by a hairline.
export const folderWrapper = style({
  position: "relative",
});

export const folderHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0.85em 0.95em 0.55em",
  userSelect: "none",
});

export const folderDivider = style({
  borderBottom: "1px solid light-dark(#eef0f3, #26282f)",
  marginLeft: "0.95em",
  marginRight: "0.95em",
});

// depth 0 = the stage title (large); depth >= 1 = section title (small-caps).
export const stageLabel = style({
  fontSize: "1.02rem",
  fontWeight: 700,
  letterSpacing: "-0.01em",
});

export const sectionLabel = style({
  fontSize: "0.72rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "light-dark(#9298a3, #8c919b)",
});

export const folderToggleIcon = style({
  width: "1em",
  height: "1em",
  strokeWidth: 2.5,
  opacity: 0.45,
  flexShrink: 0,
});
