import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  EditorState,
  convertToRaw,
  KeyBindingUtil,
  getDefaultKeyBinding,
} from "draft-js";
import Editor from "@draft-js-plugins/editor";
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
} from "@draft-js-plugins/buttons";
import createLinkifyPlugin, { extractLinks } from "@draft-js-plugins/linkify";
import createMentionPlugin, {
  defaultSuggestionsFilter,
} from "@draft-js-plugins/mention";
import createToolbarPlugin from "@draft-js-plugins/static-toolbar";
import editorStyles from "./CustomMentionEditor.module.css";
import mentionsStyles from "./MentionsStyles.module.css";
import { mentions } from "./mentionData";

function Entry(props) {
  const { mention, theme, searchValue, isFocused, ...parentProps } = props;

  return (
    <div {...parentProps}>
      <div className={theme?.mentionSuggestionsEntryContainer}>
        <div className={theme?.mentionSuggestionsEntryContainerLeft}>
          <img
            src={mention.avatar}
            className={theme?.mentionSuggestionsEntryAvatar}
            role="presentation"
          />
        </div>

        <div className={theme?.mentionSuggestionsEntryContainerRight}>
          <div className={theme?.mentionSuggestionsEntryText}>
            {mention.name}
          </div>

          <div className={theme?.mentionSuggestionsEntryTitle}>
            {mention.title}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomMentionEditor() {
  const ref = useRef(null);
  const [showImage, setShowImage] = useState(false);
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState(mentions);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const content = editorState.getCurrentContent().getPlainText();
  console.log(content);

  const { hasCommandModifier } = KeyBindingUtil;

  function myKeyBindingFn(e) {
    // pressed enter
    // if you want to add ctrl + enter use && hasCommandModifier(e)
    if (e.keyCode === 13) {
      // if (e.keyCode === 13 && hasCommandModifier(e)) {
      return "myeditor-save";
    }
    return getDefaultKeyBinding(e);
  }

  function handleKeyCommand(command) {
    if (command === "myeditor-save") {
      alert("pressed S");
      return "handled";
    }
    return "not-handled";
  }

  const { MentionSuggestions, plugins, Toolbar, linkifyPlugin } =
    useMemo(() => {
      const staticToolbarPlugin = createToolbarPlugin();
      const { Toolbar } = staticToolbarPlugin;
      const linkifyPlugin = createLinkifyPlugin();
      const mentionPlugin = createMentionPlugin({
        entityMutability: "IMMUTABLE",
        theme: mentionsStyles,
        mentionPrefix: "@",
        supportWhitespace: true,
        mentionComponent: ({ children }) => (
          <span style={{ color: "red" }} onClick={() => alert("asda")}>
            {children}
          </span>
        ),
      });
      // eslint-disable-next-line no-shadow
      const { MentionSuggestions } = mentionPlugin;
      // eslint-disable-next-line no-shadow
      const plugins = [mentionPlugin, staticToolbarPlugin, linkifyPlugin];
      return { plugins, MentionSuggestions, Toolbar, linkifyPlugin };
    }, []);

  const onChange = useCallback((_editorState) => {
    setEditorState(_editorState);
  }, []);
  const onOpenChange = useCallback((_open) => {
    setOpen(_open);
  }, []);
  const onSearchChange = useCallback(({ value }) => {
    setSuggestions(defaultSuggestionsFilter(value, mentions));
  }, []);

  return (
    <>
      <div
        className={editorStyles.editor}
        onClick={() => {
          ref.current.focus();
        }}
      >
        <Editor
          editorKey={"editor"}
          editorState={editorState}
          onChange={onChange}
          plugins={plugins}
          ref={ref}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={myKeyBindingFn}
        />

        <MentionSuggestions
          open={open}
          onOpenChange={onOpenChange}
          suggestions={suggestions}
          onSearchChange={onSearchChange}
          onClick={() => alert("asd")}
          onAddMention={(e) => {
            // get the mention object selected
          }}
          mention
          entryComponent={Entry}
          // if you want to change the parent div to span then use this
          // popoverContainer={({ children }) => <div>{children}</div>}
        />
        {showImage && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "start",
              alignItems: "center",
              width: "100%",
              // border: "2px solid red",
            }}
          >
            <img
              style={{
                objectFit: "contain",
                width: "100px",
                height: "100px",
                //   border: "2px solid red",
                display: "inline-block",
              }}
              src={
                "https://images.indianexpress.com/2020/08/descendants-of-the-sun.jpg"
              }
            />
            <img
              style={{
                objectFit: "contain",
                width: "100px",
                height: "100px",
                //   border: "2px solid red",
                display: "inline-block",
              }}
              src={
                "https://upload.wikimedia.org/wikipedia/en/1/1e/Sweet_Home_TV_series.jpg"
              }
            />
          </div>
        )}
        <div>
          <Toolbar>
            {
              // may be use React.Fragment instead of div to improve perfomance after React 16
              (externalProps) => (
                <div
                  style={{
                    border: "2px solid green",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <button
                      {...externalProps}
                      onClick={() => setShowImage(!showImage)}
                    >
                      show Image
                    </button>
                    <BoldButton {...externalProps} />
                    <ItalicButton {...externalProps} />
                    <UnderlineButton {...externalProps} />
                    <CodeButton {...externalProps} />
                    <BlockquoteButton {...externalProps} />
                    <CodeBlockButton {...externalProps} />
                  </div>
                  <div>
                    <button>Send</button>
                  </div>
                </div>
              )
            }
          </Toolbar>
        </div>
      </div>
    </>
  );
}
