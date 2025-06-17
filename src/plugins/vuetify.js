import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export const vuetify = createVuetify({
  theme: { defaultTheme: "light" },
  defaults: {
    global: {
      font: {
        family: "Prompt, sans-serif",
      },
    },
    VCard: {
      style: "font-family: Prompt, sans-serif",
    },
  },
  components,
  directives,
});
