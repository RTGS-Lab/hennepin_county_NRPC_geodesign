require([
    "esri/WebMap",
    "esri/views/MapView",
    "esri/widgets/Home",
    "esri/widgets/Editor",
    "esri/widgets/LayerList",
    "esri/widgets/Legend",
    "esri/widgets/Zoom",
  ], (
    WebMap, MapView, Home, Editor, LayerList, Legend, Zoom
  ) => {
    // Create a map from the webmap id for "20241031_Demo_map" in ArcGIS Online
    const webmap = new WebMap({
      portalItem: {
        id: "bc54085fffa045a5a4911f3274ab97e0"
      }
    });

    // Create a MapView to display the map
    const view = new MapView({
      container: "viewDiv", // Element ID where the map will be placed
      map: webmap,
      constraints: {
        rotationEnabled: false // Prevent rotation
      }
    });

    // Execute when the view is ready
    view.when(() => {
      console.log("WebMap loaded successfully.");

      // Add the Home button widget
      const home = new Home({ view });
      view.ui.add(home, "top-left");

      // Add the LayerList widget
      const layerList = new LayerList({ view });
      view.ui.add(layerList, "bottom-left");

      // Locate the target layer for editing
      const targetLayer = webmap.layers.find(layer => 
        layer.title === "Winter Workshop Activity 1" // Adjust based on your layer
      );

      // Create Editor widget if the target layer exists
      if (targetLayer) {
        const editor = new Editor({
          view: view,
          layerInfos: [{
            layer: targetLayer,
            attachmentsOnUpdateEnabled: false,
            attachmentsOnCreateEnabled: false
          }]
        });
        view.ui.add(editor, "top-right");
      } else {
        console.warn("Target layer not found!");
      }

      // Create and add text box with instructions
      const textBox = document.createElement("div");
      textBox.className = "text-box";
      textBox.innerText = "What are areas that are no-brainers for natural systems conservation/preservation in your jurisdiction?";
      document.body.appendChild(textBox);

      // Add the first link box with source information
      const linkBox = document.createElement("div");
      linkBox.className = "link-box";
      linkBox.innerHTML = '<a href="https://z.umn.edu/a2br" target="_blank">More about the layers</a>';
      document.body.appendChild(linkBox);

      // Add a second link box for transitioning to Activity 2
      const secondLinkBox = document.createElement("div");
      secondLinkBox.className = "second-link-box";
      secondLinkBox.innerHTML = '<a href="https://z.umn.edu/NRPCActivity2" target="_blank">Go to second activity</a>';
      document.body.appendChild(secondLinkBox);
    });
  }
});
