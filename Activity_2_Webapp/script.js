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
  
    // Create a map from the webmap id
    const webmap = new WebMap({
      portalItem: {
        id: "91d72809056849a0aad99fd547b0500f"
      }
    });
  
    const view = new MapView({
      container: "viewDiv",
      map: webmap
    });
  
    view.when(() => {
      // Log each layer with its index and title
      console.log("Available Layers:");
      webmap.layers.forEach((layer, index) => {
        console.log(`Layer Index: ${index}, Title: ${layer.title}, ID: ${layer.id}`);
      });
  
      // Find the editable and non-editable layers
      const editLayer = webmap.layers.find(layer => layer.title === "20241031_Demo_Polygons");
      const noneditLayer = webmap.layers.find(layer => layer.title === "20241031_Demo_Layer");
  
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
      textBox.innerText = "Demo activity 2";
      document.body.appendChild(textBox);
  
      // Add the Legend widget
      const legend = new Legend({ view: view });
      view.ui.add(legend, "bottom-right");
    });
  });
  