require([
    "esri/WebMap",
    "esri/views/MapView",
    "esri/widgets/Home",
    "esri/widgets/Editor",
    "esri/widgets/LayerList",
    "esri/widgets/Legend",
    "esri/widgets/Zoom"
  ], (
    WebMap, MapView, Home, Editor, LayerList, Legend, Zoom
  ) => {
    // Create a map from the webmap id
    const webmap = new WebMap({
      portalItem: {
        id: "91d72809056849a0aad99fd547b0500f"
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
      // Log each layer with its index and title
      console.log("Available Layers:");
      webmap.layers.forEach((layer, index) => {
        console.log(`Layer Index: ${index}, Title: ${layer.title}, ID: ${layer.id}`);
      });
  
      // Find the editable and non-editable layers
      const editLayer = webmap.layers.find(layer => layer.title === "Winter Workshop Activity 2");
      const noneditLayer = webmap.layers.find(layer => layer.title === "Winter Workshop Activity 1");
  
      // Add the Editor widget
      const editor = new Editor({
        view: view,
        layerInfos: [
          {
            layer: editLayer,
            attachmentsOnUpdateEnabled: false,
            attachmentsOnCreateEnabled: false,
            enabled: true
          },
          {
            layer: noneditLayer,
            enabled: false
          }
        ]
      });
      view.ui.add(editor, "top-right");
  
      // Create and add the LayerList widget
      const layerList = new LayerList({ view: view });
      view.ui.add(layerList, { position: "bottom-left" });
  
      // Add a text box in the upper-left corner
      const textBox = document.createElement("div");
      textBox.className = "text-box";
      textBox.innerText = "How can we connect these no-brainer areas across your jurisdictions?";
      document.body.appendChild(textBox);
  
      // Add the link box for sources
      const linkBox = document.createElement("div");
      linkBox.className = "link-box";
      linkBox.innerHTML = '<a href="https://z.umn.edu/a2br" target="_blank">More about the layers</a>';
      document.body.appendChild(linkBox);
    

      // Add the Legend widget

    });
  });
  
