import * as React from "react";
import { Responsive as ResponsiveGridLayout } from "react-grid-layout";
import { isEqual } from "lodash";
// import "/node_modules/react-grid-layout/css/styles.css";
// import "/node_modules/react-resizable/css/styles.css";
import "./styles.css";

const getLayoutsFromSomewhere = (): ReactGridLayout.Layouts => {
  return {
    xs: [
      { i: "1", x: 0, y: 0, w: 1, h: 2 },
      { i: "2", x: 1, y: 0, w: 1, h: 2, minW: 2, maxW: 4 },
      { i: "3", x: 2, y: 0, w: 1, h: 2 }
    ],
    lg: [
      { i: "1", x: 0, y: 0, w: 1, h: 2 },
      { i: "2", x: 1, y: 0, w: 1, h: 2, minW: 2, maxW: 4 },
      { i: "3", x: 2, y: 0, w: 1, h: 2 }
    ],
    sm: [
      { i: "1", x: 0, y: 0, w: 1, h: 2 },
      { i: "2", x: 1, y: 0, w: 1, h: 2, minW: 2, maxW: 4 },
      { i: "3", x: 2, y: 0, w: 1, h: 2 }
    ]
  };
};
const sizes = {
  lg: "Large",
  md: "Medium",
  sm: "Small",
  xs: "Extra small"
};

class MyResponsiveGrid extends React.Component {
  state = {
    layouts: getLayoutsFromSomewhere(),
    count: 3,
    layoutSize: "lg"
    // h: window.offsetX
  };
  node: any;
  changeItem: any;
  componentDidMount() {
    this.resize();
    window.addEventListener("resize", this.resize);
  }
  resize = () => {
    console.log("size", this.node.offsetWidth);
    this.setState({
      h: this.node.offsetHeight,
      w: this.node.offsetWidth
    });
  };

  getGrid = () => {
    const { count } = this.state;
    // const children = React.useMemo(() => {
    return new Array(count).fill(undefined).map((val, idx) => {
      // data-grid={{ x: idx, y: 1, w: 1, h: 1 }}
      return (
        <div key={idx + 1} className="card">
          {idx}
        </div>
      );
    });
    // }, [count]);
    // return children;
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  render() {
    // {lg: layout1, md: layout2, ...}
    const { layouts, layoutSize, w, h } = this.state;
    console.log(layoutSize);

    return (
      <div
        className="App"
        ref={node => {
          this.node = node;
        }}
      >
        <div className="info">
          {" "}
          You are viewing in {sizes[layoutSize] || "--"}({h} x {w}) screen size{" "}
        </div>
        <div
          className="button-layout"
          onClick={() => {
            this.setState(oldState => {
              return {
                count: oldState.count + 1
              };
            });
          }}
        >
          {" "}
          add new card
        </div>
        <ResponsiveGridLayout
          className="layout"
          width={w}
          autoSize
          onBreakpointChange={bp => {
            console.log(bp);
            this.setState({
              layoutSize: bp
            });
          }}
          containerPadding={[30, 30]}
          verticalCompact
          onDragStop={(old, oldItem, newItem) => {
            console.log(old, oldItem, newItem);
            if (!isEqual(oldItem, newItem)) {
              this.changeItem = newItem;
            }
          }}
          onLayoutChange={(
            layout: ReactGridLayout.Layout,
            alllayout: ReactGridLayout.Layouts
          ): void => {
            const newLayouts = alllayout;
            if (this.changeItem) {
              ["lg", "md", "sm", "xs"].forEach(size => {
                if (size !== layoutSize) {
                  const items = newLayouts[size] || [];
                  const index = items.findIndex(
                    ({ i }) => i === this.changeItem.i
                  );
                  if (index >= 0) {
                    newLayouts[size][index] = { ...this.changeItem };
                  } else {
                    (newLayouts[size] || []).push({ ...this.changeItem });
                  }
                }
              });
            }
            this.changeItem = null;
            // ['lg', 'md', 'sm', 'xs']
            // alllayout
            this.setState({
              layouts: newLayouts
            });
          }}
          layouts={layouts}
          breakpoints={{ lg: 1280, md: 1080, sm: 768, xs: 320 }}
          cols={{ lg: 4, md: 3, sm: 2, xs: 1, xxs: 3 }}
        >
          {this.getGrid()}
        </ResponsiveGridLayout>
      </div>
    );
  }
}

export default MyResponsiveGrid;
