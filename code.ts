figma.showUI(__html__, {
  width: 360,
  height: 520,
  themeColors: true
});

type GifAsset = {
  name: string;
  pageName: string;
  nodeId: string;
  imageHash: string;
  count: number;
  bytes: Uint8Array;
};

function getPageName(node: BaseNode): string {
  let current: BaseNode | null = node;

  while (current) {
    if (current.type === "PAGE") {
      return current.name;
    }

    current = current.parent;
  }

  return "Unknown";
}

async function scanForGifs(scope: "page" | "file"): Promise<GifAsset[]> {
  let nodes: readonly (SceneNode | PageNode)[];

  if (scope === "file") {
    await figma.loadAllPagesAsync();

    nodes = figma.root.findAll(
      (node) => "fills" in node
    );
  } else {
    nodes = figma.currentPage.findAll(
      (node) => "fills" in node
    );
  }

  const gifs = new Map<string, GifAsset>();

  for (const node of nodes) {
    if (!("fills" in node)) continue;

    const fills = node.fills;
    if (fills === figma.mixed) continue;

    for (const paint of fills) {
      if (paint.type !== "IMAGE" || !paint.imageHash) continue;

      const image = figma.getImageByHash(paint.imageHash);
      if (!image) continue;

      const bytes = await image.getBytesAsync();

      if (bytes.length < 6) continue;

      const signature = String.fromCharCode(
        bytes[0],
        bytes[1],
        bytes[2],
        bytes[3],
        bytes[4],
        bytes[5]
      );

      if (signature === "GIF87a" || signature === "GIF89a") {
        const existing = gifs.get(paint.imageHash);

        if (existing) {
          existing.count++;
        } else {
          gifs.set(paint.imageHash, {
            name: node.name,
            pageName: getPageName(node),
            nodeId: node.id,
            imageHash: paint.imageHash,
            count: 1,
            bytes
          });
        }
      }
    }
  }

  return Array.from(gifs.values());
}

figma.ui.onmessage = async (msg) => {
  if (msg.type !== "scan") return;

  try {
    const gifs = await scanForGifs(msg.scope);

    figma.ui.postMessage({
      type: "scan-result",
      scope: msg.scope,
      gifs
    });
  } catch (error) {
    figma.ui.postMessage({
      type: "scan-error",
      scope: msg.scope,
      message: error instanceof Error ? error.message : "Something went wrong."
    });
  }
};
