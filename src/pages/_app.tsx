import "@/styles/globals.css";
import {
  ChakraProvider,
  defineStyle,
  defineStyleConfig,
  extendTheme,
  StyleFunctionProps,
} from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { inputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

export default function App({ Component, pageProps }: AppProps) {
  const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(inputAnatomy.keys);

  const theme = extendTheme({
    initialColorMode: "light",
    useSystemColorMode: false,
    fonts: {
      heading: "Salvatore",
      body: "Salvatore",
    },
    colors: {
      primaryFontColor: "secondary.500",
      secondaryFontColor: "#EEE9E2",
      primary: {
        100: "#FEF7E5",
        200: "#FDEECB",
        300: "#F9E1AF",
        400: "#F3D299",
        500: "#ECBC78",
        600: "#CA9657",
        700: "#A9733C",
        800: "#885326",
        900: "#713C17",
      },
      secondary: {
        100: "#DDF5F5",
        200: "#BEE9EB",
        300: "#8BBDC5",
        400: "#58818B",
        500: "#20363E",
        600: "#172B35",
        700: "#10212C",
        800: "#0A1723",
        900: "#06101D",
      },
      tertiary: {
        100: "#FEFDFB",
        200: "#FDFBF8",
        300: "#F9F7F2",
        400: "#F4F1EB",
        500: "#EEE9E2",
        600: "#CCBAA5",
        700: "#AB8E71",
        800: "#8A6648",
        900: "#72482B",
      },
      success: {
        100: "#F1FBD3",
        200: "#E0F8A9",
        300: "#C4EC7B",
        400: "#A6D957",
        500: "#7DC127",
        600: "#63A51C",
        700: "#4B8A13",
        800: "#366F0C",
        900: "#275C07",
      },
      danger: {
        100: "#FDE7D8",
        200: "#FCC9B3",
        300: "#F6A38B",
        400: "#ED7F6D",
        500: "#E2493F",
        600: "#C22E31",
        700: "#A21F2D",
        800: "#831428",
        900: "#6C0C26",
      },
    },
    components: {
      Heading: defineStyleConfig({ baseStyle: { color: "secondary.500" } }),
      Text: defineStyleConfig({ baseStyle: { color: "secondary.500" } }),
      Input: defineStyleConfig({
        variants: { outline: defineStyle({ field: { borderRadius: "full" } }) },
      }),
      Textarea: defineStyleConfig({
        variants: { outline: defineStyle({ borderRadius: 20 }) },
      }),
      Select: defineStyleConfig({
        variants: { outline: defineStyle({ field: { borderRadius: "full" } }) },
      }),
      Button: defineStyleConfig({
        defaultProps: {
          size: "sm",
          colorScheme: "primary",
        },
        variants: {
          solid: defineStyle({
            colorScheme: "primary",
            textColor: "secondary",
            color: "secondary",
            borderRadius: 9999,
          }),
          outline: defineStyle({
            colorScheme: "primary",
            borderRadius: 9999,
          }),
          ghost: defineStyle({
            colorScheme: "primary",
            textColor: "secondary",
            color: "secondary",
            borderRadius: 9999,
          }),
          link: defineStyle({
            colorScheme: "primary",
            textColor: "secondary",
            color: "secondary",
          }),
        },
      }),
    },
    styles: {
      global: (props: StyleFunctionProps) => ({
        body: {
          color: "default",
          bg: "#EEE9E2",
        },
      }),
    },
  });

  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
