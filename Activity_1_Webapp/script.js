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

    const view = new MapView({
      container: "viewDiv",
      map: webmap,
      constraints: {
        rotationEnabled: false
      }
    });

    view.when(() => {
      // Create a container div for the Legend
      const legendContainer = document.createElement("div");
      legendContainer.id = "legend-container";
      document.body.appendChild(legendContainer);
  
      // Add the Legend widget to the container
      const legend = new Legend({
        view: view,
        container: legendContainer
      });
  
      view.ui.add(legendContainer, {
        position: "top-left",
        index: 1
      });
    });

    const home = new Home({
      view: view
    });
  
    // Add the Home widget to a custom position
    const homeContainer = document.createElement("div");
    homeContainer.className = "home-container";
    document.body.appendChild(homeContainer);
  
    home.container = homeContainer;
  
    view.ui.add(homeContainer, "manual");
  

    view.when(() => {

      // Log each layer with its index and title in the WebMap
      console.log("Available Layers:");
      webmap.layers.forEach((layer, index) => {
        console.log(`Layer Index: ${index}, Title: ${layer.title}, ID: ${layer.id}`);
      });

      // Find the layer we're editing by title
      const targetLayer = webmap.layers.find(layer => 
        layer.title === "Winter Workshop Activity 1"  // Change to appropriate layer if using for another webapp or project
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
      textBox.innerText = "What are areas that are no-brainers for natural systems conservation/preservation in your jurisdiction?";
      document.body.appendChild(textBox);

      // Add the link box for sources
      const linkBox = document.createElement("div");
      linkBox.className = "link-box";
      linkBox.innerHTML = '<a href="https://z.umn.edu/a2br" target="_blank">More about the layers</a>';
      document.body.appendChild(linkBox);
    });
  });
