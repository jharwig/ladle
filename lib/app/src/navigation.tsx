import React from "react";
import cx from "classnames";
import history from "./history";
import { getStoryTree } from "./story-name";
import { Page, Down } from "./icons";
import type { StoryTreeT } from "../../cli/types";

const Link: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <a
    href={href}
    onClick={(e) => {
      e.preventDefault();
      history.push(href);
    }}
  >
    {children}
  </a>
);

const Navigation: React.FC<{ stories: string[]; activeStory: string }> = ({
  stories,
  activeStory,
}) => {
  const [search, setSearch] = React.useState("");
  const canonicalSearch = search
    .toLocaleLowerCase()
    .replace(new RegExp("\\s+", "g"), "-");

  const filteredStories = stories.filter((story) =>
    story.includes(canonicalSearch)
  );
  console.log(getStoryTree(filteredStories));
  return (
    <aside className="fstbk-aside">
      <input
        placeholder="Search stories"
        value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearch(e.target.value)
        }
      />
      <ul style={{ marginLeft: "-6px" }}>
        <NavigationSection
          tree={getStoryTree(filteredStories)}
          activeStory={activeStory}
        />
      </ul>
    </aside>
  );
};

const NavigationSection: React.FC<{
  tree: StoryTreeT;
  activeStory: string;
}> = ({ tree, activeStory }) => {
  return (
    <React.Fragment>
      {Object.keys(tree)
        .sort()
        .map((key) => {
          const treeProps = tree[key];
          return (
            <li
              key={treeProps.id}
              className={cx({
                "fstbk-linkable": treeProps.isLinkable,
                "fstbk-active": treeProps.id === activeStory,
              })}
              style={!treeProps.isLinkable ? { marginTop: "0.5em" } : {}}
            >
              {treeProps.isLinkable ? (
                <div style={{ display: "flex" }}>
                  <Page />
                  <Link href={`?story=${treeProps.id}`}>{treeProps.name}</Link>
                </div>
              ) : (
                <div style={{ display: "flex" }}>
                  <Down />
                  <div>{treeProps.name}</div>
                </div>
              )}
              {Object.keys(treeProps.children).length > 0 && (
                <ul>
                  <NavigationSection
                    tree={treeProps.children}
                    activeStory={activeStory}
                  />
                </ul>
              )}
            </li>
          );
        })}
    </React.Fragment>
  );
};

export default Navigation;