type SourceUri = string;

export type JsSource = {
  uri: SourceUri;
};

export type JsScript = JsSource & {
  content: string;
  status?: "inspecting" | "inspected";
};

/**
 * Probably should be private to the binding?
 */
export type JsScriptMap = Map<SourceUri, JsScript>;
