import * as React from "react";
import { useDisclosure } from "@mantine/hooks";
import { GuiFolderMessage } from "../WebsocketMessages";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { Box, Collapse } from "@mantine/core";
import { GuiComponentContext } from "../ControlPanel/GuiComponentContext";
import { ViewerContext } from "../ViewerContext";
import {
  folderDivider,
  folderHeader,
  folderToggleIcon,
  folderWrapper,
  sectionLabel,
  stageLabel,
} from "./Folder.css";
import { shallowObjectKeysEqual } from "../utils/shallowObjectKeysEqual";

export default function FolderComponent({
  uuid,
  props: { label, visible, expand_by_default },
}: GuiFolderMessage & { nextGuiUuid: string | null }) {
  const viewer = React.useContext(ViewerContext)!;
  const [opened, { toggle }] = useDisclosure(expand_by_default);
  const guiIdSet = viewer.useGui(
    (state) => state.guiUuidSetFromContainerUuid[uuid],
    shallowObjectKeysEqual,
  );
  const guiContext = React.useContext(GuiComponentContext)!;
  const isEmpty = guiIdSet === undefined || Object.keys(guiIdSet).length === 0;

  // depth 0 = the stage (large title); deeper = a titled section (small-caps).
  const depth = guiContext.folderDepth;
  const isStage = depth === 0;

  const ToggleIcon = opened ? IconChevronUp : IconChevronDown;
  const showBody = opened && !isEmpty;
  if (!visible) return null;
  return (
    <Box className={folderWrapper}>
      <Box
        className={folderHeader}
        style={{ cursor: isEmpty ? undefined : "pointer" }}
        onClick={toggle}
      >
        <span className={isStage ? stageLabel : sectionLabel}>{label}</span>
        <ToggleIcon
          className={folderToggleIcon}
          style={{ display: isEmpty ? "none" : undefined }}
        />
      </Box>
      {showBody && <div className={folderDivider} />}
      <Collapse in={showBody}>
        <Box
          style={{
            // stage body sits flush so sections align to the card; section
            // bodies indent their controls in from the card edge.
            padding: isStage ? "0.5em 0.15em 0.3em" : "0.4em 0.95em 0.75em",
          }}
        >
          <GuiComponentContext.Provider
            value={{
              ...guiContext,
              folderDepth: guiContext.folderDepth + 1,
            }}
          >
            <guiContext.GuiContainer containerUuid={uuid} />
          </GuiComponentContext.Provider>
        </Box>
      </Collapse>
    </Box>
  );
}
