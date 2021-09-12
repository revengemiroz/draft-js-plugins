import React, { useCallback, useMemo, useRef, useState } from "react";
import { EditorState, convertToRaw } from "draft-js";
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

  function extractLinks(text) {
    console.log(text);
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
                "https://preview.redd.it/fpxptjtwwgm71.png?width=640&crop=smart&auto=webp&s=37a119b9b10275804c38c0f8929388230f6564e9"
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
                "https://preview.redd.it/sljar4ndo2m71.png?width=640&crop=smart&auto=webp&s=364d26d1ff6aa59c487786a93ad09747c3a1fbee"
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
