require([
    "esri/WebMap",
    "esri/views/MapView",
    "esri/widgets/Editor",
    "esri/widgets/LayerList",
    "esri/widgets/Legend",
    "esri/widgets/Zoom"
  ], (
    WebMap, MapView, Editor, LayerList, Legend, Zoom
  ) => {

    // Create a map from the webmap id for "20241031_Demo_map" in ArcGIS Online
    const webmap = new WebMap({
      portalItem: {
        id: "bc54085fffa045a5a4911f3274ab97e0"
      }
    });

    const view = new MapView({
      container: "viewDiv",
      map: webmap
    });

    view.when(() => {

      // Log each layer with its index and title in the WebMap
      console.log("Available Layers:");
      webmap.layers.forEach((layer, index) => {
        console.log(`Layer Index: ${index}, Title: ${layer.title}, ID: ${layer.id}`);
      });

      // Find the layer we're editing by title
      const targetLayer = webmap.layers.find(layer => 
        layer.title === "20250107_Activity_1"  // Change to appropriate layer if using for another webapp or project
      );

      // Create editor, change settings to remove the ability to add or edit attachments
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

      // Create the LayerList widget
      const layerList = new LayerList({
        view: view
      });

      // Add LayerList to the bottom-left of the view
      view.ui.add(layerList, {
        position: "bottom-left"
      });

      // Add a text box in the upper-left corner
      const textBox = document.createElement("div");
      textBox.className = "text-box";
      textBox.innerText = "What are areas that are no-brainers for natural systems conservation/preservation in your city?";
      document.body.appendChild(textBox);

      // Add the link box for sources
      const linkBox = document.createElement("div");
      linkBox.className = "link-box";
      linkBox.innerHTML = '<a href="https://z.umn.edu/a2br" target="_blank">More about the layers</a>';
      document.body.appendChild(linkBox);
          
      // Add a default Legend widget
      const legend = new Legend({
        view: view
      });
      view.ui.add(legend, "bottom-right");  // Position the Legend at the bottom right
    });
  });
