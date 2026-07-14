import {
  Checkbox,
  ColorInput,
  Select,
  TextInput,
  NumberInput,
  Paper,
  ActionIcon,
  Button,
  createTheme,
  Textarea,
} from "@mantine/core";
import { themeToVars } from "@mantine/vanilla-extract";

// animo brand blue (152,189,255) expanded into a Mantine 10-shade scale. Index 6
// is the primary (filled buttons / focus rings); lighter shades back the "light"
// button + input tints.
const brand: [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
] = [
  "#eef4ff",
  "#dbe6ff",
  "#b6ccff",
  "#98bdff",
  "#7aa5f7",
  "#6293f3",
  "#4f86f8",
  "#3f72dd",
  "#3463c4",
  "#2453ac",
];

export const theme = createTheme({
  fontFamily: "Inter",
  autoContrast: true,
  primaryColor: "brand",
  primaryShade: 6,
  colors: { brand },
  defaultRadius: "md",
  components: {
    Checkbox: Checkbox.extend({
      defaultProps: {
        radius: "sm",
      },
    }),
    ColorInput: ColorInput.extend({
      defaultProps: {
        radius: "md",
      },
    }),
    Select: Select.extend({
      defaultProps: {
        radius: "md",
      },
    }),
    Textarea: Textarea.extend({
      defaultProps: {
        radius: "md",
      },
    }),
    TextInput: TextInput.extend({
      defaultProps: {
        radius: "md",
      },
    }),
    NumberInput: NumberInput.extend({
      defaultProps: {
        radius: "md",
      },
    }),
    Paper: Paper.extend({
      defaultProps: {
        radius: "md",
        shadow: "0",
      },
    }),
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        variant: "subtle",
        color: "gray",
        radius: "md",
      },
    }),
    Button: Button.extend({
      defaultProps: {
        radius: "md",
        variant: "light",
        styles: {
          root: { fontWeight: 500 },
          label: {
            fontWeight: 500,
          },
        },
      },
    }),
  },
});

export const vars = themeToVars(theme);
