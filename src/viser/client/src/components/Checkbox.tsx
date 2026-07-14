import * as React from "react";
import { ViserInputComponent } from "./common";
import { GuiComponentContext } from "../ControlPanel/GuiComponentContext";
import { GuiCheckboxMessage } from "../WebsocketMessages";
import { Box, Checkbox, Flex, Text, Tooltip } from "@mantine/core";

export default function CheckboxComponent({
  uuid,
  value,
  props: { disabled, visible, hint, label },
}: GuiCheckboxMessage) {
  const { setValue } = React.useContext(GuiComponentContext)!;
  if (!visible) return null;
  let input = (
    <Checkbox
      id={uuid}
      checked={value}
      size="xs"
      onChange={(value) => {
        setValue(uuid, value.target.checked);
      }}
      disabled={disabled}
    />
  );
  if (hint !== null && hint !== undefined) {
    // For checkboxes, we want to make sure that the wrapper
    // doesn't expand to the full wuuidth of the parent. This will
    // de-center the tooltip.
    input = (
      <Tooltip
        zIndex={100}
        label={hint}
        multiline
        style={{ width: "15rem" }}
        withArrow
        openDelay={500}
        withinPortal
      >
        <Box style={{ display: "inline-block" }}>{input}</Box>
      </Tooltip>
    );
  }
  // Full-width row: the label uses the whole width (no cramped wrapping) and the
  // checkbox is pushed to the right edge, so the row actually consumes its width.
  return (
    <ViserInputComponent uuid={uuid}>
      <Flex align="center" justify="space-between" gap="xs">
        {label !== undefined && (
          <Text
            c="dimmed"
            style={{
              fontSize: "0.875em",
              fontWeight: 450,
              lineHeight: "1.3em",
              letterSpacing: "-0.5px",
              flexGrow: 1,
            }}
            unselectable="off"
          >
            <label htmlFor={uuid}>{label}</label>
          </Text>
        )}
        <Box style={{ flexShrink: 0 }}>{input}</Box>
      </Flex>
    </ViserInputComponent>
  );
}
