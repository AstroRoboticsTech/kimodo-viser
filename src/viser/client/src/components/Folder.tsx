import * as React from "react";
import { useDisclosure } from "@mantine/hooks";
import { GuiFolderMessage } from "../WebsocketMessages";
import {
  IconChevronDown,
  IconChevronUp,
  IconHelpCircle,
} from "@tabler/icons-react";
import { Box, Collapse, Tooltip } from "@mantine/core";
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
  props: { label, visible, expand_by_default, hint },
}: GuiFolderMessage & { nextGuiUuid: string | null }) {
  const viewer = React.useContext(ViewerContext)!;
  const [opened, { toggle }] = useDisclosure(expand_by_default);
  const guiIdSet = viewer.useGui(
    (state) => state.guiUuidSetFromContainerUuid[uuid],
    shallowObjectKeysEqual,
  );
  const guiContext = React.useContext(GuiComponentContext)!;
  const isEmpty = guiIdSet === undefined || Object.keys(guiIdSet).length === 0;

  // depth 0 = the stage title (NOT collapsible); depth 1 = a top section
  // (collapsible); depth >= 2 = a sub-group header (Visibility / Inspector / ...)
  // that is NOT collapsible — always shown, no chevron.
  const depth = guiContext.folderDepth;
  const isStage = depth === 0;
  const collapsible = depth === 1;

  const ToggleIcon = opened ? IconChevronUp : IconChevronDown;
  const showBody = collapsible ? opened && !isEmpty : !isEmpty;
  if (!visible) return null;
  return (
    <Box className={folderWrapper}>
      <Box
        className={folderHeader}
        style={{ cursor: collapsible && !isEmpty ? "pointer" : "default" }}
        onClick={collapsible ? toggle : undefined}
      >
        <Box style={{ display: "flex", alignItems: "center", gap: "0.3em" }}>
          <span className={isStage ? stageLabel : sectionLabel}>{label}</span>
          {hint != null && hint !== "" && (
            <Tooltip
              label={hint}
              multiline
              w={220}
              withArrow
              openDelay={300}
              zIndex={100}
              events={{ hover: true, focus: true, touch: true }}
            >
              <IconHelpCircle
                size="0.95em"
                style={{ opacity: 0.45, cursor: "help", flexShrink: 0 }}
                onClick={(e) => e.stopPropagation()}
              />
            </Tooltip>
          )}
        </Box>
        {collapsible && (
          <ToggleIcon
            className={folderToggleIcon}
            style={{ display: isEmpty ? "none" : undefined }}
          />
        )}
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
